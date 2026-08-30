# Nexus WorldGen

Nexus WorldGen is a playable, deterministic 3D expedition built with [NexusEngine](https://github.com/LuminaryLabs-Dev/NexusEngine) as its root runtime, Three.js as its presentation adapter, and Next.js as its static application shell.

## Current status

The first complete implementation is committed at `a12d40bda63ebf5c585ef5590cb1ae3f965690df`. It generates a reproducible world model in the browser, lets the player traverse it by keyboard, pointer, or touch, and teaches the interaction through a replayable field tutorial.

The social-post screenshot that motivated the project is conceptual inspiration only. This repository does not claim image-to-3D reconstruction, Gaussian-splat training, external model inference, or compatibility with the pipeline described in that post.

## Play the expedition

Requirements: Node.js `20.9` or newer and npm.

```bash
npm ci
npm run dev
```

Open <http://127.0.0.1:3000>. Production output is a static export in `out/`.

### Controls

| Action | Keyboard / pointer | Touch |
| --- | --- | --- |
| Traverse | `W A S D` or arrow keys | Direction pad |
| Look | Drag the world | Drag the world |
| Boost | Hold `Shift` | — |
| Resonance scan | `F` | Scan button |
| World blueprint | `B` | Expedition menu |
| Field guide | `H` | Tutorial card |

Ambient field audio is opt-in and synthesized locally with the Web Audio API.

## World model

Every normalized seed drives the full model: a 16,641-vertex terrain lattice, four biomes, water and atmosphere, 720 trees, 260 rocks, 108 crystals, 420 glimmers, a 19-point traversal route, Nexus Prime, and three signal beacons. The same seed and generator version reproduce the same blueprint.

NexusEngine owns the ECS world, input, movement, tutorial state, telemetry, events, clock, and `input → simulate → resolve → cleanup` lifecycle. Three.js consumes snapshots to build and animate the scene; it is not the canonical simulation store.

## Repository orientation

- [Architecture](docs/architecture.md) — implemented system boundaries and extension seams.
- [Dependencies](docs/dependencies.md) — project-owned and third-party boundaries.
- [Development](docs/development.md) — phase rules and contributor workflow.
- [Validation](docs/validation.md) — evidence ladder and current results.
- [Known issues](docs/known-issues.md) — active limitations and external gates.
- [Project history](docs/project-history.md) — evidence-backed chronology.
- [Agent start here](.agent/start-here.md) — concise continuation state.
- [Changelog](CHANGELOG.md) — human-facing delivery chronology.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Next.js development server |
| `npm run lint` | Run the Next.js ESLint profile |
| `npm run typecheck` | Run strict TypeScript checking without output |
| `npm test` | Run deterministic world and NexusEngine runtime tests |
| `npm run test:e2e` | Run the authored Chromium interaction journey when Playwright Chromium is available |
| `npm run build` | Create the static production export |
| `npm run validate` | Run lint, typecheck, unit tests, and production build |

## Validation boundary

Lint, strict TypeScript, nine unit/runtime tests, clean `npm ci`, workflow parsing, the default static export, and the `/NexusWorldGen` Pages export pass locally. A native CPU-Vulkan validation imported the real generator, NexusEngine runtime, and scene builder and rendered 79,426 triangles at 1280×720; its Nexus Prime raycast and scan state/pixel change passed.

The sandbox cloud browser rejected loopback access, and its task-local Chromium download endpoint returned an invalid archive. Browser/CSS interaction evidence therefore remains a post-deployment gate rather than being overstated as a local pass. See [validation](docs/validation.md).

## Canonical identity

- Repository: [LuminaryLabs-Dev/NexusWorldGen](https://github.com/LuminaryLabs-Dev/NexusWorldGen)
- Default branch: `main`
- Audited baseline: `c5209d9cadbd566070bc2940cabb3578a397849c`
- Documentation foundation: `21f233c7ad7d9caedcbee1d3b623bb672ee84aaf`
- Playable implementation: `a12d40bda63ebf5c585ef5590cb1ae3f965690df`
- Project type: web application
- Disposition: rehabilitate
- Documentation profile: `active-agent-operated-v1`, pattern revision `2`

No license is asserted by this documentation. Add one only after ownership and licensing authority are confirmed.
