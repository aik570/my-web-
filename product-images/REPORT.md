# Product image collection – report

Run: 2026-11-03 09:50 · models: 493 · files on disk: 135

| Status | Models |
|---|---|
| DOWNLOADED_CANDIDATE | 3 |
| VISUALLY_VERIFIED | 7 |
| RIGHTS_REVIEW_REQUIRED | 121 |
| DUPLICATE | 4 |
| MISSING | 0 |
| FAILED | 358 |

**Usable on the website without further rights work: VISUALLY_VERIFIED (free licence, exact model confirmed). DOWNLOADED_CANDIDATE still needs the visual check; RIGHTS_REVIEW_REQUIRED needs permission or a commercial licence first.**

| Brand | DOWNLOADED_CANDIDATE | VISUALLY_VERIFIED | RIGHTS_REVIEW_REQUIRED | DUPLICATE | MISSING | FAILED |
|---|---|---|---|---|---|---|
| Apple | 3 | 3 | 75 | 4 | 0 | 44 |
| Samsung | 0 | 2 | 46 | 0 | 0 | 99 |
| Huawei | 0 | 1 | 0 | 0 | 0 | 48 |
| Xiaomi | 0 | 0 | 0 | 0 | 0 | 92 |
| Google | 0 | 0 | 0 | 0 | 0 | 20 |
| Sony | 0 | 0 | 0 | 0 | 0 | 31 |
| OnePlus | 0 | 1 | 0 | 0 | 0 | 24 |

## What FAILED means here

FAILED = the model could not be checked completely in this run, not "no image exists". Wikimedia Commons answered this network with HTTP 429 (rate limit) for most requests, so the free-licence check is still open. Re-run with `python3 scripts/collect-product-images.py --retry-failed` from another network or with a Wikimedia API token.

- 215 × no official manufacturer image source available (Xiaomi, Huawei, Sony, OnePlus, Google)
- 90 × Samsung: no Mobile Press page for this model
- 44 × Apple: not on the identify-your-model pages (MacBook, Watch Ultra/Ultra 2)
- 9 × Samsung: press image rejected (thumbnail only 306 × 240 px, or not a clean single packshot)

## File checks

All listed files exist, open as images and are used once.

## Sources and limits

- Wikimedia Commons API: category of the exact model, then exact title search. Free licences only; licence, author and file page are stored per model.
- Samsung Mobile Press: official packshot from the model's media page. Terms of use: personal, informational, non-commercial – therefore RIGHTS_REVIEW_REQUIRED and not used on the site.
- Apple Design Resources: only front bezel frames (iPhone 16–18) under an app-marketing licence; Apple/Google newsroom images are for news use. Not collected.
- Rejected automatically: titles naming another model or variant, scenes/accessories/boxes in the title, unknown or non-free licences, uneven or dark backgrounds, devices touching the frame.
- Automatic checks never confirm the model. VISUALLY_VERIFIED is only set from scripts/photos/visual-review.json.

## Contact sheets

- contact-sheets/apple-1.png
- contact-sheets/apple-2.png
- contact-sheets/apple-3.png
- contact-sheets/apple-4.png
- contact-sheets/samsung-1.png
- contact-sheets/samsung-2.png
- contact-sheets/samsung-3.png
- contact-sheets/samsung-4.png
- contact-sheets/samsung-5.png
- contact-sheets/huawei-1.png
- contact-sheets/huawei-2.png
- contact-sheets/xiaomi-1.png
- contact-sheets/xiaomi-2.png
- contact-sheets/xiaomi-3.png
- contact-sheets/google-1.png
- contact-sheets/sony-1.png
- contact-sheets/oneplus-1.png

## Models with an image

