# Easy Reach Window Cleaning — website

Static site. No build step, no `npm install`. Open `index.html` or push to any static host
(GitHub Pages, Netlify, Cloudflare Pages…) and it works.
Stack: **Tailwind CSS (Play CDN)** + shadcn/ui-style design tokens + a little vanilla JS.

## File structure

```
index.html              ← ALL page content (text, phone, email, sections)
css/styles.css          ← design tokens (colours/radius) + components + animations
js/tailwind.config.js   ← Tailwind theme (fonts, colours, spacing notes) — loads right after the CDN
js/main.js              ← menu, scroll reveals, before/after sliders, bubbles, form submit
images/
  before-*.jpg / after-*.jpg   ← slider photos
  van.webp, logo.webp/png      ← van + logo (transparent)
  og-image.jpg                 ← 1200×630 social share image
  services/   ← one photo per service (4:3) shown in the blue "What we do" explorer
  illustrations/hero-window.svg  ← the animated hero graphic
favicon.ico, favicon-*.png, apple-touch-icon.png, android-chrome-*.png, site.webmanifest
robots.txt
```

## Common edits

| I want to…                         | Do this |
|------------------------------------|---------|
| Change phone / email / address     | Search `index.html` for `07781`, `easyreachwindow@gmail.com`, `Perrybon` (also in the JSON-LD block in `<head>`) |
| Re-brand colours                   | `css/styles.css` → `:root` variables (`--primary` blue, `--secondary` yellow, `--navy`) |
| Edit a service                     | `index.html` → section `id="services"`: each service is one `<button class="svc-tab">` (the list) plus one matching `<article class="svc-panel">` (the photo card) |
| Swap before/after photos           | Replace the 4 jpgs in `images/` (keep names, ~4:3 ratio) or edit the `src` in the `id="work"` section |
| Change FAQ                         | `index.html` → section `id="faq"`, each question is one `<details>` |
| Add a service to the form dropdown | `index.html` → `<select id="f-service">` |
| Change where quotes are emailed    | `index.html` → `<form id="quote-form" action="https://formsubmit.co/YOUR@EMAIL">` |

## Photos: what's real and what's a placeholder

Anything labelled **"Photo placeholder"** is a stand-in. Swap it by dropping a new JPG into the same
folder **with the same filename** (no code changes needed). Keep roughly the shown aspect ratio.

| File | Used for | Ratio | Status |
|------|----------|-------|--------|
| `images/services/window-cleaning.jpg` | Services → Window cleaning | 4:3 | placeholder |
| `images/services/pressure-washing.jpg` | Services → Pressure washing | 4:3 | placeholder |
| `images/services/soft-washing.jpg` | Services → Soft washing | 4:3 | placeholder |
| `images/services/fascia-gutters.jpg` | Services → Fascia & gutters | 4:3 | placeholder |
| `images/services/driveways-patios.jpg` | Services → Driveways & patios | 4:3 | real photo |
| `images/services/conservatory-roofs.jpg` | Services → Conservatory roofs | 4:3 | real photo |
| `images/services/property-maintenance.jpg` | Services → Property maintenance | 4:3 | placeholder |
| `images/logo.webp` | Logo card in the "Why Easy Reach" section (also in the nav/footer) | square | real |
| `images/services/landlord-commercial.jpg` | Service 08 photo | 4:3 | placeholder |
| `images/before-*.jpg`, `after-*.jpg` | Before/after sliders  | 4:3 | real photos |

Tip: resize photos to ~1200px wide and save at ~80% JPEG quality so the page stays fast.

## Quote form (FormSubmit)

* Sends to `easyreachwindow@gmail.com` via https://formsubmit.co (AJAX, no page reload, success message on screen).
* **First submission only:** FormSubmit emails an *activation link* to that address. Submit one test
  enquiry after going live and click the link, otherwise real enquiries won't be delivered.
* Includes a honeypot field for spam and an auto-reply to the customer (`_autoresponse`).

## Before launch checklist

1. Replace `YOUR-DOMAIN.com` in `index.html` (canonical, `og:url`, `og:image`, `twitter:image`, JSON-LD) with the real domain.
   The OG image must be an absolute URL for Facebook/WhatsApp previews to work.
2. Submit a test quote and activate FormSubmit (above).
3. Test the share preview: https://www.opengraph.xyz/
4. Optional: add real customer reviews — add a section only with genuine, permitted testimonials.

## Notes

* **8px spacing:** use even Tailwind steps only (`2`=8px, `4`=16px, `6`=24px, `8`=32px, `12`=48px, `16`=64px, `20`=80px).
* Tailwind Play CDN is great for a small site like this. If you ever want to ship compiled CSS, run the Tailwind CLI
  against `index.html` using the theme in `js/tailwind.config.js`.
* Animations respect `prefers-reduced-motion`.


## Reviews (section `id="reviews"`)
The review cards are clearly marked **SAMPLE** placeholders. Do NOT leave invented reviews live.
In `index.html` find the `EDIT ME` comment in the reviews section, paste in real reviews (word for word, with permission) and delete the `rev-tag` "Sample" span on each card. Keep the first set of 6 cards; the script clones them for the endless scroll.

## Hero van
The van drives across the bottom of the hero (`.hero-road` / `.hero-van` in `css/styles.css`, image `images/van.webp`). Speed is the `15s` in the `van-pass` animation.

## SEO: what is already done
- Keyword-led `<title>`, meta description, H1, single-page heading hierarchy, descriptive alt text
- Canonical + hreflang (en-GB), robots meta, geo tags, Open Graph + Twitter cards
- JSON-LD: LocalBusiness (all 12 services, all 10 parishes, phone, address), WebSite, WebPage and FAQPage (matches the on-page FAQ)
- `robots.txt`, `sitemap.xml` (with images), `404.html`, `_headers` (security + caching for Cloudflare Pages/Netlify), `site.webmanifest`
- Fast: lazy images, no build step, preloaded hero art

## Go-live checklist (do these once the domain is chosen)
1. Run `python3 set-domain.py theirdomain.com` – swaps every `YOUR-DOMAIN.com` (canonical, OG, schema, sitemap, robots).
2. Add the real review text (see Reviews above). Never add star ratings to the schema unless they are real.
3. Replace the placeholder service photos (esp. `landlord-commercial.jpg`, `property-maintenance.jpg`).
4. If they have Facebook / Instagram / Google pages, add them as `"sameAs": [...]` in the JSON-LD.
5. Submit `https://theirdomain.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
6. **Set up a free Google Business Profile** for Easy Reach (service area: Guernsey) with the same name, phone and address as the site. This is the biggest local-ranking boost, bigger than anything on the page itself.
7. Ask happy customers for Google reviews and link the profile from the site.
8. Activate FormSubmit by sending one test enquiry and clicking the email link.