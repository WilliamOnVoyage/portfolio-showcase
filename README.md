# Portfolio Showcase

A modern, high-performance portfolio website and engineering hub built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Framer Motion.

Automatically fetches public and private GitHub repositories, merges root `PORTFOLIO.json` contract files with local taxonomy overrides, pre-renders standalone Markdown blog articles, and displays an interactive black-hole shader background with smooth dark/light theme support.

---

## Key Features

- **Hybrid Data Fetching**: Automatically queries GitHub API for owner repositories and merges them with local taxonomy overrides (`src/data/project-overrides.json`).
- **`PORTFOLIO.json` Contract**: Any repository can include a root `PORTFOLIO.json` file to publish its tagline, public description, live URL, and thumbnail without code edits on the portfolio site.
- **Section 02 / Insights (Blog System)**: Standalone Markdown blog engine (`content/blogs/*.md`) with frontmatter metadata, real-time tag & keyword search, sticky table of contents, and 1-click social sharing.
- **Dark & Light Mode Support**: Responsive WebGL shader background ([BlackHole.tsx](file:///Users/zml/Workspace/portfolio-showcase/src/components/BlackHole.tsx)) adapting between OLED dark space and soft light mode photon trails.
- **Privacy-First Design**: Private repos display curated project metadata and mockups without linking to private source code.
- **Ultra-Fast Performance**: 100% statically pre-rendered (SSG) via Next.js App Router for instant page loads.

---

## Directory Structure

```
portfolio-showcase/
├── .agents/
│   └── AGENTS.md                  # AI coding agent rules & compliance guidelines
├── content/
│   └── blogs/                     # Standalone Markdown blog files (*.md)
├── docs/
│   ├── PORTFOLIO_SCHEMA.md        # PORTFOLIO.json contract schema specification
│   ├── PORTFOLIO_AGENT_RULES.md   # Prompt guidelines for tracking repo agents
│   └── dns-config.json            # DNS & Route53 configuration notes
├── public/
│   └── images/projects/           # Downloaded & cached repo thumbnails
├── scripts/
│   ├── fetch-github-data.ts       # GitHub API & PORTFOLIO.json ingestion script
│   └── compile-blogs.ts           # Markdown blog frontmatter compiler
└── src/
    ├── app/
    │   ├── page.tsx               # Main showcase homepage (Vanguard, Insights, etc.)
    │   ├── blog/page.tsx          # Dedicated blog landing page (/blog)
    │   └── blog/[slug]/page.tsx   # Dynamic blog article reader view (/blog/[slug])
    ├── components/                # UI components (Hero, BlogCard, ArticleContent, etc.)
    ├── data/
    │   ├── project-overrides.json # Central project taxonomy & feature overrides
    │   ├── profile.json           # User bio, contact info & skills
    │   ├── experience.json        # Career trajectory timeline data
    │   ├── publications.json      # Patents & research papers data
    │   ├── projects.json          # Compiled project dataset output
    │   └── blogs.json             # Compiled blog dataset output
    ├── lib/                       # Utility functions & helper scripts
    └── types.ts                   # TypeScript interfaces (Project, BlogPost, etc.)
```

---

## Getting Started & CLI Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory with your GitHub Personal Access Token (scope: `repo` for private access):
```env
GITHUB_TOKEN=gho_your_github_token_here
```

### 3. Key npm Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Runs `compile-blogs` and starts Next.js development server (`http://localhost:3000` or `3002`). |
| `npm run build` | Runs `compile-blogs` and builds static production bundle (`next build`). |
| `npm run fetch-data` | Runs `compile-blogs` and fetches GitHub API repos, merging with `src/data/project-overrides.json`. |
| `npm run compile-blogs` | Parses all `.md` files in `content/blogs/` into `src/data/blogs.json`. |

---

## How to Write & Publish Blog Articles

1. Create a new `.md` file in [`content/blogs/`](file:///Users/zml/Workspace/portfolio-showcase/content/blogs/):
   ```markdown
   ---
   slug: "my-article-slug"
   title: "Article Title"
   description: "Short summary..."
   date: "2026-07-26"
   readTime: "5 min read"
   tags:
     - "Architecture"
     - "Next.js"
   featured: true
   ---

   ## Heading...

   Your markdown content here...
   ```
2. Run `npm run compile-blogs` (or simply `npm run build` / `npm run dev`), which automatically parses your article into the site.
3. Commit and push:
   ```bash
   git add .
   git commit -m "post: add new article"
   git push
   ```

---

## Customizing Projects & `PORTFOLIO.json` Contract

### Central Taxonomy Overrides
To override repo categories, tech stacks, or mark a project as featured, edit [`src/data/project-overrides.json`](file:///Users/zml/Workspace/portfolio-showcase/src/data/project-overrides.json):
```json
{
  "mintagent": {
    "description": "Decentralized outcome marketplace...",
    "techStack": ["Solidity", "Next.js 16", "FastAPI"],
    "category": "Web3 & AI Agents",
    "featured": true
  }
}
```
After editing, run `npm run fetch-data` to update `src/data/projects.json`.

### Tracking Repository Contract
Any tracking repository can include a root `PORTFOLIO.json` file:
```json
{
  "tagline": "One sentence summary...",
  "publicDescription": "Markdown description...",
  "demoUrl": "https://youtu.be/...",
  "liveUrl": "https://my-app.com",
  "thumbnail": "public/images/mockup.png"
}
```
See [`docs/PORTFOLIO_SCHEMA.md`](file:///Users/zml/Workspace/portfolio-showcase/docs/PORTFOLIO_SCHEMA.md) for full contract details.

---

## Development & AI Agent Guidelines

Both human developers and AI coding assistants (Antigravity, Cursor, Claude Code, Windsurf) working in this repository **MUST** follow these rules (also referenced in [`.agents/AGENTS.md`](file:///Users/zml/Workspace/portfolio-showcase/.agents/AGENTS.md)):

1. **Mandatory DOM Verification**: Before asking to commit or push code changes, launch `npm run dev` and visually verify rendered DOM elements across routes (`/`, `/blog`, `/blog/[slug]`) in both Light and Dark mode. Prefer native Safari (`open -a Safari`) or lightweight inspection to avoid heavy Chromium resource consumption.
2. **Documentation Integrity**: Keep [`README.md`](file:///Users/zml/Workspace/portfolio-showcase/README.md) updated whenever adding routes, components, schemas, or CLI scripts.
3. **Taxonomy & Contract Compliance**: Always edit `src/data/project-overrides.json` and run `npm run fetch-data` when modifying repo metadata.
4. **Automated Compilation Check**: Always verify `npm run build` passes with zero type or lint errors before ending your turn.
5. **Explicit Push Approval**: Always obtain explicit user confirmation before running `git push` to remote repositories.