| Brand | Model | Status | Source | Licence |
|---|---|---|---|---|
| Apple | iPhone 17 Pro Max | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone 17 Pro | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone Air | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone 17 | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone 16 Pro Max | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone 16 Pro | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone 16 Plus | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone 16 | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone 15 Pro Max | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone 15 Pro | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone 15 Plus | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone 15 | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone 14 Pro Max | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone 14 Pro | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone 14 Plus | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone 14 | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone SE (2022) | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone 13 Pro Max | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone 13 Pro | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone 13 | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone 13 mini | VISUALLY_VERIFIED | https://commons.wikimedia.org/wiki/File%3AIPhone_13_Mini_Gr%C3%BCn_Freigestellt.png | CC BY-SA 4.0 |
| Apple | iPhone 12 Pro Max | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone 12 Pro | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone 12 | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone 12 mini | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone SE (2020) | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone 11 Pro Max | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone 11 Pro | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone 11 | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone XS Max | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone XS | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone XR | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone X | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone 8 Plus | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone 8 | DOWNLOADED_CANDIDATE | https://commons.wikimedia.org/wiki/File%3AIPhone_8.png | CC BY-SA 4.0 |
| Apple | iPhone 7 Plus | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone 7 | VISUALLY_VERIFIED | https://commons.wikimedia.org/wiki/File%3AIPhone_7_-_A1778_Rose_Gold_-_Back_%28retouch%29_%28transparent_BG_no_shadow%29.png | CC BY-SA 4.0 |
| Apple | iPhone SE (2016) | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone SE | DOWNLOADED_CANDIDATE | https://commons.wikimedia.org/wiki/File%3AIPhone_SE_in_silver.png | CC BY-SA 3.0 |
| Apple | iPhone 6s Plus | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPhone 6s | VISUALLY_VERIFIED | https://commons.wikimedia.org/wiki/File%3AIPhone_6s_-_rear_view-92671.jpg | CC BY-SA 4.0 |
| Apple | iPhone 6 Plus | DOWNLOADED_CANDIDATE | https://commons.wikimedia.org/wiki/File%3AIPhone_6_%26_6_Plus.png | CC BY-SA 4.0 |
| Apple | iPhone 6 | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108044 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPad Pro 13 Zoll 1. Gen | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108043 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPad Pro 12.9 Zoll 1. Gen | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108043 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPad Pro 12.9 Zoll 2. Gen | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108043 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPad Pro 12.9 Zoll 3. Gen | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108043 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPad Pro 12.9 Zoll 4. Gen | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108043 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPad Pro 12.9 Zoll 5. Gen | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108043 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPad Pro 12.9 Zoll 6. Gen | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108043 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPad Pro 11 Zoll 1. Gen | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108043 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPad Pro 11 Zoll 2. Gen | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108043 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPad Pro 11 Zoll 3. Gen | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108043 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPad Pro 11 Zoll 4. Gen | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108043 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPad Pro 10.5 Zoll | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108043 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPad Pro 9.7 Zoll | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108043 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPad Mini 7 | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108043 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPad Mini 6 | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108043 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPad Mini 5 | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108043 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPad Air 13 Zoll 1. Gen | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108043 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPad Air 11 Zoll 1. Gen | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108043 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPad Air 5 | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108043 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPad Air 4 | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108043 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPad Air 3 | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108043 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPad Air 2 | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108043 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPad 10 (2022 10.9 Zoll) | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108043 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPad 9 (2021 10.2 Zoll) | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108043 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPad 8 (2020 10.2 Zoll) | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108043 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPad 7. Gen | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108043 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPad 6. Gen | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108043 | Apple Inc. – all rights reserved (support page image) |
| Apple | iPad 5. Gen | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108043 | Apple Inc. – all rights reserved (support page image) |
| Apple | Apple Watch Series SE 40/44mm | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108056 | Apple Inc. – all rights reserved (support page image) |
| Apple | Apple Watch Series 9 41/45mm | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108056 | Apple Inc. – all rights reserved (support page image) |
| Apple | Apple Watch Series 8 41/45mm | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108056 | Apple Inc. – all rights reserved (support page image) |
| Apple | Apple Watch Series 7 41/45mm | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108056 | Apple Inc. – all rights reserved (support page image) |
| Apple | Apple Watch Series 6 40/44mm | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108056 | Apple Inc. – all rights reserved (support page image) |
| Apple | Apple Watch Series 5 40/44 mm | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108056 | Apple Inc. – all rights reserved (support page image) |
| Apple | Apple Watch Series 4 40 mm | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108056 | Apple Inc. – all rights reserved (support page image) |
| Apple | Apple Watch Series 4 44 mm | DUPLICATE | https://support.apple.com/en-us/108056 | Apple Inc. – all rights reserved (support page image) |
| Apple | Apple Watch Series 3 38/42 mm | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108056 | Apple Inc. – all rights reserved (support page image) |
| Apple | Apple Watch SE 2. Gen 40/44 mm | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108056 | Apple Inc. – all rights reserved (support page image) |
| Apple | Apple Watch Series 2 38 mm | RIGHTS_REVIEW_REQUIRED | https://support.apple.com/en-us/108056 | Apple Inc. – all rights reserved (support page image) |
| Apple | Apple Watch Series 2 42 mm | DUPLICATE | https://support.apple.com/en-us/108056 | Apple Inc. – all rights reserved (support page image) |
| Apple | Apple Watch Series 1 38 mm | DUPLICATE | https://support.apple.com/en-us/108056 | Apple Inc. – all rights reserved (support page image) |
| Apple | Apple Watch Series 1 42 mm | DUPLICATE | https://support.apple.com/en-us/108056 | Apple Inc. – all rights reserved (support page image) |
| Samsung | Galaxy S25 | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-s25 | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy S25 Plus | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-s25-plus | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy S25 Ultra | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-s25-ultra | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy S24 | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-s24 | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy S24 Plus | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-s24-plus | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy S24 Ultra | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-s24-ultra | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy S23 | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-s23 | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy S23 FE | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-s23-fe | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy S23 Plus | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-s23-plus | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy S23 Ultra | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-s23-ultra | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy S22 | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-s22 | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy S22 Ultra | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-s22-ultra | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy A73 | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-a73-5g | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy A55 | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-a55-5g | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy A54 5G | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-a54-5g | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy A53 5G | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-a53-5g | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy A52 | VISUALLY_VERIFIED | https://commons.wikimedia.org/wiki/File%3ASamsung-Galaxy-A52-White.jpg | CC BY-SA 4.0 |
| Samsung | Galaxy A35 | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-a35-5g | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy A34 | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-a34-5g | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy A33 | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-a33-5g | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy A23 5G | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-a23-5g | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy A14 5G | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-a14-5g | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy A13 | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-a13 | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy M53 | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-m53-5g | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy M33 | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-m33 | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy M23 | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-m23 | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy J5 (2017) | VISUALLY_VERIFIED | https://commons.wikimedia.org/wiki/File%3ASamsung_Galaxy_J5_%282017%2C_SM-J530F-DS%29-0346.jpg | CC BY-SA 4.0 |
| Samsung | Galaxy Z Flip 7 | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-z-flip7 | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy Z Flip 6 | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-z-flip6 | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy Z Flip 4 | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-z-flip4 | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy Z Fold 7 | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-z-fold7 | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy Z Fold 6 | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-z-fold6 | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy Z Fold 5 | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-z-fold5 | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy Z Fold 4 | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-z-fold4 | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy Z Fold 3 | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-z-fold3-5g | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy Tab A9 | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-tab-a9 | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy Tab A9 Plus | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-tab-a9-plus | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy Tab S9 | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-tab-s9 | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy Tab S9 FE | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-tab-s9-fe | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy Tab S9 FE Plus | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-tab-s9-fe-plus | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy Tab S9 Plus | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-tab-s9plus | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy Tab S9 Ultra | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-tab-s9-ultra | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy Tab S8 | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-tab-s8 | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy Tab S8 Plus | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-tab-s8-plus | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy Tab S8 Ultra | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-tab-s8-ultra | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy XCover 7 | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-xcover7 | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy XCover 7 Pro | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-xcover7-pro | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Samsung | Galaxy Xcover 6 Pro | RIGHTS_REVIEW_REQUIRED | https://www.samsungmobilepress.com/media-assets/galaxy-xcover6-pro | Samsung Mobile Press terms: personal, informational, non-commercial use |
| Huawei | Honor 8 | VISUALLY_VERIFIED | https://commons.wikimedia.org/wiki/File%3AHonor_8_black_-_reverse.jpg | CC BY 3.0 |
| OnePlus | OnePlus 7 Pro | VISUALLY_VERIFIED | https://commons.wikimedia.org/wiki/File%3AOneplus_7_Pro_2019.jpg | CC BY-SA 4.0 |
