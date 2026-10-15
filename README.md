# Tech Branding & Logo

An open-source branding orchestrator + CLI for lasting identities, temporary campaigns, and assets within established brands. Includes technology, food/hospitality, real estate and fashion/apparel guidance, with B2B and packaging overlays. The existing package/skill identifier remains `tech-branding-logo`.

**Skill entrypoint:** [`SKILL.md`](SKILL.md)  
**Required skill context:** [`references/`](references/)  
**CLI:** dependency-free, Node 18+  
**License:** MIT

## Install safely

For customers, distribute the portable `SKILL.md` + `references/` through the target agent's native skill/plugin flow or a reviewed package registry. That avoids presenting an agent with an unverified third-party GitHub execution request.

The repository CLI is for local development and deliberate manual installation. If you choose to run directly from GitHub, review the repository and pin a trusted revision first; this command downloads and executes package code:

```bash
npx -y github:Atmech/tech-branding-logo-repo
```

Do not present that command as the primary end-user branding experience.

The default command is **onboarding**: it detects supported agent environments in the current project and installs the skill where they can read it. It does not start a branding project or ask you to fill out a brand questionnaire.

```text
Tech Branding & Logo
Onboarding — install once, use from your agent

Detected
✓ Codex / OpenAI
✓ Cursor

  Codex / OpenAI → .agents/skills/tech-branding-logo
  Cursor         → .cursor/skills/tech-branding-logo

Ready.
```

Override detection when needed:

```bash
npx -y github:Atmech/tech-branding-logo-repo -- --agent=codex,cursor
```

Preview changes first:

```bash
npx -y github:Atmech/tech-branding-logo-repo -- --dry-run
```

The installer is transactional: `.tech-branding-logo/install.json` records what it created so update/uninstall can avoid touching unrelated project files.

## When you actually want to brand something

Create a persistent project brief:

```bash
npx -y github:Atmech/tech-branding-logo-repo -- brief
```

The CLI captures a short request and optional context; the agent interprets it and asks only consequential follow-ups. Existing project state is resumed without overwriting progress.

Work scopes are `brand-identity` (default), `campaign-direction`, and `brand-application`. Identity retains the submodes `zero-to-brand`, `name-to-brand`, and `brand-evolution`. Campaigns support brand-led, brand-adjacent and independent creative freedom, with explicit fixed requirements and temporary overrides.

```bash
node ./bin/tech-branding-logo.js brief --scope=campaign-direction
node ./bin/tech-branding-logo.js brief --scope=brand-application
```

The working project state lives in:

```text
.branding/
├── context.md       # user context, not branding conclusions
├── state.json       # current mode/stage/progress
├── handoff.md       # instructions for any compatible agent
├── decisions.md     # decisions + rejected directions
├── inputs/          # existing brand assets / source material
└── outputs/         # generated working artifacts
```

Then open your IDE/agent and say:

```text
Read .branding/handoff.md and continue the brand project.
```

Because the project state is agent-neutral, you can begin in Claude Code and continue later in Cursor or Codex without restarting discovery.

## CLI commands

```text
tech-branding-logo                 installation onboarding (default)
tech-branding-logo onboarding      install into detected agents/IDEs
tech-branding-logo brief           create project context + agent handoff
tech-branding-logo resume          show current state and resume instruction
tech-branding-logo doctor          verify the skill is actually visible
tech-branding-logo update          refresh known skill files safely
tech-branding-logo export          create a portable brand-kit/
tech-branding-logo uninstall       remove only installer-tracked files
```

Examples:

```bash
# Verify everything after installation
npx -y github:Atmech/tech-branding-logo-repo -- doctor

# Explicitly create a rebrand brief
npx -y github:Atmech/tech-branding-logo-repo -- brief --mode=brand-evolution

# Continue later
npx -y github:Atmech/tech-branding-logo-repo -- resume

# Export final working context and outputs
npx -y github:Atmech/tech-branding-logo-repo -- export

# Safe removal
npx -y github:Atmech/tech-branding-logo-repo -- uninstall
```

## What the skill knows how to do

The CLI is the experience/state layer. The skill is the expertise layer.

The orchestrator infers scope and selects useful expertise, maintains a compact brief, and runs the appropriate workflow. Identity work retains strategy, naming when needed, concept exploration, refinement and production checks. Campaign work produces a concept, key visual, variation rules and channel assets. Application work follows an approved identity without reopening naming or logo design.

Modules are loaded selectively in one agent. B2B informs buying decisions without imposing one aesthetic. Tests follow actual surfaces: signage, packaging, garments, menus, product UI and other requested assets. Campaign colours and typography stay separate from master brand rules.

See [evaluation scenarios](references/evaluation.md) and the [research capture/backlog](references/research-method.md). Initial industry guidance is original and provisional; book research and comparative visual improvement are not claimed as complete.

## Architecture

```text
User / IDE
    │
    ▼
CLI experience layer
onboarding · brief · resume · doctor · export
    │
    ├── .tech-branding-logo/   install manifest
    └── .branding/             portable project memory
    │
    ▼
SKILL.md + references/
branding methodology + expertise
    │
    ▼
Agent execution
strategy · names · concepts · SVG · tokens · guidelines · QC
```

The separation is intentional: improving the installer or project UX must not create a second competing branding methodology.

## Supported installation targets

Current auto-detection supports:

| Environment | Local skill path |
| --- | --- |
| Codex / OpenAI | `.agents/skills/tech-branding-logo/` |
| Claude Code | `.claude/skills/tech-branding-logo/` |
| Cursor | `.cursor/skills/tech-branding-logo/` |
| Windsurf | `.windsurf/skills/tech-branding-logo/` |
| Gemini CLI | `.gemini/skills/tech-branding-logo/` |
| Generic | `skills/tech-branding-logo/` |

The installer copies only the portable skill payload: `SKILL.md` and `references/`.

## ChatGPT Skills

For environments that accept a direct skill upload, the minimal package is:

```text
tech-branding-logo/
├── SKILL.md
└── references/
    ├── brand-strategy.md
    ├── naming.md
    ├── rebrand-audit.md
    ├── logo-workflow.md
    ├── deliverable-schemas.md
    ├── qc.md
    ├── domains/
    ├── overlays/
    └── campaign-direction.md  # plus scope, research and evaluation references
```

## Plugin publishing

See [`PLUGIN_PUBLISHING.md`](PLUGIN_PUBLISHING.md) for the current ChatGPT distribution model, packaging checklist, test cases, and listing copy.

## Development

```bash
npm test
node ./bin/tech-branding-logo.js --help
node ./bin/tech-branding-logo.js --dry-run --agent=generic
```

The CLI deliberately has no runtime dependencies.

## Repository layout

```text
.
├── bin/                      # executable CLI entrypoint
├── cli/                      # onboarding, state, brief, doctor, export
├── schemas/                  # install + brand project state contracts
├── test/                     # CLI smoke tests
├── SKILL.md                  # core expertise entrypoint
├── references/               # progressively loaded skill knowledge
├── AGENTS.md                 # Codex/OpenAI adapter
├── CLAUDE.md                 # Claude Code adapter
├── .cursor/                  # Cursor adapter/rules
├── adapters/                 # generic integrations
├── brand/                    # project branding outputs/examples
├── site/                     # public project site
├── PLUGIN_PUBLISHING.md      # ChatGPT distribution guide
└── LICENSE
```

## Important limitation

This package operationalizes principles extracted from the referenced *Logos That Last* material. The source PDF is not redistributed here. The strategy, naming, and rebrand modules are additional original workflow guidance.

## License

MIT. See [`LICENSE`](LICENSE).
