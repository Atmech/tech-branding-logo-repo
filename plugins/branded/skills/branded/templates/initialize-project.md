# Initialize branding project memory without the CLI

Read SKILL.md first. Resolve the user's working project and read any existing `.branding/` files. Never reset or replace existing progress.

With file-writing tools, create missing directories `.branding/inputs/` and `.branding/outputs/`. Create a compact `.branding/context.md` containing confirmed facts, labelled assumptions and consequential unknowns; `.branding/decisions.md` for approvals and rejected options; and `.branding/handoff.md` instructing the next agent to read these files and resume the current stage.

Create `.branding/state.json` using `schemas/state.schema.json`, recording the installed skill version, work scope, identity mode only when appropriate, stage and timestamps. Preserve unknown fields on subsequent updates. Read that schema rather than inventing field names. No questionnaire or CLI execution is required. If file tools are unavailable, return the brief and handoff as copyable text and disclose that persistent files were not created.

All branding memory stays in the user's project even when the skill is installed personally or through a plugin. Never store project inputs, decisions or outputs in the skill installation folder.
