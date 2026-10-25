# Get branded

Choose your agent, paste one line into your terminal, then start a new chat. Node.js 18+ and Git are required. No manual clone, folder copy or npm publication is needed.

## Codex

```sh
npx -y github:Atmech/tech-branding-logo-repo#6359f0a --agent codex --global
```

Then mention `$branded`.

## Claude Code

```sh
npx -y github:Atmech/tech-branding-logo-repo#6359f0a --agent claude --global
```

Then use `/branded` in a new session.

## Cursor, Grok coding, Gemini or Windsurf

Change the `--agent` value to `cursor`, `grok`, `gemini` or `windsurf`. Omit `--global` to install only in the project where you run the command. Grok Bot uses its own skill library.

The source pin selects the current branded preview while the rename/identity PR stack awaits merge. It is a published Git commit, not an npm registry package or a tagged release. The website command is defined in `site/install-options.js`. After merging the stack, maintainers can move this pin to a reviewed release tag.

## Native plugins

The repository now contains Codex and Claude marketplace catalogs and a complete, generated skills-only plugin. There is no MCP server or service account to connect. The preview commands below use the easy-install branch; they do not imply a listing in either host's curated public directory.

Codex CLI:

```sh
codex plugin marketplace add Atmech/tech-branding-logo-repo --ref codex/easy-install && codex plugin add branded@branded
```

Start a new chat to use its bundled skill. The command registers the repository catalog explicitly. Supported desktop surfaces expose configured catalogs in their plugin controls.

Claude Code:

```sh
claude plugin marketplace add Atmech/tech-branding-logo-repo#codex/easy-install && claude plugin install branded@branded
```

Start a new session and run `/branded:branded`. In Claude Code 2.1.292 or later, `claude plugin install branded --marketplace Atmech/tech-branding-logo-repo#codex/easy-install` combines registration and installation directly. The two-command line above also supports older marketplace-capable versions.

Use a recent host version; organization policy may control additional marketplaces. See [official Codex packaging and repository marketplaces](https://developers.openai.com/plugins/build/plugins) and [Claude marketplace installation](https://code.claude.com/docs/en/discover-plugins).

## Skills ecosystem

branded follows the open skill format. The [Skills CLI](https://github.com/vercel-labs/skills) supports Codex, Claude Code and many other hosts; its current version requires Node.js 22.20+. The remote preview can also be installed directly with the Skills CLI:

```sh
npx skills add Atmech/tech-branding-logo-repo/plugins/branded/skills/branded#codex/easy-install --skill branded -a codex -g
```

This source selects only the complete skill payload, rather than copying the repository's website and project files. For Claude Code, change `-a codex` to `-a claude-code`. A Skills-compatible source is not a claim of leaderboard indexing or endorsement. This route was verified in a fresh temporary project; add `-g` for personal scope as shown.

## Updates and removal

Use the same manager you installed with.

For the one-line branded installer, replace the install arguments with `update --global` or `uninstall --global`, retaining the reviewed GitHub source. `doctor --global` checks the installed files. Omit `--global` for project scope. Updates preserve edits; no overwrite flag is needed.

Claude plugins use `claude plugin marketplace update branded` and `claude plugin update branded@branded`. Codex uses `codex plugin marketplace upgrade branded` and its plugin controls. Skills CLI installations use `npx skills update` / `npx skills remove`. Keep one installation method per host to avoid duplicate skill copies. Project memory remains in `.branding/`.

See [advanced installation and recovery](INSTALLATION.md), [manual/native distribution](NATIVE_INSTALL.md), and [host compatibility](COMPATIBILITY.md).
