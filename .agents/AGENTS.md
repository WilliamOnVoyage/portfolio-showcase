# Portfolio Showcase — AI Agent Guidelines & Development Rules

This file is automatically loaded by AI coding assistants (Antigravity, Cursor, Claude Code, Windsurf).
The single source of truth for repository architecture, development workflow, and AI agent rules is [`README.md`](file:///Users/zml/Workspace/portfolio-showcase/README.md).

---

## Mandatory Rules for AI Agents & Developers

1. **Single Source of Truth**: Keep [`README.md`](file:///Users/zml/Workspace/portfolio-showcase/README.md) updated whenever adding or modifying routes, components, data schemas, or CLI scripts.
2. **Preserve Taxonomy Overrides**: Always edit `src/data/project-overrides.json` when adding custom categories, tech stacks, or featured project metadata, then run `npm run fetch-data`.
3. **`PORTFOLIO.json` Contract Compliance**: Respect the contract schema in `docs/PORTFOLIO_SCHEMA.md` for external repo ingestion.
4. **Automated Build & Type Check**: Always run `npm run build` to verify static compilation and type validity before ending your turn.
5. **Mandatory DOM & Visual Verification**: Before asking to commit or push code changes, you **MUST** launch `npm run dev` and perform visual DOM verification (using `browser_subagent` or browser inspection) across affected routes (`/`, `/blog`, `/blog/[slug]`) in both Light and Dark Mode to verify layout integrity, contrast, and element rendering.
6. **Explicit User Approval for Push**: Always obtain explicit user confirmation before running `git push` to remote repositories.
