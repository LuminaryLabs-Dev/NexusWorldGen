# Development

## Current phase

Only documentation paths declared by the active documentation contract may change. There is no supported install, development-server, build, test, or export command in the audited baseline.

## Documentation phase workflow

1. Read [AGENTS.md](../AGENTS.md) and [.agent/start-here.md](../.agent/start-here.md).
2. Confirm the branch is `main` and the worktree contains no unrelated changes.
3. Change only the declared documentation allowlist.
4. Run the documentation checks in [validation.md](validation.md).
5. Review the diff for unsupported product claims and non-documentation paths.
6. Record the exact validated commit and reconcile the project tracker, Upkeep row, and maintenance record.
7. Release the documentation checkout before adding product files.

## Product phase entry gate

The product phase may begin only when:

- the governed documentation validator passes;
- Markdown lint passes;
- the documentation diff is allowlist-only;
- the documentation baseline is committed;
- `MNT-357` and its linked record agree; and
- the documentation checkout is cleared before the new product scope is claimed.

## Product phase conventions

When authorized and active, the product phase should:

- use the framework's canonical Next.js TypeScript structure;
- add one lockfile and use its package manager consistently;
- pin NexusEngine to the audited Git commit;
- keep world generation pure and seed-driven;
- represent canonical simulation state in NexusEngine rather than scene objects;
- keep the Three.js adapter client-only and disposable;
- add tests against real world-model and runtime entry points;
- expose accessible keyboard and touch paths; and
- use a static export compatible with one Pages workflow.

## Commands

Commands are intentionally absent until manifests and scripts exist and have been executed successfully. Update this section and the root README from package metadata during the product phase.

## Change discipline

Use direct `main` history for the explicitly authorized pass. Preserve the documentation-first commit boundary and avoid mixing generated build output, caches, screenshots, credentials, or local environment files into source control.
