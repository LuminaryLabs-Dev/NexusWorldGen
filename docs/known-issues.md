# Known issues and boundaries

## Cloud-browser GPU and viewport boundary

The sandbox cloud browser rejected the exact loopback URL with `ERR_BLOCKED_BY_CLIENT`, and its task-local Playwright Chromium download path returned zero-byte/truncated archives. The public Pages target removed the loopback blocker and allowed live DOM/CSS interaction testing at 1363×936.

That cloud browser has WebGL disabled. The application enters its intentional model fallback without app-origin warnings or errors, while the CPU-Vulkan harness covers the real Three.js scene, projection, raycast, NexusEngine scan state, and framebuffer change. Live GPU-canvas browser behavior, keyboard hold duration, fixed phone viewports, and phone interaction remain environment gates.

## GitHub Pages delivery state

The workflow and `/NexusWorldGen` export pass locally and in GitHub Actions. Actions run `33285598780` deployed the public target at <https://luminarylabs-dev.github.io/NexusWorldGen/>. Any future delivery must re-check the run, served revision, and base-path assets rather than inheriting this result automatically.

## Native renderer boundary

The CPU-Vulkan adapter imports the actual world generator, NexusEngine runtime, and scene builder. `@headless-three/renderer` `0.4.0` does not support the custom sky `ShaderMaterial`, so that one mesh is replaced with the same atmosphere fog color only in headless evidence. Browser WebGL retains the shader. This does not reduce the passed terrain, instancing, lighting, landmark, raycast, runtime-state, or framebuffer-change coverage.

## Hardware and device performance

The scene uses bounded pixel ratio, instancing, static export, and explicit disposal, but representative desktop GPU, low-power mobile GPU, physical touch device, battery, and thermal performance have not been measured. The static export is about 2.1 MB in the current toolchain; the largest uncompressed JavaScript chunk contains the rendering stack.

## Concept boundary

This is a deterministic procedural world generator. It does not accept an image and does not implement image reconstruction, Gaussian splats, external inference, model training, or the social post's Matrix-3D/Wan/ComfyUI/Unreal pipeline.

## Licensing unresolved

The repository has no license. Public visibility does not grant reuse rights; do not add or infer a license without authority.
