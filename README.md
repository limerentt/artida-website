# АРТИДА — artida.by

Сайт белорусского производителя бесконтактных технологий и электроники для систем безопасности и контроля доступа.

## Структура

```
website/
├── index.html          — Главная (scroll-driven анимация, canvas с 242 фреймами)
├── products.html       — Каталог продукции
├── magiya.html         — Продукт: МАГИЯ
├── ke-01.html          — Продукт: КЕ-01
├── ktm-ud.html         — Продукт: КТМ-УД
├── about.html          — О компании
├── services.html       — Услуги
├── contacts.html       — Контакты
├── css/style.css       — Дизайн-система (токены, компоненты)
├── js/app.js           — Общий JS (навигация, анимации)
├── img/frames/         — 242 WebP-фрейма для canvas-анимации
└── img/products/       — Фотографии продукции
```

## Технологии

- **GSAP 3** + ScrollTrigger — scroll-driven анимации
- **Lenis** — smooth scroll
- **Canvas API** — покадровая анимация продукта (разборка/сборка)
- **CSS Custom Properties** — дизайн-токены
- **Google Fonts** — Unbounded (display) + Manrope (body)

## Запуск

```bash
cd website
python3 -m http.server 8080
# или
npx serve .
```

Открыть `http://localhost:8080` в браузере.

## Дизайн-токены

| Токен | Значение |
|-------|----------|
| `--bg-dark` | `#0A0A0A` |
| `--accent` | `#E85D3A` |
| `--text-on-dark` | `#F0EDE8` |
| Шрифт display | Unbounded |
| Шрифт body | Manrope |
