# Afrisciencenet.org — WordPress UI Upgrade + Platform Foundation Plan

## 0) Scope and delivery strategy

This plan upgrades **on top of WordPress** (no full rebuild), prioritizing:

- Premium modern homepage and design system first (Phase 1).
- Lightweight platform foundations for Equipment/Institutions/Resources next (Phase 2).
- Low hosting complexity (shared hosting or managed WordPress compatible).
- Easy long-term management by a small NGO team in WordPress admin.

---

## 1) Information architecture / sitemap

## Public pages

- **Home** (new SaaS-style landing page)
- **About**
  - Mission
  - Team / Governance (optional)
  - Partners
- **Equipment Database** (archive: `equipment`)
  - Equipment detail (single: `equipment`)
- **Lab/Institution Directory** (archive: `institution`)
  - Institution detail (single: `institution`)
- **Resources** (archive: `resource`)
  - Resource detail (single: `resource`)
- **Forum / Community** (existing posts/forum area)
- **Network** (existing)
- **Search Results** (`/search`)
- **Contact** (optional if not already present)

## Auth pages (existing, polished UI)

- **Login**
- **Register** (including Institutional Equipment Database flow)
- **Profile / Account** (if plugin provides)

## Utility

- Privacy Policy
- Terms
- Footer pages (FAQs, support email)

---

## 2) Homepage wireframe outline (mobile-first)

## Section A — Sticky Header/Nav

- Left: logo
- Center/right: Home, Equipment, Institutions, Resources, Forum, About
- Primary CTA button: **Join Network**
- Mobile: hamburger drawer + CTA fixed in drawer top

## Section B — Hero (above fold)

- Headline: **“Connecting African Researchers to Labs & Equipment”**
- Subtext: “Discover equipment, institutions, and opportunities that accelerate African science collaboration.”
- CTA row:
  - CTA1: **Find Equipment**
  - CTA2: **Join Network**
- Optional decorative gradient or blurred orb background (CSS only)

## Section C — Global Search

- Centered wide search bar under hero
- Label: “Search equipment, institutions, resources…”
- Initial behavior: WordPress global search
- Later extension: scoped equipment/institution query

## Section D — 4 Feature Cards (3D depth)

- Card 1: Equipment Database
- Card 2: Lab Directory
- Card 3: Funding / Scholarships
- Card 4: Collaboration / Forum

Each card:
- Icon
- 1-line title
- Short supporting text
- Link CTA
- Hover elevation + subtle border glow

## Section E — Featured Equipment (latest 6)

- Grid of 2 (mobile), 3 (tablet), 6 (desktop with compact cards)
- Card fields: image, name/model, institution, country, availability badge

## Section F — Featured Institutions (latest 6)

- Card fields: institution name, country/city, departments/labs snippet

## Section G — Latest Resources (latest 6)

- Card fields: title, category, summary, download/view link

## Section H — Forum Highlights (latest 4)

- Card fields: topic title, excerpt, replies/comments count, last activity

## Section I — Trust Strip

- Mission summary sentence
- Stats placeholders (e.g., “250+ Labs”, “1,200+ Equipment Records”, “40+ Countries”)
- Partner/affiliation logo placeholders

## Section J — Footer

- Quick links, contact, social, copyright

---

## 3) UI style guide (clean academic NGO + subtle 3D)

## Color palette

- **Navy 900** (primary): `#0B1F3A`
- **Navy 700**: `#13315C`
- **Teal 500** (accent): `#14B8A6`
- **Teal 600**: `#0D9488`
- **White**: `#FFFFFF`
- **Gray 50** (section bg): `#F8FAFC`
- **Gray 200** (separators): `#E2E8F0`
- **Text body**: `#334155`

## Typography

- Headings: `Poppins` or `Inter` (600–700)
- Body: `Inter` or system sans (400–500)
- Scale:
  - H1: clamp(2rem, 4vw, 3.5rem)
  - H2: clamp(1.5rem, 3vw, 2.25rem)
  - Body: 1rem
  - Small/meta: 0.875rem

## Component style tokens

- Radius: `16px` cards, `999px` pills/buttons
- Shadow soft: `0 10px 30px rgba(15, 23, 42, 0.08)`
- Shadow hover: `0 16px 40px rgba(11, 31, 58, 0.16)`
- Glass card bg: `rgba(255,255,255,0.72)` + `backdrop-filter: blur(8px)`
- Border: `1px solid rgba(255,255,255,0.45)` over gradient sections

