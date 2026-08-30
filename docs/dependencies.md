# Dependencies and provenance

## Baseline

The documentation baseline has no dependency manifest, lockfile, installed package, vendored source, asset bundle, model, or dataset.

## Approved root runtime

The product phase will consume `LuminaryLabs-Dev/NexusEngine` at exact commit `8a60167fc945109408851c586a9355b1147438d5`. The audited package identifies itself as `nexusengine` version `0.0.4`, uses ECMAScript modules, requires Node.js 18 or newer, and exports `createEngine` plus ECS/runtime primitives.

The implementation must pin the exact Git commit in the dependency manifest and preserve it in the lockfile. Do not silently substitute a similarly named package or unpinned branch reference.

## Planned third-party boundary

The product phase is expected to select and lock:

- Next.js and React for the application shell;
- Three.js for browser rendering;
- TypeScript and lint tooling for static validation;
- a unit-test runner; and
- browser automation needed for reproducible smoke tests.

Exact versions remain unresolved until the product phase selects them and proves a clean installation. This document must be updated from the final manifests rather than from preference.

## Project-owned work

Luminary-owned implementation will include the deterministic world blueprint, terrain and population rules, NexusEngine integration, Three.js adapter, tutorial, controls, interface, tests, and validation harness created in this repository.

## Excluded provenance

The supplied social-post screenshot is not source code, an asset licensed for product use, a model, a dataset, or proof of implementation. The described Matrix-3D, Wan, ComfyUI, Gaussian-splat, Unreal, or Skywork systems are not dependencies of this approved local procedural demo unless separately sourced, authorized, documented, and validated later.

## Licensing boundary

No repository license is asserted. Preserve third-party package notices and add a repository license only after Luminary ownership and licensing authority are confirmed.
