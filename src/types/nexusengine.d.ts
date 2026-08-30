declare module "nexusengine" {
  export type Definition = Readonly<{ kind: string; name: string }>;

  export type NexusWorld = {
    addEntity(): number;
    removeEntity(entity: number): boolean;
    setComponent<T>(entity: number, component: Definition, value: T): T;
    getComponent<T>(entity: number, component: Definition): T;
    hasComponent(entity: number, component: Definition): boolean;
    removeComponent(entity: number, component: Definition): boolean;
    setResource<T>(resource: Definition, value: T): T;
    getResource<T>(resource: Definition): T | undefined;
    hasResource(resource: Definition): boolean;
    removeResource(resource: Definition): boolean;
    emit<T>(event: Definition, payload: T): T;
    readEvents<T>(event: Definition): T[];
    clearEvents(event: Definition): void;
    query(...components: Definition[]): number[];
    entityCount: number;
  };

  export type NexusEngine = {
    world: NexusWorld;
    scheduler: {
      phases: string[];
      addPhase(name: string): unknown;
      addSystem(phaseName: string, system: (world: NexusWorld) => void): unknown;
    };
    clock: { delta: number; elapsed: number; frame: number };
    tick(delta?: number): NexusWorld;
    getLastTickCommit(): unknown;
    isTicking(): boolean;
  };

  export function createEngine(options?: Record<string, unknown>): NexusEngine;
  export function defineComponent(name: string): Definition;
  export function defineResource(name: string): Definition;
  export function defineEvent(name: string): Definition;
}