## Micro-interactions

- Card hover: `transform: translateY(-6px) scale(1.01)`
- Button press: `translateY(1px)`
- Scroll reveal: CSS class toggled with `IntersectionObserver`
- Keep transitions between `180ms–280ms`

## Accessibility/performance

- Minimum contrast WCAG AA
- Reduced motion support via `@media (prefers-reduced-motion: reduce)`
- Avoid large JS animation libraries in phase 1

---

## 4) WordPress implementation approach

## Recommended architecture

- Keep existing parent theme.
- Create a **child theme** for custom templates/styles.
- Use **Gutenberg blocks** + reusable patterns for editable sections.
- Add only essential plugins (free/lightweight).

## Essential plugins only

- **Advanced Custom Fields (ACF)** (free) for structured meta fields.
- **Custom Post Type UI** (optional) if team prefers UI over code registration.
- **WP Super Cache** or host cache plugin.
- **SEO plugin** already in use (Yoast/RankMath, avoid duplicates).

> If comfortable with code, register CPTs/taxonomies in child theme and skip CPT UI plugin.

## Folder structure (child theme)

```txt
wp-content/themes/afrisciencenet-child/
  style.css
  functions.php
  front-page.php
  archive-equipment.php
  single-equipment.php
  archive-institution.php
  single-institution.php
  archive-resource.php
  single-resource.php
  assets/
    css/main.css
    js/main.js
    img/
  template-parts/
    home/hero.php
    home/search.php
    home/feature-cards.php
    home/section-grid.php
```

## Phase 1 implementation steps (UI/UX first)

1. Create child theme and enqueue `main.css` + `main.js`.
2. Build new `front-page.php` using template parts.
3. Add sticky nav and new footer styling.
4. Implement hero, search, 4 feature cards, and content sections pulling latest posts.
5. Style with design tokens (CSS variables), glass cards, shadows, responsive grid.
6. Add light scroll reveal script and reduced-motion fallback.
7. Optimize images (WebP), lazy-load, and avoid heavy bundles.
8. QA mobile breakpoints (360px, 390px, 768px, 1024px, 1280px).

## Phase 2 implementation steps (platform basics)

1. Register CPTs: `equipment`, `institution`, `resource`.
2. Add ACF field groups per CPT.
3. Build archive/single templates.
4. Add relationship between institutions and equipment.
5. Add “Request Access” form on single equipment page (WPForms/Contact Form 7).
6. Expand search to include CPTs and optional filters (country/institution).
7. Add admin docs and training video/checklist.

---

## 5) Homepage mockup content blueprint (copy-ready)

## Hero

- H1: **Connecting African Researchers to Labs & Equipment**
- Body: “Africa Science Information Access Network helps researchers discover instruments, institutions, and opportunities for impactful collaboration.”
- Buttons: **Find Equipment** | **Join Network**

## Feature cards

- **Equipment Database** — Browse available scientific instruments and access details.
- **Lab Directory** — Discover institutions and labs across African countries.
- **Funding & Scholarships** — Find grants, fellowships, and mobility opportunities.
- **Collaboration Forum** — Connect with peers, ask questions, and share research support.

## Trust strip copy

- Mission: “Building equitable access to scientific infrastructure across Africa.”
- Stats placeholders: `XX+ Institutions`, `XX+ Equipment Listings`, `XX Countries`
- Partner logos: placeholder grayscale cards until assets are provided.

---

## 6) Code snippets (starter)

## `functions.php` (enqueue + CPT skeleton)

```php
<?php
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style(
        'asn-main',
        get_stylesheet_directory_uri() . '/assets/css/main.css',
        [],
        '1.0.0'
    );

    wp_enqueue_script(
        'asn-main',
        get_stylesheet_directory_uri() . '/assets/js/main.js',
        [],
        '1.0.0',
        true
    );
});

add_action('init', function () {
    register_post_type('equipment', [
        'label' => 'Equipment',
        'public' => true,
        'has_archive' => true,
        'menu_icon' => 'dashicons-hammer',
        'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
        'rewrite' => ['slug' => 'equipment'],
        'show_in_rest' => true,
    ]);

    register_post_type('institution', [
        'label' => 'Institutions',
        'public' => true,
        'has_archive' => true,
        'menu_icon' => 'dashicons-building',
        'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
        'rewrite' => ['slug' => 'institutions'],
        'show_in_rest' => true,
    ]);

    register_post_type('resource', [
        'label' => 'Resources',
        'public' => true,
        'has_archive' => true,
        'menu_icon' => 'dashicons-media-document',
        'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
        'rewrite' => ['slug' => 'resources'],
        'show_in_rest' => true,
    ]);
});
```

