# Package, test and publish branded

Updated 25 October 2026 against current official documentation. The workflow remains skills-only: there is no required MCP server, OAuth flow or hosted backend.

## Build a release

```sh
npm ci
npm test
npm run validate
npm run build:release
```

The build creates `dist/branded-<version>-skill.zip`, `dist/branded-<version>-plugin.zip`, the npm CLI tarball, `release.json` and `SHA256SUMS`. All packages use the version in package.json and the same canonical workflow. Release metadata includes the source revision and payload digest. Build from a reviewed tag and record any working-tree changes before publishing; a local build is not a published release.

The plugin ZIP places portable `plugin.json`, Codex and Claude compatibility manifests beside `skills/branded/`. OpenAI presentation metadata is maintained in plugins/openai-interface.json. The package contains no hooks or MCP server. [OpenAI package structure](https://developers.openai.com/plugins/build/plugins), [Claude plugin reference](https://code.claude.com/docs/en/plugins-reference).

## Validate before sharing

Inspect archives and checksums. Test both fresh project and personal installations, upgrades from the previous release, edited files, uninstall, recovery and duplicate host copies. Then run the host acceptance checklist in docs/COMPATIBILITY.md and record exact host versions. Automated filesystem checks cannot claim a live integration passed.

Branding acceptance cases: zero-to-brand with naming before visuals; name-to-brand preserving an approved name; brand evolution retaining useful equity; a temporary campaign keeping master identity unchanged; and an application using the approved identity without reopening discovery. Inspect actual editable deliverables and relevant surface QC. Do not claim trademark clearance or unavailable tool capabilities.

## OpenAI public distribution

The official procedure supports uploading a plugin ZIP, including skills-only plugins, to a draft, resolving automated findings, submitting for review and publishing after approval. Publisher identity verification and organizational permissions apply. Check account eligibility in the publishing interface; this repository does not establish that eligibility or approval. [Official submission procedure](https://developers.openai.com/plugins/deploy/submission).

Use the skills-only package rather than adding an unnecessary server. Review the listing text, publisher information, any required URLs/images and the current validation feedback before submission. No fake privacy-policy or terms URL is supplied by the build. Public directory fields and requirements can change.

Do not publish from tests or a default install/build command. Publishing a GitHub release, npm package or marketplace listing is a distinct release action. Updates to bundled skills require a new package submission through the supported flow. Keep older versioned artifacts available for rollback.

## Other hosts

Use docs/NATIVE_INSTALL.md for local plugin loading and portable-folder installation. Grok coding supports its own paths and documented Claude compatibility; Grok Bot uses a separate library. Cursor, Gemini and Cascade have documented skill folders, with exact invocation still subject to host testing. Do not describe one plugin manifest as proof of support everywhere.

## Release checklist

- Version and lockfile agree; release tag matches package version.
- Tests and package-content validation pass on macOS, Linux and Windows in CI.
- All required references, schemas, templates, metadata and license are present.
- Actual host tests are recorded without marking pending checks as passed.
- Website, installation guide and release notes use the same distribution routes.
- No private files, source PDFs or credentials are bundled.
- Publisher-owned listing metadata and required submission assets are complete.
- Published checksums and source revision identify the reviewed release.
