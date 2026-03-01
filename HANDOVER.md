# Verkehrsteiner Website Handover

## 1. Project Summary
This is an Eleventy 3 static site with Netlify CMS editing.

Core stack:
- Eleventy v3
- Nunjucks/HTML layouts
- Markdown content
- One global stylesheet: `src/css/critical.css`
- Minimal browser JS, mostly in:
  - `src/js/scripts.js`
  - inline scripts in `src/_includes/layouts/home.html`

Output:
- generated to `dist/`

## 2. Runtime Requirements
Use:
- Node.js 18

Commands:
- dev: `npm run start`
- build: `npm run build`

Reason:
- this project has already had build/runtime issues outside Node 18

## 3. Current Repository State

The metadata in `package.json` is also stale in places:
- package name
- repository URL
- bugs/homepage fields

Those values do not match the current site and should be cleaned if this repo is being maintained long-term.

## 4. High-Level Architecture
### Root config
- Eleventy config: `.eleventy.js`
- Netlify config: `netlify.toml`
- package scripts: `package.json`

### Source content
- root pages: `src/*.md`
- posts/news: `src/posts/*.md`
- projects: `src/projects/*.md`
- services: `src/services/*.md`
- faqs: `src/faqs/*.md`
- team members: `src/team/*.md`

### Templates
- layouts: `src/_includes/layouts/`
- partials: `src/_includes/partials/`
- SVG includes: `src/_includes/svgs/`

### Data
- `src/_data/site.js`
- `src/_data/site.json`
- `src/_data/navigation.json`
- `src/_data/footer_navigation.json`
- `src/_data/global.js`
- `src/_data/helpers.js`

### Assets
- CSS: `src/css/critical.css`
- JS: `src/js/scripts.js`
- images: `src/images/`
- fonts: `src/fonts/`

## 5. Eleventy Configuration
Main config file:
- `.eleventy.js`

### Passthrough copy
Currently copied directly:
- `src/fonts`
- `src/admin`
- `src/css`
- `src/js`
- `src/images`
- `src/favicon.svg`
- `src/site.webmanifest`

### Collections
Defined collections include:
- `news`
- `projects`
- `services`
- `faqs`
- `postCategories`
- `postTags`
- `projectCategories`
- `projectTags`
- generated category/tag page collections for news and projects

### Filters
Important custom filters include:
- `dateFilter`
- `w3DateFilter`
- `sortByDisplayOrder`
- `inline`
- `filterNewsByCategory`
- `filterNewsByTag`
- `filterProjectsByCategory`
- `filterProjectsByTag`
- `filterProjectsByService`
- `filterFaqsByService`
- `asTagArray`

### Service matching logic
Projects and FAQs are linked to services by text matching, not by IDs.

Relevant helpers:
- `normalizeServiceText()`
- `matchesService()`

Implication:
- service names must stay textually consistent
- punctuation, dashes, and accents are normalized, but this is still a string-based relationship

If the site grows, replacing this with a stable slug/key would be safer.

## 6. Content Model
### Pages
Editable single files in `src/`:
- `src/index.md`
- `src/about.md`
- `src/contact.md`
- `src/news.md`
- `src/projects.md`
- `src/services.md`
- `src/process.md`

### News
Folder:
- `src/posts/`

Common fields:
- `title`
- `postAuthor`
- `postDate`
- `image`
- `postSummary`
- `postCategories`
- `postTags`
- body content

### Projects
Folder:
- `src/projects/`

Common fields:
- `title`
- `activities`
- `category`
- `client`
- `partners`
- `service`
- `date`
- `image`
- `thumbnail`
- `location`
- `tags`
- `summary`
- `aside`
- body content

Important:
- `tags` may be stored as comma-separated text
- the site normalizes this with `asTagArray`

### Services
Folder:
- `src/services/`

Common fields:
- `name`
- `summary`
- `image`
- `eleventyComputed.title`
- `lede`
- `aside1`
- `aside2`
- `blockquote`
- body content

### FAQs
Folder:
- `src/faqs/`

Purpose:
- FAQs are filtered onto service pages by matching the FAQ `service` field with the current service

### Team
Folder:
- `src/team/`

Common fields:
- `name`
- `role`
- `linkedin`
- `telephone`
- `qualifications`
- `summary`
- `bio`
- `quote`
- images

## 7. Admin / CMS
Admin config:
- `src/admin/config.yml`

Admin entry page:
- `src/admin.njk`

Current CMS backend:
- Netlify CMS / Decap style config
- `git-gateway`
- `editorial_workflow`

Collections exposed in the CMS:
- Pages
- News
- Projects
- Services
- Team Members
- Globals

Global editable JSON files:
- `src/_data/site.json`
- `src/_data/navigation.json`
- `src/_data/footer_navigation.json`

Important:
- `src/_data/site.js` wraps `site.json` and merges fallback values
- if `site.json` is missing, the site can still fall back, but the CMS expects `site.json` to exist

## 8. Site Data and Environment
Site data entry point:
- `src/_data/site.js`

Behavior:
- merges default values with `src/_data/site.json`
- resolves site URL from Netlify environment variables when present

Current extra fields in site data:
- `googleMapsApiKey`
- `googleMapsMapId`

These are intended for a future or partial Google Maps API integration.

## 9. CSS Structure
Main stylesheet:
- `src/css/critical.css`

This file now includes handover comments near the most non-obvious parts.

Key CSS systems:
- theme tokens in `:root`
- reversed theme in `body[data-theme="reversed"]`
- fluid typography tokens
- named grid layouts using `data-layout`
- component styles
- map modal styles
- home SVG animation state styles

### Important pattern: page gutter
`body` defines:
- `--page-gutter`

