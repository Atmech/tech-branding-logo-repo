# How to brand branded

Use the lowercase name **branded**. Introduce it with “Brand strategy, inside your agent.” Lead a launch or cover with “Make it mean something.” Follow with one useful fact about the work, not another slogan.

## Logo

Use `site/assets/branded-lockup.svg` for headers and introductions. Use `site/assets/branded-mark.svg` where the name is already known. The reversed variants are under `site/assets/brand/`. The primary wordmark is outlined; no font installation is required to reproduce it.

Keep one stem-width clear space around the symbol and the equivalent clearance around the lockup. The symbol is 68 × 68 source units; its stem is 14 units wide, so clear space is at least 14 units at source scale. Minimum intended sizes: symbol 24px; dedicated favicon 16px; full lockup 140px wide. Use the simplified favicon asset instead of reducing the full symbol at 16px.

Do not stretch, rotate, decorate, outline, close the counter, or give the mark a multicolor fill. Use solid ink on light surfaces or paper on ink. Never depend on color to explain the logo. Preserve the old logo through version history rather than mixing both systems on current pages.

## Palette and type

| Token | Value | Role |
| --- | --- | --- |
| Paper | `#f4f0e8` | Main surface |
| Ink | `#1a1b19` | Text, logo, structure |
| Lime | `#caff70` | Work objects and forward progress |
| Coral | `#ff6a3d` | Surface accents and interruption |
| Coral display | `#eb542c` | Large text on paper |
| Muted ink | `#555750` | Body copy and secondary labels on paper |
| Focus blue | `#5a7eff` | Focus outlines |

Use paper/ink for most of the area and lime/coral as concentrated accents. Bright coral on paper is decorative; it does not meet large-text contrast. Darker coral display on paper is approximately 3.17:1 and is limited to large display text. Ink on bright coral is approximately 6.08:1. Use ink for small text on coral. See QC for tested pairs.

Georgia Regular and Italic carry large statements. System sans carries practical language. System mono provides quiet labels. These are installed-system font stacks; no font binary is redistributed. The outlined wordmark was prepared from locally available Arial Bold with optical tracking. The original font is not included in the delivered artwork. See `tokens.json` for portable values.

## Composition

Make one proposition dominant. Use a grid and ample paper around it. Offset ink panels with a coral edge. Let a lime work card be the focal object. Keep paragraphs short and interfaces easy to scan. A diagonal cut, crop or edge can echo the logo; do not turn every object into a b.

Use tilted cards only as illustration. Installation commands, forms and navigation stay horizontal. Continuous motion is decorative and stops under reduced-motion preferences. Avoid additional gradients, decorative sparkles, meaningless dashboards and claims of authority.

## Voice and behavior

Say what the product helps the user decide. Show why a direction is suitable. Use “recommended” when a choice still needs review. Give the user a concrete next step. Preserve their decisions when the project resumes.

Examples:

- Introduction: “A clear point of view. A brand you can build on.”
- First question: “What are we making, and what do you want people to do after seeing it?”
- Direction: “This mark keeps the counter open at the size your header needs.”
- Limitation: “The SVG is ready. Physical printing has not been tested.”

## Applications included

- Homepage: actual brand proposition, worktable illustration, workflow, work scopes, continuity and installation.
- Public playbook: `site/brand-guide.html`, including downloadable logos and practical rules.
- Social/launch cover: `site/assets/brand/social-card.png`, 1200 × 630; editable SVG beside it.
- Profile/skill icon: `site/assets/brand/avatar.png`, 512 × 512; editable SVG beside it.
- Repository header: README uses the social cover and links to the strategy and playbook.
- Codex metadata: `assets/branded-icon.png` and `assets/branded-logo.svg`, packaged with the skill.

Social platforms need an absolute public image URL for Open Graph previews. No deployment URL is asserted here; set `og:image` to the deployed PNG URL after hosting is confirmed.

## Migration

The user selected the new name in the previous rename task; this work changes the identity around it. Keep skill identifiers, installer behavior, repository URLs and `.branding/` project memory as they are. Replace current website logo references, README artwork and agent icon metadata together. The existing GitHub Pages workflow deploys the site after a suitable main-branch merge; local changes do not mean a live deployment.

If rolling back this proposed identity, restore the previous `site/`, root icon assets and metadata from Git; keep any approved project decisions. Owner approval of the mark, comparative name/mark screening, live host discovery and live hosting remain separate decisions.
