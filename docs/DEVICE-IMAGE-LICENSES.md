# Device image licences

Status 03.11.2026. Only these images are used on the website (calculator, mapping `src/_data/modelImages.json` → `src/_data/modelPhotos.js`). All are stored locally (no hotlinks), cropped and placed on a white 600 × 800 canvas, re-encoded as WebP (EXIF removed). "bearbeitet" = edited (crop/background), as CC licences require changes to be indicated. CC BY-SA: the edited versions are themselves under the same licence.

| Model | File | Original source | Author | Licence | Required attribution (how it is given) | Downloaded |
|---|---|---|---|---|---|---|
| Apple iPhone 6s | `src/assets/img/produkte/apple-iphone-6s.webp` | https://commons.wikimedia.org/wiki/File%3AIPhone_6s_-_rear_view-92671.jpg | Raimond Spekking | CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0) | „Foto: Raimond Spekking (bearbeitet), CC BY-SA 4.0, Quelle" – shown under the photo in the calculator | 30.10.2026 |
| Huawei Honor 8 | `src/assets/img/produkte/huawei-honor-8.webp` | https://commons.wikimedia.org/wiki/File%3AHonor_8_black_-_reverse.jpg | Honor | CC BY 3.0 (https://creativecommons.org/licenses/by/3.0) | „Foto: Honor (bearbeitet), CC BY 3.0, Quelle" – shown under the photo in the calculator | 30.10.2026 |
| OnePlus OnePlus 7 Pro | `src/assets/img/produkte/oneplus-oneplus-7-pro.webp` | https://commons.wikimedia.org/wiki/File%3AOneplus_7_Pro_2019.jpg | Thilo Parg | CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0) | „Foto: Thilo Parg (bearbeitet), CC BY-SA 4.0, Quelle" – shown under the photo in the calculator | 30.10.2026 |
| Samsung Galaxy A52 | `src/assets/img/produkte/samsung-galaxy-a52.webp` | https://commons.wikimedia.org/wiki/File%3ASamsung-Galaxy-A52-White.jpg | OnoMaker 12345 | CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0) | „Foto: OnoMaker 12345 (bearbeitet), CC BY-SA 4.0, Quelle" – shown under the photo in the calculator | 30.10.2026 |
| Samsung Galaxy J5 (2017) | `src/assets/img/produkte/samsung-galaxy-j5-2017.webp` | https://commons.wikimedia.org/wiki/File%3ASamsung_Galaxy_J5_%282017%2C_SM-J530F-DS%29-0346.jpg | Raimond Spekking | CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0) | „Foto: Raimond Spekking (bearbeitet), CC BY-SA 4.0, Quelle" – shown under the photo in the calculator | 30.10.2026 |
| Apple iPhone 13 mini | `src/assets/img/produkte/apple-iphone-13-mini.webp` | https://commons.wikimedia.org/wiki/File%3AIPhone_13_Mini_Gr%C3%BCn_Freigestellt.png | DYVER | CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0) | „Foto: DYVER (bearbeitet), CC BY-SA 4.0, Quelle" – shown under the photo in the calculator | 03.11.2026 |
| Apple iPhone 8 | `src/assets/img/produkte/apple-iphone-8.webp` | https://commons.wikimedia.org/wiki/File%3AIPhone_8.png | Dimsar01 (Greek Wikipedia) | CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0) | „Foto: Dimsar01 (bearbeitet), CC BY-SA 4.0, Quelle" – shown under the photo in the calculator | 03.11.2026 |
| Apple iPhone SE (2016) | `src/assets/img/produkte/apple-iphone-se-2016.webp` | https://commons.wikimedia.org/wiki/File%3AIPhone_SE_in_silver.png | Micaman45 | CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0) | „Foto: Micaman45 (bearbeitet), CC BY-SA 3.0, Quelle" – shown under the photo in the calculator | 03.11.2026 |

**8 of 493 catalogue models** have a licensed image. All other models show the schematic drawing.

## Found but NOT used (rights not established or model not certain)

| Images | Source | Why not used |
|---|---|---|
| 75 exact Apple models (iPhone 6–17, iPad, Apple Watch) | support.apple.com "Identify your model" pages | Apple Inc., all rights reserved – no permission for a shop website |
| 46 exact Samsung models | Samsung Mobile Press (samsungmobilepress.com) | Terms: personal, informational, non-commercial use only |
| iPhone 7 (CC BY-SA 4.0) | Wikimedia Commons, author MacRepairDundee.co.uk | Licence allows it, but the required credit names another repair business – owner decision |
| iPhone 6 Plus, iPhone SE (unspecified generation) | Wikimedia Commons | Model/generation cannot be confirmed for the catalogue entry |
| iPhone 16 Pro Max, iPhone 15 / 15 Plus / 15 Pro Max | Wikimedia Commons | Rejected: a replacement display part and a mock-up render with the wrong model name |

Full per-model result (all 493): `project-audit/handy-chirurg-image-workflow.csv`, `product-images/REPORT.md`, script `scripts/collect-product-images.py`. Wikimedia Commons answered this network with HTTP 429 (rate limit) for most models, so 358 models are not fully checked there; re-run `python3 scripts/collect-product-images.py --retry-failed` from another network or with a Wikimedia API token.

Before adding any image: exact model, clean packshot, licence for commercial use on this website, and an entry here.
