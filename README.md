# primer2-theme

A two-column Jekyll theme for GitHub Pages, based on GitHub's [Primer](https://primer.style/) design system.

## Features

- Two-column layout: fixed sidebar with navigation + main content area
- Client-side full-text search (Lunr.js) in the sidebar
- Responsive — collapses to mobile-friendly single column with hamburger menu
- Syntax highlighting via Rouge

Documentation/demo: https://bagustri.github.io/primer2 

## Usage

Add to your site's `_config.yml`:

```yml
remote_theme: bagustris/primer2-theme
plugins:
  - jekyll-remote-theme
```

Or to use a specific version:

```yml
remote_theme: bagustris/primer2-theme@v0.6.0
```

## Customizing

### Page navigation

Pages with `layout: default` are automatically listed in the sidebar. Control the order with `order` front matter and exclude pages with `nav_exclude: true`:

```yaml
---
layout: default
title: My Page
order: 1
---
```

### Stylesheet

Create `/assets/css/style.scss` in your site:

```scss
---
---

@import "{{ site.theme }}";
/* your custom styles here */
```

### Layouts

Override by creating `/_layouts/default.html` in your site. For smaller customizations, create `/_includes/head-custom.html`.

## Local development

```sh
script/bootstrap   # install dependencies
script/server      # preview at localhost:4000
script/cibuild     # run full test suite
```

## License

MIT