## `front-page.php` (section skeleton)

```php
<?php get_header(); ?>
<main class="asn-home">
  <?php get_template_part('template-parts/home/hero'); ?>
  <?php get_template_part('template-parts/home/search'); ?>
  <?php get_template_part('template-parts/home/feature-cards'); ?>

  <?php
  get_template_part('template-parts/home/section-grid', null, [
    'title' => 'Featured Equipment',
    'post_type' => 'equipment',
    'count' => 6,
  ]);

  get_template_part('template-parts/home/section-grid', null, [
    'title' => 'Featured Institutions',
    'post_type' => 'institution',
    'count' => 6,
  ]);

  get_template_part('template-parts/home/section-grid', null, [
    'title' => 'Latest Resources',
    'post_type' => 'resource',
    'count' => 6,
  ]);

  get_template_part('template-parts/home/section-grid', null, [
    'title' => 'Forum Highlights',
    'post_type' => 'post',
    'count' => 4,
  ]);
  ?>

  <section class="asn-trust-strip">...</section>
</main>
<?php get_footer(); ?>
```

## `assets/css/main.css` (3D style primitives)

```css
:root {
  --navy-900: #0b1f3a;
  --navy-700: #13315c;
  --teal-500: #14b8a6;
  --teal-600: #0d9488;
  --bg: #ffffff;
  --bg-soft: #f8fafc;
  --line: #e2e8f0;
  --text: #334155;
  --radius: 16px;
  --shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  --shadow-hover: 0 16px 40px rgba(11, 31, 58, 0.16);
}

.asn-home {
  background: radial-gradient(1200px 500px at 20% -5%, rgba(20,184,166,.14), transparent),
              radial-gradient(900px 420px at 95% 5%, rgba(19,49,92,.12), transparent),
              var(--bg);
}

.asn-card {
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(8px);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  transition: transform .22s ease, box-shadow .22s ease;
}

.asn-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: var(--shadow-hover);
}

.asn-btn-primary {
  background: linear-gradient(135deg, var(--teal-500), var(--teal-600));
  color: #fff;
  border-radius: 999px;
  padding: .75rem 1.2rem;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
  }
}
```

## `assets/js/main.js` (light reveal only)

```js
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.16 });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
});
```

---

## 7) Admin guide (step-by-step content operations)

## Add equipment

1. WP Admin → **Equipment** → Add New.
2. Enter title as `Equipment Name – Model`.
3. Fill ACF fields:
   - Name
   - Model
   - Manufacturer
   - Institution
   - Country / City
   - Department/Lab
   - Specs
   - Availability
   - Contact Method
   - Images
4. Set featured image and publish.

## Add institution

1. WP Admin → **Institutions** → Add New.
2. Fill ACF fields:
   - Name
   - Address
   - Country
   - Website
   - Contact
   - Labs/Departments
3. Relate equipment (relationship field) if configured.
4. Publish.

## Add resource

1. WP Admin → **Resources** → Add New.
2. Fill fields:
   - Title
   - Category
   - File upload or link
   - Summary
3. Publish.

## Curate homepage sections

- Featured rows pull latest entries automatically.
- To feature specific items later, add boolean field `is_featured` and query by it.

---

## 8) Performance + QA checklist

- Use optimized image sizes and WebP.
- Ensure lazy loading enabled for images/iframes.
- Minimize third-party scripts.
- Test Core Web Vitals on mobile.
- Verify keyboard navigation and visible focus styles.
- Confirm all sections stack cleanly on ≤390px screens.

---

## 9) Phase timeline (practical)

- **Week 1:** Design system + homepage template + responsive polish.
- **Week 2:** CPTs + fields + archive/single templates.
- **Week 3:** Search improvement + QA + admin onboarding docs.

This sequencing gives a visible premium UI quickly while preserving WordPress manageability and low infrastructure overhead.
