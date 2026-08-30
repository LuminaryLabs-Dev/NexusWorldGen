# Development

## Requirements

- Node.js `20.9` or newer; Node.js 24 is used in the deployment workflow.
- npm with the committed `package-lock.json`.
- A WebGL-capable browser for the interactive page.

## Install and run

```bash
npm ci
npm run dev
```

The development route is <http://127.0.0.1:3000>. The application is client rendered and does not require secrets, external APIs, remote assets, or a model server.

## Validation commands

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run validate
```

`npm run validate` runs lint, strict typecheck, all unit/runtime tests, and the default static export. To exercise the GitHub Pages path locally:

```bash
NEXT_PUBLIC_BASE_PATH=/NexusWorldGen npm run build
```

Confirm that `out/index.html` references assets and `manifest.webmanifest` under `/NexusWorldGen/`. Generated `.next/`, `out/`, Playwright output, and sandbox evidence are ignored.

`npm run test:e2e` runs the authored Chromium tutorial journey when a compatible Playwright Chromium executable is available. Absence of that external browser binary is an environment blocker, not a substitute test pass.

## Source map

- `app/` — metadata, global design system, and root page.
- `src/world/` — pure deterministic world schema, PRNG/noise, and generator.
- `src/runtime/` — NexusEngine resources, components, systems, and snapshot API.
- `src/render/` — Three.js scene construction, animation, camera, and disposal.
- `src/components/` — playable client and tutorial/HUD/controls.
- `tests/` — deterministic model and runtime tests.
- `e2e/` — browser journey and phone-control smoke test.
- `.github/workflows/deploy.yml` — the only deployment workflow.

## Change workflow

1. Read [AGENTS.md](../AGENTS.md), [.agent/start-here.md](../.agent/start-here.md), and [architecture.md](architecture.md).
2. Preserve NexusEngine as the canonical runtime and keep the renderer as an adapter.
3. Keep generator randomness explicit and seeded; add determinism assertions for rule changes.
4. Add or update tests against the real public generator/runtime entry points.
5. Validate default and Pages-base-path builds.
6. Inspect rendered evidence for any Three.js or interface change.
7. Update stateful documentation only when its event semantics are satisfied.
8. Do not commit caches, exports, local evidence, credentials, or unrelated changes.

## Interaction and accessibility expectations

Keyboard and touch traversal are first-class paths. Preserve semantic button labels, visible focus, the skip link, polite live updates, readable fallback content, `prefers-reduced-motion`, forced-color behavior, and 39-pixel-or-larger primary touch controls. Sound must remain opt-in.

## Deployment

The workflow runs on pushes to `main` and manual dispatch. It installs with `npm ci`, runs lint/typecheck/tests, builds the static site with `NEXT_PUBLIC_BASE_PATH=/NexusWorldGen`, uploads `out/`, and deploys to the `github-pages` environment. Do not add a second deployment workflow.
