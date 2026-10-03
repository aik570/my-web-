import cv2, numpy as np
crop=cv2.imread('crop.png'); H,W=crop.shape[:2]; C=480
yy,xx=np.mgrid[0:H,0:W]; rr=np.hypot(xx-C,yy-C)
hsv=cv2.cvtColor(crop,cv2.COLOR_BGR2HSV); h,s,v=[hsv[...,i].astype(int) for i in range(3)]
lab=cv2.cvtColor(crop,cv2.COLOR_BGR2LAB).astype(np.float32)
# coarse zones (crop coords)
P={
 'greens':[(60,420),(70,300),(120,220),(200,150),(300,110),(380,140),(440,210),(475,290),(470,400),(420,445),(330,425),(250,450),(130,470)],
 'coconut':[(40,470),(130,470),(250,450),(330,425),(420,445),(500,430),(560,470),(605,555),(600,610),(520,630),(440,600),(330,640),(250,630),(160,650),(80,665),(45,580)],
 'mango':[(80,665),(160,650),(250,630),(330,640),(440,600),(520,630),(600,610),(612,700),(600,810),(590,930),(480,960),(300,960),(150,900),(90,780)],
}
names=['greens','coconut','mango','tofu']
zone=np.full((H,W),3,np.uint8)
for i,k in enumerate(names[:3]):
  m=np.zeros((H,W),np.uint8); cv2.fillPoly(m,[np.array(P[k],np.int32)],1); zone[m>0]=i
# the tofu zone is the right half: leftovers on the left (along the wall) go to the nearest left-side zone
dl=np.stack([cv2.distanceTransform(1-(zone==i).astype(np.uint8),cv2.DIST_L2,5) for i in range(3)],-1)
left=(zone==3)&(xx<470)&~((yy<200)&(xx>300))
zone[left]=np.argmin(dl,-1)[left]
# distance of each pixel to each zone -> spatial prior
prior=[]
for i in range(4):
  m=(zone==i).astype(np.uint8)
  d_out=cv2.distanceTransform(1-m,cv2.DIST_L2,5)   # 0 inside
  prior.append(d_out)
prior=np.stack(prior,-1)
# colour models from confident interiors (eroded zones)
cost=np.zeros((H,W,4),np.float32)
for i in range(4):
  m=(zone==i).astype(np.uint8); m=cv2.erode(m,np.ones((31,31),np.uint8))
  m=(m>0)&(rr<430)
  samp=lab[m]; 
  # small k-means per class to capture multi-colour ingredients
  K=4; crit=(cv2.TERM_CRITERIA_EPS+cv2.TERM_CRITERIA_MAX_ITER,20,1.0)
  _,_,cent=cv2.kmeans(samp[::7].astype(np.float32),K,None,crit,3,cv2.KMEANS_PP_CENTERS)
  d=np.min(np.linalg.norm(lab[...,None,:]-cent[None,None],axis=-1),axis=-1)
  cost[...,i]=d
# blur colour cost (textures), add spatial prior: free inside zone, grows outside over ~45px
cost=np.stack([cv2.GaussianBlur(cost[...,i],(0,0),6) for i in range(4)],-1)
total=cost+prior*0.45+(prior>60)*1000   # a region may refine its border, never wander off (e.g. round the dark wall)
from skimage.segmentation import slic
sp=slic(cv2.cvtColor(crop,cv2.COLOR_BGR2RGB),n_segments=2600,compactness=14,start_label=0)
np.save('sp.npy',sp)
nsp=sp.max()+1
sums=np.zeros((nsp,4)); cnt=np.bincount(sp.ravel(),minlength=nsp)
for i in range(4): sums[:,i]=np.bincount(sp.ravel(),weights=total[...,i].ravel(),minlength=nsp)
splbl=np.argmin(sums/np.maximum(cnt,1)[:,None],1).astype(np.uint8)
lbl=splbl[sp]
# clean: majority filter
for _ in range(0):
  oh=np.stack([cv2.GaussianBlur((lbl==i).astype(np.float32),(0,0),5) for i in range(4)],-1); lbl=np.argmax(oh,-1).astype(np.uint8)
# every region is one piece: stray fragments go to the region around them
for it in range(3):
  for i in range(4):
    n,cc,st,_=cv2.connectedComponentsWithStats((lbl==i).astype(np.uint8),8)
    if n<=2: continue
    big=1+np.argmax(st[1:,cv2.CC_STAT_AREA])
    for c in range(1,n):
      if c==big: continue
      m=(cc==c).astype(np.uint8); edge=(cv2.dilate(m,np.ones((5,5),np.uint8))>0)&(m==0)
      vals=lbl[edge]; vals=vals[vals!=i]
      if len(vals): lbl[m>0]=np.bincount(vals,minlength=4).argmax()
np.save('lbl.npy',lbl)
col=np.array([(60,200,60),(255,255,255),(0,210,255),(0,90,230)],np.uint8)
ov=(crop*0.45+col[lbl]*0.55).astype(np.uint8)
ov[rr>478]=crop[rr>478]
cv2.imwrite('lbl.jpg',ov)