This variable controls:
- body horizontal padding
- full-bleed behavior of `.figure-container`

If spacing changes:
- update `--page-gutter`
- do not hard-code new negative margins elsewhere

### Important pattern: named layouts
The grid layout names such as:
- `appenzeller`
- `fribourgeois`
- `raclette`
- `sbrinz`

are effectively template APIs.

They are used across templates and should be reused rather than bypassed unless there is a strong reason.

## 10. JavaScript Structure
### Shared JS
File:
- `src/js/scripts.js`

Current responsibility:
- global animation toggle helper:
  - `window.Verkehrsteiner.createAnimationToggle`

This helper:
- manages button state
- swaps on/off icons
- updates ARIA state
- exposes `start`, `stop`, `disable`, `enable`

### Inline JS
Important exception:
- `src/_includes/layouts/home.html`

The home page still contains a large inline animation script.

This script currently controls:
- the tile-based banner SVG
- the alternate SVG “signal rain” animation

If the project continues evolving, moving that logic into a dedicated JS module would reduce template complexity.

## 11. Home Page Animation Systems
Home template:
- `src/_includes/layouts/home.html`

### Current SVGs
Included on the home page:
- `src/_includes/svgs/banner-animation-alt.svg`
- `src/_includes/svgs/banner-animation-index-wide.svg`

Archived/retained include:
- `src/_includes/svgs/banner-animation-index.svg`

### System 1: Tile banner
SVG:
- `banner-animation-index-wide.svg`

Behavior:
- tiles are clipped square cells
- inner shapes rotate in timed segments
- hover pauses the active tile and its orthogonal neighbors
- hover also shifts fill to accent colors

Visual rules live in:
- `src/css/critical.css`

Motion logic lives in:
- inline script in `src/_includes/layouts/home.html`

### System 2: Alt banner
SVG:
- `banner-animation-alt.svg`

Behavior:
- `path` and `rect` elements start hidden and raised
- JS randomly drops them down and fades them in
- effect is intentionally Matrix/signal-like rather than orderly

Visual rules live in:
- `src/css/critical.css`

Motion logic lives in:
- inline script in `src/_includes/layouts/home.html`

### Toggle button
Current state:
- one `.js-anim-toggle` on the home page
- it controls both SVG systems

Caveat:
- the button is visually attached to the banner container, but it currently governs both banners at once
- this is functional, but may not be the final UX

## 12. SVG Includes
SVG include folder:
- `src/_includes/svgs/`

Current notable files:
- `banner-animation-index.svg`
- `banner-animation-index-wide.svg`
- `banner-animation-alt.svg`

The `banner-animation-alt.svg` file was refactored recently:
- elements grouped by fill color
- `rect`s clustered within each fill group
- colors now use:
  - `var(--color-brand)`
  - `var(--color-accent)`
  - relative `oklch(from var(--color-brand) ...)`

Implication:
- color theming is now CSS-variable-driven
- the SVG is easier to maintain than when each element had its own hard-coded fill

## 13. Maps
### Current implementation
Projects page uses:
- a CSS-only modal opened via anchor target
- a Google Maps embed inside an iframe

Relevant CSS block:
- `src/css/critical.css`

There was discussion around moving to:
- Google Maps JavaScript API
- map styling via API JSON / map ID

That is not fully implemented in the current build.

### Data placeholders
Site data includes:
- `googleMapsApiKey`
- `googleMapsMapId`

Those fields are ready for future use, but may still be empty.

## 14. Services, Projects, and FAQs Relationship
Current linking logic:
- project -> service via `project.data.service`
- faq -> service via `faq.data.service`

Matching is text-based.

This works now, but long-term maintenance risk is:
- a service label changes
- related projects or FAQs stop matching silently

Recommended future refactor:
- introduce a service slug field
- use slug-based relationships everywhere

## 15. Known Caveats / Technical Debt
### 1. Inline home page animation script is large
Location:
- `src/_includes/layouts/home.html`

Risk:
- template becomes harder to maintain
- animation logic is less reusable than a dedicated JS file

### 2. Package metadata is stale
Location:
- `package.json`

Risk:
- confusing repo identity for future maintainers

### 3. Existing `README.md` is starter-kit-oriented
Location:
- `README.md`

Risk:
- handover confusion if someone reads the wrong file first

### 4. Service linkage is text-based
Location:
- `.eleventy.js`

Risk:
- content editors can break relationships by renaming text

### 5. Some logic is intentionally template-local
Example:
- home banner animations

Risk:
- harder to test and reuse

## 16. Recommended Next Cleanup Tasks
If a developer picks this up again, the highest-value cleanup tasks are:

1. Move home animation logic out of `src/_includes/layouts/home.html` into `src/js/`
2. Replace string-based service matching with slugs/IDs
3. Clean stale metadata in `package.json`
4. Decide whether the home page should have:
   - one shared animation toggle
   - one toggle per banner
5. Review whether both home SVG systems are intended to ship or only one

## 17. Useful File References
- `.eleventy.js`
- `package.json`
- `netlify.toml`
- `src/admin/config.yml`
- `src/_data/site.js`
- `src/_data/site.json`
- `src/css/critical.css`
- `src/js/scripts.js`
- `src/_includes/layouts/home.html`
- `src/_includes/layouts/projects.html`
- `src/_includes/layouts/project.html`
- `src/_includes/layouts/service.html`
- `src/_includes/layouts/about.html`
- `src/_includes/partials/project-list.html`
- `src/_includes/partials/post-list.html`
- `src/_includes/partials/member-list.html`
- `src/_includes/svgs/banner-animation-alt.svg`
- `src/_includes/svgs/banner-animation-index-wide.svg`

## 18. Final Build Check
Last verified command:
- `npm run build`

Build completed successfully on Node 18.
