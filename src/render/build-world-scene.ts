import * as THREE from "three";
import { classifyBiome } from "../world/generate-world";
import type { BiomeId, RuntimeSnapshot, WorldBlueprint, WorldPlacement } from "../world/types";

const BIOME_COLORS: Record<BiomeId, { ground: string; canopy: string; glow: string }> = {
  verdant: { ground: "#4f8062", canopy: "#4cb37c", glow: "#7cf2bd" },
  wetland: { ground: "#396f6e", canopy: "#3d9c8d", glow: "#6de7d4" },
  ember: { ground: "#8a5a4a", canopy: "#b56a45", glow: "#ff8d62" },
  alpine: { ground: "#9cafb0", canopy: "#88a9a2", glow: "#9cdfff" }
};

export type WorldSceneHandle = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  worldRoot: THREE.Group;
  nexusTarget: THREE.Object3D;
  update(elapsed: number, snapshot: RuntimeSnapshot, reducedMotion: boolean): void;
  dispose(): void;
};

function colorForTerrain(blueprint: WorldBlueprint, height: number, x: number, z: number): THREE.Color {
  const biome = classifyBiome(height, x, z, blueprint.seedHash);
  const color = new THREE.Color(BIOME_COLORS[biome].ground);
  const normalized = THREE.MathUtils.clamp((height - blueprint.terrain.minHeight) / (blueprint.terrain.maxHeight - blueprint.terrain.minHeight), 0, 1);
  color.offsetHSL(0, normalized * -0.07, normalized * 0.11 - 0.025);
  if (height < blueprint.terrain.waterLevel + 1.2) color.lerp(new THREE.Color("#2c6264"), 0.58);
  return color;
}

function createTerrain(blueprint: WorldBlueprint): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(
    blueprint.terrain.size,
    blueprint.terrain.size,
    blueprint.terrain.segments,
    blueprint.terrain.segments
  );
  geometry.rotateX(-Math.PI / 2);
  const position = geometry.attributes.position;
  const colors = new Float32Array(position.count * 3);
  const color = new THREE.Color();

  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index);
    const z = position.getZ(index);
    const y = blueprint.terrain.heights[index];
    position.setY(index, y);
    color.copy(colorForTerrain(blueprint, y, x, z));
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.92,
    metalness: 0.02
  });
  const terrain = new THREE.Mesh(geometry, material);
  terrain.name = "Generated terrain";
  terrain.receiveShadow = true;
  terrain.userData.worldId = "terrain";
  return terrain;
}

