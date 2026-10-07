import cv2, numpy as np, os
import pathlib; OUT=str(pathlib.Path(__file__).resolve().parents[2]/'assets/poke'); os.makedirs(OUT,exist_ok=True)
crop=cv2.imread('crop.png').astype(np.float32); base=cv2.imread('base.png').astype(np.float32)
lbl=np.load('lbl.npy'); bowl,food,sauce,sesame,veg,pine=np.load('masks.npy')
H,W=lbl.shape; C=480
yy,xx=np.mgrid[0:H,0:W]; rr=np.hypot(xx-C,yy-C)
GREENS,COCO,MANGO,TOFU=0,1,2,3
disk=np.clip(477.5-rr,0,1).astype(np.float32)          # anti-aliased outer edge
def soft(m,dil=0,sig=1.0):
    m=m.astype(np.uint8)
    if dil: m=cv2.dilate(m,np.ones((2*dil+1,2*dil+1),np.uint8))
    return cv2.GaussianBlur(m.astype(np.float32),(0,0),sig) if sig else m.astype(np.float32)
# Empty bowl: the photo's own rim and walls; the floor is shaded in the ceramic's colour (taken from the walls)
lip=(rr>=458)&(rr<468)&(crop.sum(-1)<300)
cer=np.median(crop[lip],0)                              # the lit rim lip: warm dark brown-grey
d=rr/478.0
# matt ceramic floor: the lip's colour, a broad soft light from the top left, walls darkening to the rim
light=1.05+0.38*np.exp(-((xx-C+80)**2+(yy-C+100)**2)/(2*240**2)) - 0.62*np.clip((d-0.58)/0.36,0,1)**1.3
floor=cer[None,None,:]*light[...,None]
rng=np.random.default_rng(7); floor+=rng.normal(0,2.2,floor.shape)    # the photo's grain
a_bowl=cv2.GaussianBlur(bowl.astype(np.float32),(0,0),3.0)
bowl_rgb=crop*a_bowl[...,None]+floor*(1-a_bowl[...,None])
layers={'bowl':(bowl_rgb,disk)}
def piled(src,m,dil=2,sig=1.4):
    # the ingredient plus a faint contact shadow just outside it (down-right), so it sits on what is below
    a=soft(m,dil,sig)
    sh=cv2.GaussianBlur(np.roll(np.roll(soft(m,dil,0),7,0),5,1),(0,0),7)*0.42
    sh=np.clip(sh-a,0,1)
    alpha=np.clip(a+sh,0,1)
    rgb=(src*a[...,None])/np.maximum(alpha,1e-4)[...,None]     # shadow pixels are black
    return (rgb,alpha*disk)
def region(i,src,dil=2):
    return piled(src,(lbl==i)&food,dil)
layers['greens']=region(GREENS,base)
layers['tofu']=region(TOFU,base)
# vegetables in three interleaved groups too, so they land a beat apart
n,cc=cv2.connectedComponents(veg.astype(np.uint8),8)
vg=(np.arange(n) % 3)
for g in range(3):
    layers[f'veg{g+1}']=piled(crop,(vg[cc]==g)&veg,1,1.0)
layers['mango']=region(MANGO,base)
layers['pineapple']=piled(crop,pine,1,1.0)
layers['sauce']=(crop,soft(sauce,1,0.9)*disk)
layers['coconut']=region(COCO,crop)
# sesame in three interleaved groups, so the seeds can land one after another
n,cc=cv2.connectedComponents(sesame.astype(np.uint8),8)
grp=(np.arange(n)*2654435761 % 3)
for g in range(3):
    m=(grp[cc]==g)&sesame
    layers[f'sesame{g+1}']=(crop,soft(m,1,0.8)*disk)
layers['final']=(crop,disk)
for name,(rgb,a) in layers.items():
    rgb=np.where((a>0.002)[...,None],rgb,0)   # hidden pixels carry no colour: much smaller files
    rgba=np.dstack([np.clip(rgb,0,255),np.clip(a*255,0,255)]).astype(np.uint8)
    for size in (960,600):
        im=rgba if size==960 else cv2.resize(rgba,(size,size),interpolation=cv2.INTER_AREA)
        cv2.imwrite(f'{OUT}/spicy-tropical-{name}-{size}.webp',im,[cv2.IMWRITE_WEBP_QUALITY,84])
# composite check (all layers, without the final photo) vs the photo
comp=np.zeros((H,W,3),np.float32)
for name,(rgb,a) in layers.items():
    if name=='final': continue
    comp=rgb*a[...,None]+comp*(1-a[...,None])
cv2.imwrite('composite.jpg',comp.astype(np.uint8))
err=np.abs(comp-crop)[rr<470].mean(); print('mean abs diff vs photo',round(float(err),2))
