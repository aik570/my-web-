# Ma'loa — редизайн главной. Файл для передачи в новый чат

Состояние на 30.09.2026, вечер. **Дедлайн: 01.10.2026, 10:00** — показываем шефу **Intro + Hero + Franchise**.
В конце файла лежит исходный HTML главной maloa.com (`original.html`): редизайн делаем поверх него.

---

## 1. Проект

- **Клиент:** Ma'loa, сеть поке-боулов, офис в Берлине, есть франшиза. Сайт: https://maloa.com (WordPress).
- **Контакт у клиента:** Даша (WhatsApp, по-русски).
- **Команда:** я + Коля (пишет ТЗ, проверяет).
- **Цель:** главная уровня Awwwards 2026 — премиально, «Гавайи», 3D-ощущение, анимации кнопок.
- **Репозиторий:** `aik570/my-web-`, ветка `claude/new-session-jb2kjo`, PR https://github.com/aik570/my-web-/pull/2
  - `maloa-site/` — текущая работа (Intro готов), `maloa-site/original.html` — исходник главной.
  - `maloa/` — старое демо v2 на фото, бриф `maloa/brief.md`, оригиналы фото `maloa/src/`.

## 2. Подтверждённые решения

1. **Стек:** чистый HTML + CSS + JS + GSAP 3.15 (ScrollTrigger, DrawSVGPlugin) с jsDelivr. Без React/Next.js — потом переносим в WordPress.
2. **Структура:** как на сайте, но без лишнего. Порядок maloa.com: шапка → Hero (вместо слайдера) → Welcome → Favorites → Poké your style → Gift card → Franchise → Newsletter/футер. Что убрать или объединить — решить в новом чате.
3. **Бренд:**
   - цвета: основной `#004443`, фон `#d8e2e2`, светлый `#f4f7f5`, розовый `#f3d2d5`, текст `#06302f`;
   - шрифт: Bricolage Grotesque (заголовки) + Figtree (текст), Google Fonts; Brandon Grotesque — если клиент купит лицензию (на сайте он подключён как `brandonweb-medium` / `brandonweb-black`);
   - волна: мягкая анимированная волна по краям блоков (на сайте — `welle.png` под заголовками);
   - логотип: пока заглушка (круг с «M» + надпись «MA'LOA» Bricolage 800), настоящий SVG ждём от клиента.
4. **Intro (Блок 0):** готов в `maloa-site/`, но **переделать под эскиз Коли** (раздел 4):
   - фон «джунгли» генерируем в Higgsfield;
   - лого подпрыгивает;
   - появляется надпись MA'LOA;
   - переход волной в Hero.

   Правила, которые оставляем: шапка с «Bestellen» поверх и кликабельна, скролл/клавиша/свайп ускоряют ×5, кнопка «Intro überspringen», раз за сессию (sessionStorage), reduced motion — только fade.
5. **Hero (Блок 1):**
   - **видео на весь экран** (без рамки), генерируем новое 16:9 в Higgsfield;
   - листья свисают в углах: **прозрачные WebP**, покачивание и появление через GSAP;
   - сверху — полупрозрачные обведённые **магнитные** кнопки меню, на телефоне — гамбургер;
   - заголовок **«Aloha, Eschborn.»** с 3D-появлением слов, подзаголовок, 2 кнопки («Jetzt bestellen», «Zum Menü»), индикатор скролла;
   - текст и фото появляются плавно.
6. **Franchise:** брать информацию с сайта (тексты и данные maloa.com — раздел Franchise в `original.html` и страница `/franchise/`). Ничего не выдумывать: цифр на главной нет, если их нет и на `/franchise/`, ставим `[—]`. «Bochum, 6.10.» — по данным клиента (Даша, WhatsApp 29.09).
7. **Данные меню:**
   - 15 боулов:
     - FISH: Big Island Tuna, Maui Tuna, Lāna'i Tuna, Molokai Salmon, Kaua'i Salmon, O'ahu Salmon, Green Cream Shrimps, Moana Tempura;
     - CHICKEN: Vul'Cano, Peanutlover, Truffle'Loa, Korean Chicken;
     - VEGAN: Crazy Beet-Root, Sesam Me Tofu, Spicy Tropical Tofu.
   - Favorites — 8 карточек: 6 островов + Moana + Green Cream.
   - Poké your style — 6 шагов: Base (5) → Protein (10) → Mix-ins (9) → Homemade Flavors (9) → Toppings (8) → Premium Toppings (7).
   - Фото клиента в `maloa/src/`: `spicy-salmon-tobiko.jpg` = **Maui Tuna**, `shrimp-wasabi.jpg` = **Green Cream Shrimp**, `lanai.jpg` = Lanai, `peanutlover.jpg` = Peanutlover, `spicy-tropical.jpg` = Spicy Tropical, `salmon-cashew.jpg` = Kauai или Molokai (не подтверждено), `beet-falafel.jpg` = вероятно Crazy Beet-Root. Логотип: `logo-white-bg.jpg`, `monogram.jpg`.
8. **Правила:**
   - на телефоне вместо видео постеры;
   - «Bestellen» всегда на виду, ничего не блокирует заказ;
   - reduced motion — только fade;
   - анимируем только `transform` / `opacity` (+ `clip-path` как исключение);
   - фокус с клавиатуры, кнопка паузы у зацикленного видео (WCAG);
   - коммит после каждого шага;
   - работа по шагам: HTML → подтверждение → CSS → GSAP → телефон.

## 3. Приёмы из референсов (код изучен)

**Zentry** (github.com/MohammedJawwad/Zentry, React → переносим на чистый JS):
- Появление слов в 3D. Стартовое состояние слова: `transform: translate3d(10px,51px,-60px) rotateY(60deg) rotateX(-40deg); transform-origin: 50% 50% -150px; opacity:0`. Анимация: `to {opacity:1, transform:'translate3d(0,0,0) rotateY(0) rotateX(0)', ease:'power2.inOut', stagger:.02}`.
- Шапка: при скролле вниз `y:-100, opacity:0`, вверх — возвращается плашкой (`floating-nav`), наверху страницы — прозрачная.
- Видео-кадр Hero при скролле обрезается: `clipPath: polygon(14% 0, 72% 0, 88% 90%, 0 95%)`, `borderRadius: 0 0 40% 10%`, scrub.
- Подчёркивание ссылок меню: `scaleX(0 → 1)`, `transform-origin` справа → слева.

**Anibel GTAVI** (github.com/anibeladjei/Anibel_GTAVI):
- Показ через маску-логотип: `mask-image:url(logo.svg)`. Старт `mask-size: 3500%`, скролл (pin, `+=200%`, scrub 2.5) → `mask-size: 20%`.
- Видео по скроллу: секция закреплена, `tl.to(video, {currentTime: video.duration})` после `loadedmetadata`.

Не открылись (домены закрыты): dev.to (Rasa Kenangan), rocket.new, awwwards.com, fritesatelier.com, memamu.co.il.
**Референсы заказчика fritesatelier.com и memamu.co.il — прислать скриншоты или записи экрана в новый чат.**

## 4. Эскиз Коли (расшифровка записей)

**Загрузка:** круглое лого на фоне джунглей → лого подпрыгивает → появляется надпись MA'LOA (фон джунгли).

**Кадры эскиза:**
1. Лого на фоне джунглей.
2. MA'LOA.
3. Анимированные волны (переход).
4. Шапка: лого слева, кнопки меню сверху, листья в углах.
5. Видео на фоне (изначально «видео с сайта», решено генерировать новое).

**HERO:** «Референс ___ / MA'LOA на главном экране, сзади фон джунглей. Затем при скролле всплывает экран и листья свисают с анимацией → на заднем фоне видео улучшенного качества. Затем все блоки Hero, но с анимациями и улучшенным качеством, сами объекты лучше.»
- Кнопки сверху обведены, магнитные, полупрозрачные.
- Нужно передать стиль Гавайев.

**Дальше:** по краям блоков мягкая волна (анимированная). Блок 2: плавное появление текста и фото. Ещё внедрить фото BOWL-___. Franchise seit (страница франшизы).

## 5. Открытые вопросы

- Какие блоки убрать или объединить («как на сайте, но без лишнего»).
- «Референс вилки» (на странице Hero) — что это за референс?
- Строка «Ещё внедрить фото BOWL-…» — второе слово не разобрано.
- Настоящий логотип в SVG/AI/EPS — запросить у Даши.
- Лицензия Brandon Grotesque — спросить у клиента.
- Цифры франшизы — есть ли на странице `/franchise/`; иначе запросить у Даши.
- Скриншоты или записи экрана fritesatelier.com и memamu.co.il.

## 6. Что уже есть (файлы и медиа)

**`maloa-site/` (Блок 0 Intro, работает, проверен):**
- `index.html`, `preview.html` (всё в одном файле, Intro играет всегда);
- `css/tokens.css`, `css/base.css`, `css/intro.css`;
- `js/core.js` (флаги, адреса медиа, регистрация плагинов), `js/intro.js` (таймлайн);
- `assets/logo/logo-circle.svg`, `logo-wordmark.svg` (заглушки).

**Медиа на CDN Higgsfield** (`https://d2ol7oe51mr4n9.cloudfront.net/user_3K31NSDIHA0gXz2VXZIk09GnTID/<id>`):

| Что | Файлы (webm / mp4 / постер webp), 480 px |
|---|---|
| Лист 1 monstera | `30f84563-242f-4fc9-bde8-9e82df2991eb.mp4` / `fad5d329-8d93-42b3-817c-f40e3bfbb5a4.mp4` / `34566854-68de-4309-a002-0253021a23b1.webp` |
| Лист 2 palm frond | `7be90413-4925-4586-bb08-f4323ac8d685.mp4` / `e7fa7e12-06ac-4648-9015-4a6f11f749d5.mp4` / `0c179bad-29bb-49ab-95e0-a6032d006055.webp` |
| Лист 3 calathea | `8ebb9853-a885-4ea1-ad7e-91f6ded93ec9.mp4` / `ac8d3080-b601-4b2c-8562-5bb35df6e164.mp4` / `a6920dcb-73d8-4c0a-895d-82bca308a291.webp` |
| Лист 4 banana | `d0b18307-8900-4540-9a3c-3d8e09cef830.mp4` / `3f27cae8-0d15-4d07-8585-6ee8a9269508.mp4` / `4ff23060-3e3a-493c-88f5-7c1e8fbd62b6.webp` |
| Лист 5 pineapple crown | `d34a5e9c-66f9-4b98-b266-274a6efe6231.mp4` / `2632655a-db0e-4fdb-ab2d-398cf032aef1.mp4` / `6e61e95a-504f-4a3d-b871-b796f64f480e.webp` |
| Лист 6 philodendron | `2bf96699-9ec9-4d15-ab79-798de984d4cb.mp4` / `beae11e1-894c-45a7-963c-daee4d036ef0.mp4` / `00e73827-a29a-41f9-ad58-d7878a72ebb5.webp` |
| Поворот боула (квадрат, 960 px, для перемотки скроллом) | `0d327f70-3a4c-47b1-9cf9-aecae694508b.mp4`, постеры `6f229b86-e5a1-4e01-94d1-d55576ca850b.webp` (960) и `b4603b20-1c76-4671-a81e-6d28254c036a.webp` (600) |

Первоисходники в Higgsfield (job id, для повторного использования как референс):
- кадры листьев (gpt_image_2_5, фон `#004443`): `5647120a-…4d15`, `42943c0e-…b4f4`, `1363c66c-…5383f6c`, `3c394859-…d33ed5`, `10cde025-…ff0e`, `d8aac44d-…1359`;
- боул Maui Tuna на бирюзовом фоне под 45°: `17c790f9-37f9-401f-9b71-a41a5c9b5b88`;
- видео «разобранный вид»: `4bf54f7b-1bc0-49a5-8d18-86bceb2802e4`;
- загруженные фото клиента: Maui Tuna `b0226fbb-a3b3-49b0-9e57-be6295bbfb86`, Lanai `7a3630bd-83d9-4e55-a5ab-c52e75743c10`.

Потрачено около 100 кредитов Higgsfield из 810.

**Для новых листьев на прозрачном фоне:** взять те же 6 кадров и убрать фон (`remove_background` в Higgsfield).

## 7. Особенности окружения (важно для нового чата)

- **Закрыты сетью:** maloa.com, awwwards.com, dev.to, contra.com, rocket.new, dribbble, fritesatelier.com, memamu.co.il, cdnjs и **CDN Higgsfield** (результаты генераций не скачать в контейнер). GitHub, npm и jsDelivr работают.
- **Работа с медиа** идёт в песочнице Higgsfield (`sandbox_exec`: ffmpeg, Pillow, Playwright). Загрузка: `media_upload` → `curl PUT` с заголовком `If-None-Match: *` → `media_confirm`. Проверка страниц с реальными медиа — там же: `git clone` ветки, Playwright.
- **Загрузка фото в Higgsfield:** через `media_import_url` с raw.githubusercontent.com (репозиторий публичный).
- **Видео Higgsfield глазами** может посмотреть только пользователь (виджет Higgsfield). Я проверяю цифрами: шов повтора, фон, движение.
- **CDN Higgsfield отдаёт WebM с типом MP4.** Chrome это прощает, проверено. Для продакшена файлы надо перенести к себе.

## 8. Проблемы текущего сайта (записка клиенту)

- **Попапы:**
  - в тестовом режиме (`Boxzilla testMode`): скидка и франшиза показываются при каждом визите;
  - на английской версии они пустые («only available in German»).
- **Тема сломана:** ошибка `lessphp @body_font`, её прячет скрипт, который переписывает `body.innerHTML`.
- **Устаревшие плагины:**
  - WordPress 6.4, WooCommerce 5.5.5 (2021), Slider Revolution 5.4.8 (2018), qTranslate-X (заброшен);
  - остатки магазина;
  - Font Awesome подключён ×3, Bootstrap ×2, около 40 запросов.
- **SEO и текст:**
  - нет H1;
  - текст слайдов вшит в картинки;
  - health claims в таблицах питательности (Verordnung (EG) 1924/2006);
  - «© 2023», `/franchise-2/`;
  - смешение языков на английской версии («Seid Be one…», немецкая форма рассылки, «Mehr Ma'Loa»).
- **Прочее:** кнопка «наверх» перекрывает значок reCAPTCHA; «Vouchers» и «Coupons» в разных меню.

---

## Приложение: original.html (главная maloa.com, английская версия)

```html
<!doctype html>
<!--
  maloa.com home page, English version (?lang=en), as supplied by the user on 30.09.2026.
  REFERENCE ONLY, not part of the new site.

  Kept: every piece of content and structure (header menu with dropdowns, slider slides,
  the four sections, the footer, newsletter fields, and the product data from the popups).
  Dropped: the WordPress/plugin plumbing that carries no content: ~40 stylesheet and
  script tags (WooCommerce, YITH, Revolution Slider runtime, Bootstrap x2, Font Awesome x3,
  emoji loader, UsersWP helpers), the Borlabs cookie-box template, WPBakery row wrappers
  and inline style noise. Notable findings from those are listed at the bottom.
-->
<html lang="en-US">
<head>
<meta charset="utf-8">
<title>MA’LOA® Hawaiian Poké Bowl</title>
<!-- Theme: "belly" (RoadThemes) + child theme, WPBakery 5.6, Slider Revolution 5.4.8.1,
     qTranslate-X 3.4.6.8 (DE/EN/FR), WooCommerce 5.5.5, WordPress 6.4.12.
     Brand CSS in the theme: page ground #d8e2e2, primary #004443, pink popup #f2d1d5,
     body text #1a483e, fonts "brandonweb-medium" / "brandonweb-black" (Brandon Grotesque
     via the Use Any Font plugin). Wave divider: /wp-content/uploads/2020/05/welle.png (477x6)
     and the CSS class .wavedownGreen (radial-gradient scallops, #004443 → #d9e2e2). -->
</head>
<body class="home page-id-948 theme-belly">

<!-- ============ HEADER (desktop; a sticky copy and a mobile copy repeat it) ============ -->
<header class="header-container">
  <div class="logo"><a href="https://maloa.com/"><img width="79" src="https://maloa.com/wp-content/uploads/2018/11/static1.squarespace.png" alt="MA’LOA® Hawaiian Poké Bowl"></a></div>
  <nav class="mega_main_menu" aria-label="Menu">
    <ul>
      <li><a href="https://maloa.com/what-is-poke/?lang=en">About Ma’loa</a>
        <ul>
          <li><a href="https://maloa.com/what-is-poke/?lang=en">WHAT IS POKÉ</a></li>
          <li><a href="https://maloa.com/what-is-poke/?lang=en#ourstory">OUR STORY</a></li>
          <li><a href="https://maloa.com/what-is-poke/?lang=en#our_promise">OUR PROMISE</a></li>
          <li><a href="https://maloa.com/faq/?lang=en">FAQ</a></li>
        </ul>
      </li>
      <li><a href="#">Menu</a> <!-- desktop: dead link "#"; mobile: /produkte -->
        <ul>
          <li><a href="https://maloa.com/produkte/?lang=en">PRODUCTS</a></li>
          <li><a href="https://maloa.com/naehrwerte/?lang=en">NUTRITION</a></li>
        </ul>
      </li>
      <li><a href="https://maloa.smoothr.de/map">Stores</a></li>
      <li><a href="https://maloa.com/catering/?lang=en">Catering</a></li>
      <li><a href="https://maloa.com/jobs/?lang=en">Join Us</a></li>
      <li><a href="https://maloa.com/franchise/?lang=en">Franchise</a></li>
      <li><a href="https://www.paynoweatlater.de/at/maloa/?crt=maloa">Vouchers</a></li> <!-- mobile menu calls it "Coupons" -->
      <li class="order-now"><a href="https://maloa.smoothr.de/map">Order Now</a></li>
      <li><a href="#"><img src="https://maloa.com/wp-content/plugins/qtranslate-x/flags/gb.png" alt="English"></a>
        <ul>
          <li><a href="https://maloa.com/?lang=de">Deutsch</a></li>
          <li><a href="https://maloa.com/?lang=en">English</a></li>
          <li><a href="https://maloa.com/?lang=fr">Français</a></li>
        </ul>
      </li>
    </ul>
  </nav>
</header>

<main>
<!-- hidden page title left in the markup: <h2>Homepage</h2> + breadcrumbs "Home / Homepage". No H1 anywhere. -->

<!-- ============ SLIDER (Revolution Slider, fade, 9 s per slide, arrows + bullets) ============
     Text is baked into the images; no text layers. -->
<section class="rev_slider">
  <img src="https://maloa.com/wp-content/uploads/2026/08/2026-09-01_Opening-Eschborn_Website-Open-Now.jpg" width="1920" height="1080" alt="">
  <img src="https://maloa.com/wp-content/uploads/2023/09/SLIDER_Korean-Chicken-Bowl.jpg" width="1920" height="1080" alt="">
  <img src="https://maloa.com/wp-content/uploads/2025/04/MALOAWEB_Slider_Whatsapp-1.jpg" width="1920" height="1080" alt="">
  <!-- slide 4: bg-maloa-dunkel.png with a muted YouTube background video, id IdVSUdoMoR4 -->
  <img src="https://maloa.com/wp-content/uploads/2020/05/bg-maloa-dunkel.png" width="1296" height="660" alt="">
  <img src="https://maloa.com/wp-content/uploads/2020/05/DSC02247_2.png" width="1240" height="827" alt="">
</section>

<!-- ============ WELCOME ============ -->
<section id="aboutpoke_home" class="welcome-text">
  <div>
    <h3>WELCOME TO MA’LOA</h3>
    <img src="https://maloa.com/wp-content/uploads/2020/05/welle.png" width="477" height="6" alt="">
    <p><strong>MA'LOA focuses on something that Hawaiians would say is essential. We're talking about Poké Bowl, the traditional Hawaiian national dish. With Poké, we're giving you the opportunity to enter the island vibe of Hawaii.<br>
    What do you see? Sandy beaches, chains of flowers, coconuts and friendly, happy islanders. Hula dancing, Polynesian fire shows, waves. That's right, it's all Hawaii. We're here to bring a piece of Hawaii to your city: the best Poké Bowls you can get.</strong></p>
    <a class="button1" href="https://maloa.com/what-is-poke/">ABOUT POKÉ</a>
  </div>
  <figure><img src="https://maloa.com/wp-content/uploads/2020/01/Um_Maloa-1024x729.jpg" width="1024" height="729" alt=""></figure>
</section>

<!-- ============ FAVORITES (full-width, dark leaf background bg-maloa-dunkel.png) ============ -->
<section class="fullbanner">
  <figure id="picOffset-start"><img src="https://maloa.com/wp-content/uploads/2020/05/bg-maloa-favs.png" width="869" height="866" alt=""></figure>
  <div>
    <h3>MA’LOA FAVORITES</h3>
    <img src="https://maloa.com/wp-content/uploads/2020/05/welle.png" width="477" height="6" alt="">
    <p style="text-align:center;color:#fff"><strong>Some of the MA'LOA team's exceptionally created favorite bowls are named after the 8 islands of Hawaii. Choose between seafood, chicken or our vegan varieties. Which island are you headed for today?</strong></p>
    <a class="button2" href="https://maloa.com/produkte/">MENU</a>
  </div>
</section>

<!-- ============ POKÉ YOUR STYLE ============ -->
<section class="welcome-text">
  <div>
    <h3>POKÉ YOUR STYLE</h3>
    <img src="https://maloa.com/wp-content/uploads/2020/05/welle.png" width="477" height="6" alt="">
    <p style="color:#004443"><strong>Create your own Poké Bowl: The varied mix of fresh seafood, valuable greens or rice, crunchy vegetables and exotic flavours awakens the Hawaiian joy of life. Are you in the mood for low fat, high protein or maybe vegan? Be inventive and discover the variety!</strong></p>
    <a class="button1" href="https://maloa.com/produkte/">MENU</a>
  </div>
  <figure><img src="https://maloa.com/wp-content/uploads/2020/02/image-asset.gif" width="750" height="750" alt=""></figure>
</section>

<!-- ============ GIFT CARD (full-width divider image trenner-1.png) ============ -->
<section class="fullbanner" style="background-image:url(https://maloa.com/wp-content/uploads/2023/09/trenner-1.png)">
  <a class="button3" href="https://www.paynoweatlater.de/at/maloa/?crt=maloa">GET YOUR GIFT CARD HERE</a>
</section>

<!-- ============ FRANCHISE ============ -->
<section>
  <a id="franchiseBtn" class="button4" href="https://maloa.com/franchise-2/">FRANCHISE</a> <!-- note: /franchise-2/, the menu uses /franchise/ -->
  <div>
    <h3>BECOME A FRANCHISE PARTNER</h3>
    <img src="https://maloa.com/wp-content/uploads/2020/05/welle.png" width="477" height="6" alt="">
    <p style="text-align:center;color:#004443"><strong>Seid Be one of the first to see MA'LOA bring a piece of Hawaii to your city. We make healthy fast food for the 21st century. South Sea island meets international cuisine. Learn more about our franchise model and open your own MA'LOA store. Ride the healthy wave with us!</strong></p>
  </div>
</section>
</main>

<!-- ============ FOOTER ============ -->
<footer class="footer">
  <!-- Mailchimp for WP, form 306. Headline and placeholders are German even on /?lang=en -->
  <form class="mc4wp-form" method="post">
    <p>Erhalte hier deine 25% für unseren Webshop! Gewinnspiele, wichtige Facts und mehr - MA’LOA NEWSLETTER!</p>
    <input type="text" name="FNAME" placeholder="Vorname*" required>
    <input type="text" name="LNAME" placeholder="Nachname*" required>
    <input type="text" name="BIRTHDAY" placeholder="Geburtstag*" required>
    <input type="text" name="LANG" placeholder="Sprache">
    <input type="email" name="EMAIL" placeholder="E-Mail Adresse*" required>
    <button type="submit">ABONNIEREN!</button>
  </form>

  <div>
    <p>Contact Us</p>
    <ul>
      <li>OFFICE ADDRESS: <a href="https://maps.app.goo.gl/HaQTVUUgpdPhea5T7">Fuggerstraße 26, 10777 Berlin</a></li>
      <li>OFFICE PHONE: <a href="tel:00493022013811">(030) 220 138 11</a></li>
      <li>WHATSAPP CHAT: <a href="https://wa.me/+4917624722381">0176 247 223 81</a></li>
      <li>OFFICE E-MAIL: <a href="mailto:info@maloa.com">info@maloa.com</a></li>
    </ul>
  </div>
  <div>
    <p>Mehr Ma’Loa</p> <!-- German heading on the English page; links below drop ?lang=en -->
    <ul>
      <li><a href="https://maloa.com/what-is-poke/">About Ma’Loa</a></li>
      <li><a href="https://maloa.com/produkte/">Products</a></li>
      <li><a href="https://maloa.smoothr.de/map">Stores</a></li>
      <li><a href="https://maloa.com/catering/">Catering</a></li>
      <li><a href="https://maloa.com/jobs/">Join us</a></li>
      <li><a href="https://maloa.com/franchise/">Franchise</a></li>
      <li><a href="https://www.paynoweatlater.de/at/maloa/?crt=maloa">Vouchers</a></li>
      <li><a href="https://maloa.smoothr.de/map">Order now</a></li>
      <li><a href="https://maloa.com/faq/">FAQ</a></li>
    </ul>
  </div>
  <div>
    <p>Legal Disclaimer</p>
    <ul>
      <li><a href="https://maloa.com/impressum/">Imprint</a></li>
      <li><a href="https://maloa.com/privacy/">Privacy</a></li>
      <li><a href="#" class="borlabs-cookie-preference">Cookie settings</a></li>
    </ul>
    <p>Social Media</p>
    <a href="https://www.facebook.com/maloapoke/">Facebook</a>
    <a href="https://www.instagram.com/maloapoke_de/">Instagram</a>
    <a href="https://www.tiktok.com/@maloapoke">TikTok</a>
  </div>
  <p>COPYRIGHT © 2023 <a href="https://www.maloa.com/">MALOA</a>. ALL RIGHTS RESERVED.</p>
</footer>

<!-- ============ PRODUCT DATA from the Boxzilla popups (hidden on the page) ============
Bowls (kcal / protein / carbs / fat, per bowl):
  Kauai Salmon Bowl      Base + Lachs, Edamame, Gurke, Ananas, Korean Love Flavor, Kimchi, Cashewkerne   485.4 / 28.08 / 43.94 / 23.05
  Molokai Salmon Bowl    Base + salmon, green soybeans, cucumber, beetroot, Sesam Me Flavor, algae salad, peanuts   545.8 / 32.05 / 38.04 / 29.93
  Lanai Tuna Bowl        Base + Ahi Tuna, Edamame, Gurke, Rote Bete, Koriander, Crazy Lime Flavor, Avocado, Erdnüsse   506.85 / 33.76 / 39.10 / 25.06
  Maui Tuna Bowl         Base + Ahi Tuna, Rote Zwiebeln, Frühlingszwiebel, Edamame, Vul'Cano Flavor, Avocado, Masago (description duplicated on the site)   497.75 / 30.59 / 27.25 / 31.25
  Big Island Tuna Bowl   Base + Ahi Tuna, Edamame, Rote Zwiebeln, Frühlingszwiebel, Gurke, Ma'Loa Flavor, Avocado, Erdnüsse   573.8 / 33.55 / 28.36 / 39.13
  Vul'cano Chicken Bowl  Base + chicken, scallion, green soybeans, cucumber, Vul'Cano Flavor, avocado, cashew nuts   547.75 / 30.59 / 24.25 / 38.25
  Peanutlover Chicken    Base + chicken, green soybeans, cucumber, scallions, Peanut Butter Dream Flavor, algae salad, peanuts   507 / 33.68 / 32.33 / 27.22
  Spicy Tropical Tofu    Base + Tofu, Gurke, Ananas, Frühlingszwiebel, Korean Love, Mango, Kokosschips   352.4 / 10.08 / 45.94 / 15.05
  Sesam Me Tofu Bowl     Base + Tofu, Edamame, Gurke, rote Zwiebel, Sesam Me, Mango, Erdnüsse   423.8 / 21.05 / 40.04 / 21.93
  Green Cream Shrimp     Base + Garnele, Frühlingszwiebel, Gurke, Edamame, Green Cream Flavor, Algensalat, Wasabinüsse   415.2 / 19.44 / 26.12 / 26.46
Other popups (per 100 g): Acai Bowl 103 kcal; Coconut-Cashew-Bowl 208.4 kcal; Mochi-Eis Mango 200 kcal,
  Salted Caramel 248 kcal, Vanille 228 kcal, Coconut 252 kcal; Carrot and Cocos Ginger Soup 103 kcal.
Every bowl table also has a "Vorteile/Benefits" column with health claims
("helps with diabetes", "reduces risk of cancer", "Kalorien und Fettarm" …) — legal risk, see brief.
"Order Now" popup: Pickup → /stores/, Lieferando → /stores/, Catering → /catering/.

============ FINDINGS FROM THE DROPPED PLUMBING ============
- Boxzilla popups run with testMode "1": the 25% popup (time on page 0, top-left, #f2d1d5)
  and the franchise popup (30% scroll, top-right, #004444) show on every visit.
  On /?lang=en both render "Sorry, this entry is only available in German".
- A script at the end rewrites document.body.innerHTML to hide
  "lessphp fatal error: failed to parse passed in variable @body_font" (broken theme compile).
- Font Awesome loaded three times (4.7 ×2, 7.3.1), Bootstrap twice, jQuery + migrate,
  ~40 CSS/JS requests; reCAPTCHA v3 badge sits under the back-to-top button.
- Borlabs cookie box configured in German on the English page.
-->
</body>
</html>
```
