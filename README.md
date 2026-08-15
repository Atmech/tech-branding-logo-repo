# Tech Branding & Logo

An agent skill for building technology-product names, logos, and visual identity systems.

It supports three entry modes:

- **Zero-to-brand** — product idea with no name yet.
- **Name-to-brand** — finalized name with no established brand psychology.
- **Brand evolution** — an existing product identity that needs a refresh, evolution, or reset.

The workflow moves from product truth and brand psychology through naming, brand nouns, high-volume logo concepts, black-and-white refinement, product-surface testing, visual-system extension, and quality control.

## Use with agents

This is a repository-native skill: clone or copy this folder into the workspace your agent can read. No package installation is required. The agent should read [`SKILL.md`](SKILL.md) before beginning; the adapters below make that routing explicit for common environments.

- **Codex/OpenAI:** Open this repository as the workspace (or copy `SKILL.md`, `references/`, and [`AGENTS.md`](AGENTS.md) into your project). Ask Codex to use the `tech-branding-logo` skill for your product.
- **Claude Code:** Start Claude Code from this repository, or copy [`CLAUDE.md`](CLAUDE.md), `SKILL.md`, and `references/` into the target project. Ask it to run the tech-branding-and-logo workflow.
- **Cursor:** Copy [`.cursor/rules/tech-branding-logo.mdc`](.cursor/rules/tech-branding-logo.mdc) into the target project's `.cursor/rules/` directory, alongside `SKILL.md` and `references/`. In Cursor chat, ask it to apply the Tech Branding & Logo rule.
- **Generic agents:** Give the agent this repository (or `SKILL.md`, `references/`, and [`adapters/generic-agent.md`](adapters/generic-agent.md)) as readable context, then explicitly request one of the three modes.

Load the references progressively from [`references/`](references/), depending on the selected mode and stage.

### Quick start

Start with a prompt like this (replace the bracketed fields):

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

The first response should contain a staged plan plus a product brief and brand foundation. Subsequent stages deliver naming (when applicable), approved brand nouns, a concept catalog, three developed directions, editable logo assets, visual-system tokens and guidelines, and a final manifest with QC evidence and unresolved risks. For an existing name, say `name-to-brand`; for a rebrand, say `brand-evolution` and provide current assets and recognition constraints.

## Important limitation

This package operationalizes principles extracted from the referenced *Logos That Last* material. The source PDF is not redistributed here. The strategy, naming, and rebrand modules are additional original workflow guidance.

## License

MIT. See [`LICENSE`](LICENSE).
