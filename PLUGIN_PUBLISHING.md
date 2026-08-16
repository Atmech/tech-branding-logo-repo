# Publishing Tech Branding & Logo in ChatGPT

This document tracks the recommended distribution path for the `tech-branding-logo` skill.

> Last verified against OpenAI's public documentation: August 2026.

## 1. Understand the current model

ChatGPT's **Plugin Directory** is the primary discovery surface for workflow capabilities. A plugin listing can package one or more:

- Skills
- Apps
- App templates

A plugin does **not** necessarily need an external app. Skill-only plugins are supported conceptually by the current Plugin model.

This repository's core workflow is intentionally **skill-first**. It does not require OAuth, an MCP server, a database, or an external API to perform branding strategy, naming, logo exploration, identity-system design, or QC.

## 2. Build the installable skill package

The minimal package is:

```text
tech-branding-logo/
├── SKILL.md
└── references/
    ├── brand-strategy.md
    ├── naming.md
    ├── rebrand-audit.md
    ├── logo-workflow.md
    ├── deliverable-schemas.md
    └── qc.md
```

Do not require the repository's `site/`, `brand/`, `.cursor/`, `CLAUDE.md`, or `AGENTS.md` for the ChatGPT skill itself. Those are distribution adapters and examples.

## 3. Install and test it as a ChatGPT Skill first

In ChatGPT:

1. Open **Plugins** in the sidebar.
2. Open the **Skills** tab.
3. Select **Create**.
4. Choose **Upload from your computer**.
5. Upload the skill package.
6. Confirm the installed skill appears under **Created by me** or **Installed**.

Before attempting broader distribution, run the acceptance tests below.

## 4. Acceptance tests

### Test A — zero-to-brand

```text
Use tech-branding-logo in zero-to-brand mode.

Product: an AI-native CRM for independent consultants
Audience: solo consultants and small advisory teams
Job to be done: capture relationships and know who to follow up with
Alternatives: spreadsheets, Notion, HubSpot
Proof: email/calendar ingestion and automatic relationship context
Constraints: premium but not corporate; works well as an app icon
```

Expected behavior:

- selects `zero-to-brand`
- starts with product truth and brand foundation
- does not jump directly to colors or a polished logo
- includes naming before the shared logo workflow
- avoids claiming trademark/domain clearance

### Test B — name-to-brand

```text
Use tech-branding-logo in name-to-brand mode.

The product name is Orbit. It is a developer observability product for AI agents. Keep the name unless there is a material strategic reason not to.
```

Expected behavior:

- evaluates name fit without automatically reopening naming
- builds brand psychology from the product rather than inventing etymology
- continues through visual territories and logo development

### Test C — brand evolution

```text
Use tech-branding-logo in brand-evolution mode.

We have an existing B2B SaaS brand with moderate customer recognition, but the identity feels generic and does not work well as a favicon. Preserve useful recognition where possible.
```

Expected behavior:

- audits existing equity
- classifies assets as retain / evolve / retire
- chooses refresh, evolution, or reset deliberately
- includes migration sequencing

## 5. Share it before public listing

ChatGPT currently supports sharing Skills directly with people/groups and, where enabled, publishing them to a workspace library.

This is the fastest validation route:

1. Open **Plugins → Skills**.
2. Find the skill under **Created by me**.
3. Open the `•••` menu.
4. Select **Share**.
5. Share it with testers or your workspace.

Collect feedback on invocation quality, output consistency, and whether the description triggers at the right time.

## 6. Public Plugin Directory publication

OpenAI's current public documentation establishes that the Plugin Directory can contain skills, apps, and app templates, including plugins whose required capability is a skill rather than an external app.

However, the public documentation does **not currently document a universal GitHub-to-public-directory submission flow for standalone skills** equivalent to uploading a repository URL.

The documented public developer submission flow is clearest for **apps**, where developers submit through the OpenAI Developer Platform with directory metadata, testing instructions, availability information, and app/MCP connectivity details when applicable. Approved apps are distributed in Plugin Directory listings.

Therefore, for this project:

1. Validate the Skill in ChatGPT first.
2. Use the Skill's sharing/publishing controls available to the account/workspace.
3. Check the Plugin Directory / developer publishing interface for a skill-only plugin submission option available to the account.
4. If OpenAI exposes a skill-only plugin submission flow, use the listing metadata below.
5. Do **not** build an MCP server merely to force the skill into the directory. Add an app only if the product genuinely needs external tools or data.

## 7. Recommended Plugin Directory listing

### Name

**Tech Branding & Logo**

### Short description

Build technology-product names, logos, and visual identity systems from product truth through production-ready brand direction.

### Long description

Tech Branding & Logo is a structured brand-development workflow for technology products. It supports zero-to-brand projects, products with an existing name, and brand-evolution or rebrand work. The skill connects product positioning and brand psychology to naming, visual territories, high-volume logo exploration, black-and-white refinement, product-surface testing, identity-system extension, and quality control.

### Suggested category

Design / Productivity / Developer & Business Tools, depending on the categories available at submission time.

### Suggested prompts

- Build a brand from scratch for my new AI product.
- I already have a product name. Turn it into a coherent visual identity.
- Audit my existing tech brand and propose an evolution rather than a destructive rebrand.
- Generate and narrow logo concepts using product strategy, not generic SaaS motifs.

### Capability summary

- brand strategy and positioning
- technology-product naming
- brand psychology
- visual territories and brand nouns
- high-volume logo concept generation
- logo refinement and production checks
- app-icon, favicon, monochrome, and UI testing
- visual identity system extension
- rebrand equity audit and migration planning
- structured QC and delivery manifests

## 8. When to add an App / MCP server

Do not add an app just for directory eligibility.

An app becomes useful if the workflow later needs capabilities such as:

- automated trademark-database searches
- domain availability checks
- direct Figma creation/editing
- asset storage or version management
- external brand research databases
- publishing finished assets into third-party systems

Those capabilities introduce authentication, privacy, tool permissions, reliability, and potentially legal-review requirements. Keep them separate from the core branding reasoning skill.

## 9. Release checklist

- [ ] `SKILL.md` frontmatter name and description are clear
- [ ] all referenced files exist under `references/`
- [ ] no local or private paths are required
- [ ] no source material that cannot be redistributed is bundled
- [ ] zero-to-brand test passes
- [ ] name-to-brand test passes
- [ ] brand-evolution test passes
- [ ] small-size / product-surface behavior is explicitly tested
- [ ] legal/trademark claims remain appropriately caveated
- [ ] skill is shared with external testers or workspace users first
- [ ] directory listing copy is reviewed
- [ ] privacy policy / terms are prepared only if an external app is later added

## 10. Canonical source

The GitHub repository remains the canonical open-source source of truth. ChatGPT-distributed versions should be built from tagged/reviewed repository revisions so changes remain auditable.
