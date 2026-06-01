# Academic Homepage

Source code for a personal academic homepage built with [Jekyll](https://jekyllrb.com/) and hosted on [GitHub Pages](https://pages.github.com/).
Live site: [watthu.github.io](https://watthu.github.io)

## Features

- **Bilingual support** — English / Chinese toggle on the biography section
- **Blog with tag filtering** — Posts organised by tags; year-grouped archive view when filtering
- **Math rendering** — LaTeX support via [MathJax 3](https://www.mathjax.org/)
- **Auto-generated TOC** — Table of contents built from headings in each post
- **Responsive design** — Mobile-friendly layout with collapsible navigation

## Folder Structure

```
Homepage/
├── _config.yml          ← Site config: personal info, bio, education, teaching, links
├── Gemfile              ← Ruby dependencies (don't edit)
├── index.html           ← Home page
├── blog.html            ← Blog listing page
├── publications.md      ← Publications page
├── life.md              ← Life page
├── 404.html             ← Custom 404 page
│
├── _layouts/
│   ├── default.html     ← Base layout (nav + footer)
│   ├── page.html        ← Static pages (Publications, Blog, etc.)
│   ├── blog.html        ← Blog listing with tag filter + sidebar
│   └── post.html        ← Individual post with TOC and prev/next nav
│
├── _includes/
│   ├── head.html        ← <head> block (fonts, CSS, MathJax)
│   ├── nav.html         ← Top navigation bar + search overlay
│   ├── footer.html      ← Footer
│   └── bio.html         ← Biography section (bilingual)
│
├── _posts/              ← Blog posts (Markdown)
│
└── assets/
    ├── css/style.css    ← All styles (CSS variables at the top for easy theming)
    ├── js/main.js       ← All interactivity
    └── images/          ← Photos, logos, publication thumbnails
```

## Getting Started

### Local development

Requires Ruby 3.0+. With [rbenv](https://github.com/rbenv/rbenv):

```bash
rbenv install 3.2.2 && rbenv global 3.2.2
```

Then in the project folder:

```bash
gem install bundler
bundle install
bundle exec jekyll serve
```

Open [http://localhost:4000](http://localhost:4000). Jekyll rebuilds automatically on file changes.

### Deploy to GitHub Pages

1. Push all files to a repository named `yourusername.github.io`
2. Go to **Settings → Pages → Source**, select `main` branch and `/ (root)`, click **Save**
3. Site goes live at `https://yourusername.github.io` within a few minutes

The `_site/` folder is generated locally and excluded via `.gitignore` — GitHub Pages builds it automatically on every push.

## Personalisation

Almost everything is configured in `_config.yml`:

- Name, title, university, email, social links
- Biography text (English + Chinese)
- Education entries (with logo support)
- Teaching entries (grouped by institution)
- Research interests
- Navigation links

## Writing a Blog Post

Create a Markdown file in `_posts/` with the filename format `YYYY-MM-DD-title.md`:

```markdown
---
layout: post
title: "Your Post Title"
subtitle: "Optional subtitle"
mathjax: true
tags:
  - Statistics
  - Bayesian Analysis
---

Content here. Supports **Markdown**, $inline math$, and display math:

$$\hat{\theta} = \arg\max_\theta \ell(\theta)$$
```

## Theming

CSS variables are defined at the top of `assets/css/style.css`. Change `--c-accent` to retheme the entire site:

```css
:root {
  --c-accent:   #2d5a8e;
  --c-accent-h: #1e3f63;
}
```

## Dependencies

Loaded via CDN — no installation needed:

- [Google Fonts](https://fonts.google.com/) — Lora, DM Sans, DM Mono
- [Font Awesome 6](https://fontawesome.com/)
- [Academicons](https://jpswalsh.github.io/academicons/)
- [MathJax 3](https://www.mathjax.org/)
