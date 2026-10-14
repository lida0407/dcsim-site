> **Moved (2026-10-15):** DC Sim now lives at https://rack-density.com/dc/ (repo lida0407/rack-density-site, `src/pages/dc/**`).
> This repo only publishes `redirects/` to GitHub Pages: every old URL forwards to the same path under rack-density.com/dc/.

# dcsim-site

Static marketing site for **DC Sim** (a Sensaka product), built with Astro and deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

Live: https://lida0407.github.io/dcsim-site/

The spec and the marketing log live in the private planning repo (`marketing/dc-site/`, `share/updatemkt-dc.md`). This repo holds only the site source.

## Run

```sh
npm ci
npm run dev       # local dev server
npm run build     # astro build + scripts/check-copy.mjs (fails on rule violations)
```

## Where things are

| What | Where |
|---|---|
| Site URL and base path (the one place to change for the final domain) | `site.config.mjs` |
| Product name, contact, demo URL, prices, template file | `src/config/product.ts` |
| Page copy (product, integrations, partners, security, contact, template, sample twin) | `src/content/pages/**.md` (frontmatter: title, description, h1, directAnswer, faq, badge, shots) |
| Guides | `src/content/guides/*.md` |
| Custom pages (home, pricing, integrations index, resources, calculators, changelog, privacy) | `src/pages/` |
| Screenshots | `src/assets/shots/` (optimised to WebP at build) |
| Downloads (template v1.1, filled example, partner one-pagers) | `public/downloads/` |
| robots.txt, llms.txt, sitemap | `src/pages/robots.txt.ts`, `src/pages/llms.txt.ts`, `@astrojs/sitemap` |

## Moving to the final domain

1. In `site.config.mjs` set `SITE_URL` to the domain (e.g. `https://dcsim.io`) and `BASE_PATH` to `/`.
2. Add `public/CNAME` containing the domain, and point DNS at GitHub Pages.
3. Push. Canonicals, sitemap, robots, llms.txt and every link follow the constants.

## Copy rules (enforced by `scripts/check-copy.mjs` at build)

- No competitor names (price anchors only as "typical DCIM pricing"); integration partners are allowed on their pages.
- No AI model or AI company names.
- "CFD" only in the negative; every projected number is labelled "estimated".
- Nothing is described as available unless the build log (`share/updatedc.md`) says it shipped. Roadmap items carry a visible Roadmap badge. Zabbix and NetBox flip from Roadmap only after the dev agent logs the demo-instance test.
