# Validation

## Current verdict

`Ready for delivery with an explicit deployed-browser gate.` The source, deterministic runtime, static export, workflow, and trusted native scene evidence pass. Live Actions/Pages, deployed browser interaction, fixed-viewport CSS review, and remote equality cannot pass until the final commits are pushed and the public target exists.

## Evidence ladder

| Gate | State | Current evidence |
| --- | --- | --- |
| Source/context audit | Passed | Exact repository, branch, baseline, history, LFS/submodule, GitHub, and Drive reconciliation completed |
| Documentation foundation | Passed | Governed docs-only commit `21f233c` |
| Dependency resolution | Passed | Exact `package-lock.json`; clean `npm ci` completed twice, including commit-tarball NexusEngine installation |
| Lint | Passed | `npm run lint` exits 0 |
| Static typecheck | Passed | strict `npm run typecheck` exits 0 |
| Unit/runtime tests | Passed | 2 files, 9 tests, 0 failures |
| Default production export | Passed | `npm run build`; `/` and `/_not-found` statically generated |
| Pages production export | Passed | `/NexusWorldGen` asset and manifest paths verified; `out/` about 2.1 MB |
| Workflow syntax | Passed | `.github/workflows/deploy.yml` parsed as YAML; one workflow only |
| Native renderer setup | Passed | 512×512 PNG, 40,323 bytes, 437 sampled colors, identical repeat SHA-256 |
| Project scene framebuffer | Passed | 1280×720, 70 objects, 55 meshes, 79,426 triangles, recognizable terrain/ecology/Nexus |
| Three.js interaction | Passed | `nexus-prime` selected with 2 ray hits; `scanPulse` changed `0 → 0.86`; before/after PNG hashes differ |
| Local browser/WebGL | Blocked by environment | Cloud browser rejects loopback; task-local Chromium archive unavailable; no browser pass claimed |
| Deployed browser/visual/accessibility | Pending delivery | Requires the public Pages target and current-run evidence |
| Actions/Pages | Pending delivery | Requires final push and workflow result |
| Remote equality | Pending delivery | Requires `origin/main` and connector readback to match the final local commit |

## Static acceptance commands

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
NEXT_PUBLIC_BASE_PATH=/NexusWorldGen npm run build
```

The dependency install was also repeated with a fresh npm cache. GitHub workflow parsing and `git diff --check` pass independently.

## Determinism and runtime assertions

The nine tests prove same-seed deep equality, different-seed variation, complete bounded inventories, height-field sampling, biome coverage, NexusEngine blueprint registration, engine clock/movement, normalized diagonal speed, clamped view pitch, scan pulse, and tutorial state.

## Trusted Three.js render evidence

The task-local harness uses Node.js 24, Three.js `0.185.1`, `@headless-three/renderer` `0.4.0`, and checksum-verified Ubuntu Noble Mesa Lavapipe `25.2.8`. No system package was installed.

The setup smoke render reproduced SHA-256 `5f7da1d16c739db0d61fd8aff9ad3a859f43ee0ac6c863d65c9534e910647038` twice. The selected project frames use seed `AURELIA-7`; before hash `8ab9423a5c0a8822b8932d5c03e2af95229d1a28ad002497e9ad2f3a9afe940f` changes to `e9038f1472e01208db726d5aac014bfea23e53259a45765f3a4b7096bdada8d6` after the actual `NexusWorldRuntime.scan()` action.

The harness imports `src/world/generate-world.ts`, `src/runtime/nexus-world-runtime.ts`, and `src/render/build-world-scene.ts`. Its one declared stub replaces the unsupported custom sky `ShaderMaterial` with the blueprint fog color. This evidence covers scene construction, real geometry/material extraction, camera, lighting, native framebuffer pixels, Three.js projection/raycast, stable target identity, NexusEngine state, and visual synchronization. It does not cover DOM/CSS or raw browser event delivery.

## Browser evidence boundary

The Playwright journey defines the intended flow: load a non-empty WebGL world, begin the tutorial, traverse, scan, open the Blueprint, reforge the seed, and verify phone controls. The environment could not supply a permitted Chromium executable, so that journey remains pending rather than being replaced by a weaker claim.

After deployment, capture the exact public revision at 1440×1000, 1024×900, 390×844, and 375×667 where the browser surface supports viewport control. Check WebGL renderer/canvas pixels, console/page errors, tutorial-to-reforge interaction, keyboard/touch controls, responsive overlap, focus, reduced motion, and the generic-design signal checklist.

## Delivery definition of done

Maintenance may close only when:

- the final documentation-only diff validates;
- the local worktree is clean;
- `main` is fast-forwarded without force;
- Actions and Pages return a truthful outcome;
- deployed browser evidence is captured when the public target is available;
- remote commit/tree equality is proven; and
- the project tracker, Current State, Upkeep row, and maintenance record agree.

## Evidence retention

Iteration framebuffers, runtime manifests, reports, console/network records, and browser blockers remain outside source control. Durable delivery evidence is registered in the canonical Drive project under `03 — Validation & Evidence` after the final commit and deployment state are known.
