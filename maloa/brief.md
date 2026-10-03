# Ma'loa: редизайн сайта maloa.com. Бриф проекта

Этот файл содержит всё, что уже известно и решено по проекту. Его можно загрузить в новый проект Claude как стартовый контекст.

---

## 1. Суть проекта

- **Клиент:** Ma'loa, сеть поке-боулов (гавайская кухня), офис в Берлине, есть франшиза.
- **Сайт:** https://maloa.com
- **Контакт у клиента:** Даша. Общаемся на русском в мессенджере.
- **Задача:** редизайн сайта.
- **Главное направление (согласовано):** структуру сайта и фирменные цвета **оставляем**. Переделываем **логику появления блоков и анимации**: 3D, блоки внахлёст, анимации при скролле.
- **Демо на текущем этапе:** https://claude.ai/artifact/NpQAaW4w5onWY9d3ebtrbf. Его код лежит в файле `maloa-demo.html`. В демо пока иллюстрации, а не реальные фото, и клиенту/мне оно кажется «мультяшным». **Следующий шаг: заменить на реальные фото и видео.**

---

## 2. Текущий сайт: факты

### Технологии
- WordPress.
- Slider Revolution 5.4.8.1 (примерно 2018 год, устарел).
- qTranslate-X (плагин для языков, давно не поддерживается).
- Языки: DE / EN / FR.
- Онлайн-заказ идёт на **внешний сервис Smoothr**: https://maloa.smoothr.de/map. Своего магазина или корзины на сайте нет.
- Картинки грузятся с двух доменов: maloa.com и web.maloa.com. Файл логотипа называется `static1.squarespace.png`, это остаток старого сайта.

### Структура главной (сохраняем порядок)
1. Шапка с меню: Über Ma'loa, Menu, Standorte, Catering, Jobs, Franchise, Gutscheine, Kontakt, кнопка Bestellen, языки.
2. Слайдер (4 слайда): открытие в Eschborn, Korean Chicken Bowl, заказ через WhatsApp и ещё одно фото.
3. **Welcome to Ma'loa**: текст + фото + кнопка «About Poké».
4. **Ma'loa Favorites**: текст + кнопка «Menu».
5. **Poké your style**: собери свой боул.
6. Кнопки «Geschenkgutschein kaufen» и «Franchise Partner werden».
7. Блок франшизы.
8. Рассылка: 25% скидки в вебшопе за подписку.
9. Футер: контакты, соцсети, Impressum, Datenschutz.

### Найденные проблемы
- В футере «© 2023», сайт выглядит заброшенным.
- Дублирующиеся ссылки: «Standorte» и «Bestellen» ведут на одну страницу. «Pickup» и «Lieferando» ведут на /stores/. Франшиза лежит на двух адресах: /franchise/ и /franchise-2/.
- Кнопка заказа теряется среди 9 пунктов меню.
- Несколько попапов сразу: скидка, рассылка, франшиза.
- Длинные тексты набраны жирным целиком.
- Название бренда пишется по-разному: Ma'loa / Ma'Loa / MA'LOA / Ma`Loa.
- Обращение прыгает между «Ihr/Euch» и «du/deine». В демо выбрано **Ihr**, как в большинстве текстов сайта.
- Опечатки: «Chashewkerne», «Stoffwechselmacht», «Rote Beete/Bete». Описание Maui Tuna Bowl продублировано.
- **Юридический риск:** в таблицах питательности есть health claims вроде «Gurke hilft bei Diabetes», «Edamame senken Krebsrisiko», а блюдо на 573 ккал названо «kalorienarm». В ЕС это регулирует Verordnung (EG) 1924/2006. Рекомендуем клиенту проверить у юриста и убрать. В демо таких утверждений нет.

---

## 3. Контент (реальные данные с сайта)

