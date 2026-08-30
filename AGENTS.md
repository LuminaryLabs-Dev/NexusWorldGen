# Repository instructions

This repository is governed by the target-specific `active-agent-operated-v1` documentation profile, revision `2`.

## Read first

1. [README.md](README.md)
2. [.agent/start-here.md](.agent/start-here.md)
3. [.agent/repository-profile.md](.agent/repository-profile.md)
4. [docs/development.md](docs/development.md)
5. [docs/validation.md](docs/validation.md)

## Current gate

The documentation foundation (`85a34e3`), playable implementation (`cace132`), and quiet WebGL-fallback fix (`2537ed2`) are delivered on `main`. Local and Actions gates pass, Pages is live, and deployed browser interaction is recorded. No active implementation gate remains; physical-device and representative-GPU measurements are optional follow-up work and must not be reported as completed without new evidence.

## Non-negotiable boundaries

- NexusEngine owns root runtime state and deterministic simulation; Three.js is the renderer adapter.
- Treat the supplied social-post screenshot as inspiration only. Do not claim or emulate an unavailable image-to-3D or Gaussian-splat pipeline.
- Separate confirmed facts, approved intent, inferences, and unverified behavior.
- Keep one direct `main` history for this authorized pass; do not create a side branch or pull request.
- Preserve user changes and never rewrite unrelated history.
- Preserve the single `.github/workflows/deploy.yml` Pages workflow and its `/NexusWorldGen` base path.
- Do not commit generated `out/`, `.next/`, Playwright output, or sandbox framebuffer evidence.

## Before any handoff

Run the checks declared for the active phase in [docs/validation.md](docs/validation.md), update only the state files whose event semantics were satisfied, and reconcile the canonical project tracker and Upkeep record.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
