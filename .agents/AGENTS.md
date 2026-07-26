# Portfolio Showcase — AI Agent Guidelines & Repository Contract

This file defines mandatory rules for AI coding assistants (Antigravity, Cursor, Claude Code, Windsurf) working in this repository.

---

## 1. Core Architecture & Data Ingestion

- **Hybrid Data Fetching**: Projects are fetched dynamically from GitHub API via `scripts/fetch-github-data.ts` and merged with taxonomy overrides stored in `src/data/project-overrides.json`.
- **`PORTFOLIO.json` Contract**: Any tracking repo can include a `PORTFOLIO.json` file in its root directory to publish its `tagline`, `publicDescription`, `demoUrl`, `liveUrl`, and `thumbnail`.
- **Blog System**: Standalone `.md` files live in `content/blogs/*.md` with YAML frontmatter. Running `npm run compile-blogs` (or `npm run build` / `npm run dev`) automatically parses them into `src/data/blogs.json`.

---

## 2. Mandatory Responsibilities for Future AI Agents

1. **Maintain Master Documentation**: If you add new routes, components, data schemas, or CLI scripts, you **MUST** immediately update [`README.md`](file:///Users/zml/Workspace/portfolio-showcase/README.md).
2. **Preserve Taxonomy Overrides**: Always edit `src/data/project-overrides.json` when adding custom categories, tech stacks, or featured project metadata.
3. **Run Data Generation**: After updating project overrides, run `npm run fetch-data` to regenerate `src/data/projects.json`.
4. **Automated Build & Lint Check**: Never end your turn without running `npm run build` to verify static compilation and type validity.
5. **Mandatory DOM & Visual Verification**: Before committing or pushing code changes, you **MUST** launch the local dev server (`npm run dev`) and perform visual DOM verification (using `browser_subagent` or browser inspection) across affected routes (e.g. `/`, `/blog`, `/blog/[slug]`) in both Light Mode and Dark Mode to verify layout integrity, contrast, and element rendering.
