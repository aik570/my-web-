import cv2, numpy as np
crop=cv2.imread('crop.png'); H,W=crop.shape[:2]; C=480
lbl=np.load('lbl.npy')
yy,xx=np.mgrid[0:H,0:W]; rr=np.hypot(xx-C,yy-C)
hsv=cv2.cvtColor(crop,cv2.COLOR_BGR2HSV); h,s,v=[hsv[...,i].astype(int) for i in range(3)]
GREENS,COCO,MANGO,TOFU=0,1,2,3
inside=rr<478
def comps(mask,amin,amax):
    n,cc,st,_=cv2.connectedComponentsWithStats(mask.astype(np.uint8),8)
    keep=(st[:,cv2.CC_STAT_AREA]>=amin)&(st[:,cv2.CC_STAT_AREA]<=amax); keep[0]=False
    return keep[cc]
# bowl: rim ring and dark walls near the edge
# bowl: the rim ring only (food lying over the rim stays with the food); dark gaps inside belong to the food
bowl=inside&(rr>=455)&~((v>100)&(rr<470))
bowl=cv2.morphologyEx(bowl.astype(np.uint8),cv2.MORPH_CLOSE,np.ones((5,5),np.uint8))>0
bowl&=inside
food=inside&~bowl
# sauce (Korean Love): deep red, glossy; on coconut, greens and mango only
red=((h<=8)|(h>=174))&(s>140)&(v>70)&(v<215)
# on mango only the deepest red counts (the fruit itself is orange); gaps between pieces are too dark to qualify
redm=((h<=4)|(h>=176))&(s>165)&(v>90)&(v<210)
# on white coconut even a light tint is sauce
redc=((h<=14)|(h>=160))&(s>55)&(v>60)
sauce=((red&(lbl==GREENS))|(redm&(lbl==MANGO)))&food
sauce=cv2.morphologyEx(sauce.astype(np.uint8),cv2.MORPH_OPEN,np.ones((2,2),np.uint8))>0
sauce=comps(sauce,12,100000)
# sesame: white seeds (bright, unsaturated) and black seeds (small dark specks), not on coconut (white on white)
# white seeds: clearly lighter and less saturated than what they lie on (shaded seeds on leaves count too)
vl=cv2.blur(v.astype(np.float32),(17,17)); sl=cv2.blur(s.astype(np.float32),(17,17))
white=(((s<70)&(v>165))|(((v-vl)>28)&((sl-s)>35)&(v>110)))&np.isin(lbl,[GREENS,MANGO,TOFU])&food
white=cv2.morphologyEx(white.astype(np.uint8),cv2.MORPH_OPEN,np.ones((2,2),np.uint8))>0
white=comps(white,5,130)
# black seeds: much darker than their surroundings, small
vloc=cv2.blur(v.astype(np.float32),(15,15))
black=(v<80)&((vloc-v)>55)&food&np.isin(lbl,[MANGO,TOFU,GREENS])
black=comps(black,5,90)
black=cv2.dilate(black.astype(np.uint8),np.ones((2,2),np.uint8))>0
sesame=white|black
# spring onion / cucumber: green pieces inside the tofu
veg=(h>=27)&(h<=95)&(s>32)&(v>34)&(lbl==TOFU)&food
veg=cv2.morphologyEx(veg.astype(np.uint8),cv2.MORPH_CLOSE,np.ones((5,5),np.uint8))>0
veg=comps(veg,120,100000)
veg=cv2.dilate(veg.astype(np.uint8),np.ones((5,5),np.uint8))>0
veg&=(lbl==TOFU)&food
# pineapple: pale yellow chunks among the tofu (the tofu itself is orange-red)
pine=(h>=19)&(h<=31)&(s>80)&(v>150)&(lbl==TOFU)&food&~veg
pine=cv2.morphologyEx(pine.astype(np.uint8),cv2.MORPH_OPEN,np.ones((5,5),np.uint8))>0
pine=comps(pine,260,100000)
pine=cv2.dilate(pine.astype(np.uint8),np.ones((5,5),np.uint8))>0
pine&=(lbl==TOFU)&food&~veg
print('pine',int(pine.sum()))
for n,m in [('bowl',bowl),('sauce',sauce),('sesame',sesame),('veg',veg)]: print(n,int(m.sum()))
# fill what the overlays cover so the layers underneath are whole
hole=(cv2.dilate(sauce.astype(np.uint8),np.ones((5,5),np.uint8))>0)|(cv2.dilate(sesame.astype(np.uint8),np.ones((7,7),np.uint8))>0)|(cv2.dilate((veg|pine).astype(np.uint8),np.ones((5,5),np.uint8))>0)
hole&=food
# frequency-selective reconstruction rebuilds texture instead of smearing it (opencv-contrib)
if hasattr(cv2,'xphoto'):
    base=np.zeros_like(crop)
    cv2.xphoto.inpaint(crop,(~hole).astype(np.uint8)*255,base,cv2.xphoto.INPAINT_FSR_FAST)
else:
    base=cv2.inpaint(crop,hole.astype(np.uint8)*255,5,cv2.INPAINT_TELEA)
np.save('masks.npy',np.stack([bowl,food,sauce,sesame,veg,pine]))
cv2.imwrite('base.png',base)
dbg=crop.copy(); dbg[sauce]=(255,0,255); dbg[sesame]=(255,255,0); dbg[veg]=(0,255,0); dbg[pine]=(0,128,255); dbg[bowl]=(dbg[bowl]*0.5+np.array([0,0,255])*0.5).astype(np.uint8)
cv2.imwrite('dbg.jpg',dbg); cv2.imwrite('base.jpg',base)
