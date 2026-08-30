# Durable memory

## Confirmed facts

- `LuminaryLabs-Dev/NexusWorldGen` is the exact canonical target.
- `main` is the only branch in the audited baseline.
- The baseline commit is `c5209d9cadbd566070bc2940cabb3578a397849c`.
- The baseline contained only `README.md` with `# NexusWorldGen`.
- No baseline package, source, test, workflow, release, LFS object, submodule, tag, or deployment evidence exists.
- Exact-name GitHub and Drive searches found no duplicate, predecessor, successor, or related implementation.
- The current NexusEngine source baseline is `8a60167fc945109408851c586a9355b1147438d5`.

## Durable decisions

- Disposition is `Rehabilitate`.
- Documentation profile is `active-agent-operated-v1`, revision `2`, as a target-specific contract.
- NexusEngine is the root runtime; Three.js is the browser presentation adapter.
- World generation is deterministic and local for the playable demo.
- The supplied screenshot is inspiration only and does not authorize image-to-3D, Gaussian-splat, model, dataset, or training claims.
- Deployment uses one `.github/workflows/deploy.yml` in the product phase.
- The authorized delivery path is direct to `main` after local validation, without a side branch or pull request.

## Active unknowns

- Final package versions other than the pinned NexusEngine commit are unresolved until product dependency selection.
- GitHub Pages repository settings and the post-push Actions result are external deployment gates.
- A repository license has not been authorized.

## Update semantics

Update this file only when a durable fact, boundary, decision, or material unknown changes. Put chronological maintenance events in [change-log.md](change-log.md) and human-facing release notes in [../CHANGELOG.md](../CHANGELOG.md).