function createSky(blueprint: WorldBlueprint): THREE.Mesh {
  const material = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      topColor: { value: new THREE.Color(blueprint.atmosphere.skyTop) },
      horizonColor: { value: new THREE.Color(blueprint.atmosphere.skyHorizon) },
      lowerColor: { value: new THREE.Color(blueprint.atmosphere.fog) },
      offset: { value: 8 },
      exponent: { value: 0.74 }
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 horizonColor;
      uniform vec3 lowerColor;
      uniform float offset;
      uniform float exponent;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition + vec3(0.0, offset, 0.0)).y;
        float upper = pow(max(h, 0.0), exponent);
        float lower = pow(max(-h, 0.0), 0.45);
        vec3 color = mix(horizonColor, topColor, upper);
        color = mix(color, lowerColor, lower * 0.85);
        gl_FragColor = vec4(color, 1.0);
      }
    `
  });
  return new THREE.Mesh(new THREE.SphereGeometry(270, 32, 18), material);
}

function setInstance(
  mesh: THREE.InstancedMesh,
  index: number,
  placement: WorldPlacement,
  scale: THREE.Vector3,
  yOffset = 0
): void {
  const dummy = new THREE.Object3D();
  dummy.position.set(placement.x, placement.y + yOffset, placement.z);
  dummy.rotation.y = placement.rotation;
  dummy.scale.copy(scale).multiplyScalar(placement.scale);
  dummy.updateMatrix();
  mesh.setMatrixAt(index, dummy.matrix);
}

function createForest(placements: WorldPlacement[]): THREE.Group {
  const group = new THREE.Group();
  group.name = "Biome forest";
  const trunkGeometry = new THREE.CylinderGeometry(0.22, 0.36, 2.8, 6);
  const canopyGeometry = new THREE.ConeGeometry(1.15, 3.6, 7);
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: "#3c3128", roughness: 1 });
  const canopyMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.86, vertexColors: false });
  const trunks = new THREE.InstancedMesh(trunkGeometry, trunkMaterial, placements.length);
  const canopies = new THREE.InstancedMesh(canopyGeometry, canopyMaterial, placements.length);
  trunks.castShadow = true;
  canopies.castShadow = true;

  placements.forEach((placement, index) => {
    const trunkScale = new THREE.Vector3(0.82 + placement.variant * 0.08, 0.85 + placement.variant * 0.12, 0.82 + placement.variant * 0.08);
    setInstance(trunks, index, placement, trunkScale, 1.35 * placement.scale);
    setInstance(canopies, index, placement, new THREE.Vector3(1, 0.9 + placement.variant * 0.08, 1), 3.25 * placement.scale);
    const canopyColor = new THREE.Color(BIOME_COLORS[placement.biome].canopy);
    canopyColor.offsetHSL(placement.variant * 0.016, 0, placement.variant * 0.028);
    canopies.setColorAt(index, canopyColor);
  });
  trunks.instanceMatrix.needsUpdate = true;
  canopies.instanceMatrix.needsUpdate = true;
  if (canopies.instanceColor) canopies.instanceColor.needsUpdate = true;
  group.add(trunks, canopies);
  return group;
}

function createInstancedDetails(blueprint: WorldBlueprint): THREE.Group {
  const group = new THREE.Group();
  group.name = "World details";
  const rockMaterial = new THREE.MeshStandardMaterial({ color: "#6f7a77", roughness: 0.9, metalness: 0.08 });
  const rocks = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.75, 0), rockMaterial, blueprint.rocks.length);
  blueprint.rocks.forEach((placement, index) => {
    setInstance(rocks, index, placement, new THREE.Vector3(1.3, 0.7 + placement.variant * 0.08, 1), 0.42 * placement.scale);
  });
  rocks.instanceMatrix.needsUpdate = true;
  rocks.castShadow = true;
  rocks.receiveShadow = true;

  const crystalMaterial = new THREE.MeshStandardMaterial({
    color: blueprint.atmosphere.aurora,
    emissive: blueprint.atmosphere.aurora,
    emissiveIntensity: 1.55,
    roughness: 0.22,
    metalness: 0.28
  });
  const crystals = new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.7, 0), crystalMaterial, blueprint.crystals.length);
  blueprint.crystals.forEach((placement, index) => {
    setInstance(crystals, index, placement, new THREE.Vector3(0.62, 1.8 + placement.variant * 0.45, 0.62), 0.72 * placement.scale);
  });
  crystals.instanceMatrix.needsUpdate = true;
  group.add(rocks, crystals);
  return group;
}

function createPath(blueprint: WorldBlueprint): THREE.Mesh {
  const points = blueprint.path.map((point) => new THREE.Vector3(point.x, point.y, point.z));
  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve, 120, 0.18, 7, false);
  const material = new THREE.MeshBasicMaterial({
    color: blueprint.atmosphere.aurora,
    transparent: true,
    opacity: 0.68,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const path = new THREE.Mesh(geometry, material);
  path.name = "Luminous route";
  return path;
}

function createNexus(blueprint: WorldBlueprint): { group: THREE.Group; rings: THREE.Mesh[]; core: THREE.Mesh } {
  const group = new THREE.Group();
  group.name = "Nexus Prime";
  group.userData.worldId = blueprint.nexus.id;
  group.position.set(blueprint.nexus.x, blueprint.nexus.y, blueprint.nexus.z);

  const darkStone = new THREE.MeshStandardMaterial({ color: "#192b2a", roughness: 0.68, metalness: 0.42 });
  const glow = new THREE.MeshStandardMaterial({
    color: blueprint.atmosphere.aurora,
    emissive: blueprint.atmosphere.aurora,
    emissiveIntensity: 2.8,
    roughness: 0.12,
    metalness: 0.34
  });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(7.5, 9, 2.2, 12), darkStone);
  base.position.y = 0.85;
  base.receiveShadow = true;
  base.castShadow = true;
  group.add(base);

  const rings: THREE.Mesh[] = [];
  for (let index = 0; index < 3; index += 1) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(3.2 + index * 1.35, 0.1 + index * 0.03, 8, 64), glow);
    ring.position.y = 5.2;
    ring.rotation.set(Math.PI / 2.6 + index * 0.44, index * 0.72, index * 0.22);
    rings.push(ring);
    group.add(ring);
  }

  for (let index = 0; index < 8; index += 1) {
    const angle = (index / 8) * Math.PI * 2;
    const pylon = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.86, 6.5, 5), darkStone);
    pylon.position.set(Math.cos(angle) * 6.2, 3.6, Math.sin(angle) * 6.2);
    pylon.rotation.z = Math.cos(angle) * 0.16;
    pylon.rotation.x = Math.sin(angle) * 0.16;
    pylon.castShadow = true;
    group.add(pylon);
  }

  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.55, 2), glow);
  core.position.y = 5.25;
  core.userData.worldId = "nexus-core";
  group.add(core);
  const coreLight = new THREE.PointLight(blueprint.atmosphere.aurora, 24, 52, 1.8);
  coreLight.position.y = 6;
  group.add(coreLight);
  return { group, rings, core };
}

function createBeacons(blueprint: WorldBlueprint): THREE.Group {
  const group = new THREE.Group();
  group.name = "Signal beacons";
  for (const beacon of blueprint.beacons) {
    const root = new THREE.Group();
    root.position.set(beacon.x, beacon.y, beacon.z);
    root.userData.worldId = beacon.id;
    const material = new THREE.MeshStandardMaterial({ color: "#20302f", roughness: 0.7, metalness: 0.4 });
    const glow = new THREE.MeshBasicMaterial({ color: beacon.color, transparent: true, opacity: 0.9 });
    const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 1.2, 7.8, 5), material);
    spire.position.y = 3.7;
    const signal = new THREE.Mesh(new THREE.OctahedronGeometry(0.72, 0), glow);
    signal.position.y = 8.2;
    root.add(spire, signal);
    group.add(root);
  }
  return group;
}

function createFireflies(blueprint: WorldBlueprint): THREE.Points {
  const positions = new Float32Array(blueprint.fireflies.length * 3);
  const colors = new Float32Array(blueprint.fireflies.length * 3);
  blueprint.fireflies.forEach((placement, index) => {
    positions[index * 3] = placement.x;
    positions[index * 3 + 1] = placement.y;
    positions[index * 3 + 2] = placement.z;
    const color = new THREE.Color(BIOME_COLORS[placement.biome].glow);
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: 0.42,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.78,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const points = new THREE.Points(geometry, material);
  points.userData.basePositions = positions.slice();
  return points;
}

function createClouds(blueprint: WorldBlueprint): THREE.Group {
  const group = new THREE.Group();
  group.name = "Cloud field";
  const geometry = new THREE.SphereGeometry(1, 10, 7);
  const material = new THREE.MeshStandardMaterial({ color: "#d9e5df", transparent: true, opacity: 0.16, roughness: 1, depthWrite: false });
  for (let index = 0; index < 26; index += 1) {
    const cloud = new THREE.Mesh(geometry, material);
    const angle = (index / 26) * Math.PI * 2 + (blueprint.seedHash % 31) * 0.07;
    const radius = 58 + (index % 5) * 11;
    cloud.position.set(Math.cos(angle) * radius, 29 + (index % 4) * 4, Math.sin(angle) * radius);
    cloud.scale.set(7 + (index % 3) * 2, 1.3 + (index % 2) * 0.6, 3 + (index % 4));
    group.add(cloud);
  }
  return group;
}

export function buildWorldScene(blueprint: WorldBlueprint): WorldSceneHandle {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(blueprint.atmosphere.fog);
  scene.fog = new THREE.FogExp2(blueprint.atmosphere.fog, 0.0095);
  const camera = new THREE.PerspectiveCamera(58, 16 / 9, 0.1, 420);
  const worldRoot = new THREE.Group();
  worldRoot.name = `World ${blueprint.seed}`;
  worldRoot.userData.seed = blueprint.seed;
  scene.add(createSky(blueprint), worldRoot);

  const hemisphere = new THREE.HemisphereLight(blueprint.atmosphere.sun, "#0a1a1b", 1.6);
  scene.add(hemisphere);
  const sun = new THREE.DirectionalLight(blueprint.atmosphere.sun, 3.25);
  sun.position.set(-52, 72, 34);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -90;
  sun.shadow.camera.right = 90;
  sun.shadow.camera.top = 90;
  sun.shadow.camera.bottom = -90;
  scene.add(sun);

  const terrain = createTerrain(blueprint);
  const waterMaterial = new THREE.MeshPhysicalMaterial({
    color: "#194f5a",
    roughness: 0.16,
    metalness: 0.16,
    transparent: true,
    opacity: 0.72,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const water = new THREE.Mesh(new THREE.PlaneGeometry(blueprint.terrain.size * 1.05, blueprint.terrain.size * 1.05, 1, 1), waterMaterial);
  water.rotation.x = -Math.PI / 2;
  water.position.y = blueprint.terrain.waterLevel;
  water.name = "World water";

  const { group: nexus, rings, core } = createNexus(blueprint);
  const fireflies = createFireflies(blueprint);
  const clouds = createClouds(blueprint);
  const path = createPath(blueprint);
  worldRoot.add(terrain, water, createForest(blueprint.trees), createInstancedDetails(blueprint), path, createBeacons(blueprint), nexus, fireflies, clouds);

  const playerMarker = new THREE.Group();
  playerMarker.name = "Surveyor marker";
  const locator = new THREE.Mesh(
    new THREE.TorusGeometry(0.9, 0.05, 6, 44),
    new THREE.MeshBasicMaterial({ color: "#d9f4b0", transparent: true, opacity: 0.78, depthWrite: false })
  );
  locator.rotation.x = Math.PI / 2;
  const drone = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.28, 0),
    new THREE.MeshStandardMaterial({ color: "#efffd3", emissive: "#75e7c0", emissiveIntensity: 1.2, metalness: 0.64, roughness: 0.18 })
  );
  drone.position.y = 0.52;
  playerMarker.add(locator, drone);
  worldRoot.add(playerMarker);

  const scanMaterial = new THREE.MeshBasicMaterial({ color: blueprint.atmosphere.aurora, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false });
  const scanRing = new THREE.Mesh(new THREE.RingGeometry(0.94, 1, 96), scanMaterial);
  scanRing.rotation.x = -Math.PI / 2;
  scanRing.position.y = 0.15;
  playerMarker.add(scanRing);

  const desiredCamera = new THREE.Vector3();
  const desiredTarget = new THREE.Vector3();
  const forward = new THREE.Vector3();

  function update(elapsed: number, snapshot: RuntimeSnapshot, reducedMotion: boolean): void {
    const motion = reducedMotion ? 0 : elapsed;
    const nexusPulse = snapshot.scanPulse;
    rings.forEach((ring, index) => {
      ring.rotation.y = motion * (0.12 + index * 0.05) + index * 0.72;
      ring.rotation.z = index * 0.27 + Math.sin(motion * 0.2 + index) * 0.14;
      ring.scale.setScalar(1 + nexusPulse * (0.06 + index * 0.025));
    });
    core.rotation.y = motion * 0.28;
    core.position.y = 5.25 + Math.sin(motion * 0.85) * (reducedMotion ? 0 : 0.22);
    core.scale.setScalar(1 + nexusPulse * 0.42);
    if (core.material instanceof THREE.MeshStandardMaterial) {
      core.material.emissiveIntensity = 2.8 + nexusPulse * 3.4;
    }
    waterMaterial.opacity = 0.69 + Math.sin(motion * 0.42) * (reducedMotion ? 0 : 0.025);
    clouds.rotation.y = motion * blueprint.atmosphere.wind * 0.003;
    if (path.material instanceof THREE.MeshBasicMaterial) {
      path.material.opacity = 0.58 + Math.sin(motion * 1.2) * (reducedMotion ? 0 : 0.12);
    }

    if (!reducedMotion) {
      const position = fireflies.geometry.attributes.position as THREE.BufferAttribute;
      const base = fireflies.userData.basePositions as Float32Array;
      for (let index = 0; index < position.count; index += 1) {
        position.setY(index, base[index * 3 + 1] + Math.sin(elapsed * 0.8 + index * 0.37) * 0.32);
      }
      position.needsUpdate = true;
    }

    playerMarker.position.set(snapshot.player.x, snapshot.player.y + 0.2, snapshot.player.z);
    playerMarker.rotation.y = snapshot.player.yaw;
    locator.rotation.z = motion * 0.3;
    scanMaterial.opacity = snapshot.scanPulse * 0.72;
    const scanScale = 1 + (1 - snapshot.scanPulse) * 18;
    scanRing.scale.setScalar(scanScale);

    forward.set(Math.sin(snapshot.player.yaw), snapshot.player.pitch * 0.82, Math.cos(snapshot.player.yaw)).normalize();
    desiredCamera.set(snapshot.player.x, snapshot.player.y + 4.8, snapshot.player.z).addScaledVector(forward, -8.4);
    desiredTarget.set(snapshot.player.x, snapshot.player.y + 2.5, snapshot.player.z).addScaledVector(forward, 13);
    const response = snapshot.frame < 2 ? 1 : 0.115;
    camera.position.lerp(desiredCamera, response);
    camera.lookAt(desiredTarget);
  }

  function dispose(): void {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.InstancedMesh) {
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      }
    });
  }

  return { scene, camera, worldRoot, nexusTarget: nexus, update, dispose };
}
