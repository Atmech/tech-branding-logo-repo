# Tech Branding & Logo

An open-source agent skill for building technology-product names, logos, and visual identity systems.

**Skill entrypoint:** [`SKILL.md`](SKILL.md)  
**Required runtime context:** [`references/`](references/)  
**License:** MIT

## What it does

The skill supports three entry modes:

- **Zero-to-brand** — product idea with no settled name yet.
- **Name-to-brand** — finalized or strongly preferred name with no established brand psychology.
- **Brand evolution** — an existing identity that needs a refresh, evolution, or reset.

The workflow moves from product truth and brand psychology through naming, brand nouns, high-volume concept generation, black-and-white logo refinement, product-surface testing, visual-system extension, and QC.

## Install / use

### ChatGPT Skills

Create a folder containing `SKILL.md` and the full `references/` directory, zip that folder if needed, then upload it from ChatGPT's **Plugins → Skills → Create → Upload from your computer** flow.

Minimal skill package:

```text
tech-branding-logo/
├── SKILL.md
└── references/
    ├── brand-strategy.md
    ├── naming.md
    ├── rebrand-audit.md
    ├── logo-workflow.md
    ├── deliverable-schemas.md
    └── qc.md
```

The rest of this repository contains adapters, examples, branding assets, and the project site. They are useful, but they are not required for the core skill package.

### Codex / OpenAI agents

Open this repository as the workspace, or copy `SKILL.md`, `references/`, and [`AGENTS.md`](AGENTS.md) into your project. Ask the agent to use the `tech-branding-logo` skill.

### Claude Code

Start Claude Code from this repository, or copy [`CLAUDE.md`](CLAUDE.md), `SKILL.md`, and `references/` into the target project.

### Cursor

Copy [`.cursor/rules/tech-branding-logo.mdc`](.cursor/rules/tech-branding-logo.mdc) into the target project's `.cursor/rules/` directory alongside `SKILL.md` and `references/`.

### Generic agents

Give the agent `SKILL.md`, `references/`, and [`adapters/generic-agent.md`](adapters/generic-agent.md), then explicitly request one of the three operating modes.

## Quick start

```text
Use the tech-branding-logo skill in zero-to-brand mode.

Product: [what it does]
Audience: [who it serves]
Job to be done: [outcome they need]
Alternatives: [what they use today]
Proof: [why this product can credibly deliver]
Constraints: [markets, accessibility, technical, or visual constraints]

Work in stages. Begin with the product brief and brand foundation; state assumptions and ask only questions that materially change the work. Do not claim trademark or domain clearance.
```

For an existing name, use `name-to-brand`. For a rebrand, use `brand-evolution` and provide current assets and recognition constraints.

## How the workflow runs

1. Product truth and brief
2. Brand foundation and positioning
3. Naming, when required
4. Brand nouns and visual territories
5. 50+ low-cost concept directions
6. Three developed directions
7. Black-and-white refinement
8. Product-surface and small-size testing
9. Visual identity system extension
10. Final manifest and QC

The skill progressively loads the appropriate files from [`references/`](references/) rather than treating the entire workflow as one giant prompt.

## ChatGPT Plugin publishing

ChatGPT's Plugin Directory can package skills, apps, and app templates. This project is designed to work as a **skill-first plugin** and does not require an external app or MCP server for its core workflow.

See [`PLUGIN_PUBLISHING.md`](PLUGIN_PUBLISHING.md) for the current distribution model, packaging checklist, test cases, listing copy, and the distinction between workspace skill sharing and public Plugin Directory publication.

## Repository layout

```text
.
├── SKILL.md                 # core skill entrypoint
├── references/              # progressively loaded skill knowledge
├── AGENTS.md                # Codex/OpenAI adapter
├── CLAUDE.md                # Claude Code adapter
├── .cursor/                 # Cursor rules
├── adapters/                # generic integrations
├── agents/                  # agent metadata
├── brand/                   # project branding outputs/examples
├── site/                    # public project site
├── PLUGIN_PUBLISHING.md     # ChatGPT distribution guide
└── LICENSE
```

## Important limitation

This package operationalizes principles extracted from the referenced *Logos That Last* material. The source PDF is not redistributed here. The strategy, naming, and rebrand modules are additional original workflow guidance.

## License

MIT. See [`LICENSE`](LICENSE).
