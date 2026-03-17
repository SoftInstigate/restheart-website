# Copilot Instructions for restheart.org

## Site Overview

This is the [restheart.org](https://restheart.org) website — a Jekyll-based documentation and marketing site for RESTHeart, a backend framework providing REST, GraphQL, and WebSocket APIs for MongoDB. It is published via GitHub Pages.

## Build & Serve

```bash
# Serve locally (sets UTF-8 locale)
bin/serve.sh
# or equivalently:
bundle exec jekyll serve

# Build for production
bundle exec jekyll build
```

There is no test or lint suite. Validate changes by building/serving locally.

The CI/CD pipeline (`.github/workflows/jekyll.yml`) builds on push to `master` and deploys automatically to GitHub Pages using Ruby 3.1 with bundler caching.

## Architecture

Content is organized into three main areas:

- **`docs/`** — Primary documentation. Versioned: `docs/` = v9 (current), `docs/v8/` = legacy. Older versions (v3–v7) are excluded from the sitemap via `_config.yml` defaults.
- **`_posts/`** — Blog posts (Jekyll collection, paginated 7/page, published under `/blog/`).
- **Root pages** — `index.md`, `features.md`, `get.md`, `quick-start.md`, `services.md`, etc.

Layouts live in `_layouts/`, partials in `_includes/`. Two custom plugins in `_plugins/` auto-generate tag and category archive pages for the blog.

Content uses a mix of Markdown (`.md`, processed with kramdown + Rouge) and AsciiDoc (`.adoc`, processed with `jekyll-asciidoc`).

## Key Conventions

### Front Matter

All docs pages require these fields:

```yaml
---
title: Page Title
layout: docs          # or 'docs-adoc' for AsciiDoc files
menu: <section>       # matches a sidebar section: foundations, mongodb-rest, mongodb-graphql,
                      # framework, security, deployment, cloud
applies_to: restheart # 'restheart', 'cloud', or 'both' — renders a badge on the page
---
```

The `docs_version` field defaults to `9` for all files under `docs/` (set globally in `_config.yml`). Override explicitly only for legacy version pages.

For pages with old URLs, add:

```yaml
redirect_from:
  - /docs/old/path/
```

### Layouts

| Layout | Use for |
|---|---|
| `docs` | Standard Markdown documentation pages |
| `docs-adoc` | AsciiDoc documentation pages |
| `default` | General site pages |
| `blog` | Blog index |
| `article` / `post` | Individual blog posts |
| `no-footer` | Full-viewport pages (e.g., Sophia AI iframe) |

### Docs In-Page TOC

Docs pages include a manual TOC in a right-side column using a `<div markdown="1" class="d-none d-xl-block col-xl-2 order-last bd-toc">` block with a bullet list of anchor links. This is hand-maintained, not auto-generated.

### AsciiDoc vs Markdown

- New v9 docs: prefer Markdown (`.md`) with `layout: docs`
- Legacy v8 docs and some shared content use AsciiDoc (`.adoc`) with `layout: docs-adoc`
- AsciiDoc files use Rouge syntax highlighting via `source-highlighter=rouge` (set in `_config.yml`)

### Blog Posts

Posts go in `_posts/` with filename format `YYYY-MM-DD-title.md`. Standard Jekyll front matter applies. The `excerpt_separator` is `<!-- more -->`.

### Sidebar Navigation

The docs sidebar (`_includes/docs-sidebar.html`) is manually maintained. When adding a new docs page, add a link to the appropriate section in this file. There is a separate `_includes/docs-v8-sidebar.html` for the v8 legacy section.

### Styles

SCSS source is in `_sass/` and compiled through `css/main.scss`. Bootstrap 4/5 modules are included in `_sass/bootstrap/`. Add custom styles to `_sass/_components.scss` or `_sass/_utilities.scss`. AsciiDoc pages use `css/asciidoctor.css`.

### Analytics & Tracking

Google Analytics (UA + GA4), Hotjar, and Plausible are configured in `_config.yml`. The cookie banner is controlled by `cookie_banner: true`.
