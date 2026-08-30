# Nexus WorldGen

Nexus WorldGen is the canonical repository for a browser-based, deterministic world-generation experience built with NexusEngine as its root runtime and Three.js as its presentation layer.

## Current status

The repository is in its documentation-foundation phase. The audited baseline contained only this repository name; no application, build, test, deployment, model, or asset pipeline exists yet. Product implementation starts only after the governed documentation gate validates and the documentation checkout is released.

The attached social-post screenshot that motivated this initiative is conceptual inspiration. This project does not currently claim image-to-3D reconstruction, Gaussian-splat training, external model inference, or compatibility with the pipeline described in that post.

## Intended experience

The authorized product brief is a high-fidelity, tutorial-led world explorer with:

- a reproducible seeded world blueprint;
- navigable terrain, biomes, water, atmosphere, and landmarks;
- NexusEngine-owned ECS state and deterministic simulation;
- a Three.js browser renderer;
- desktop, keyboard, pointer, and touch interaction;
- a replayable first-run tutorial and world inspector;
- responsive and reduced-motion modes;
- unit, browser, headless-render, visual, accessibility, and performance evidence; and
- one GitHub Pages deployment workflow.

These are approved goals, not implemented features.

## Repository orientation

- [Architecture](docs/architecture.md) — current and planned system boundaries.
- [Dependencies](docs/dependencies.md) — project-owned and third-party boundaries.
- [Development](docs/development.md) — phase rules and contributor workflow.
- [Validation](docs/validation.md) — evidence ladder and current results.
- [Known issues](docs/known-issues.md) — active limitations and external gates.
- [Project history](docs/project-history.md) — evidence-backed chronology.
- [Agent start here](.agent/start-here.md) — concise continuation state.
- [Changelog](CHANGELOG.md) — human-facing delivery chronology.

## Setup and run

There is no runnable application or dependency manifest in the documentation baseline. Do not invent or publish setup commands until the product phase adds and validates them. The first supported commands will be recorded in this README and [development guide](docs/development.md) together with the exact package-manager lockfile.

## Validation boundary

The baseline audit passed source-completeness and context-reconciliation checks. Build, tests, browser runtime, headless rendering, deployment, and device behavior remain unverified because no implementation exists. See [validation](docs/validation.md) for the explicit evidence ladder.

## Canonical identity

- Repository: [LuminaryLabs-Dev/NexusWorldGen](https://github.com/LuminaryLabs-Dev/NexusWorldGen)
- Default branch: `main`
- Audited baseline: `c5209d9cadbd566070bc2940cabb3578a397849c`
- Project type: web application
- Disposition: rehabilitate
- Documentation profile: `active-agent-operated-v1`, pattern revision `2`

No license is asserted by this documentation. Add one only after ownership and licensing authority are confirmed.
