"""Step 0: crop the bowl out of the client's photo (centre and radius measured from the rim).
Run all steps from an empty working directory:
  python3 crop.py && python3 seg.py && python3 build.py && python3 layers.py
Needs: opencv-contrib-python-headless (xphoto inpainting), numpy, scikit-image. Writes the layers to maloa-site/assets/poke/."""
import cv2, pathlib
SRC = pathlib.Path(__file__).resolve().parents[2] / 'assets/src/bowls/bowl-02-spicy-tropical-tofu.jpg'
src = cv2.imread(str(SRC)); cx, cy, R = 995, 669, 480
cv2.imwrite('crop.png', src[cy-R:cy+R, cx-R:cx+R])
