# Install without Node or cloning the repository

Obtain a versioned skill or plugin ZIP from a release published by the maintainer and check its SHA-256 against that release's SHA256SUMS. Release packages are prepared by `npm run build:release`; package generation does not mean a public release or marketplace listing already exists.

## Portable skill folder

Extract `branded-<version>-skill.zip`. It contains one `branded/` directory with SKILL.md, references, schemas, templates, optional OpenAI metadata and LICENSE. Copy that directory into the host's project or personal skill directory from [COMPATIBILITY.md](COMPATIBILITY.md). Node and Git are unnecessary for using the workflow. Manual/native installs are managed by their host, not automatically registered in the CLI's manifest. The CLI can take ownership with `--adopt` only if all existing payload files match its bundled version exactly.

## Native plugin package

Extract `branded-<version>-plugin.zip`. Keep manifests and `skills/` together at the root. The package provides portable `plugin.json`, `.codex-plugin/plugin.json` and `.claude-plugin/plugin.json`. They all reference the same canonical skill payload.

For Claude Code local validation, start a disposable session using `claude --plugin-dir <extracted-plugin-directory>`. Inspect available commands; the skill may appear as `/branded:branded`. Run the acceptance checklist before broader distribution. Grok's coding documentation describes Claude plugin compatibility and `--plugin-dir`; test your installed version before advertising it as verified.

For ChatGPT/Codex, use the local plugin installation controls supported by the installed host, or follow the official plugin ZIP submission flow for public distribution. Do not assume a portable ZIP has been approved or that every surface exposes the same local installation UI. See [PLUGIN_PUBLISHING.md](../PLUGIN_PUBLISHING.md).

Native plugin removal and updates use the host's controls. Avoid installing both the plugin skill and a separate folder copy unless you intend to compare them.

## Manual agent fallback

Ask an agent with file access: “Read the installed branded/SKILL.md, load only relevant references, and use templates/initialize-project.md to preserve project context.” For agents without file access, attach the needed instruction/reference text. Report unsupported asset-generation or persistence capabilities explicitly. Grok Bot has separate library controls described in COMPATIBILITY.md.

Sources: [Claude local plugins](https://code.claude.com/docs/en/plugins), [OpenAI packaging](https://developers.openai.com/plugins/build/plugins), [OpenAI submission](https://developers.openai.com/plugins/deploy/submission), [Grok coding plugins](https://docs.x.ai/build/features/skills-plugins-marketplaces).
