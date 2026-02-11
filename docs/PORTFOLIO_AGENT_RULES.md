# Portfolio Contract Rules

Copy the following block into your project's `.cursorrules`, `.windsurfrules`, or system prompt.

```markdown
# PORTFOLIO CONTRACT COMPLIANCE

This repository feeds into a central portfolio showcase. The file `PORTFOLIO.json` in the root directory controls the narrative.

## 1. THE CONTRACT
The `PORTFOLIO.json` schema:
```json
{
  "tagline": "String. One sentence summary.",
  "publicDescription": "String. Markdown supported. Detailed explanation.",
  "demoUrl": "String. URL to a video or demo.",
  "liveUrl": "String. URL to the deployed application.",
  "thumbnail": "String. Path to image (e.g. /images/demo.png)."
}
```

## 2. YOUR RESPONSIBILITIES
If you are an AI assistant editing this code:

1.  **DETECT**: Check if `PORTFOLIO.json` exists.
2.  **MAINTAIN NARRATIVE**: If you make significant architectural changes, propose an update to `publicDescription` to reflect the new capabilities.
3.  **PROTECT PRIVACY**: NEVER add secrets, internal IPs, or PII.
```
