# CLAUDE.md — Контекст для AI-агентов

Этот файл содержит всё, что нужно знать AI-агенту для продолжения работы над проектом без предыдущего контекста.

---

## Что это за проект

Корпоративный сайт **АРТИДА** (artida.by) — белорусский производитель бесконтактных технологий для систем безопасности и контроля доступа (СКУД). Сайт делается для родителей владельца репозитория.

**Live-версия:** https://limerentt.github.io/artida-website/

---

## Владелец и контекст

- **Кто заказчик**: Лекс (lex / limerentt) — продуктовый аналитик, делает сайт для компании своих родителей
- **Компания**: ООО «АРТИДА», Минск, Беларусь
- **Целевая аудитория сайта**: B2B-клиенты — монтажные организации, застройщики, системные интеграторы СКУД
- **Язык сайта**: русский

---

## Принятые дизайн-решения (НЕ менять без согласования)

### Брендинг
- **Цвета**: белый фон + корпоративный синий (#1E4D8C). Это финальная палитра после нескольких итераций (изначально был тёмный фон с оранжевым акцентом — отвергнуто).
- **Шрифт**: IBM Plex Sans (единый для всего). Ранее были Unbounded + Manrope — заменены.
- **Стиль**: чистый, корпоративный, минималистичный. Без декоративных элементов.

### Архитектура
- **Без фреймворков**: чистый HTML + CSS + JS. Это осознанный выбор, не предлагать React/Vue/etc.
- **Без бандлеров**: нет npm, webpack, vite. Только CDN для GSAP и Lenis.
- **index.html содержит inline CSS и JS** для hero-секции — это нормально, не рефакторить в отдельные файлы без просьбы.
- **Остальные страницы** используют общие css/style.css + js/app.js.

---

## Самая сложная часть: Hero-анимация

### Как это работает
1. `.canvas-container` имеет height: 320vh — создаёт длинную зону скролла
2. `.canvas-sticky` (position: sticky) прилипает к верху и содержит grid: 3 колонки
3. Центральная колонка `.canvas-center` — flex column: hero-текст сверху, canvas снизу
4. GSAP ScrollTrigger отслеживает прогресс скролла (0→1) и:
   - Переключает фреймы в canvas (242 кадра)
   - Фейдит hero-intro текст (в первые 15%)
   - Показывает/скрывает spec-блоки в боковых панелях по фазам

### Фреймы
- 242 штуки WebP, 1928×1072, прозрачный фон
- Расположение: `img/frames/frame_0001.webp` ... `frame_0242.webp`
- Первые 121 = разборка продукта, вторые 121 = сборка
- Подготовлены из Higgsfield AI видео с chroma key удалением голубого фона

### ProductCanvas (класс в index.html)
- DPI-aware (devicePixelRatio)
- Размер подстраивает под `.canvas-wrap` (родитель), не под window
- Contain-fit: сохраняет пропорции изображения
- Fallback: если фреймы не загрузились — показывает статичное фото

---

## Известные подводные камни и грабли

### 1. Удаление фона из видео
**НЕ использовать AI-модели** (u2net, ISNet, BiRefNet) — все дают артефакты на этих конкретных видео. Простой chroma key по цвету работает идеально:
- Целевой цвет фона: RGB(134, 230, 247)
- Hard cutoff: ±10 по каждому каналу
- Soft edge feathering: ±10–25
- 1px binary erosion для зачистки краёв

### 2. Canvas vs Video
Была попытка использовать `<video>` вместо canvas — результат был "отвратительный" (слова заказчика). Canvas с фреймами — единственный рабочий подход.

### 3. Наложение текста на продукт
Hero-intro НЕ должен быть `position: absolute` поверх canvas — текст налезает на продукт. Текущее решение: hero-intro внутри `.canvas-center` как flex-child (natural flow), canvas ниже в `.canvas-wrap`.

### 4. Дублирование CSS-блоков
При редактировании index.html легко создать дублирующиеся CSS-селекторы (например два `.canvas-center`). Всегда проверяй `grep -n "имя-класса" index.html` после редактирования.

### 5. GitHub Pages
- Репозиторий **публичный** — иначе Pages не работает на бесплатном плане
- Ветка: **master** (не main!)
- Деплой с корня `/`
- Обновление через обычный `git push origin master`

### 6. Запуск локально
Нужен HTTP-сервер (python3 -m http.server, npx serve, etc.). Открытие index.html напрямую как файл ломает загрузку фреймов из-за Same-Origin policy.

---

## Структура index.html

```
<style>
  /* ~280 строк: hero-система, side panels, scroll progress, responsive */
</style>

<header> ... </header>
<nav class="nav-mobile"> ... </nav>

<main>
  <section class="canvas-container">     <!-- 320vh scroll zone -->
    <div class="canvas-sticky">           <!-- sticky 100vh -->
      <div class="side-panel--left">      <!-- grid col 1 -->
      <div class="canvas-center">         <!-- grid col 2 — flex column -->
        <div class="hero-intro">          <!--   заголовок + CTA -->
        <div class="canvas-wrap">         <!--   flex:1 — canvas -->
          <canvas id="productCanvas">
        <div class="hero-scroll-hint">    <!--   "скролл" внизу -->
      <div class="side-panel--right">     <!-- grid col 3 -->
      <div class="scroll-progress">       <!-- 4 точки-индикатора -->

  <section class="section-about"> ...
  <section class="section-technology"> ...
  <section class="section-services"> ...
  <section class="section-stats"> ...
  <section class="section-geography"> ...

<footer> ... </footer>

<script> CDN: Lenis, GSAP, ScrollTrigger </script>
<script src="js/app.js"> </script>
<script>
  /* ~200 строк: CONFIG, ProductCanvas class, GSAP ScrollTrigger setup */
</script>
```

---

## Git

- **Репо**: https://github.com/limerentt/artida-website
- **Ветка**: master
- **Хостинг**: GitHub Pages (автодеплой)
- **Токен**: используется для API-операций (push, Pages, etc.)
- **Коммиты**: на русском или английском, формат `тип: описание`

---

## Что ещё нужно сделать (TODO)

- [ ] Проверить и доработать hero-секцию (текст/продукт расположение)
- [ ] Мобильная адаптация hero (боковые панели скрыты — нужно решение для спеков)
- [ ] Оптимизация загрузки фреймов (lazy loading, progressive)
- [ ] Реальные фотографии продукции (сейчас placeholder'ы)
- [ ] SEO: meta tags, OpenGraph, sitemap.xml
- [ ] Форма обратной связи (бэкенд)
- [ ] Favicon
- [ ] Performance: preload critical assets
