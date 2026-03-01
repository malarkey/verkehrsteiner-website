Verkehrsteiner Website
======================

Overview
--------
This is an Eleventy 3 static site for Verkehrsteiner AG.

The site includes:
- Page templates in `src/_includes/layouts/`
- Content in Markdown under `src/`
- Shared partials in `src/_includes/partials/`
- Inline SVG includes in `src/_includes/svgs/`
- Global CSS in `src/css/critical.css`
- Shared browser JS in `src/js/scripts.js`
- Netlify CMS admin in `src/admin/`

Requirements
------------
- Node.js 18
- npm

Important:
- The project has previously failed to build on newer Node versions.
- Use Node 18 unless you are deliberately upgrading the toolchain.

Install
-------
`npm install`

Run Locally
-----------
`npm run start`

Default local URL:
`http://localhost:8080`

Production Build
----------------
`npm run build`

Build output:
`dist/`

Deployment
----------
Netlify is configured in `netlify.toml`.

Build command:
`npm run build`

Publish directory:
`dist`

Admin
-----
The CMS lives at:
`/admin/`

Config:
`src/admin/config.yml`

CMS backend:
- `git-gateway`
- `editorial_workflow`

Main content types currently exposed in the admin:
- Pages
- News
- Projects
- Services
- Team Members
- Global data

Content Areas
-------------
- News posts: `src/posts/*.md`
- Projects: `src/projects/*.md`
- Services: `src/services/*.md`
- FAQs: `src/faqs/*.md`
- Team members: `src/team/*.md`
- Main pages: `src/*.md`

Important Files
---------------
- Eleventy config: `.eleventy.js`
- Site data: `src/_data/site.js` and `src/_data/site.json`
- Navigation data: `src/_data/navigation.json`
- Footer navigation: `src/_data/footer_navigation.json`
- Main stylesheet: `src/css/critical.css`
- Shared JS: `src/js/scripts.js`
- Home template: `src/_includes/layouts/home.html`

Home Page Notes
---------------
The home page currently contains two SVG animation systems:
- `banner-animation-index-wide.svg`
- `banner-animation-alt.svg`

Both are included in:
`src/_includes/layouts/home.html`

The animation toggle button on the home page currently controls both systems.

Handover
--------
For full implementation notes, content structure, caveats, and known issues, read:
`HANDOVER.md`
