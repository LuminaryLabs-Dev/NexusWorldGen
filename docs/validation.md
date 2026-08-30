# Validation

## Verdict at audited baseline

`Partial` for the overall rehabilitation outcome: source and context evidence are complete, while the application and all runtime-dependent gates are absent. Documentation completion and maintenance completion are separate outcomes.

## Evidence ladder

| Gate | Requirement | Current state | Evidence boundary |
| --- | --- | --- | --- |
| Source access | Required | Passed | Public clone and connector readback matched `main` at `c5209d9` |
| Branch/history inventory | Required | Passed | One branch, one initial commit, no tags or releases |
| LFS/submodules | Required | Passed | Neither is configured |
| Context reconciliation | Required | Passed | Exact and near-match GitHub/Drive searches found no conflicting project |
| Documentation contract | Required | In progress | Governed set must pass semantic and mechanical checks |
| Dependency resolution | Product phase | Unverified | No manifest or lockfile exists |
| Static checks | Product phase | Unverified | No source or configuration exists |
| Unit tests | Product phase | Unverified | No test surface exists |
| Production build/export | Product phase | Unverified | No application exists |
| Browser runtime | Product phase | Unverified | No localhost route exists |
| Trusted headless Three.js render | Product phase | Unverified | No render harness exists |
| Visual/accessibility/performance | Product phase | Unverified | Requires the actual interactive render |
| Workflow | Product phase | Unverified | No `deploy.yml` exists |
| Remote equality | Delivery phase | Unverified | Requires the final pushed commit |
| Live Pages | External delivery gate | Unverified | Depends on repository settings and Actions after push |

## Documentation definition of done

The documentation phase passes only if:

- every required and evidence-triggered path exists with exact casing;
- forbidden substitutes are absent;
- links and referenced repository paths resolve;
- there are no placeholders or empty files;
- content roles are distinct and stateful files satisfy their update semantics;
- commands, package facts, commit identities, and runtime boundaries match canonical evidence;
- original and third-party boundaries are explicit;
- the diff contains only the declared documentation allowlist; and
- the final local and remote states are compared before claiming remote equality.

## Product definition of done

The product phase must add reproducible dependency installation, lint, typecheck, unit tests, production static export, live browser interaction, fixed-seed headless framebuffers from multiple views, visual review, accessibility checks, measured performance evidence, workflow validation, and final remote equality. A static screenshot alone cannot satisfy playable runtime validation.

## Evidence retention

Disposable reports, screenshots, and framebuffers should be retained outside the repository during iteration. Register durable validation evidence in the canonical Drive project under `03 — Validation & Evidence` after the exact commit and environment are known.
