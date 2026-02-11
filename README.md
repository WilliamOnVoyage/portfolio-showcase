# Portfolio Showcase

A modern, high-performance portfolio website built with Next.js 14, Tailwind CSS, and Framer Motion.  
Automatically fetches your GitHub repositories and allows for manual enhancement of private projects.

## Features

- **Hybrid Data Fetching**: Fetches public repo data via GitHub API, merges with local overrides for private projects.
- **Privacy First**: Private repos show metadata/mockups but do not link to source code.
- **Modern UI**: Bento-grid style layout, dark mode support, and smooth animations.
- **Tech Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Configure GitHub Token**:
    Create a `.env.local` file with your GitHub Personal Access Token (scope: `repo` for private access).
    ```env
    GITHUB_TOKEN=gho_your_token_here
    ```

3.  **Fetch Data**:
    Run the script to generate `src/data/projects.json`.
    ```bash
    npm run fetch-data
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Customizing Projects

To add details for private projects or override public ones, edit `data/project-overrides.json`.

Format:
```json
{
  "RepoName": {
    "description": "Custom description...",
    "techStack": ["React", "Node.js"],
    "category": "FinTech & Crypto",
    "featured": true,
    "mockup": "/images/project-mockup.png",
    "longDescription": "Detailed explanation for the modal...",
    "hidden": true
  }
}
```

**Note**: After editing this file, you must run `npm run fetch-data` to regenerate `src/data/projects.json`.
Projects marked with `"hidden": true` will be completely excluded from the site.

## Color Themes & Dark Mode

The application features a built-in **Theme Switcher** (floating button in bottom-right).

**Features:**
- **Dark/Light Mode Toggle**: Switch between light and dark backgrounds for any theme.
- **Color Palettes**:
  1.  **Default** (Monochrome/Clean)
  2.  **Ocean** (Blue/Teal)
  3.  **Forest** (Green/Earth)
  4.  **Cyberpunk** (Pink/Purple)

Preferences are persisted to `localStorage`.

## Categories

- **Featured Projects**: Set `"featured": true` in overrides.
- **Professional Collaboration**: Set `"category": "Professional Collaboration"` or `"Project Aegis Suite"`.
- **The Archive**: All other projects.
