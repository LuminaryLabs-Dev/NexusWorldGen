# Durable memory

## Confirmed facts

- `LuminaryLabs-Dev/NexusWorldGen` is the exact canonical target.
- `main` is the only branch in the audited baseline.
- The baseline commit is `c5209d9cadbd566070bc2940cabb3578a397849c`.
- The baseline contained only `README.md` with `# NexusWorldGen`.
- No baseline package, source, test, workflow, release, LFS object, submodule, tag, or deployment evidence exists.
- Exact-name GitHub and Drive searches found no duplicate, predecessor, successor, or related implementation.
- The current NexusEngine source baseline is `8a60167fc945109408851c586a9355b1147438d5`.
- The governed documentation foundation is `21f233c7ad7d9caedcbee1d3b623bb672ee84aaf`.
- The first playable implementation is `a12d40bda63ebf5c585ef5590cb1ae3f965690df`.
- `package-lock.json` pins NexusEngine to the exact commit tarball and locks Next.js `16.3.3`, React `19.2.8`, and Three.js `0.185.1`.
- The deterministic `AURELIA-7` model contains 16,641 terrain vertices, 720 trees, 260 rocks, 108 crystals, 420 glimmers, four biomes, and four landmarks.
- Local lint, strict typecheck, nine tests, clean installation, static export, workflow syntax, and native CPU-Vulkan scene/raycast validation pass.

## Durable decisions

- Disposition is `Rehabilitate`.
- Documentation profile is `active-agent-operated-v1`, revision `2`, as a target-specific contract.
- NexusEngine is the root runtime; Three.js is the browser presentation adapter.
- World generation is deterministic and local for the playable demo.
- The supplied screenshot is inspiration only and does not authorize image-to-3D, Gaussian-splat, model, dataset, or training claims.
- Deployment uses one `.github/workflows/deploy.yml` in the product phase.
- The authorized delivery path is direct to `main` after local validation, without a side branch or pull request.
- The UI uses an expedition-instrument visual system, a replayable five-stage field guide, responsive keyboard/pointer/touch controls, reduced-motion support, a WebGL fallback, and opt-in local Web Audio ambience.
- Headless validation imports the actual generator, NexusEngine runtime, and scene builder; its only renderer-specific stub replaces the unsupported custom sky `ShaderMaterial` with the same atmosphere fog color.

## Active unknowns

- GitHub Pages repository settings, the post-push Actions result, and the deployed URL remain delivery gates until inspected.
- The sandbox cloud browser blocks loopback, and the task-local Playwright Chromium archive was unavailable; deployed browser/CSS evidence remains pending.
- Physical touch-device behavior and representative hardware performance have not been measured.
- A repository license has not been authorized.

## Update semantics

Update this file only when a durable fact, boundary, decision, or material unknown changes. Put chronological maintenance events in [change-log.md](change-log.md) and human-facing release notes in [../CHANGELOG.md](../CHANGELOG.md).