### Favorites (все с Base)
| Боул | Тип | Состав | ккал |
|---|---|---|---|
| Kauai | Salmon Bowl | Lachs, Edamame, Gurke, Ananas, Korean Love, Kimchi, Cashewkerne | 485 |
| Molokai | Salmon Bowl | Lachs, Edamame, Gurke, Rote Bete, Sesam Me, Algensalat, Erdnüsse | 546 |
| Lanai | Tuna Bowl | Ahi Tuna, Edamame, Gurke, Rote Bete, Koriander, Crazy Lime, Avocado, Erdnüsse | 507 |
| Big Island | Tuna Bowl | Ahi Tuna, Edamame, Rote Zwiebeln, Frühlingszwiebel, Gurke, Ma'loa Flavor, Avocado, Erdnüsse | 574 |
| Vul'cano | Chicken Bowl | Chicken, Frühlingszwiebel, Edamame, Gurke, Vul'cano Flavor, Avocado, Cashewkerne | 548 |
| Peanutlover | Chicken Bowl | Chicken, Edamame, Gurke, Frühlingszwiebel, Peanut Butter Dream, Algensalat, Erdnüsse | 507 |
| Spicy Tropical | Tofu Bowl | Tofu, Gurke, Ananas, Frühlingszwiebel, Korean Love, Mango, Kokoschips | 352 |
| Sesam Me | Tofu Bowl | Tofu, Edamame, Gurke, Rote Zwiebel, Sesam Me, Mango, Erdnüsse | 424 |

Есть также Maui Tuna Bowl и Korean Chicken Bowl (новинка со слайдера).

### Poké your style: шаги
1. **Base:** [уточнить у клиента]
2. **Protein:** Lachs, Ahi Tuna, Garnele, Chicken, Tofu
3. **Toppings:** Edamame, Gurke, Mango, Ananas, Avocado, Algensalat, Rote Bete, Kimchi
4. **Flavor:** Ma'loa, Vul'cano, Korean Love, Crazy Lime, Sesam Me, Green Cream, Peanut Butter Dream
5. **Crunch:** Erdnüsse, Cashewkerne, Wasabinüsse, Kokoschips

### Контакты и ссылки
- Fuggerstraße 26, 10777 Berlin
- Тел.: (030) 220 138 11
- WhatsApp: 0176 247 223 81
- info@maloa.com
- Заказ / Standorte: https://maloa.smoothr.de/map
- Gutscheine: https://www.paynoweatlater.de/at/maloa/?crt=maloa
- Catering: https://maloa.com/catering/
- Franchise: https://maloa.com/franchise/
- Jobs: https://maloa.com/jobs/
- FAQ: https://maloa.com/faq/
- Instagram: https://www.instagram.com/maloapoke_de/
- TikTok: https://www.tiktok.com/@maloapoke
- Impressum: https://maloa.com/impressum/
- Datenschutz: https://maloa.com/privacy/

### Цвета, использованные в демо (нужно подтвердить по брендбуку)
- Тёмно-бирюзовый `#004443`
- Нежно-розовый `#f3d2d5`
- Светлый фон `#f4f7f5`
- Акцент лосось `#ef7058` (только в иллюстрациях)

Шрифты в демо: Bricolage Grotesque (заголовки), Figtree (текст). Заменить на фирменные, если есть.

---

## 4. Концепция анимаций (что делаем)

| Блок | Анимация | Референс |
|---|---|---|
| Hero (вместо слайдера) | Заголовок появляется по словам (3D-поворот). Справа крутящийся боул. **Цель: реальное видео из Google Flow, привязанное к скроллу.** Слайды слайдера → кнопки-новости под заголовком. | awwwards.com/inspiration/3d-webgl-product-page |
| Welcome + Favorites-интро | **Блоки внахлёст:** следующий наезжает на предыдущий, тот уменьшается и темнеет. | freefrontend.com/scroll-trigger-js (Stacking Accordion) |
| Favorites | **Как у SŌM:** слева закреплено фото боула, справа листается список; фото, название и ккал меняются. | awwwards.com/inspiration/product-details-scroll-experience-som |
| Poké your style | **«Разобранный вид»:** при скролле боул разлетается на слои Base → Protein → Toppings → Flavor → Crunch с подписями. | awwwards.com/inspiration/interactive-webgl-exploded-view-iyo |
| Волна-разделитель | Три слоя волны с разной скоростью (объём). | awwwards.com/inspiration/3d-webgl-scroll-monogrid-com |
| Gutschein, Franchise, Newsletter | Блоки внахлёст (вторая «колода»). | тот же |
| Футер | Бегущая строка «Ride the healthy wave». | — |

