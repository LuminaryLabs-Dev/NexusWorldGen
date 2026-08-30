"use client";

import { FormEvent, PointerEvent as ReactPointerEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { buildWorldScene, type WorldSceneHandle } from "@/src/render/build-world-scene";
import { createNexusWorldRuntime, type InputState, type NexusWorldRuntime } from "@/src/runtime/nexus-world-runtime";
import { generateWorldBlueprint } from "@/src/world/generate-world";
import type { RuntimeSnapshot } from "@/src/world/types";

const DEFAULT_SEED = "AURELIA-7";
const SEED_SEQUENCE = ["VIRIDIAN-42", "CINDER-09", "MORROW-88", "LUMEN-23", "AURELIA-7"];

const TUTORIAL = [
  { eyebrow: "FIELD PROTOCOL 00", title: "Enter the living atlas", body: "You are the Surveyor. Follow the luminous route to Nexus Prime and wake the signal network." },
  { eyebrow: "FIELD PROTOCOL 01", title: "Traverse the wilds", body: "Move with W A S D or the directional controls. Hold Shift to engage trail boost." },
  { eyebrow: "FIELD PROTOCOL 02", title: "Read the terrain", body: "Send a resonance scan with F. It reveals the nearest signal and maps your position." },
  { eyebrow: "FIELD PROTOCOL 03", title: "Open the world model", body: "Inspect the blueprint to see the deterministic systems behind this generated world." },
  { eyebrow: "FIELD PROTOCOL 04", title: "Reforge the frontier", body: "Generate another seeded world. Terrain, ecology, atmosphere, and routes will all change together." },
  { eyebrow: "EXPEDITION READY", title: "The atlas is yours", body: "Reach Nexus Prime, find all three signals, or keep forging worlds. Every seed is reproducible." }
] as const;

type RenderState = "booting" | "ready" | "fallback";

const INITIAL_SNAPSHOT: RuntimeSnapshot = {
  frame: 0,
  elapsed: 0,
  player: { x: 0, y: 0, z: 72, yaw: Math.PI, pitch: -0.08, speed: 0, distanceTravelled: 0 },
  distanceToNexus: 72,
  biome: "verdant",
  scanPulse: 0,
  tutorialStep: 0
};

function Icon({ name, size = 18 }: { name: "compass" | "scan" | "map" | "spark" | "menu" | "close" | "arrow" | "keyboard" | "sound"; size?: number }) {
  const paths: Record<typeof name, React.ReactNode> = {
    compass: <><circle cx="12" cy="12" r="8.5"/><path d="m15.4 8.6-2 4.8-4.8 2 2-4.8 4.8-2Z"/></>,
    scan: <><path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4"/><circle cx="12" cy="12" r="2.6"/><path d="M12 7.4v1.2M12 15.4v1.2M7.4 12h1.2M15.4 12h1.2"/></>,
    map: <><path d="m3.5 5.4 5-2.1 7 2.1 5-2.1v15.3l-5 2.1-7-2.1-5 2.1V5.4Z"/><path d="M8.5 3.3v15.3M15.5 5.4v15.3"/></>,
    spark: <><path d="m12 2 1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2Z"/><path d="m19 16 .6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6L19 16Z"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    keyboard: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h.01M11 9h.01M15 9h.01M18 9h.01M7 13h.01M11 13h.01M15 13h3M8 16h8"/></>,
    sound: <><path d="M5 9v6h4l5 4V5L9 9H5Z"/><path d="M17 9.2a4 4 0 0 1 0 5.6M19.5 6.8a7.4 7.4 0 0 1 0 10.4"/></>
  };
  return <svg aria-hidden="true" className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function formatDistance(value: number): string {
  return value < 10 ? `${value.toFixed(1)}m` : `${Math.round(value)}m`;
}

function biomeLabel(value: RuntimeSnapshot["biome"]): string {
  return { verdant: "Verdant Shelf", wetland: "Siltwater Mire", ember: "Ember Reach", alpine: "Glass Alpine" }[value];
}

function createRenderer(host: HTMLDivElement): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute("aria-label", "Playable generated 3D world");
  renderer.domElement.setAttribute("role", "img");
  host.appendChild(renderer.domElement);
  return renderer;
}

export function WorldExperience() {
  const [seed, setSeed] = useState(DEFAULT_SEED);
  const [seedInput, setSeedInput] = useState(DEFAULT_SEED);
  const [snapshot, setSnapshot] = useState<RuntimeSnapshot>(INITIAL_SNAPSHOT);
  const [renderState, setRenderState] = useState<RenderState>("booting");
  const [fps, setFps] = useState(0);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [tutorialVisible, setTutorialVisible] = useState(true);
  const [blueprintOpen, setBlueprintOpen] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scanMessage, setScanMessage] = useState("Signal lattice standing by");
  const [soundOn, setSoundOn] = useState(false);
  const [liveMessage, setLiveMessage] = useState("World generation initiated");

  const blueprint = useMemo(() => generateWorldBlueprint(seed), [seed]);
  const hostRef = useRef<HTMLDivElement>(null);
  const runtimeRef = useRef<NexusWorldRuntime | null>(null);
  const sceneRef = useRef<WorldSceneHandle | null>(null);
  const inputRef = useRef<InputState>({ forward: 0, strafe: 0, boost: false });
  const keyRef = useRef(new Set<string>());
  const viewRef = useRef({ yaw: blueprint.spawn.yaw, pitch: -0.08 });
  const pointerRef = useRef({ active: false, x: 0, y: 0 });
  const audioRef = useRef<AudioContext | null>(null);
  const tutorialStepRef = useRef(tutorialStep);
  const renderStateRef = useRef(renderState);

  useEffect(() => { tutorialStepRef.current = tutorialStep; }, [tutorialStep]);
  useEffect(() => { renderStateRef.current = renderState; }, [renderState]);
  useEffect(() => () => { void audioRef.current?.close(); }, []);

  const advanceTutorial = useCallback((minimumStep: number, nextStep: number) => {
    if (tutorialStepRef.current === minimumStep) {
      tutorialStepRef.current = nextStep;
      setTutorialStep(nextStep);
      runtimeRef.current?.setTutorialStep(nextStep);
      setTutorialVisible(true);
    }
  }, []);

  const syncInput = useCallback(() => {
    const keys = keyRef.current;
    inputRef.current = {
      forward: Number(keys.has("KeyW") || keys.has("ArrowUp")) - Number(keys.has("KeyS") || keys.has("ArrowDown")),
      strafe: Number(keys.has("KeyD") || keys.has("ArrowRight")) - Number(keys.has("KeyA") || keys.has("ArrowLeft")),
      boost: keys.has("ShiftLeft") || keys.has("ShiftRight")
    };
    runtimeRef.current?.setInput(inputRef.current);
  }, []);

  const performScan = useCallback(() => {
    runtimeRef.current?.scan();
    const current = runtimeRef.current?.snapshot();
    if (!current) return;
    const candidates = [
      { label: "Nexus Prime", distance: current.distanceToNexus },
      ...blueprint.beacons.map((beacon) => ({
        label: beacon.label,
        distance: Math.hypot(current.player.x - beacon.x, current.player.z - beacon.z)
      }))
    ].sort((a, b) => a.distance - b.distance);
    setScanMessage(`${candidates[0].label} · ${formatDistance(candidates[0].distance)}`);
    setLiveMessage(`Resonance scan complete. Nearest signal: ${candidates[0].label}, ${formatDistance(candidates[0].distance)}.`);
    advanceTutorial(2, 3);
  }, [advanceTutorial, blueprint.beacons]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.tagName === "INPUT") return;
      if (["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "ShiftLeft", "ShiftRight"].includes(event.code)) {
        event.preventDefault();
        keyRef.current.add(event.code);
        syncInput();
      }
      if (!event.repeat && event.code === "KeyF") performScan();
      if (!event.repeat && event.code === "KeyB") setBlueprintOpen((current) => !current);
      if (!event.repeat && event.code === "KeyH") setTutorialVisible((current) => !current);
    };
    const onKeyUp = (event: KeyboardEvent) => {
      keyRef.current.delete(event.code);
      syncInput();
    };
    const onBlur = () => { keyRef.current.clear(); syncInput(); };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [performScan, syncInput]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    setRenderState("booting");
    const runtime = createNexusWorldRuntime(blueprint);
    const worldScene = buildWorldScene(blueprint);
    runtimeRef.current = runtime;
    sceneRef.current = worldScene;
    viewRef.current = { yaw: blueprint.spawn.yaw, pitch: -0.08 };
    runtime.setView(viewRef.current.yaw, viewRef.current.pitch);
    runtime.setTutorialStep(tutorialStepRef.current);
    setSnapshot(runtime.snapshot());

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = createRenderer(host);
    } catch (error) {
      console.error("WebGL renderer unavailable", error);
      queueMicrotask(() => {
        setRenderState("fallback");
        setLiveMessage("3D acceleration is unavailable. World model details remain accessible.");
      });
      worldScene.dispose();
      return;
    }

    let animationFrame = 0;
    let previous = performance.now();
    let lastUiUpdate = 0;
    let frameCount = 0;
    let fpsStarted = previous;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      renderer.setSize(width, height, false);
      worldScene.camera.aspect = width / height;
      worldScene.camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    const animate = (now: number) => {
      const delta = Math.min(1 / 15, Math.max(1 / 240, (now - previous) / 1000));
      previous = now;
      runtime.setInput(inputRef.current);
      const current = runtime.tick(delta);
      worldScene.update(current.elapsed, current, reducedMotion);
      renderer.render(worldScene.scene, worldScene.camera);
      frameCount += 1;

      if (renderStateRef.current !== "ready") {
        renderStateRef.current = "ready";
        setRenderState("ready");
        setLiveMessage(`${blueprint.name} rendered and ready to explore.`);
      }
      if (now - lastUiUpdate > 110) {
        setSnapshot(current);
        lastUiUpdate = now;
        if (tutorialStepRef.current === 1 && current.player.distanceTravelled > 4) advanceTutorial(1, 2);
      }
      if (now - fpsStarted > 1000) {
        setFps(Math.round((frameCount * 1000) / (now - fpsStarted)));
        frameCount = 0;
        fpsStarted = now;
      }
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      renderer.dispose();
      renderer.domElement.remove();
      worldScene.dispose();
      runtimeRef.current = null;
      sceneRef.current = null;
    };
  }, [advanceTutorial, blueprint]);

  const rotateView = useCallback((deltaX: number, deltaY: number) => {
    viewRef.current.yaw -= deltaX * 0.0042;
    viewRef.current.pitch = THREE.MathUtils.clamp(viewRef.current.pitch - deltaY * 0.0035, -0.72, 0.42);
    runtimeRef.current?.setView(viewRef.current.yaw, viewRef.current.pitch);
  }, []);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointerRef.current = { active: true, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointerRef.current.active) return;
    rotateView(event.clientX - pointerRef.current.x, event.clientY - pointerRef.current.y);
    pointerRef.current = { active: true, x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointerRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const setMobileInput = (direction: keyof Pick<InputState, "forward" | "strafe">, value: number) => {
    inputRef.current = { ...inputRef.current, [direction]: value };
    runtimeRef.current?.setInput(inputRef.current);
  };

  const openBlueprint = () => {
    setBlueprintOpen(true);
    advanceTutorial(3, 4);
  };

  const reforge = useCallback((requestedSeed?: string) => {
    const normalized = requestedSeed?.trim().toUpperCase().slice(0, 32);
    const currentIndex = SEED_SEQUENCE.indexOf(seed);
    const nextSeed = normalized || SEED_SEQUENCE[(currentIndex + 1 + SEED_SEQUENCE.length) % SEED_SEQUENCE.length];
    setSeed(nextSeed);
    setSeedInput(nextSeed);
    setBlueprintOpen(false);
    setScanMessage("Signal lattice standing by");
    setLiveMessage(`Forging deterministic world seed ${nextSeed}.`);
    if (tutorialStepRef.current === 4) {
      tutorialStepRef.current = 5;
      setTutorialStep(5);
      setTutorialVisible(true);
    }
  }, [seed]);

  const submitSeed = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    reforge(seedInput);
  };

  const startTutorial = () => {
    setTutorialStep(1);
    tutorialStepRef.current = 1;
    runtimeRef.current?.setTutorialStep(1);
    setTutorialVisible(true);
    setLiveMessage("Field protocol started. Move forward to begin the survey.");
  };

  const restartTutorial = () => {
    setTutorialStep(0);
    tutorialStepRef.current = 0;
    setTutorialVisible(true);
  };

  const toggleSound = async () => {
    if (audioRef.current) {
      await audioRef.current.close();
      audioRef.current = null;
      setSoundOn(false);
      setLiveMessage("Ambient field audio disabled.");
      return;
    }
    const context = new AudioContext();
    const master = context.createGain();
    master.gain.value = 0.045;
    master.connect(context.destination);
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 520;
    filter.Q.value = 0.7;
    filter.connect(master);
    const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) {
      const envelope = Math.sin((index / data.length) * Math.PI);
      data[index] = (Math.sin(index * 12.9898 + blueprint.seedHash) * 43758.5453 % 1) * envelope * 0.18;
    }
    const wind = context.createBufferSource();
    wind.buffer = buffer;
    wind.loop = true;
    wind.connect(filter);
    wind.start();
    for (const [frequency, gain] of [[73, 0.11], [109, 0.055]] as const) {
      const oscillator = context.createOscillator();
      const oscillatorGain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency + (blueprint.seedHash % 7);
      oscillatorGain.gain.value = gain;
      oscillator.connect(oscillatorGain).connect(master);
      oscillator.start();
    }
    await context.resume();
    audioRef.current = context;
    setSoundOn(true);
    setLiveMessage("Ambient field audio enabled.");
  };

  const progress = tutorialStep === 0 ? 0 : Math.min(100, (tutorialStep / (TUTORIAL.length - 1)) * 100);

  return (
    <main className="experience-shell" data-render-ready={renderState === "ready"} data-seed={blueprint.seed}>
      <a className="skip-link" href="#expedition-controls">Skip to controls</a>
      <div
        ref={hostRef}
        className="world-canvas"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {renderState === "booting" && (
          <div className="boot-screen" role="status">
            <div className="boot-glyph"><span/><span/><span/></div>
            <p>Forging terrain lattice</p>
            <small>{blueprint.stats.terrainVertices.toLocaleString()} vertices · deterministic seed {blueprint.seed}</small>
          </div>
        )}
        {renderState === "fallback" && (
          <div className="fallback-world">
            <Icon name="compass" size={42}/>
            <h1>{blueprint.name}</h1>
            <p>The 3D renderer could not start, but the complete deterministic world model remains available in Blueprint.</p>
            <button className="primary-action" onClick={openBlueprint}>Open world model</button>
          </div>
        )}
      </div>

      <div className="atmosphere-vignette" aria-hidden="true"/>
      <div className="grain" aria-hidden="true"/>

      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark"><span/><span/><span/></div>
          <div>
            <strong>NEXUS</strong><span>WORLDGEN</span>
          </div>
          <i>FIELD ATLAS / 01</i>
        </div>
        <div className="topbar-center" aria-label="World status">
          <span className={`status-dot ${renderState}`}/>
          <span>{renderState === "ready" ? "WORLD ONLINE" : renderState === "fallback" ? "MODEL ONLINE" : "SYNTHESIZING"}</span>
          <b>{fps || "—"} FPS</b>
        </div>
        <nav className="topbar-actions" aria-label="Expedition tools">
          <button className="tool-button" onClick={() => void toggleSound()} aria-pressed={soundOn} aria-label={soundOn ? "Mute ambient sound" : "Enable ambient sound"}>
            <Icon name="sound"/>
          </button>
          <button className="text-tool" onClick={() => setControlsOpen(true)}><Icon name="keyboard"/> CONTROLS</button>
          <button className="text-tool" onClick={openBlueprint}><Icon name="map"/> BLUEPRINT</button>
          <button className="mobile-menu-button" onClick={() => setMobileMenuOpen((value) => !value)} aria-expanded={mobileMenuOpen} aria-label="Open expedition menu"><Icon name={mobileMenuOpen ? "close" : "menu"}/></button>
        </nav>
      </header>

      <section className="world-identity" aria-labelledby="world-title">
        <span className="coordinate-rule">SEED / {blueprint.seed}</span>
        <h1 id="world-title">{blueprint.name}</h1>
        <p>{blueprint.tagline}</p>
        <div className="world-tags">
          <span>PROCEDURAL</span><span>DETERMINISTIC</span><span>{blueprint.stats.biomeCount} BIOMES</span>
        </div>
      </section>

      <aside className={`mission-panel ${mobileMenuOpen ? "mobile-open" : ""}`} aria-label="Current expedition">
        <div className="panel-kicker"><span>ACTIVE EXPEDITION</span><b>01 / 01</b></div>
        <div className="mission-symbol"><Icon name="compass" size={25}/><span/></div>
        <h2>Wake Nexus Prime</h2>
        <p>Follow the aurora route through the living terrain and reach the dormant world anchor.</p>
        <div className="mission-meter"><span style={{ width: `${Math.max(2, 100 - (snapshot.distanceToNexus / 72) * 100)}%` }}/></div>
        <dl>
          <div><dt>RANGE</dt><dd>{formatDistance(snapshot.distanceToNexus)}</dd></div>
          <div><dt>REGION</dt><dd>{biomeLabel(snapshot.biome)}</dd></div>
        </dl>
        <button className="scan-button" onClick={performScan}><Icon name="scan"/> RESONANCE SCAN <kbd>F</kbd></button>
        <small className="scan-result">{scanMessage}</small>
      </aside>

      <section className="telemetry-strip" aria-label="Live world telemetry">
        <div><span>ALTITUDE</span><strong>{snapshot.player.y.toFixed(1)}m</strong></div>
        <div><span>VELOCITY</span><strong>{snapshot.player.speed.toFixed(1)}m/s</strong></div>
        <div><span>CLIMATE</span><strong>{blueprint.atmosphere.temperature}°C</strong></div>
        <div><span>TRAVERSED</span><strong>{snapshot.player.distanceTravelled.toFixed(0)}m</strong></div>
      </section>

      <div className="compass-rail" aria-hidden="true">
        <span>W</span><i/><span>NW</span><i/><b>N</b><i/><span>NE</span><i/><span>E</span>
        <em style={{ transform: `translateX(${Math.sin(snapshot.player.yaw) * 68}px)` }}/>
      </div>

      <section id="expedition-controls" className="desktop-hint" aria-label="Quick controls">
        <span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> MOVE</span>
        <span><span className="mouse-icon"/> DRAG TO LOOK</span>
        <span><kbd>⇧</kbd> BOOST</span>
        <button onClick={() => setTutorialVisible(true)}>FIELD GUIDE <kbd>H</kbd></button>
      </section>

      <section className="mobile-controls" aria-label="Touch movement controls">
        <div className="touch-pad">
          <button aria-label="Move forward" onPointerDown={() => setMobileInput("forward", 1)} onPointerUp={() => setMobileInput("forward", 0)} onPointerCancel={() => setMobileInput("forward", 0)}>▲</button>
          <button aria-label="Move left" onPointerDown={() => setMobileInput("strafe", -1)} onPointerUp={() => setMobileInput("strafe", 0)} onPointerCancel={() => setMobileInput("strafe", 0)}>◀</button>
          <button aria-label="Move backward" onPointerDown={() => setMobileInput("forward", -1)} onPointerUp={() => setMobileInput("forward", 0)} onPointerCancel={() => setMobileInput("forward", 0)}>▼</button>
          <button aria-label="Move right" onPointerDown={() => setMobileInput("strafe", 1)} onPointerUp={() => setMobileInput("strafe", 0)} onPointerCancel={() => setMobileInput("strafe", 0)}>▶</button>
        </div>
        <button className="mobile-scan" onClick={performScan} aria-label="Resonance scan"><Icon name="scan" size={23}/></button>
      </section>

      {tutorialVisible && (
        <section className={`tutorial-card step-${tutorialStep}`} role={tutorialStep === 0 ? "dialog" : "region"} aria-labelledby="tutorial-title">
          <div className="tutorial-progress"><span style={{ width: `${progress}%` }}/></div>
          <button className="panel-close" onClick={() => setTutorialVisible(false)} aria-label="Close field guide"><Icon name="close"/></button>
          <span className="tutorial-kicker">{TUTORIAL[tutorialStep].eyebrow}</span>
          <h2 id="tutorial-title">{TUTORIAL[tutorialStep].title}</h2>
          <p>{TUTORIAL[tutorialStep].body}</p>
          {tutorialStep === 0 && <button className="primary-action" onClick={startTutorial}>BEGIN EXPEDITION <Icon name="arrow"/></button>}
          {tutorialStep > 0 && tutorialStep < 5 && <small>STEP {tutorialStep} OF 4 · The guide advances as you act</small>}
          {tutorialStep === 5 && <button className="secondary-action" onClick={() => setTutorialVisible(false)}>EXPLORE FREELY</button>}
          {tutorialStep === 0 && <button className="skip-tutorial" onClick={() => { setTutorialStep(5); tutorialStepRef.current = 5; setTutorialVisible(false); }}>SKIP TUTORIAL</button>}
        </section>
      )}

      {blueprintOpen && (
        <div className="panel-scrim" onMouseDown={(event) => { if (event.target === event.currentTarget) setBlueprintOpen(false); }}>
          <aside className="blueprint-panel" role="dialog" aria-modal="true" aria-labelledby="blueprint-title">
            <button className="panel-close" onClick={() => setBlueprintOpen(false)} aria-label="Close world blueprint"><Icon name="close"/></button>
            <span className="panel-kicker-text">DETERMINISTIC WORLD MODEL</span>
            <h2 id="blueprint-title">{blueprint.name}</h2>
            <p className="blueprint-intro">One seed drives a complete, reproducible terrain lattice, biome map, landmark network, ecology, atmosphere, and traversable route.</p>
            <div className="seed-console">
              <label htmlFor="seed-input">WORLD SEED</label>
              <form onSubmit={submitSeed}>
                <input id="seed-input" value={seedInput} onChange={(event) => setSeedInput(event.target.value)} maxLength={32}/>
                <button type="submit">FORGE</button>
              </form>
            </div>
            <div className="world-stat-grid">
              <div><span>TERRAIN</span><strong>{blueprint.stats.terrainVertices.toLocaleString()}</strong><small>vertices</small></div>
              <div><span>ECOLOGY</span><strong>{(blueprint.stats.treeCount + blueprint.stats.rockCount).toLocaleString()}</strong><small>instances</small></div>
              <div><span>SIGNALS</span><strong>{blueprint.beacons.length + 1}</strong><small>landmarks</small></div>
              <div><span>GLIMMERS</span><strong>{blueprint.stats.fireflyCount}</strong><small>particles</small></div>
            </div>
            <div className="system-stack">
              <div><i style={{ background: blueprint.atmosphere.aurora }}/><span><b>TERRAIN LATTICE</b><small>Fractal elevation, basin, ridge, river, coast</small></span><em>ONLINE</em></div>
              <div><i style={{ background: "#75b987" }}/><span><b>BIOME ECOLOGY</b><small>Verdant, wetland, ember, alpine</small></span><em>ONLINE</em></div>
              <div><i style={{ background: "#d99064" }}/><span><b>LANDMARK GRAPH</b><small>Nexus Prime plus three signal beacons</small></span><em>ONLINE</em></div>
              <div><i style={{ background: "#8cd9f0" }}/><span><b>NEXUSENGINE ECS</b><small>Input, simulation, resolve, cleanup phases</small></span><em>ROOT</em></div>
            </div>
            <button className="reforge-button" onClick={() => reforge()}><Icon name="spark"/> REFORGE NEXT FRONTIER</button>
            <p className="model-note">This demo generates a world model in-browser. It does not claim to reconstruct geometry from an uploaded image.</p>
          </aside>
        </div>
      )}

      {controlsOpen && (
        <div className="panel-scrim" onMouseDown={(event) => { if (event.target === event.currentTarget) setControlsOpen(false); }}>
          <aside className="controls-panel" role="dialog" aria-modal="true" aria-labelledby="controls-title">
            <button className="panel-close" onClick={() => setControlsOpen(false)} aria-label="Close controls"><Icon name="close"/></button>
            <span className="panel-kicker-text">SURVEYOR INPUT MAP</span>
            <h2 id="controls-title">Expedition controls</h2>
            <div className="control-list">
              <div><span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></span><p><b>Traverse</b><small>Move across the terrain</small></p></div>
              <div><span><kbd>DRAG</kbd></span><p><b>Look</b><small>Rotate the survey camera</small></p></div>
              <div><span><kbd>⇧</kbd></span><p><b>Trail boost</b><small>Accelerate movement</small></p></div>
              <div><span><kbd>F</kbd></span><p><b>Resonance scan</b><small>Locate the nearest signal</small></p></div>
              <div><span><kbd>B</kbd></span><p><b>Blueprint</b><small>Inspect or reforge the world</small></p></div>
              <div><span><kbd>H</kbd></span><p><b>Field guide</b><small>Show or hide the tutorial</small></p></div>
            </div>
            <button className="secondary-action" onClick={() => { setControlsOpen(false); restartTutorial(); }}>REPLAY FIELD GUIDE</button>
          </aside>
        </div>
      )}

      <p className="sr-only" role="status" aria-live="polite">{liveMessage}</p>
    </main>
  );
}
