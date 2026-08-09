# Deliverable schemas

Use JSON or YAML with these top-level objects. Add files only when they exist.

```yaml
project: {name: string, mode: zero-to-brand|name-to-brand|brand-evolution, date: YYYY-MM-DD}
foundation: {audience: [], problem: string, promise: string, proof: [], role: string, personality: [], tensions: [], anti_positioning: [], territories: []}
naming: {status: not_applicable|in_progress|recommended|screening_note, candidates: [], recommendation: string}
nouns: {generated: [], approved: [], rejected: []}
concepts: [{id: string, nouns: [], silhouette: string, geometry: string, negative_space: string, story: string, app_icon: string, risks: [], score: number}]
directions: [{id: string, concept_ids: [], rationale: string, logo_assets: [], visual_dna: {colors: [], type: [], icons: [], patterns: [], motion: []}, tests: []}]
qc: {scores: {}, blockers: [], open_risks: [], decision: pass|iterate|hold}
delivery: {files: [], usage_rules: [], touchpoints: [], migration: [], open_decisions: []}
```

Minimum final file set: strategy/positioning, approved noun list, concept board or catalog, three directions or documented selection rationale, final logo variants, palette/type/tokens, visual-DNA rules, application examples, QC report, and a usage/migration guide as applicable.
