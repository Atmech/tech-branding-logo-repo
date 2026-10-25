# Agent compatibility

Reviewed 25 October 2026. “Documented path” means the host documentation describes this discovery mechanism. Automated tests validate our files and lifecycle, not host invocation. No live host version has yet passed the manual checklist below. The generated plugin manifest passed `claude plugin validate --strict` with locally installed Claude Code 2.1.236; this is manifest validation, not a discovery or branding-execution test. Personal installations apply to the local machine, not automatically to remote or cloud sessions.

| Host | Project directory | Personal directory (under home) | How to check |
| --- | --- | --- | --- |
| Codex | `.agents/skills/branded` | `.agents/skills/branded` | `/skills`, then mention `$branded` |
| Claude Code | `.claude/skills/branded` | `.claude/skills/branded` | `/branded`; plugin invocation may be namespaced |
| Grok coding agent | `.grok/skills/branded` | `.grok/skills/branded` | `/branded` |
| Cursor | `.cursor/skills/branded` | `.cursor/skills/branded` | Find it in the `/` menu |
| Windsurf / Cascade (legacy path) | `.windsurf/skills/branded` | `.codeium/windsurf/skills/branded` | Check the host skills selector |
| Gemini CLI | `.gemini/skills/branded` | `.gemini/skills/branded` | `/skills list`, then `/skills reload` if needed |
| Generic | `skills/branded` | Use an explicit custom target | Load SKILL.md explicitly; discovery is unverified |

Cascade documentation now redirects to Devin Desktop; it still documents the legacy Windsurf paths above. Its preferred project path is `.devin/skills`, and it documents `~/.config/devin/skills` as an alternative personal path. Use `--target` for those paths.

Codex and Cursor support the shared `.agents/skills` location. Gemini supports it in both scopes; Grok documents it for personal skills. The installer reuses an existing shared copy for these compatible targets, or shares the Codex copy when requested together. It does not remove separate native copies silently. Doctor reports duplicate native copies; compare versions in the host selector before choosing one. Claude Code uses its own adapter rather than assuming a common discovery path.

Official sources: [Codex](https://learn.chatgpt.com/docs/build-skills), [Claude Code](https://code.claude.com/docs/en/skills), [Grok coding agent](https://docs.x.ai/build/features/skills-plugins-marketplaces), [Cursor](https://cursor.com/docs/skills), [Cascade](https://docs.windsurf.com/windsurf/cascade/skills), [Gemini CLI](https://geminicli.com/docs/cli/skills/).

## Grok Bot is a separate installation surface

A coding-agent directory is not a Bot library installation. Use the Bot's supported skill-creation and enabling controls. Give the Bot the portable bundle's instructions and references through its supported file/context controls, ask it to save the workflow as “branded,” then enable that private skill for the intended Bot. Inspect the saved result to confirm the reference material is available; saving only a summary is not equivalent to installing the complete workflow. If package import is unsupported, do not claim ZIP installation succeeded.

See [Grok Bot skills](https://docs.x.ai/grok-bot/skills-routines-and-automations). This project does not automate account controls, schedules or Bot creation.

## Capabilities and other agents

Strategy and naming work with instruction loading. Editable deliverables require file or design tools; visual QC requires image viewing; raster generation requires image tools; live research requires external access. Missing tools must be disclosed in the output. No skill installation grants those tools automatically.

For an API agent, load SKILL.md into the application's instruction/context mechanism and provide referenced files on demand, along with any execution tools. For a chat-only agent, supply the relevant workflow and references as context and use copyable brief/handoff text. A copied file alone does not create API integration or persistence.

## Manual acceptance checklist

Record host name, exact host version, operating system, session type, skill version, date, result and evidence. Test these steps in a disposable project:

1. Install in project scope; verify appearance and explicitly invoke the skill.
2. Request a small brand application within an existing identity. Verify it preserves the name/logo rather than restarting identity discovery.
3. Create one editable artifact if tools support it and inspect it visually. Record unavailable capabilities.
4. Initialize `.branding/` and resume in a second host without losing approved decisions.
5. Repeat using a personal installation in a second project.
6. Check duplicates, an update, and uninstall after adding a personal note and editing a payload file. Verify both edits survive and `.branding/` is unchanged.

| Host / version | OS | Session | Date | Discovery | Invocation | Editable output / QC | Cross-host resume |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Not run | — | — | — | Pending | Pending | Pending | Pending |
