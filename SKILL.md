---
name: tech-branding-logo
description: End-to-end naming, logo, and visual-identity development for technology products. Use for zero-to-brand projects with no name, name-to-brand projects with a finalized name but no brand psychology, and brand-evolution or rebrand projects with an existing identity. Produces strategy, candidate names where needed, logo concepts and SVG-ready assets where supported, a modular product identity system, guidelines, and quality-control evidence.
---

# Tech Branding & Logo

Build a coherent tech-product brand from product truth through a usable logo and visual identity system. Keep strategy, naming, and visual design connected; do not jump straight to colors or a decorative logo.

## Operating contract

- Select exactly one mode: `zero-to-brand`, `name-to-brand`, or `brand-evolution`.
- Ask only for missing information that materially changes the work. State assumptions when proceeding.
- Treat the product promise, audience, category, and future direction as constraints—not as copy to decorate.
- Distinguish book-derived visual methodology from added modules for product strategy, naming, and rebrand migration.
- Create actual visual artifacts when the environment supports SVG, vector code, image generation, or design files. If it cannot, create structured concept boards and precise construction directions; never pretend a prompt is a finished logo.
- Preserve useful recognition in a rebrand unless evidence supports a reset.
- Never claim trademark, domain, or legal clearance from preliminary checks.

## Project-state interoperability

When a project contains `.branding/`, treat it as portable project memory shared across compatible agents:

- Read `.branding/handoff.md`, `.branding/context.md`, and `.branding/state.json` before beginning or resuming work.
- Treat `context.md` as user-supplied context, not as a branding conclusion.
- Continue discovery adaptively. Do not repeat questions already answered unless the answer is contradictory or materially insufficient.
- Ask a question only when its answer could materially change positioning, naming, identity direction, rebrand scope, or a production constraint.
- Surface conflicts explicitly (for example, mutually incompatible desired perceptions) and resolve them before committing to a direction.
- Update `.branding/state.json` when a stage meaningfully changes; preserve the existing schema fields and add fields rather than deleting unknown ones.
- Record important choices, alternatives rejected, and reversals in `.branding/decisions.md` so another agent can continue the work without reconstructing history.
- Put working brand artifacts under `.branding/outputs/` when the environment allows file creation. Existing source assets may be placed under `.branding/inputs/`.
- Do not confuse installer onboarding with project discovery. Installation/setup is handled by the CLI; branding discovery begins from the project brief and continues here only as needed.

## Mode routing

### Zero-to-brand

Use for an idea with no settled name. Resolve product truth and positioning, create brand psychology, define naming territories, generate and screen names, then continue with the shared logo workflow. Deliver a recommended name plus the logo and brand system. Read `references/brand-strategy.md` and `references/naming.md`.

### Name-to-brand

Use when the name is strongly preferred or finalized but has no established meaning. Assess name-fit without automatically reopening naming; classify as retain, reinterpret, retain with descriptor, or reconsider. Build psychology from the product—not a fabricated etymology—then run the shared logo workflow. Deliver logo and brand system, with a name-fit note. Read `references/brand-strategy.md` and `references/naming.md`.

### Brand evolution

Use for an existing product, identity, or rebrand request. Audit current equity, audience recognition, accessibility, product fit, and competitive distinctiveness. Classify assets as retain, evolve, or retire; choose refresh, evolution, or reset; create the new system and a migration plan. Read `references/rebrand-audit.md`.

## Shared workflow and gates

1. **Brief the product.** Capture audience, job-to-be-done, alternatives, promise, proof, product maturity, category, constraints, expansion path, desired feelings, anti-feelings, and touchpoints. Mark unknowns.
2. **Form the brand foundation.** Define transformation, brand role, core promise, reasons to believe, personality tensions, attributes, anti-positioning, verbal tone, and 3–5 visual territories. Do not proceed if the foundation is contradictory; surface the conflict.
3. **Build brand nouns.** Produce 15–25 concrete nouns across objects, structures, movements, nature, people/roles, and cultural or technical metaphors. Translate abstractions into subjects. Narrow to about 15 approved nouns with rationale. Avoid automatic clouds, brains, sparks, circuits, shields, robots, generic gradients, or letter-in-circle marks unless the concept earns them.
4. **Generate quantity before polish.** Produce at least 50 low-cost thumbnail directions. For non-sketching agents, each is a structured concept: noun(s), silhouette, geometry, positive/negative space, story, app-icon potential, originality risk, and small-size risk.
5. **Combine and select.** Seek unexpected noun combinations using overlap, negative space, rhythm, flow, modularity, or a meaningful twist. Score and shortlist 8–15 concepts; develop 3 distinct directions. Do not show three color variations of one idea as three directions.
6. **Refine in black and white first.** Establish silhouette, proportion, spacing, optical balance, line weight, negative space, and construction. Then create wordmark/typography, color, and lockups. Read `references/logo-workflow.md`.
7. **Test as a product asset.** Check app icon, favicon (including 16×16), avatar, browser extension, horizontal/compact lockup, light/dark UI, monochrome, one-color reproduction, embroidery/engraving approximation, and representative product surfaces. Reject marks that depend on fine lines, tight gaps, or color alone.
8. **Extend the visual DNA.** Propagate the mark’s geometry into design tokens, iconography, patterns, illustration, UI shapes, motion, data visualization, documentation, social assets, and launch examples. Include only modules that fit the product; badges are optional.
9. **Package and explain.** Use `references/deliverable-schemas.md` for the final manifest. Include rationale, alternatives rejected, usage rules, risks, and open decisions. For rebrands include migration sequencing and continuity measures.
10. **Run QC.** Use `references/qc.md`; show scores, evidence, and unresolved risks. A score is a decision aid, not proof of market success.

## Output behavior

Return work in stages when the project is large: foundation → names/nouns → concepts → selected direction → production system. Keep rejected concepts available as an audit trail. Prefer editable, inspectable outputs: SVG, JSON/YAML tokens, Markdown guidelines, and rendered previews where possible.

## Reference map

- `references/brand-strategy.md` — tech-product discovery, psychology, positioning, and mode inputs.
- `references/naming.md` — naming territories, candidate schema, screening, and legal caveats.
- `references/rebrand-audit.md` — equity audit, change scope, retain/evolve/retire, migration.
- `references/logo-workflow.md` — book-derived noun-to-system method and production tests.
- `references/deliverable-schemas.md` — machine-readable manifests for stages and final delivery.
- `references/qc.md` — scoring rubric, failure modes, and acceptance gates.

## Provenance

The visual method is based on the user-supplied *Logos That Last* PDF as represented in the referenced conversation. The PDF binary was not available in this workspace, so this package does not reproduce or quote it; it operationalizes the extracted principles and clearly separates the added tech-product strategy, naming, and migration guidance.
