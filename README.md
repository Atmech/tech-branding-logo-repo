# Tech Branding & Logo

An agent skill for building technology-product names, logos, and visual identity systems.

It supports three entry modes:

- **Zero-to-brand** — product idea with no name yet.
- **Name-to-brand** — finalized name with no established brand psychology.
- **Brand evolution** — an existing product identity that needs a refresh, evolution, or reset.

The workflow moves from product truth and brand psychology through naming, brand nouns, high-volume logo concepts, black-and-white refinement, product-surface testing, visual-system extension, and quality control.

## Use with agents

Read [`SKILL.md`](SKILL.md) first. The repository also includes adapters for common agent environments:

- Codex/OpenAI: [`AGENTS.md`](AGENTS.md) and [`agents/openai.yaml`](agents/openai.yaml)
- Claude Code: [`CLAUDE.md`](CLAUDE.md)
- Cursor: [`.cursor/rules/tech-branding-logo.mdc`](.cursor/rules/tech-branding-logo.mdc)
- Generic agents: [`adapters/generic-agent.md`](adapters/generic-agent.md)

Load the references progressively from [`references/`](references/), depending on the selected mode and stage.

## Important limitation

This package operationalizes principles extracted from the referenced *Logos That Last* material. The source PDF is not redistributed here. The strategy, naming, and rebrand modules are additional original workflow guidance.

## License

MIT. See [`LICENSE`](LICENSE).
