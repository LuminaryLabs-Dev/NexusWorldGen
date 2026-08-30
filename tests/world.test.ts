import { describe, expect, it } from "vitest";
import { classifyBiome, generateWorldBlueprint, sampleHeight, terrainHeight } from "@/src/world/generate-world";

describe("deterministic world generation", () => {
  it("reproduces the complete world model for the same seed", () => {
    const first = generateWorldBlueprint("AURELIA-7");
    const second = generateWorldBlueprint("aurelia-7");

    expect(second).toEqual(first);
    expect(first.seed).toBe("AURELIA-7");
  });

  it("changes terrain, atmosphere, and placements for a different seed", () => {
    const first = generateWorldBlueprint("AURELIA-7");
    const second = generateWorldBlueprint("VIRIDIAN-42");

    expect(second.seedHash).not.toBe(first.seedHash);
    expect(second.terrain.heights).not.toEqual(first.terrain.heights);
    expect(second.trees.slice(0, 8)).not.toEqual(first.trees.slice(0, 8));
    expect(second.atmosphere).not.toEqual(first.atmosphere);
  });

  it("builds the complete bounded world inventory", () => {
    const world = generateWorldBlueprint("MORROW-88");
    const half = world.terrain.size / 2;
    const placements = [...world.trees, ...world.rocks, ...world.crystals, ...world.fireflies];

    expect(world.terrain.heights).toHaveLength((world.terrain.segments + 1) ** 2);
    expect(world.stats).toMatchObject({
      terrainVertices: 16_641,
      treeCount: 720,
      rockCount: 260,
      crystalCount: 108,
      fireflyCount: 420,
      biomeCount: 4,
      landmarkCount: 4
    });
    expect(world.beacons).toHaveLength(3);
    expect(world.path).toHaveLength(19);
    expect(placements.every((placement) => Math.abs(placement.x) <= half && Math.abs(placement.z) <= half)).toBe(true);
    expect(world.terrain.minHeight).toBeLessThan(world.terrain.waterLevel);
    expect(world.terrain.maxHeight).toBeGreaterThan(18);
  });

  it("samples the generated height field at known grid points", () => {
    const world = generateWorldBlueprint("CINDER-09");
    const half = world.terrain.size / 2;

    expect(sampleHeight(world, -half, -half)).toBeCloseTo(world.terrain.heights[0], 8);
    expect(sampleHeight(world, half, half)).toBeCloseTo(world.terrain.heights.at(-1)!, 8);
    expect(sampleHeight(world, world.spawn.x, world.spawn.z)).toBeCloseTo(world.spawn.y - 0.3, 8);
    expect(terrainHeight(0, 0, world.seedHash)).toBeCloseTo(sampleHeight(world, 0, 0), 8);
  });

  it("classifies all four terrain biomes", () => {
    const seedHash = generateWorldBlueprint("LUMEN-23").seedHash;
    const biomes = new Set([
      classifyBiome(20, 0, 0, seedHash),
      classifyBiome(-2, 0, 0, seedHash),
      classifyBiome(8, 50, 50, seedHash),
      classifyBiome(8, -50, -50, seedHash)
    ]);

    expect(biomes.has("alpine")).toBe(true);
    expect(biomes.has("wetland")).toBe(true);
    expect(biomes.size).toBeGreaterThanOrEqual(3);
  });
});
