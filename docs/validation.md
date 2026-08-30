# Validation

## Current verdict

`Delivered with explicit environment boundaries.` The source, deterministic runtime, static export, workflow, native Three.js scene, GitHub Actions, Pages deployment, and supported live-browser journey pass. The cloud browser has no WebGL context and no controllable viewport matrix, so fixed phone compositions, live GPU-canvas browser behavior, and physical-device performance remain follow-up evidence rather than release claims.

## Evidence ladder

| Gate | State | Current evidence |
| --- | --- | --- |
| Source/context audit | Passed | Exact repository, branch, baseline, history, LFS/submodule, GitHub, and Drive reconciliation completed |
| Documentation foundation | Passed | Governed docs-only commit `85a34e3` on public `main` |
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
| Deployed browser/visual/accessibility | Partial by environment | Live 1363×936 fallback UI passed tutorial start, scan, Blueprint, reforge, base paths, overflow, and app-origin console checks; WebGL and fixed phone viewports unavailable |
| Actions/Pages | Passed | Run `33285598780` passed all build/deploy steps; public URL verified |
| Remote equality | Passed for product tree | Remote `2537ed2` and the validated local fallback revision share tree `5168294`; connector readback confirmed `main` |

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

## Deployed browser evidence

The exact public target <https://luminarylabs-dev.github.io/NexusWorldGen/> was loaded after Actions run `33285598780`. At 1363×936 it resolved its manifest, stylesheet, and all Next.js chunks under `/NexusWorldGen`; `scrollWidth` did not exceed the viewport. The journey started the field guide, completed a resonance scan, exposed the 16,641-vertex Blueprint, forged seed `CANOPY-77`, and observed the generated name `Cinderwake Basin`. A fresh reload of revision `2537ed2` produced zero app-origin warnings or errors.

The cloud browser reports WebGL disabled and therefore renders the intentional model fallback (`canvasCount: 0`); this is not claimed as a GPU-canvas pass. The capability preflight prevents Three.js context errors while preserving the full deterministic Blueprint and tutorial controls. The authored Playwright journey still defines the intended WebGL, keyboard-hold, and phone-control flow for an environment with Chromium/WebGL and viewport control.

Future browser evidence should capture 1440×1000, 1024×900, 390×844, and 375×667 on a WebGL-capable browser. Check canvas pixels, keyboard/touch controls, responsive overlap, focus, reduced motion, and representative device performance.

## Delivery definition of done

This delivery satisfied the required closeout gates:

- the final documentation-only diff validates;
- the local worktree is clean;
- `main` is fast-forwarded without force;
- Actions and Pages returned a successful outcome;
- deployed browser evidence captured the supported fallback path and disclosed the WebGL boundary;
- remote tree equality was proven; and
- the project tracker, Current State, Upkeep row, and maintenance record agree.

## Evidence retention

Iteration framebuffers, runtime manifests, reports, console records, screenshots, and browser blockers remain outside source control. Durable delivery evidence is registered in the canonical Drive project under `03 — Validation & Evidence`; fixed mobile and physical-device results must be added there if later executed.
