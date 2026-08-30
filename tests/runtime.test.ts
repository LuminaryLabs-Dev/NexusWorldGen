import { describe, expect, it } from "vitest";
import { createNexusWorldRuntime, TelemetryResource, TutorialResource, WorldBlueprintResource } from "@/src/runtime/nexus-world-runtime";
import { generateWorldBlueprint } from "@/src/world/generate-world";

describe("NexusEngine world runtime", () => {
  it("registers the generated blueprint as the root ECS resource", () => {
    const blueprint = generateWorldBlueprint("AURELIA-7");
    const runtime = createNexusWorldRuntime(blueprint);

    expect(runtime.engine.world.getResource(WorldBlueprintResource)).toBe(blueprint);
    expect(runtime.engine.world.getResource(TelemetryResource)).toBeDefined();
  });

  it("advances the NexusEngine clock and traverses the terrain", () => {
    const blueprint = generateWorldBlueprint("VIRIDIAN-42");
    const runtime = createNexusWorldRuntime(blueprint);
    const before = runtime.snapshot();

    runtime.setInput({ forward: 1, strafe: 0, boost: true });
    for (let index = 0; index < 60; index += 1) runtime.tick(1 / 60);
    const after = runtime.snapshot();

    expect(after.frame).toBe(60);
    expect(after.elapsed).toBeCloseTo(1, 4);
    expect(after.player.distanceTravelled).toBeGreaterThan(10);
    expect(after.player.z).toBeLessThan(before.player.z);
    expect(after.player.y).toBeTypeOf("number");
  });

  it("normalizes diagonal input and clamps camera pitch", () => {
    const runtime = createNexusWorldRuntime(generateWorldBlueprint("MORROW-88"));
    runtime.setView(Math.PI / 2, 9);
    runtime.setInput({ forward: 1, strafe: 1, boost: false });
    for (let index = 0; index < 45; index += 1) runtime.tick(1 / 60);
    const snapshot = runtime.snapshot();

    expect(snapshot.player.pitch).toBe(0.42);
    expect(snapshot.player.speed).toBeLessThanOrEqual(11.01);
    expect(snapshot.player.distanceTravelled).toBeGreaterThan(5);
  });

  it("emits a visible scan pulse and records tutorial state", () => {
    const runtime = createNexusWorldRuntime(generateWorldBlueprint("CINDER-09"));

    runtime.scan();
    runtime.setTutorialStep(3);
    expect(runtime.snapshot().scanPulse).toBe(1);
    expect(runtime.snapshot().tutorialStep).toBe(3);
    expect(runtime.engine.world.getResource(TutorialResource)).toEqual({ step: 3 });

    runtime.tick(1);
    expect(runtime.snapshot().scanPulse).toBeLessThan(1);
    expect(runtime.snapshot().scanPulse).toBeGreaterThan(0);
  });
});
