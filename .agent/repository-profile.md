# Repository profile

## Identity

- Canonical repository: `LuminaryLabs-Dev/NexusWorldGen`
- Canonical URL: <https://github.com/LuminaryLabs-Dev/NexusWorldGen>
- Default branch: `main`
- Audited baseline: `c5209d9cadbd566070bc2940cabb3578a397849c`
- Visibility: public
- Archive/fork state: active and not a fork
- Repository class: Luminary-owned active web application

## Documentation contract

- Pattern set: `luminary-repository-documentation-patterns`
- Pattern revision: `2`
- Profile: `active-agent-operated-v1`
- Authority: canonical Luminary Upkeep and Repository Documentation guides plus the explicit target-specific skill-operated project request
- Required headings: none beyond the content required to fulfill each file's role
- Required paths: `README.md`, `AGENTS.md`, `.agent/repository-profile.md`, `.agent/start-here.md`, `.agent/memory.md`, `.agent/change-log.md`
- Evidence-triggered paths in this phase: `CHANGELOG.md` and `docs/{architecture,dependencies,development,known-issues,project-history,validation}.md`

This is a target-specific contract, not a company-wide pattern change.

## Build-out and disposition

- Baseline classification: minimally initialized
- Source completeness: complete for the audited baseline
- Understanding state: sufficient
- Documentation gate: passed at `21f233c7ad7d9caedcbee1d3b623bb672ee84aaf`
- Disposition: rehabilitate
- Original implemented systems: none
- Baseline reusable components: none
- Preservation value: low for baseline code, high for the canonical initiative and future delivery history
- Playable implementation: `a12d40bda63ebf5c585ef5590cb1ae3f965690df`

## Runtime boundary

NexusEngine is imported at exact source commit `8a60167fc945109408851c586a9355b1147438d5` and owns the application clock, ECS resources/components, events, lifecycle phases, input, movement, tutorial state, and telemetry. The pure world generator supplies the deterministic blueprint. Three.js consumes runtime snapshots as the presentation adapter, while the Next.js App Router supplies the static shell and interface.

## External context

- Root runtime source: `LuminaryLabs-Dev/NexusEngine` at `8a60167fc945109408851c586a9355b1147438d5`
- Exact-name GitHub and Drive searches found no predecessor, successor, duplicate, or related Nexus WorldGen implementation.
- The supplied social-post screenshot is contextual inspiration, not project source, a model artifact, a dataset, or implementation evidence.

## Validation boundary

Source/context auditing, dependency installation, static checks, unit/runtime tests, production export, workflow syntax, and trusted CPU-Vulkan scene/raycast validation pass. Local browser validation is blocked by the sandbox's browser boundaries; live Actions, Pages, deployed browser interaction, physical touch-device behavior, and representative hardware performance remain delivery or environment gates.
