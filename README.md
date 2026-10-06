# amirsohil.github.io — redesign

Drop-in instructions:

1. Copy every file in this folder into the root of your `amirsohil.github.io` repo,
   overwriting `index.html`, `about.html`, `portfolio.html`, `essays.html`.
   (`portfolio2.html` is no longer needed — everything now lives in one
   searchable `portfolio.html`, driven by `data/projects.json`.)
2. Your existing `images/` folder stays exactly where it is — every path in
   `data/projects.json` and `data/essays.json` points at `images/<file>.png`,
   matching what's already live.
3. Add your CV as a PDF at `assets/cv/amir-sohil-cv.pdf` (create the
   `assets/cv/` folder). That's the only broken link until you do — the nav
   "Download CV" button and the one on About/404 all point there.
4. Individual project/essay pages (`pola.html`, `transferium.html`, etc.)
   are untouched and keep their current HTML5UP styling, so there'll be a
   visual jump from the new hub pages into the old detail pages. Happy to
   restyle those to match in a follow-up if you want the whole site
   consistent.
5. Tags in `data/projects.json` / `data/essays.json` were inferred from your
   existing project descriptions — skim them and adjust before publishing,
   especially the "Tools" tags on projects that didn't name a specific stack.
6. To add a new project or essay later: add one object to the matching JSON
   file. No HTML or JS changes needed — the tag filters and search rebuild
   themselves from whatever's in the file.
7. `project-page-template.html` and `essay-page-template.html` are sample
   detail pages — duplicate one, rename it to match a project/essay's
   `href`, and search for ALL-CAPS placeholder text to fill in. They cover:
   reading-progress bar, scroll-spy table of contents, animated stat
   counters, tabs, an expandable "case card" accordion, an image gallery
   with a keyboard-navigable lightbox, a bare interactive "try it" slider
   scaffold (rewire the formula in `js/detail.js`'s `initDemoSlider()`),
   footnotes, copy-link, auto-computed reading time, and a "more work" /
   "read next" strip that pulls live from the JSON data files. All of it is
   plain HTML/CSS/JS — no build step, no dependencies beyond what's already
   in this repo.

## Structure

```
index.html          Landing
about.html           About
portfolio.html        Portfolio (search + Tools/Skills filters)
essays.html           Essays (search + Tools/Skills filters)
contact.html          Contact
404.html              Custom not-found page
project-page-template.html  Sample interactive project detail page — duplicate per project
essay-page-template.html    Sample interactive essay detail page — duplicate per essay
css/style.css         Full design system (includes detail-page components)
js/main.js             Nav, hero canvas, marquee, back-to-top, contact form
js/filter.js            Search + tag filter engine (portfolio + essays)
js/featured.js          Pulls "featured" items onto the landing page
js/detail.js             Progress bar, TOC scrollspy, accordion, tabs, counters,
                          lightbox, demo slider, footnotes, related-items strip
data/projects.json      Every portfolio project — edit this to update the site
data/essays.json        Every essay — edit this to update the site
favicon.svg              Node-graph mark
robots.txt / sitemap.xml SEO basics
```
