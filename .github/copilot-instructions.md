# Copilot Instructions for jekyll-theme-primer

## Project Overview

This is a Jekyll theme for GitHub Pages, built on top of GitHub's Primer CSS design system. It ships as a Ruby gem (`jekyll-theme-primer`) and is intended to be consumed via `remote_theme` in other sites.

## Build, Test, and Lint Commands

```sh
# Install dependencies (run once before anything else)
script/bootstrap

# Run full CI suite: Jekyll build + htmlproofer + RuboCop + W3C HTML validation + gem build
script/cibuild

# Start local preview server at localhost:4000
script/server
# or equivalently:
bundle exec jekyll serve

# Run RuboCop linter only
bundle exec rubocop -D --config .rubocop.yml

# Build the gem only
gem build jekyll-theme-primer.gemspec
```

There is no single-test command; the full CI run (`script/cibuild`) is the test suite. It validates the built `_site/index.html` via W3C validator and checks all HTML with htmlproofer.

## Architecture

The theme is structured as a standard Jekyll theme gem:

- **`_layouts/`** — Four layouts: `default` (base), `home`, `page`, `post`. `home` and `page` are thin wrappers that just render `{{ content }}` inside `default`.
- **`_layouts/default.html`** — The single master template. It includes the Primer CSS, injects `{% seo %}` (via `jekyll-seo-tag`), embeds inline search UI (Lunr.js), and includes `_includes/head-custom.html` for user overrides.
- **`_sass/`** — Sass entry points only; no custom styles defined in the theme itself.
  - `jekyll-theme-primer.scss` — Imports all primer npm packages in order: `primer-support`, `primer-base`, `primer-utilities`, `primer-layout`, `primer-markdown`, then `rouge` syntax highlighting.
  - `rouge.scss` — Syntax highlighting styles for Rouge code blocks.
- **`_includes/`** — Intentionally minimal. `head-custom.html` and `head-custom-google-analytics.html` are override hooks for consumers.
- **`assets/css/style.scss`** — Consumer-facing entry point that just imports `jekyll-theme-primer`. Consumer sites override styles by creating their own `/assets/css/style.scss` that imports this theme and adds custom rules after.
- **`assets/search.json`** — Lunr.js search index data file served as JSON.
- **`_config.yml`** — Theme's own demo site config; sets `theme: jekyll-theme-primer` and configures `search.enabled: true`.

## Key Conventions

- **CSS customization pattern**: Consumer sites must add Sass variable overrides *before* `@import "{{ site.theme }}"` in their `style.scss`, not after.
- **Layout overrides**: Consumer sites override `_includes/head-custom.html` locally to inject favicons, custom fonts, etc. without touching the theme layout.
- **Gem packaging**: `jekyll-theme-primer.gemspec` uses `git ls-files` to enumerate gem files — only files tracked by git in `assets/`, `_includes/`, `_layouts/`, `_sass/`, `LICENSE`, and `README` are packaged.
- **Version bumping**: Version is defined only in `jekyll-theme-primer.gemspec`. Do not bump it in a PR; it is bumped prior to release and tagged.
- **RuboCop config**: Inherits from `rubocop-github`'s default config via `inherit_gem`. `Layout/LineLength` is disabled. The `_site/` and `vendor/` dirs are excluded.
- **Search**: Lunr.js client-side search is embedded directly in `_layouts/default.html` and loads `/assets/search.json` at runtime. The search page at `/search/` just focuses the persistent search input in the header.
- **Jekyll plugins**: `jekyll-github-metadata` and `jekyll-seo-tag` are runtime dependencies — `site.github.*` variables and the `{% seo %}` tag are always available in layouts.
- **One PR = one feature/fix**: Each pull request should address exactly one concern.