Ещё посмотреть: awwwards.com/websites/food-drink, landing.love (коллекция GSAP), gsapdemos.com/examples, awwwards.com/websites/gsap.

**Правила:**
- На телефоне тяжёлое 3D заменять лёгкими видео или картинками: заказ не должен тормозить.
- Без прелоадера: он задерживает заказ.
- Кнопка «Bestellen» всегда на виду.
- Поддержка `prefers-reduced-motion`: без анимаций для тех, кто их отключил.
- Анимировать только transform и opacity.

**Технически:** GSAP + ScrollTrigger. Для WordPress/Elementor есть готовые наборы GSAP-анимаций (например, Animation Addons), так что сайт не обязательно переписывать с нуля. Переезд на Next.js + Sanity + React Three Fiber возможен, но это уже премиум-пакет с большим бюджетом.

---

## 5. Нужные материалы

### Фото с текущего сайта (скачать и загрузить в проект)
1. Логотип Ma'loa (PNG, прозрачный фон).
2. Фото из «Welcome to Ma'loa» (файл Um_Maloa).
3. Фон блока Favorites (bg-maloa-favs).
4. Слайды: Korean Chicken Bowl, открытие Eschborn, DSC02247.
5. Фото всех боулов со страницы «Produkte».

### Видео из Google Flow (делаю сам)
1. **Hero:** боул медленно поворачивается на 360°, камера неподвижна, угол примерно 45° сверху, однотонный тёмно-бирюзовый фон, 5–8 секунд, без текста.
2. **Poké your style:** тот же боул и фон, ингредиенты по очереди поднимаются из миски и зависают слоями (рис → лосось/тунец → овощи → соус → орешки), 5–8 секунд.
3. По желанию: PNG ингредиентов на прозрачном фоне (лосось, авокадо, эдамаме, манго).

**Важно:** в Flow загружать реальное фото их боула как референс, чтобы видео было похоже на настоящий продукт. Видео сжать до 3–5 МБ каждое.

Видео будут привязаны к скроллу (кадры проигрываются при прокрутке, как на сайтах Apple).

---

## 6. Открытые вопросы к клиенту

1. Фирменные цвета и шрифты: есть ли брендбук с точными кодами?
2. Какие варианты Base есть в меню?
3. Есть ли качественные фото боулов, сторов, команды?
4. Главная цель сайта: больше онлайн-заказов, франшиза, кейтеринг или имидж?
5. Остаёмся на WordPress?
6. Smoothr остаётся системой заказов?
7. Все три языка (DE/EN/FR) нужны?
8. Кто пишет тексты и кто утверждает?
9. Данные для блока франшизы: стартовые инвестиции, площадь, число сторов, поддержка.
10. Сроки и бюджет.

---

## 7. Цена и договорённости (как вести разговор)

- Не называть цену, пока не ясен объём.
- Спросить про ориентир по бюджету.
- Предложить 2–3 пакета:
  - **Базовый:** новый дизайн главной и меню, мобильная версия, заметная кнопка заказа.
  - **Стандарт:** весь сайт + техническое обновление + исправление текстов.
  - **Премиум:** всё + 3D-анимации + SEO + поддержка 1–2 месяца.
- Условия: предоплата 30–50%, 2 раунда правок включены, дальше за доплату. Этапы: дизайн → согласование → вёрстка → запуск.

---

## 8. Задача для следующего шага

Взять `maloa-demo.html` и:
1. Заменить все иллюстрации и заглушки `[Foto: …]` на реальные фото клиента.
2. Заменить 3D-боул на видео из Flow, привязанное к скроллу (hero и Poké your style).
3. Сохранить структуру, цвета и все анимации блоков.
4. Проверить на телефоне: скорость, читаемость, кнопка заказа.
