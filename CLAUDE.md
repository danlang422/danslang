# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Daniel Lang's personal site (danslang.com) — a portfolio/home page plus a devblog. Static HTML/CSS/JS at the root, with Eleventy used only to generate the `/posts/` section from Markdown.

## Commands

- `npm run build` — runs `eleventy`, builds `content/` into `posts/`
- `npm run start` — runs `eleventy --serve`, builds and serves with live reload for working on posts/templates

There is no test suite, linter, or type checker in this repo.

To preview the static root pages (`index.html`, `portfolio.html`) exactly as deployed, serve the repo root with any static file server (e.g. `python -m http.server`), since they use relative asset paths — opening them via `file://` will mostly work but `npm run start`'s dev server only serves the Eleventy-built `content/`, not the root pages.

## Architecture: two halves of the same site

This repo has **two separate rendering paths that share one `styles.css` and `script.js`**, and it's important not to conflate them:

1. **Static root pages** — `index.html` (home) and `portfolio.html` — are hand-written, plain HTML. They are deployed as-is and use **relative** asset paths (`assets/glasses.svg`, `styles.css`, `index.html`).
2. **Eleventy-generated pages** — everything under `content/`, which builds into `posts/`. These use the `base.njk` layout and reference assets with **root-absolute** paths (`/styles.css`, `/assets/...`).

The site nav/header markup (`.site-header`, brand link, nav links) is duplicated by hand in `index.html`, `portfolio.html`, and `content/_includes/base.njk`. **When changing nav (adding a link, renaming, etc.), update it in all three places** — there is no shared partial.

### Eleventy config (`.eleventy.js`)

- Input dir: `content/`
- Output dir: `posts/` (note: this is also the *site's* `/posts/` URL path — the output dir doubles as the URL prefix)
- Includes dir: `content/_includes/`

### Content structure

- `content/index.njk` → builds to `posts/index.html`, the "all posts" listing page (linked from nav as `/posts/`). Iterates `collections.posts`.
- `content/devblog.njk` → builds to `posts/devblog/index.html`, a filtered listing. Iterates `collections.devblog`.
- `content/posts/*.md` — individual posts. Front matter `tags` determines collection membership (e.g. `tags: [posts, devblog]` or `tags: [posts, case-study]`); a post only shows up on the devblog listing if it's tagged `devblog`.
- `content/posts/posts.json` — Eleventy directory data file applied to every file in `content/posts/`: sets `layout: post.njk` and `permalink: /{{ page.fileSlug }}/` (resolves under the `posts/` output dir, so a post's fileSlug becomes `posts/<slug>/index.html`).
- `content/_includes/base.njk` — the shared HTML shell (head, nav, footer) for all Eleventy-rendered pages. Includes the `<dialog>`-based image lightbox markup only in `post.njk`, not in `base.njk` itself.
- `content/_includes/post.njk` — wraps post content in `.post-body`, adds title/date, and the lightbox `<dialog>`.

`posts/` (the build output) is gitignored — Cloudflare rebuilds it fresh on deploy. Don't hand-edit files under `posts/`; edit the corresponding source under `content/` and rebuild.

### Styling and scripting

- `styles.css` is one global stylesheet for the entire site (static pages + generated posts), organized with section comments (`/* NAV */`, `/* HERO */`, `/* PORTFOLIO */`, `/* BLOG POST */`, `/* LIGHTBOX */`, etc.) — check for an existing section before adding new rules.
- `script.js` is one global script covering unrelated small behaviors: footer year, the homepage glasses hover/click speech bubble, and the post-image lightbox (click an image in `.post-body` to open it in a `<dialog>`). Lightbox listeners are only meaningful on post pages (`post.njk`); the glasses/speech-bubble listeners are only meaningful on `index.html`. Both are guarded with existence checks so the single script can be safely included everywhere.

## Deployment

Deployed to Cloudflare (`wrangler.jsonc`), serving the whole repo root as static assets (`assets.directory: "./"`). `.assetsignore` excludes `node_modules`, `.git`, `.claude`, `content` (Eleventy source, not needed at runtime), and build config files from the deployed asset set — the built `posts/` directory *is* deployed. Cloudflare runs the Eleventy build (`npm run build`) as part of the deploy, per the comment in `.gitignore`.
