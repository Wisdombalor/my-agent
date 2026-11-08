# Design skill coverage

Scope: local refinement of the existing property portfolio on 8 November 2026. No publishing or remote changes.

| Skill / exact source | Classification | Status | Contribution and evidence |
|---|---|---|---|
| design-orchestrator, /Users/mac/.codex/skills/design-orchestrator/SKILL.md | Core | applied | Intake, alternative structures, experience contract, implementation, review and handoff. DESIGN_DECISIONS.md and DESIGN_REVIEW.md. |
| design-taste, /Users/mac/.agents/skills/design-taste/SKILL.md | Core | applied | Read forms, density, elevation, spacing and website/motion records. Applied 48px phone icon targets, neutral elevation and in-flow form footer. These preferences are low confidence; expressive website motion is medium/emerging and was scoped to an operational app. |
| frontend-design, /Users/mac/.agents/skills/frontend-design/SKILL.md | Core | applied | Portfolio workspace direction, green/neutral foundations, compact divided metrics, photographic cards. Decisions recorded before coding. |
| ux-writing, /Users/mac/.agents/skills/ux-writing/SKILL.md | Core | applied | Page purpose, local-save disclosure, shorter search prompt, sentence-case main actions, useful empty-state action. Content matrix in review. |
| responsive-design, /Users/mac/.codex/skills/responsive-design/SKILL.md | Core | reviewed | Fluid heading, zero-min tracks, wrapping controls, 2-column phone metrics. Chrome checks at 320,390,768,1280. |
| emil-design-eng, /Users/mac/.agents/skills/emil-design-eng/SKILL.md | Core | reviewed | Explicit details buttons, keyboard edit isolation, visible focus, static metrics, restrained hover. Before/after findings in review. |
| mobile-native, /Users/mac/.agents/skills/mobile-native/SKILL.md | Core | applied | Dynamic viewport dialog limits, touch-sized inputs, capability-gated hover, safe-area support, scroll containment. Real-phone keyboard/safe-area behavior unverified. |
| animate, /Users/mac/.agents/skills/animate/SKILL.md | Core for changed feedback | applied | Existing transition token reused for toast; instant keyboard interactions; existing occasional dialog entrance retained; decorative pulse removed. No new motion dependency. |
| review-animations, /Users/mac/.agents/skills/review-animations/SKILL.md | Core | reviewed | Source review of changed motion and keyboard behavior. Runtime reduced-motion playback and frame profiling remain open. |
| anthropic-skills duplicates of taste, copy and design engineering | Duplicate | duplicate | Canonical agents-directory copies above used once. |
| responsive-web-app and motion-system | Conditional | not applicable | Existing vanilla CSS foundations and selected responsive/motion guidance suffice; no separate token architecture or duplicate broad audit needed. |
| UX research / Mobbin | Conditional | not applicable | Bounded refinement of an existing single-screen workflow used source and actual browser observations. No competitive references, customer interviews or analytics claimed. Future navigation/product strategy would benefit from targeted research. |
| prototype | Conditional, explicit-only | not applicable | No explicit variant-picker request. Three structures assessed in DESIGN_DECISIONS.md. |
| Figma / design-system | Conditional | not applicable | No Figma or standalone library deliverable requested; existing CSS tokens retained. |
| product-prioritization | Conditional | not applicable | Fixed feature scope, no MVP/backlog choice. |

Research, taste, copy, alternatives, foundations, accessibility, responsive behavior, states, motion and review were assessed. No external research, Figma, hardware testing or deployment was performed.

## Landing extension

| Skill / source | Classification | Status | New contribution |
|---|---|---|---|
| animation-vocabulary, /Users/mac/.agents/skills/animation-vocabulary/SKILL.md | Core for naming | applied | Named the transition crossfade; “animated image-grid hero” is the descriptive layout name. |
| motion-design, /Users/mac/.codex/skills/motion-design/SKILL.md | Core | applied | Calm premium choreography, only one of six tiles changing at once. Extra shadow/ambient effects omitted to keep reading and imagery clear. |
| animate, previously loaded canonical source | Core | reviewed | 600ms marketing crossfade on opacity, decode before swap, pause/resume, reduced-motion and visibility gates. Existing curve reused. |
| design-taste, previously loaded canonical source | Core | applied | ViV grid reference and website-expression entry inform the new landing. New low-confidence property-landing preference saved as ev-20261108-0007; dropdown fit treated as a bug, not a taste preference. |
| frontend-design, UX writing, responsive-design, emil-design-eng, previous canonical paths | Core | reviewed | Split introduction, asymmetric sample-photo mosaic, direct workspace links; native selects with reserved arrow space and shorter labels. Browser evidence in review extension. |

The prior no-landing/no-decorative-loop scope is superseded by the user's explicit request for a rotating property-image introduction. Operational workspace motion remains unchanged. No Mobbin, Figma, media generation, new dependency, backend or deployment was needed.

Latest correction reuses the selected copy, engineering, responsive and motion guidance: removed user-rejected playback controls, introduced semantic photo links with exact listing query routes and stable hover/focus targets, and refined deletion success into compact recoverable feedback. Existing pause-control acceptance is superseded by this user request. No new dependency or external action.
