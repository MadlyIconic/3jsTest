import * as THREE from 'three';
import { jest } from '@jest/globals';

jest.mock('../js/worldChunk', () => {
  return {
    WorldChunk: jest.fn().mockImplementation(() => {
      const { Object3D } = jest.requireActual('three');
      const chunk = new Object3D();
      chunk.position.set = jest.fn();
      chunk.userData = {};
      chunk.generate = jest.fn();
      chunk.disposeInstances = jest.fn();
      chunk.getBlock = jest.fn().mockReturnValue('mock-block');
      chunk.removeBlock = jest.fn();
      chunk.addBlockInstance = jest.fn();
      chunk.meshes = {};
      return chunk;
    }),
  };
});

jest.mock('../js/positionHelper', () => ({
  renderPosition: jest.fn(),
  renderText: jest.fn(),
  uuidv4: jest.fn().mockReturnValue('test-uuid'),
}));

import { World } from '../js/world';
import { WorldChunk } from '../js/worldChunk';

const createMain = () => ({
  sceneRenderer: { scene: new THREE.Scene() },
  lightingManager: {
    setUpAmbientLight: jest.fn(),
    setUpDirectionalLight: jest.fn().mockReturnValue({
      directionalLight: new THREE.DirectionalLight(),
      target: new THREE.Object3D(),
    }),
  },
  options: {
    chunkSize: { width: 16, height: 16 },
    params: { seed: 42 },
    ambientLightIntinsity: 0.7,
    directionalLightIntinsity: 0.6,
    skycolor: '#000000',
  },
});

describe('World', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('constructor initializes properties and scene fog', () => {
    const main = createMain();
    const world = new World(main);

    expect(world.main).toBe(main);
    expect(world.chunkSize).toEqual(main.options.chunkSize);
    expect(world.seed).toBe(42);
    expect(main.lightingManager.setUpAmbientLight).toHaveBeenCalledWith(true, 0.7);
    expect(main.lightingManager.setUpDirectionalLight).toHaveBeenCalledWith(true, 60, 75, 50, 0.6, true);
    expect(world.scene.fog).toBeInstanceOf(THREE.Fog);
    expect(world.uuidForMeshes.id).toBe('test-uuid');
  });

  test('worldToChunkCoords maps world coordinates to chunk and block positions', () => {
    const main = createMain();
    const world = new World(main);

    const result = world.worldToChunkCoords(20, 5, 20);

    expect(result).toEqual({
      chunk: { x: 1, z: 1 },
      block: { x: 4, y: 5, z: 4 },
    });
  });

  test('getChunksToAdd returns only chunks that are not already loaded', () => {
    const main = createMain();
    const world = new World(main);
    const chunk = new THREE.Object3D();
    chunk.userData = { x: 0, z: 0 };
    world.add(chunk);

    const visibleChunks = [{ x: 0, z: 0 }, { x: 1, z: 0 }];

    expect(world.getChunksToAdd(visibleChunks)).toEqual([{ x: 1, z: 0 }]);
  });

  test('getChunk returns the child chunk by coordinates', () => {
    const main = createMain();
    const world = new World(main);
    const chunk = new THREE.Object3D();
    chunk.userData = { x: 2, z: -1 };
    world.add(chunk);

    expect(world.getChunk(2, -1)).toBe(chunk);
    expect(world.getChunk(1, 0)).toBeUndefined();
  });

  test('generate creates chunks for draw distance and adds them via requestIdleCallback', () => {
    const main = createMain();
    const world = new World(main);
    world.drawDistance = 1;

    world.generate();
    expect(WorldChunk).toHaveBeenCalledTimes(9);
    expect(world.initialWorldLoaded).toBe(true);

    jest.runAllTimers();

    expect(world.loaded).toBe(true);
    expect(world.children.length).toBe(9);
    expect(world.children.every((child) => child.generate)).toBe(true);
  });

  test('removeUnusedChunks removes chunks not found in visible list', () => {
    const main = createMain();
    const world = new World(main);
    const keepChunk = new THREE.Object3D();
    keepChunk.userData = { x: 0, z: 0 };
    keepChunk.disposeInstances = jest.fn();
    keepChunk.meshes = {};
    const removeChunk = new THREE.Object3D();
    removeChunk.userData = { x: 1, z: 0 };
    removeChunk.disposeInstances = jest.fn();
    removeChunk.meshes = {};

    world.add(keepChunk);
    world.add(removeChunk);

    world.removeUnusedChunks([{ x: 0, z: 0 }]);

    expect(removeChunk.disposeInstances).toHaveBeenCalled();
    expect(world.getChunk(1, 0)).toBeUndefined();
    expect(world.getChunk(0, 0)).toBe(keepChunk);
  });

  test('getBlock returns block data only when loaded and chunk exists', () => {
    const main = createMain();
    const world = new World(main);
    const chunk = new THREE.Object3D();
    chunk.userData = { x: 0, z: 0 };
    chunk.getBlock = jest.fn().mockReturnValue('mock-block');
    world.add(chunk);
    world.loaded = true;

    expect(world.getBlock(0, 0, 0)).toBe('mock-block');
  });

  test('removeBlock delegates removal to chunk.removeBlock', () => {
    const main = createMain();
    const world = new World(main);
    const chunk = new THREE.Object3D();
    chunk.userData = { x: 0, z: 0 };
    chunk.removeBlock = jest.fn();
    world.add(chunk);

    world.removeBlock(0, 0, 0);

    expect(chunk.removeBlock).toHaveBeenCalledWith(0, 0, 0);
  });

  test('revealBlock delegates addition to chunk.addBlockInstance', () => {
    const main = createMain();
    const world = new World(main);
    const chunk = new THREE.Object3D();
    chunk.userData = { x: 0, z: 0 };
    chunk.addBlockInstance = jest.fn();
    world.add(chunk);

    world.revealBlock(0, 0, 0);

    expect(chunk.addBlockInstance).toHaveBeenCalledWith(0, 0, 0);
  });
});
