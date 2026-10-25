# Easy installation — verification

25 October 2026. This changes distribution and onboarding, preserving the recommended branded identity and its palette.

## User flow

Choose an agent, copy one command, paste into the terminal. Default: available across projects. Project-only and native-plugin options are collapsed below the primary flow. No checkout path, manual clone, archive extraction or folder-copy instructions are required by the default route.

The default command uses the published branded source commit `6359f0a` while the parent rename/identity PRs await merge. It downloads through npm's GitHub support. Node.js 18+ and Git are required. The source is pinned honestly as a preview, not presented as an npm publication or reviewed release.

## Observed checks

- Real `npx` GitHub installs passed in fresh temporary Codex and Claude projects. Required references, schemas, templates and icons were present. Personal scope passed a dry run without modifying the user's installed skill. See npx-install.json.
- Local Claude Code 2.1.236 registered the generated repository marketplace and installed the plugin in an isolated configuration directory. Its inventory reported exactly one skill, branded, and zero agents, hooks, MCP or LSP servers.
- Codex CLI 0.164.0-alpha.11.1 listed the plugin when the local catalog was supplied through command-line configuration. Automatic repository discovery did not occur in this CLI session, so the documented command registers it explicitly. Codex plugin installation was not performed on the user's real profile. See native-local.json.
- Both marketplace catalogs resolve the same generated plugin. The 39-file snapshot includes the complete canonical skill and root presentation assets; release ZIPs use the same packaging function. Drift tests reject edited, missing or extra generated files.
- All 32 unit/package/lifecycle tests passed. Payload validation, marketplace drift validation and release build passed.
- Homepage checked at 1440, 768, 390 and 320px widths: no overflow, script errors or missing assets. Twelve personal/project command variants matched the shared command generator and actual CLI parser. All six visible agent choices are supported by the installer.
- Copy and clipboard-denial keyboard fallback passed. Expanded native and project alternatives remained accessible. Automated WCAG A/AA scans reported zero violations in the checked views. See easy-install-browser.json and installation screenshots.
- Claude strict plugin and marketplace validation passed.

## Source basis and limits

Native distribution follows [official Codex repository-marketplace documentation](https://developers.openai.com/plugins/build/plugins) and [Claude marketplace installation documentation](https://code.claude.com/docs/en/discover-plugins). The optional [Skills CLI](https://github.com/vercel-labs/skills) route uses its documented open skill format and requires Node.js 22.20+ in its current version.

Repository catalogs are distinct from curated public marketplace listings. No public-directory approval, npm registry publication, universal account support or model-behavior validation is claimed. The existing user skill and host configuration were not changed by these smoke tests. Public GitHub branch verification is recorded separately when completed.
