import { createRandom, fractalNoise2D, hashSeed, valueNoise2D } from "./prng";
import type { BiomeId, Vec3, WorldBlueprint, WorldPlacement } from "./types";

const WORLD_SIZE = 196;
const TERRAIN_SEGMENTS = 128;
const WATER_LEVEL = -1.6;

const WORLD_NAMES = [
  ["Aurelia Reach", "A drowned valley waking beneath twin auroras"],
  ["Viridian Hollow", "A living archive threaded by luminous routes"],
  ["Cinderwake Basin", "Ember stone and alpine glass around an ancient signal"],
  ["Morrowglass Wilds", "A cartographer's frontier where weather remembers"],
  ["Lumenfall Expanse", "Four biomes converging on the dormant Nexus"]
] as const;

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}

function smoothstep(edge0: number, edge1: number, value: number): number {
  const amount = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return amount * amount * (3 - 2 * amount);
}

function gaussian(x: number, z: number, centerX: number, centerZ: number, radius: number): number {
  const dx = x - centerX;
  const dz = z - centerZ;
  return Math.exp(-(dx * dx + dz * dz) / (radius * radius));
}

export function terrainHeight(x: number, z: number, seedHash: number): number {
  const broad = fractalNoise2D((x + 160) * 0.012, (z - 90) * 0.012, seedHash, 5) * 12;
  const detail = fractalNoise2D(x * 0.038, z * 0.038, seedHash ^ 0xa53a9e2d, 4) * 3.8;
  const easternRidge = gaussian(x, z, 48, -12, 52) * 17;
  const westernShelf = gaussian(x, z, -58, 12, 44) * 11;
  const northPeak = gaussian(x, z, 8, -66, 32) * 22;
  const nexusBasin = gaussian(x, z, 0, 0, 24) * -5.5;
  const riverCut = Math.exp(-Math.pow(x - Math.sin(z * 0.035) * 13, 2) / 90) * -4.8;
  const normalizedEdge = Math.max(Math.abs(x), Math.abs(z)) / (WORLD_SIZE * 0.5);
  const edgeDrop = smoothstep(0.76, 1, normalizedEdge) * 21;
  return broad + detail + easternRidge + westernShelf + northPeak + nexusBasin + riverCut - edgeDrop + 2.8;
}

export function sampleHeight(blueprint: WorldBlueprint, x: number, z: number): number {
  const { size, segments, heights } = blueprint.terrain;
  const half = size * 0.5;
  const clampedX = clamp(x, -half, half);
  const clampedZ = clamp(z, -half, half);
  const gridX = ((clampedX + half) / size) * segments;
  const gridZ = ((clampedZ + half) / size) * segments;
  const x0 = Math.floor(gridX);
  const z0 = Math.floor(gridZ);
  const x1 = Math.min(segments, x0 + 1);
  const z1 = Math.min(segments, z0 + 1);
  const tx = gridX - x0;
  const tz = gridZ - z0;
  const width = segments + 1;
  const a = heights[z0 * width + x0];
  const b = heights[z0 * width + x1];
  const c = heights[z1 * width + x0];
  const d = heights[z1 * width + x1];
  return a + (b - a) * tx + (c + (d - c) * tx - (a + (b - a) * tx)) * tz;
}

export function classifyBiome(height: number, x: number, z: number, seedHash: number): BiomeId {
  const moisture = valueNoise2D(x * 0.025, z * 0.025, seedHash ^ 0x7f4a7c15);
  if (height > 15) return "alpine";
  if (height < 1.4 || moisture > 0.5) return "wetland";
  if (x > 22 && moisture < 0.08) return "ember";
  return "verdant";
}

function buildPlacement(
  id: string,
  x: number,
  z: number,
  y: number,
  scale: number,
  rotation: number,
  biome: BiomeId,
  variant: number
): WorldPlacement {
  return { id, x, y, z, scale, rotation, biome, variant };
}

function farEnough(x: number, z: number, radius: number): boolean {
  const nexusDistance = Math.hypot(x, z);
  const spawnDistance = Math.hypot(x, z - 72);
  const riverDistance = Math.abs(x - Math.sin(z * 0.035) * 13);
  return nexusDistance > radius && spawnDistance > 8 && riverDistance > 3.5;
}

