# Known issues and boundaries

## No runnable product

The documentation baseline has no application, package manifest, build, tests, world model, renderer, tutorial, or deployment workflow. Any product behavior described elsewhere is an approved target unless explicitly marked as validated.

## External deployment state

GitHub Pages settings and the eventual Actions run have not been inspected as successful deployment evidence. A valid local export and workflow do not prove the public site is live.

## Package versions unresolved

Only the NexusEngine source commit is currently pinned by decision. Next.js, React, Three.js, test, browser, and lint tool versions remain open until clean installation and lockfile validation.

## Licensing unresolved

The repository has no license. Do not infer public-use rights from public visibility or add a license without authority.

## Concept boundary

The supplied social-post screenshot describes an image-to-3D and Gaussian-splat workflow involving external systems. This project has no access to that implementation, model, training data, or asset pipeline and must not claim equivalent capabilities. The approved demo uses deterministic local procedural generation.

## Environment boundaries

Browser GPU/driver behavior, touch-device behavior, live Pages availability, and production performance remain unverified until the actual product exists and each required environment is exercised.
