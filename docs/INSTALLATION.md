# Optional CLI installation

Use the skill directly through a native package or a copied portable folder when possible. The CLI is optional and needs Node 18+; it has no runtime dependencies. Installing the executable globally and installing a skill personally are different actions.

From a reviewed checkout, invoke the CLI using its absolute path, from the project you want to use:

```sh
node /path/to/tech-branding-logo-repo/bin/tech-branding-logo.js install --agent codex
node /path/to/tech-branding-logo-repo/bin/tech-branding-logo.js install --agent claude --install-scope user
node /path/to/tech-branding-logo-repo/bin/tech-branding-logo.js install --agent grok --project /path/to/project
```

A packaged CLI tarball can also be installed locally with npm. No claim is made that the package name is currently published or available on npm. Do not use an unverified registry command as a prerequisite for branding.

The default is interactive installation. Choose “This project” or “All my projects on this computer,” then the host. Detection suggests hosts; it does not install into every tool on PATH. In automation, supply `--agent` or `--target`; no silent default is selected.

`--global` is an alias for `--install-scope user`. `--scope` still means branding work scope and applies only to `brief`. Both `--agent codex` and `--agent=codex` work. Unknown flags, missing values and options used on the wrong command fail before installation.

## Roots and custom paths

By default the CLI resolves the Git root, including a worktree `.git` file, from the launch directory. Outside Git, it uses the launch folder. `--project` selects an existing folder explicitly, including a non-Git folder or a nested folder that should be treated independently. The resolved destinations are printed before file changes.

An explicit `--target` is a manual skill-directory path, resolved relative to the project. It must be inside the selected project for project scope or inside your home for personal scope. To use another location, choose its containing folder with `--project`. Targets cannot overlap branding state, Git data or installation records. Generic/manual discovery is unverified until the host loads the files.

## Records, updates and removal

Project records are `.tech-branding-logo/install.json`. Personal records live under the user's home in `Library/Application Support/tech-branding-logo/` on macOS, `.local/share/tech-branding-logo/` on Linux, or `AppData/Local/tech-branding-logo/` on Windows. Personal skill directories still follow the host's discovery rules. Both scopes leave `.branding/` in the selected project.

```sh
tech-branding-logo install --agent codex --dry-run
tech-branding-logo doctor
tech-branding-logo update --dry-run
tech-branding-logo update
tech-branding-logo uninstall --dry-run
tech-branding-logo uninstall
```

Use the same `--install-scope user` on doctor, update, uninstall and recover to manage personal records. Update uses the saved targets, never re-detection. To add another host, use install. Records merge across installs and retain original ownership. Existing untracked files require explicit `--adopt`, and adoption only accepts matching payload content. `--force` remains a compatibility flag; it does not permit replacing local edits.

Every owned file has a hash. Updates stop on modified current payload files; merge or move the edit deliberately before retrying. Obsolete unchanged files can be removed; edited obsolete files are retained. Uninstall removes only unchanged tracked files, preserves edited and untracked files, and removes only empty installer-owned directories. It never removes `.branding/`. Preserved files become manually managed after uninstall.

Legacy version-1 manifests lack historical hashes. Update migrates conservatively, recognizing only files represented in the current payload and preserving other legacy files. Modified recognized files stop the update rather than being overwritten. If an old version already lost an installation record, it cannot be reconstructed automatically; explicitly reinstall with `--adopt` after inspecting that copy.

## Recovery and verification

Changes are planned under an exclusive process lock and journaled before they are applied. A caught write error rolls back. After a process interruption, use `recover` with the same scope/project, then repeat the intended operation. Recovery refuses to take over an active process or overwrite files edited after interruption; the journal is retained for inspection if there is a conflict. This provides recoverability, not a claim of crash-proof storage on every filesystem.

Doctor returns a nonzero exit code for missing/invalid records, empty target lists, pending operations, missing files or hash changes. It prints host invocation instructions and warns about duplicate native copies. It verifies local files, not actual host discovery, model compliance, cloud sync or design-tool capabilities. Complete the checklist in COMPATIBILITY.md.
