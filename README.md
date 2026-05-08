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

Pages with a layout (for example `page` or `default`) are automatically listed in the sidebar. Control the order with `order` front matter and exclude pages with `nav_exclude: true`:

```yaml
---
layout: page
title: My Page
order: 1
---
```

### Blog posts

To publish posts automatically, create a blog index page and let the theme's `blog-list.html` include render `site.posts`.

1. Add a blog page:

   ```yaml
   ---
   layout: page
   title: Blog
   permalink: /blog/
   order: 2
   ---
   ```

   ```liquid
   {% include blog-list.html %}
   ```

2. In your site's `_config.yml`, set post defaults so post URLs live under `/blog/`:

   ```yaml
   defaults:
     - scope:
         path: ""
         type: posts
       values:
         layout: post
         permalink: /blog/:title/
   ```

3. Create posts in `_posts/` using standard Jekyll filenames:

   ```text
   _posts/2026-05-08-my-first-post.md
   _posts/2026-05-08-my-first-post.html
   ```

   Example Markdown post:

   ```yaml
   ---
   layout: post
   title: My First Post
   description: Short summary for search engines and blog listings.
   date: 2026-05-08 10:00:00 +0900
   ---
   ```

   ```md
   Write your post content here.
   ```

New posts are listed automatically on `/blog/`. If you prefer dated URLs instead of title-only URLs, change the permalink pattern, for example to `/blog/:year/:month/:day/:title/`.

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
