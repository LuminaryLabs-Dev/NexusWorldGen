# Start here

## Exact state

Nexus WorldGen is a runnable static Next.js/Three.js application under Upkeep record `MNT-357`. The documentation foundation is `21f233c`; the separate playable implementation is `a12d40b`. The worktree contains the final documentation reconciliation before direct delivery to `main`.

## Reading order

1. [Repository profile](repository-profile.md)
2. [Durable memory](memory.md)
3. [Architecture](../docs/architecture.md)
4. [Development](../docs/development.md)
5. [Validation](../docs/validation.md)
6. [Known issues](../docs/known-issues.md)

## Active scope

Only governed documentation and delivery evidence may change in the current pass. Do not revise product behavior unless validation exposes a concrete defect.

## Next action

Validate this documentation-only diff, run `npm ci` and `npm run validate`, repeat the exact CPU-Vulkan render at the final revision, commit the reconciliation, fast-forward `main`, inspect the workflow/Pages result, validate the deployed browser target when available, then reconcile the tracker and close `MNT-357` only if the evidence gates agree.

## Handoff rule

Do not mark maintenance complete from local evidence alone. Require remote equality and a truthful deployment outcome; retain any unavailable browser or external Pages evidence as an explicit limitation.
