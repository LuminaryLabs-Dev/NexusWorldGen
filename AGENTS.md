# Repository instructions

This repository is governed by the target-specific `active-agent-operated-v1` documentation profile, revision `2`.

## Read first

1. [README.md](README.md)
2. [.agent/start-here.md](.agent/start-here.md)
3. [.agent/repository-profile.md](.agent/repository-profile.md)
4. [docs/development.md](docs/development.md)
5. [docs/validation.md](docs/validation.md)

## Current gate

The documentation foundation is the only active repository-write scope. Do not add product code, dependencies, workflows, assets, tests, or runtime configuration until the documentation set validates, its exact baseline commit is recorded, and the checkout is released.

## Non-negotiable boundaries

- NexusEngine owns root runtime state and deterministic simulation; Three.js is the renderer adapter.
- Treat the supplied social-post screenshot as inspiration only. Do not claim or emulate an unavailable image-to-3D or Gaussian-splat pipeline.
- Separate confirmed facts, approved intent, inferences, and unverified behavior.
- Keep one direct `main` history; do not create a side branch or pull request for this authorized pass.
- Preserve user changes and never rewrite unrelated history.
- Use one `.github/workflows/deploy.yml` when deployment configuration is added in the product phase.

## Before any handoff

Run the checks declared for the active phase in [docs/validation.md](docs/validation.md), update only the state files whose event semantics were satisfied, and reconcile the canonical project tracker and Upkeep record.
