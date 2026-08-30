# Dependencies and provenance

## Locked runtime dependencies

`package-lock.json` is the installation authority. Production dependencies are exact rather than ranges:

| Dependency | Locked source/version | Role |
| --- | --- | --- |
| NexusEngine | commit `8a60167fc945109408851c586a9355b1147438d5` | Root ECS runtime, resources, events, clock, scheduler, and world lifecycle |
| Next.js | `16.3.3` | App Router shell and static export |
| React / React DOM | `19.2.8` | Interactive field-atlas interface |
| Three.js | `0.185.1` | Browser scene graph and WebGL presentation |

NexusEngine is installed from the public GitHub commit tarball URL recorded in both manifests. This avoids an SSH credential dependency in CI while preserving the exact audited source revision. The package identifies itself as `nexusengine` `0.0.4`, uses ESM, and requires Node.js 18 or newer; this repository requires Node.js `20.9` or newer.

## Locked development dependencies

| Dependency | Version | Role |
| --- | --- | --- |
| TypeScript | `6.0.3` | Strict static checking compatible with the current Next.js lint stack |
| ESLint | `9.39.5` | Next.js core-web-vitals and TypeScript lint execution |
| Vitest | `4.1.11` | Deterministic generator and NexusEngine runtime tests |
| Playwright Test | `1.62.1` | Authored browser interaction journey |
| tsx | `4.23.12` | TypeScript execution for task-local validation adapters |
| Type packages | exact lockfile versions | Node, React, React DOM, and Three.js declarations |

TypeScript 7 and ESLint 10 were evaluated during setup but were not retained because the current Next.js/type-eslint plugin chain rejected them. The compatible lines are intentionally pinned.

## Trusted headless validation runtime

Framebuffer evidence is task-local and excluded from source control. The validation environment pins:

- `@headless-three/renderer` `0.4.0`;
- Three.js `0.185.1` to match the application; and
- Ubuntu Noble `mesa-vulkan-drivers` `25.2.8-0ubuntu0.24.04.2`, extracted without system installation and verified against its published SHA-256.

The adapter imports the repository's generator, NexusEngine runtime, and scene builder. The native renderer does not support `ShaderMaterial`, so only the custom sky mesh is replaced with the blueprint's fog color in that validation path; the browser implementation retains the real shader.

## Project-owned work

Luminary-owned source in this repository includes the PRNG/noise functions, world blueprint, placement rules, NexusEngine integration, Three.js scene adapter, field tutorial, controls, interface, tests, static-export configuration, and workflow.

## Excluded provenance

The supplied social-post screenshot is not source code, an asset licensed for product use, a model, a dataset, or implementation evidence. Matrix-3D, Wan, ComfyUI, Gaussian-splat, Unreal, and Skywork systems are not dependencies of this local procedural demo.

## Licensing boundary

No repository license is asserted. Preserve third-party package notices and add a repository license only after Luminary ownership and licensing authority are confirmed.
