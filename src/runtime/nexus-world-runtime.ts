import { createEngine, defineComponent, defineEvent, defineResource, type NexusEngine } from "nexusengine";
import { classifyBiome, sampleHeight } from "../world/generate-world";
import type { RuntimeSnapshot, WorldBlueprint } from "../world/types";

export const WorldBlueprintResource = defineResource("nexus-worldgen.blueprint");
export const InputResource = defineResource("nexus-worldgen.input");
export const TutorialResource = defineResource("nexus-worldgen.tutorial");
export const TelemetryResource = defineResource("nexus-worldgen.telemetry");
export const ScanEvent = defineEvent("nexus-worldgen.scan");

export const PlayerTag = defineComponent("nexus-worldgen.player");
export const Position = defineComponent("nexus-worldgen.position");
export const View = defineComponent("nexus-worldgen.view");
export const Motion = defineComponent("nexus-worldgen.motion");

export type InputState = {
  forward: number;
  strafe: number;
  boost: boolean;
};

type PlayerPosition = {
  x: number;
  y: number;
  z: number;
  distanceTravelled: number;
};

type PlayerView = {
  yaw: number;
  pitch: number;
};

type PlayerMotion = {
  x: number;
  z: number;
  speed: number;
};

type Telemetry = {
  distanceToNexus: number;
  biome: RuntimeSnapshot["biome"];
  scanPulse: number;
};

export type NexusWorldRuntime = {
  engine: NexusEngine;
  setInput(next: InputState): void;
  setView(yaw: number, pitch: number): void;
  scan(): void;
  setTutorialStep(step: number): void;
  tick(delta: number): RuntimeSnapshot;
  snapshot(): RuntimeSnapshot;
};

const EMPTY_INPUT: InputState = { forward: 0, strafe: 0, boost: false };

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}

export function createNexusWorldRuntime(blueprint: WorldBlueprint): NexusWorldRuntime {
  const engine = createEngine({ tick: { maxDelta: 1 / 15 } });
  const { world, scheduler } = engine;
  const player = world.addEntity();

  world.setResource(WorldBlueprintResource, blueprint);
  world.setResource(InputResource, { ...EMPTY_INPUT });
  world.setResource(TutorialResource, { step: 0 });
  world.setResource<Telemetry>(TelemetryResource, {
    distanceToNexus: Math.hypot(blueprint.spawn.x - blueprint.nexus.x, blueprint.spawn.z - blueprint.nexus.z),
    biome: classifyBiome(blueprint.spawn.y, blueprint.spawn.x, blueprint.spawn.z, blueprint.seedHash),
    scanPulse: 0
  });

  world.setComponent(player, PlayerTag, { active: true });
  world.setComponent<PlayerPosition>(player, Position, {
    x: blueprint.spawn.x,
    y: blueprint.spawn.y,
    z: blueprint.spawn.z,
    distanceTravelled: 0
  });
  world.setComponent<PlayerView>(player, View, { yaw: blueprint.spawn.yaw, pitch: -0.08 });
  world.setComponent<PlayerMotion>(player, Motion, { x: 0, z: 0, speed: 0 });

  scheduler.addSystem("input", (currentWorld) => {
    const input = currentWorld.getResource<InputState>(InputResource) ?? EMPTY_INPUT;
    const view = currentWorld.getComponent<PlayerView>(player, View);
    const motion = currentWorld.getComponent<PlayerMotion>(player, Motion);
    const requestedSpeed = input.boost ? 22 : 11;
    const forwardX = Math.sin(view.yaw);
    const forwardZ = Math.cos(view.yaw);
    const rightX = Math.cos(view.yaw);
    const rightZ = -Math.sin(view.yaw);
    const magnitude = Math.hypot(input.forward, input.strafe);
    const normalization = magnitude > 1 ? 1 / magnitude : 1;
    const targetX = (forwardX * input.forward + rightX * input.strafe) * normalization * requestedSpeed;
    const targetZ = (forwardZ * input.forward + rightZ * input.strafe) * normalization * requestedSpeed;
    const smoothing = 1 - Math.exp(-engine.clock.delta * 10);
    motion.x += (targetX - motion.x) * smoothing;
    motion.z += (targetZ - motion.z) * smoothing;
    motion.speed = Math.hypot(motion.x, motion.z);
    currentWorld.setComponent(player, Motion, motion);
  });

  scheduler.addSystem("simulate", (currentWorld) => {
    const position = currentWorld.getComponent<PlayerPosition>(player, Position);
    const motion = currentWorld.getComponent<PlayerMotion>(player, Motion);
    const half = blueprint.terrain.size * 0.5 - 4;
    const previousX = position.x;
    const previousZ = position.z;
    position.x = clamp(position.x + motion.x * engine.clock.delta, -half, half);
    position.z = clamp(position.z + motion.z * engine.clock.delta, -half, half);
    position.y = sampleHeight(blueprint, position.x, position.z);
    position.distanceTravelled += Math.hypot(position.x - previousX, position.z - previousZ);
    currentWorld.setComponent(player, Position, position);
  });

  scheduler.addSystem("resolve", (currentWorld) => {
    const position = currentWorld.getComponent<PlayerPosition>(player, Position);
    const previous = currentWorld.getResource<Telemetry>(TelemetryResource);
    const scanPulse = Math.max(0, (previous?.scanPulse ?? 0) - engine.clock.delta * 0.42);
    currentWorld.setResource<Telemetry>(TelemetryResource, {
      distanceToNexus: Math.hypot(position.x - blueprint.nexus.x, position.z - blueprint.nexus.z),
      biome: classifyBiome(position.y, position.x, position.z, blueprint.seedHash),
      scanPulse
    });
  });

  function snapshot(): RuntimeSnapshot {
    const position = world.getComponent<PlayerPosition>(player, Position);
    const view = world.getComponent<PlayerView>(player, View);
    const motion = world.getComponent<PlayerMotion>(player, Motion);
    const telemetry = world.getResource<Telemetry>(TelemetryResource)!;
    const tutorial = world.getResource<{ step: number }>(TutorialResource) ?? { step: 0 };
    return {
      frame: engine.clock.frame,
      elapsed: engine.clock.elapsed,
      player: {
        x: position.x,
        y: position.y,
        z: position.z,
        yaw: view.yaw,
        pitch: view.pitch,
        speed: motion.speed,
        distanceTravelled: position.distanceTravelled
      },
      distanceToNexus: telemetry.distanceToNexus,
      biome: telemetry.biome,
      scanPulse: telemetry.scanPulse,
      tutorialStep: tutorial.step
    };
  }

  return {
    engine,
    setInput(next) {
      world.setResource(InputResource, { ...next });
    },
    setView(yaw, pitch) {
      world.setComponent<PlayerView>(player, View, {
        yaw,
        pitch: clamp(pitch, -0.72, 0.42)
      });
    },
    scan() {
      world.emit(ScanEvent, { frame: engine.clock.frame });
      const telemetry = world.getResource<Telemetry>(TelemetryResource)!;
      world.setResource<Telemetry>(TelemetryResource, { ...telemetry, scanPulse: 1 });
    },
    setTutorialStep(step) {
      world.setResource(TutorialResource, { step });
    },
    tick(delta) {
      engine.tick(delta);
      return snapshot();
    },
    snapshot
  };
}
