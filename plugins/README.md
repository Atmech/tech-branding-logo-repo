# Native plugin release

`npm run build:release` builds one plugin ZIP from the canonical SKILL.md, references, schemas, templates, OpenAI skill metadata and license. It generates portable `plugin.json`, Codex compatibility and Claude compatibility manifests with the package version. No copied methodology is maintained here.

The ZIP has `skills/branded/` at its root alongside the manifests. Extract it for local host testing. See `docs/NATIVE_INSTALL.md` for loading instructions and `PLUGIN_PUBLISHING.md` for submission limits. A successful local package build is not marketplace approval or a live host test. The package has no MCP server or hooks.
