# Portfolio Contract Schema (`PORTFOLIO.json`)

To enable automated portfolio updates without exposing private repo details, any repository can include a `PORTFOLIO.json` file in its root directory.

## Design Philosophy
**Separation of Concerns:**
- **Content Repo**: Controls the *Narrative* (Description, Demo, Live URL).
- **Portfolio Repo**: Controls the *Taxonomy* (Category, Tech Stack, Visibility).

## JSON Structure

```json
{
  "tagline": "String. One sentence summary. Overrides repo description.",
  "publicDescription": "String. Markdown supported. Detailed explanation of the project.",
  "demoUrl": "String. URL to a video or demo (e.g. Loom, YouTube).",
  "liveUrl": "String. URL to the deployed application.",
  "thumbnail": "String. Path to image."
}
```

## Field Behavior

| Field | Merging Strategy | Fallback |
| :--- | :--- | :--- |
| `tagline` | Overrides repo description | Repo description |
| `publicDescription` | Overrides repo description/readme | Repo description |
| `demoUrl` | Adds "Demo" button | Hidden |
| `liveUrl` | Adds "Live" button | Homepage URL |

## Taxonomy & Visibility
**Controlled centrally in `portfolio-showcase/data/project-overrides.json`:**
- `techStack` (e.g. "Next.js" vs just "TypeScript")
- `category` (e.g. "Fintech")
- `hidden`
- `featured`
