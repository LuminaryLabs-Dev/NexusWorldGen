export type BiomeId = "verdant" | "ember" | "alpine" | "wetland";

export type Vec3 = {
  x: number;
  y: number;
  z: number;
};

export type WorldPlacement = Vec3 & {
  id: string;
  scale: number;
  rotation: number;
  biome: BiomeId;
  variant: number;
};

export type Beacon = Vec3 & {
  id: string;
  label: string;
  color: string;
};

export type WorldBlueprint = {
  schemaVersion: 1;
  seed: string;
  seedHash: number;
  name: string;
  tagline: string;
  terrain: {
    size: number;
    segments: number;
    waterLevel: number;
    minHeight: number;
    maxHeight: number;
    heights: number[];
  };
  atmosphere: {
    skyTop: string;
    skyHorizon: string;
    fog: string;
    sun: string;
    aurora: string;
    wind: number;
    temperature: number;
  };
  spawn: Vec3 & { yaw: number };
  nexus: Vec3 & { id: string; radius: number };
  path: Vec3[];
  beacons: Beacon[];
  trees: WorldPlacement[];
  rocks: WorldPlacement[];
  crystals: WorldPlacement[];
  fireflies: WorldPlacement[];
  stats: {
    terrainVertices: number;
    treeCount: number;
    rockCount: number;
    crystalCount: number;
    fireflyCount: number;
    biomeCount: number;
    landmarkCount: number;
  };
};

export type RuntimeSnapshot = {
  frame: number;
  elapsed: number;
  player: Vec3 & {
    yaw: number;
    pitch: number;
    speed: number;
    distanceTravelled: number;
  };
  distanceToNexus: number;
  biome: BiomeId;
  scanPulse: number;
  tutorialStep: number;
};
