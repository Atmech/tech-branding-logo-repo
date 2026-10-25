# Optional CLI installation

Use the skill directly through a native package or a copied portable folder when possible. The CLI is optional and needs Node 18+; it has no runtime dependencies. Installing the executable globally and installing a skill personally are different actions.

From a reviewed checkout, invoke the CLI using its absolute path, from the project you want to use:

```sh
node /path/to/tech-branding-logo-repo/bin/branded.js install --agent codex
node /path/to/tech-branding-logo-repo/bin/branded.js install --agent claude --install-scope user
node /path/to/tech-branding-logo-repo/bin/branded.js install --agent grok --project /path/to/project
```

A packaged CLI tarball can also be installed locally with npm. No claim is made that the package name is currently published or available on npm. Do not use an unverified registry command as a prerequisite for branding.

The default is interactive installation. Choose “This project” or “All my projects on this computer,” then the host. Detection suggests hosts; it does not install into every tool on PATH. In automation, supply `--agent` or `--target`; no silent default is selected.

`--global` is an alias for `--install-scope user`. `--scope` still means branding work scope and applies only to `brief`. Both `--agent codex` and `--agent=codex` work. Unknown flags, missing values and options used on the wrong command fail before installation.

## Roots and custom paths

By default the CLI resolves the Git root, including a worktree `.git` file, from the launch directory. Outside Git, it uses the launch folder. `--project` selects an existing folder explicitly, including a non-Git folder or a nested folder that should be treated independently. The resolved destinations are printed before file changes.

An explicit `--target` is a manual skill-directory path, resolved relative to the project. It must be inside the selected project for project scope or inside your home for personal scope. To use another location, choose its containing folder with `--project`. Targets cannot overlap branding state, Git data or installation records. Generic/manual discovery is unverified until the host loads the files.

## Records, updates and removal

Project records are `.branded/install.json`. Personal records live under the user's home in `Library/Application Support/branded/` on macOS, `.local/share/branded/` on Linux, or `AppData/Local/branded/` on Windows. Personal skill directories still follow the host's discovery rules. Both scopes leave `.branding/` in the selected project.

```sh
branded install --agent codex --dry-run
branded doctor
branded update --dry-run
branded update
branded uninstall --dry-run
branded uninstall
```

Use the same `--install-scope user` on doctor, update, uninstall and recover to manage personal records. Update uses the saved targets, never re-detection. To add another host, use install. Records merge across installs and retain original ownership. Existing untracked files require explicit `--adopt`, and adoption only accepts matching payload content. `--force` remains a compatibility flag; it does not permit replacing local edits.

Every owned file has a hash. Updates stop on modified current payload files; merge or move the edit deliberately before retrying. Obsolete unchanged files can be removed; edited obsolete files are retained. Uninstall removes only unchanged tracked files, preserves edited and untracked files, and removes only empty installer-owned directories. It never removes `.branding/`. Preserved files become manually managed after uninstall.

Legacy version-1 manifests lack historical hashes. Update migrates conservatively, recognizing only files represented in the current payload and preserving other legacy files. Modified recognized files stop the update rather than being overwritten. If an old version already lost an installation record, it cannot be reconstructed automatically; explicitly reinstall with `--adopt` after inspecting that copy.

## Recovery and verification

Changes are planned under an exclusive process lock and journaled before they are applied. A caught write error rolls back. After a process interruption, use `recover` with the same scope/project, then repeat the intended operation. Recovery refuses to take over an active process or overwrite files edited after interruption; the journal is retained for inspection if there is a conflict. This provides recoverability, not a claim of crash-proof storage on every filesystem.

Doctor returns a nonzero exit code for missing/invalid records, empty target lists, pending operations, missing files or hash changes. It prints host invocation instructions and warns about duplicate native copies. It verifies local files, not actual host discovery, model compliance, cloud sync or design-tool capabilities. Complete the checklist in COMPATIBILITY.md.

## Moving from Tech Branding & Logo

`branded` is the new skill identifier, CLI command and package name. New installs use `skills/branded` inside the host's discovery directory and `.branded/install.json` for project records (or the platform's personal data directory under `branded`). The repository URL is unchanged.

1. With your previous reviewed checkout or installed CLI, run `tech-branding-logo uninstall --dry-run`, then `tech-branding-logo uninstall` using the same project and scope as the old install. Use `--install-scope user` for a personal installation. For native/plugin installations, use that host's removal controls instead.
2. Review any files the old installer preserves. Keep personal edits and notes; move an edited old skill out of the host's discovery directory if it would otherwise appear alongside branded. Do not delete `.branding/`.
3. Use this checkout's `node /path/to/tech-branding-logo-repo/bin/branded.js install --agent <host>` with the intended project and scope. Confirm `branded` appears in the host and resume the existing project.

The new installer manages only branded records; it does not claim, rename or delete old installations. Old `tech-branding-logo` project-state identifiers remain accepted, and existing state, decisions, outputs and handoffs are preserved. New projects record `branded`. A public npm package or marketplace listing under the new name has not been published by this change.
