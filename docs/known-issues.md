# Known issues and boundaries

## Deployed browser evidence pending

The application builds and its scene renders natively, but local browser/CSS evidence is incomplete in the current sandbox. The selected cloud browser rejected the exact loopback URL with `ERR_BLOCKED_BY_CLIENT`. A task-local Playwright Chromium installation was attempted without system packages, but the allowed download path returned zero-byte/truncated archives and timed out. The authored browser journey is committed but was not reported as executed.

Validate the public Pages target after deployment. Until then, fixed-viewport CSS composition, browser console state, DOM keyboard delivery, and phone interaction remain explicit environment gates.

## GitHub Pages is an external delivery gate

The workflow and `/NexusWorldGen` export pass locally. Repository Pages configuration, the Actions run, deployment URL, and served revision must be inspected after the final push before live availability or remote equality is claimed.

## Native renderer boundary

The CPU-Vulkan adapter imports the actual world generator, NexusEngine runtime, and scene builder. `@headless-three/renderer` `0.4.0` does not support the custom sky `ShaderMaterial`, so that one mesh is replaced with the same atmosphere fog color only in headless evidence. Browser WebGL retains the shader. This does not reduce the passed terrain, instancing, lighting, landmark, raycast, runtime-state, or framebuffer-change coverage.

## Hardware and device performance

The scene uses bounded pixel ratio, instancing, static export, and explicit disposal, but representative desktop GPU, low-power mobile GPU, physical touch device, battery, and thermal performance have not been measured. The static export is about 2.1 MB in the current toolchain; the largest uncompressed JavaScript chunk contains the rendering stack.

## Concept boundary

This is a deterministic procedural world generator. It does not accept an image and does not implement image reconstruction, Gaussian splats, external inference, model training, or the social post's Matrix-3D/Wan/ComfyUI/Unreal pipeline.

## Licensing unresolved

The repository has no license. Public visibility does not grant reuse rights; do not add or infer a license without authority.
