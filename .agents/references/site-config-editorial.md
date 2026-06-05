# Editorial config — site.config.json

Vault skills and scripts read HITL and agent defaults from **`site.config.json`** at the vault root (not hardcoded in skill files).

## JSON path

```json
{
  "editorial": {
    "hitl": {
      "name": "Damien BECHERINI",
      "url": "https://damien.becherini.fr"
    },
    "defaultAgent": "Sonnet 4.6"
  }
}
```

## Frontmatter mapping

| site.config.json | Frontmatter field |
| :-- | :-- |
| `editorial.hitl.name` | `verified_hitl` |
| `editorial.hitl.url` | `verified_hitl_url` |
| `editorial.defaultAgent` | `verified_by` |

`last_verified` is always the date of the verification run (today), not stored in site.config.

## Skill workflow

1. Read `site.config.json` at the vault root before writing verification frontmatter.
2. Extract `editorial.hitl` and `editorial.defaultAgent`.
3. Write those values into page frontmatter after HITL approval.

Do not hardcode reviewer name or URL in skill instructions — change `site.config.json` instead.

## Scripts

Node scripts import `loadEditorialConfig()` from `scripts/lib/site-config.mjs`:

```js
import { loadEditorialConfig } from './lib/site-config.mjs';

const { hitl, defaultAgent } = loadEditorialConfig();
// hitl.name, hitl.url, defaultAgent
```
