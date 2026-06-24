# Marketing Skills

A collection of 45 marketing-focused Agent Skills (CRO, copywriting, SEO, AI SEO,
paid ads, cold email, prospecting, analytics, retention, sales enablement, and more)
for use by AI coding agents working in this repository.

Claude Code automatically discovers any `SKILL.md` under `.claude/skills/`, so these
become available as skills in this project.

## Layout

- `.claude/skills/<skill>/SKILL.md` — each skill, with `references/` and `evals/` where present.
- `.claude/tools/` — shared integration/tool docs referenced by the skills. The skills
  reference these via relative paths (`../../tools/...`), so keep `tools/` alongside `skills/`.

## Getting started

Run the `product-marketing` skill first — it creates `.agents/product-marketing.md`,
a foundational product/audience/positioning context document that the other skills
reference so you don't repeat yourself.

## Source & license

Vendored from [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills)
(by Corey Haines), MIT licensed. See `LICENSE` in this directory.
