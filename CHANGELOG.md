# Changelog

All notable human-facing repository deliveries are recorded here. Agent maintenance chronology remains in [.agent/change-log.md](.agent/change-log.md).

## 0.1.0 — 2026-08-30

### Added

- Governed repository orientation and maintainer handoff documentation.
- Evidence-backed architecture, dependency, development, validation, limitation, and history records.
- A deterministic seeded world with four biomes, terrain, water, atmosphere, instanced ecology, glimmers, a luminous route, Nexus Prime, and three signal beacons.
- NexusEngine-owned ECS input, movement, tutorial, telemetry, scan, and lifecycle systems.
- A responsive Three.js field-atlas interface with keyboard, pointer, and touch traversal; replayable tutorial; Blueprint inspector; seed reforging; accessibility modes; WebGL fallback; and opt-in Web Audio ambience.
- Unit/runtime tests, a Playwright journey, native CPU-Vulkan render/raycast validation, and one GitHub Pages workflow.
- A quiet, accessible world-model fallback for browsers without WebGL acceleration.

### Validation notes

- Local install, lint, typecheck, nine tests, static export, Pages base path, workflow parsing, deterministic smoke render, full scene render, and scan state/pixel change pass.
- GitHub Actions run `33285598780` passed and deployed <https://luminarylabs-dev.github.io/NexusWorldGen/>.
- The deployed desktop journey passed tutorial start, scan, Blueprint inspection, deterministic seed reforging, responsive overflow, asset-path, and app-origin console checks. The cloud browser has no WebGL context, so the GPU scene remains covered by native CPU-Vulkan evidence.

### Not included

- No image-to-3D reconstruction, Gaussian-splat pipeline, external model, dataset, or training workflow is included.
- No repository release tag or license has been created.
