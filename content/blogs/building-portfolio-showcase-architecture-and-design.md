---
slug: "building-portfolio-showcase-architecture-and-design"
title: "Building Portfolio Showcase: How This Site Automatically Builds from GitHub Repos"
description: "An architectural overview of how this portfolio site automatically ingests GitHub API metadata, merges root PORTFOLIO.json contracts and local taxonomy overrides, and pre-renders static HTML pages."
date: "2026-07-26"
readTime: "5 min read"
tags:
  - "Architecture"
  - "Next.js"
  - "Automation"
  - "TypeScript"
featured: true
author:
  name: "Moliang Zhou"
  role: "AI Infrastructure Engineer"
---

## System Motivation & Problem Statement

Maintaining an up-to-date personal portfolio website is notorious for developer friction. As engineers build new projects, push code to GitHub repositories, or update live deployments, personal sites quickly fall out of sync unless manually re-edited.

`Portfolio Showcase` was designed to solve this by creating a **zero-maintenance, hybrid automated showcase system**. Rather than manually hardcoding project cards or copy-pasting descriptions into HTML, the website automatically discovers public and private GitHub repositories, ingests lightweight `PORTFOLIO.json` contract files directly from tracking repositories, merges them with central taxonomy overrides, and compiles everything into statically optimized pages.

---

## High-Level Architecture Overview

The system operates via a 3-tier data pipeline:

```
┌────────────────────────────────────────────────────────────────────────┐
│ TRACKING REPOSITORIES                                                  │
│ • Public / Private GitHub Repositories                                 │
│ • Root PORTFOLIO.json Contract File (Narrative: tagline, liveUrl, etc.)│
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ BUILD-TIME INGESTION PIPELINE (scripts/fetch-github-data.ts)           │
│ • Octokit / REST API fetch for owner repos                             │
│ • Direct raw fetch of root PORTFOLIO.json                              │
│ • Merge with local taxonomy overrides (src/data/project-overrides.json) │
│ • Download & optimize repo thumbnails to public/images/projects/       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ STATIC SITE GENERATION (Next.js 14 SSG + Markdown Compiler)            │
│ • Output compiled src/data/projects.json & src/data/blogs.json         │
│ • Pre-render static pages (/ , /blog, /blog/[slug])                     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 1. The `PORTFOLIO.json` Contract

Instead of forcing central configuration updates for every minor README tweak, individual tracking repositories control their own narrative by committing a small `PORTFOLIO.json` file in their root directory:

```json
{
  "tagline": "Visual ML workbench for designing and exporting model workflows.",
  "publicDescription": "ThinkingLab turns neural network design into an interactive graph canvas...",
  "demoUrl": "https://youtu.be/example",
  "liveUrl": "https://thinking-ai-lab.com",
  "thumbnail": "public/images/mockup.png"
}
```

### Separation of Concerns
- **Content Repository**: Controls the **Narrative** (`tagline`, `publicDescription`, `demoUrl`, `liveUrl`).
- **Portfolio Repository**: Controls the **Taxonomy** (`category`, `techStack`, `featured`, `hidden`).

---

## 2. Hybrid Data Ingestion & Overrides

When `npm run fetch-data` or `npm run build` runs, the ingestion engine (`scripts/fetch-github-data.ts`):

1. **Fetches Repository List**: Queries the GitHub API for all owner repositories (public and private).
2. **Inspects `PORTFOLIO.json`**: Attempts a raw fetch of `PORTFOLIO.json` from each repo branch via GitHub REST API.
3. **Applies Taxonomy Overrides**: Reads `src/data/project-overrides.json` to assign categories (`AI Developer Tools`, `FinTech`, `Vanguard`), custom tech stacks, and metrics.
4. **Download & Cache Assets**: Automatically downloads relative image thumbnails into `public/images/projects/`.
5. **Generates Compiled Output**: Writes the unified JSON dataset to `src/data/projects.json`.

---

## 3. Embedded Standalone Markdown Engine

The blog section operates on standalone Markdown files stored in `content/blogs/*.md`.

```markdown
---
slug: "building-portfolio-showcase-architecture-and-design"
title: "Building Portfolio Showcase"
date: "2026-07-26"
readTime: "5 min read"
tags: ["Architecture", "Next.js"]
featured: true
---

## Section Heading...
```

Before Next.js builds, `scripts/compile-blogs.ts` automatically runs via `package.json` pre-build hooks, parsing all `.md` files with `gray-matter` into `src/data/blogs.json`. This enables writing raw Markdown in standard text editors without escaping JSON strings.

---

## Summary of Key Benefits

- **Zero Manual Copy-Paste**: New repos are picked up automatically via GitHub API.
- **Privacy First**: Private repositories show structured metadata without exposing source code links.
- **Ultra-Fast Performance**: All routes (`/`, `/blog`, `/blog/[slug]`) are pre-rendered statically (SSG) with zero runtime API overhead.