export function generateWorldBlueprint(seedInput: string): WorldBlueprint {
  const seed = seedInput.trim().toUpperCase().slice(0, 32) || "AURELIA-7";
  const seedHash = hashSeed(seed);
  const random = createRandom(seedHash);
  const identity = WORLD_NAMES[seedHash % WORLD_NAMES.length];
  const heights: number[] = [];
  let minHeight = Number.POSITIVE_INFINITY;
  let maxHeight = Number.NEGATIVE_INFINITY;

  for (let row = 0; row <= TERRAIN_SEGMENTS; row += 1) {
    const z = (row / TERRAIN_SEGMENTS - 0.5) * WORLD_SIZE;
    for (let column = 0; column <= TERRAIN_SEGMENTS; column += 1) {
      const x = (column / TERRAIN_SEGMENTS - 0.5) * WORLD_SIZE;
      const height = terrainHeight(x, z, seedHash);
      heights.push(height);
      minHeight = Math.min(minHeight, height);
      maxHeight = Math.max(maxHeight, height);
    }
  }

  const atmosphereOptions = [
    ["#062d35", "#d38d61", "#071b1d", "#ffd8a3", "#29e0c3"],
    ["#17294a", "#de8b72", "#0a1724", "#ffd3a0", "#77efb8"],
    ["#2a1739", "#d66b5c", "#150d20", "#ffc279", "#62d9ff"]
  ] as const;
  const palette = atmosphereOptions[seedHash % atmosphereOptions.length];

  const blueprint: WorldBlueprint = {
    schemaVersion: 1,
    seed,
    seedHash,
    name: identity[0],
    tagline: identity[1],
    terrain: {
      size: WORLD_SIZE,
      segments: TERRAIN_SEGMENTS,
      waterLevel: WATER_LEVEL,
      minHeight,
      maxHeight,
      heights
    },
    atmosphere: {
      skyTop: palette[0],
      skyHorizon: palette[1],
      fog: palette[2],
      sun: palette[3],
      aurora: palette[4],
      wind: 0.35 + random() * 0.65,
      temperature: 11 + Math.round(random() * 9)
    },
    spawn: { x: 0, y: 0, z: 72, yaw: Math.PI },
    nexus: { id: "nexus-prime", x: 0, y: 0, z: 0, radius: 9 },
    path: [],
    beacons: [],
    trees: [],
    rocks: [],
    crystals: [],
    fireflies: [],
    stats: {
      terrainVertices: heights.length,
      treeCount: 0,
      rockCount: 0,
      crystalCount: 0,
      fireflyCount: 0,
      biomeCount: 4,
      landmarkCount: 4
    }
  };

  blueprint.spawn.y = sampleHeight(blueprint, blueprint.spawn.x, blueprint.spawn.z) + 0.3;
  blueprint.nexus.y = sampleHeight(blueprint, 0, 0);

  const pathPoints: Vec3[] = [];
  for (let index = 0; index <= 18; index += 1) {
    const amount = index / 18;
    const z = 72 * (1 - amount);
    const x = Math.sin(amount * Math.PI * 1.3) * 8 * (1 - amount * 0.35);
    pathPoints.push({ x, y: sampleHeight(blueprint, x, z) + 0.38, z });
  }
  blueprint.path = pathPoints;

  const beaconDefinitions = [
    ["mire-signal", "Mire Signal", -48, 31, "#75f0c0"],
    ["ember-spire", "Ember Spire", 53, 26, "#ff875f"],
    ["glass-needle", "Glass Needle", 20, -58, "#93d7ff"]
  ] as const;
  blueprint.beacons = beaconDefinitions.map(([id, label, x, z, color]) => ({
    id,
    label,
    color,
    x,
    y: sampleHeight(blueprint, x, z),
    z
  }));

  let treeAttempts = 0;
  while (blueprint.trees.length < 720 && treeAttempts < 4800) {
    treeAttempts += 1;
    const x = (random() - 0.5) * WORLD_SIZE * 0.92;
    const z = (random() - 0.5) * WORLD_SIZE * 0.92;
    const y = sampleHeight(blueprint, x, z);
    const biome = classifyBiome(y, x, z, seedHash);
    if (y <= WATER_LEVEL + 0.75 || biome === "ember" || !farEnough(x, z, 12)) continue;
    blueprint.trees.push(buildPlacement(`tree-${blueprint.trees.length}`, x, z, y, 0.65 + random() * 1.35, random() * Math.PI * 2, biome, Math.floor(random() * 3)));
  }

  let rockAttempts = 0;
  while (blueprint.rocks.length < 260 && rockAttempts < 2400) {
    rockAttempts += 1;
    const x = (random() - 0.5) * WORLD_SIZE * 0.94;
    const z = (random() - 0.5) * WORLD_SIZE * 0.94;
    const y = sampleHeight(blueprint, x, z);
    if (y <= WATER_LEVEL + 0.25 || !farEnough(x, z, 10)) continue;
    const biome = classifyBiome(y, x, z, seedHash);
    blueprint.rocks.push(buildPlacement(`rock-${blueprint.rocks.length}`, x, z, y, 0.35 + random() * 1.4, random() * Math.PI * 2, biome, Math.floor(random() * 4)));
  }

  let crystalAttempts = 0;
  while (blueprint.crystals.length < 108 && crystalAttempts < 1800) {
    crystalAttempts += 1;
    const angle = random() * Math.PI * 2;
    const radius = 13 + random() * 72;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = sampleHeight(blueprint, x, z);
    if (y <= WATER_LEVEL + 0.4 || !farEnough(x, z, 10)) continue;
    const biome = classifyBiome(y, x, z, seedHash);
    blueprint.crystals.push(buildPlacement(`crystal-${blueprint.crystals.length}`, x, z, y, 0.35 + random() * 1.25, random() * Math.PI, biome, Math.floor(random() * 3)));
  }

  for (let index = 0; index < 420; index += 1) {
    const angle = random() * Math.PI * 2;
    const radius = 12 + random() * 62;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const terrainY = sampleHeight(blueprint, x, z);
    const y = Math.max(WATER_LEVEL + 1, terrainY) + 1 + random() * 7;
    const biome = classifyBiome(terrainY, x, z, seedHash);
    blueprint.fireflies.push(buildPlacement(`glimmer-${index}`, x, z, y, 0.5 + random(), random() * Math.PI * 2, biome, index % 3));
  }

  blueprint.stats.treeCount = blueprint.trees.length;
  blueprint.stats.rockCount = blueprint.rocks.length;
  blueprint.stats.crystalCount = blueprint.crystals.length;
  blueprint.stats.fireflyCount = blueprint.fireflies.length;
  return blueprint;
}
