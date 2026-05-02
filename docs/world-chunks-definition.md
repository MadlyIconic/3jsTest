# World and World Chunks Definition

## Overview
The Blockworld application implements a voxel-based world system divided into chunks for efficient rendering and management. This document explains how the world is structured, how chunks are generated and managed, and the supporting systems for terrain generation and spatial optimization.

## World Class Architecture
The `World` class (`src/js/world.js`) serves as the central manager for the entire game world:

```javascript
export default class World extends THREE.Group {
    constructor(runInstance) {
        super();
        this.runInstance = runInstance;
        this.chunks = new Map();
        this.spatialHash = new SpatialHash(16); // Grid size for collision optimization
        this.terrainGenerator = new TerrainGenerator();
    }

    generate() {
        // Generate initial chunks around origin
        for (let x = -this.runInstance.options.worldwidth; x <= this.runInstance.options.worldwidth; x++) {
            for (let z = -this.runInstance.options.worldwidth; z <= this.runInstance.options.worldwidth; z++) {
                this.createChunk(x, 0, z);
            }
        }
    }

    createChunk(x, y, z) {
        const chunk = new WorldChunk(x, y, z, this);
        this.chunks.set(`${x},${y},${z}`, chunk);
        this.add(chunk);
        chunk.setupWorld();
    }

    removeBlock(x, y, z) {
        // Find chunk containing the block and remove it
        const chunkCoords = this.getChunkCoords(x, y, z);
        const chunk = this.chunks.get(`${chunkCoords.x},${chunkCoords.y},${chunkCoords.z}`);
        if (chunk) {
            chunk.removeBlock(x - chunkCoords.x * 16, y - chunkCoords.y * 16, z - chunkCoords.z * 16);
        }
    }
}
```

Key responsibilities:
- **Chunk Management**: Maintains a Map of WorldChunk instances keyed by coordinates
- **Spatial Hashing**: Uses a SpatialHash for O(1) collision queries instead of O(n) brute force
- **Terrain Generation**: Delegates to TerrainGenerator for procedural content
- **Block Operations**: Handles adding/removing blocks across chunk boundaries

## WorldChunk Class Structure
Each `WorldChunk` (`src/js/worldChunk.js`) represents a 16x16x16 block section of the world:

```javascript
export default class WorldChunk extends THREE.Group {
    constructor(x, y, z, world) {
        super();
        this.world = world;
        this.chunkX = x;
        this.chunkY = y;
        this.chunkZ = z;
        this.blocks = new Array(16 * 16 * 16).fill(0); // Block data array
        this.mesh = null;
    }

    setupWorld() {
        this.generateTerrain();
        this.createMeshes();
        this.populateSpatialHash();
    }

    generateTerrain() {
        // Use TerrainGenerator to fill blocks array
        for (let x = 0; x < 16; x++) {
            for (let z = 0; z < 16; z++) {
                const worldX = this.chunkX * 16 + x;
                const worldZ = this.chunkZ * 16 + z;
                const height = this.world.terrainGenerator.generateHeight(worldX, worldZ);
                
                for (let y = 0; y < Math.min(height, 16); y++) {
                    this.setBlock(x, y, z, 1); // Set block type
                }
            }
        }
    }

    createMeshes() {
        // Generate Three.js mesh from blocks array
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        this.mesh = new THREE.InstancedMesh(geometry, material, this.getBlockCount());
        
        let instanceIndex = 0;
        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 16; y++) {
                for (let z = 0; z < 16; z++) {
                    if (this.getBlock(x, y, z) !== 0) {
                        const matrix = new THREE.Matrix4();
                        matrix.setPosition(x, y, z);
                        this.mesh.setMatrixAt(instanceIndex++, matrix);
                    }
                }
            }
        }
        this.add(this.mesh);
    }

    populateSpatialHash() {
        // Add all blocks to world's spatial hash for collision detection
        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 16; y++) {
                for (let z = 0; z < 16; z++) {
                    if (this.getBlock(x, y, z) !== 0) {
                        const worldX = this.chunkX * 16 + x;
                        const worldY = this.chunkY * 16 + y;
                        const worldZ = this.chunkZ * 16 + z;
                        this.world.spatialHash.insert(worldX, worldY, worldZ);
                    }
                }
            }
        }
    }

    removeBlock(localX, localY, localZ) {
        this.setBlock(localX, localY, localZ, 0);
        // Update mesh and spatial hash
        this.updateMesh();
        this.world.spatialHash.remove(this.chunkX * 16 + localX, this.chunkY * 16 + localY, this.chunkZ * 16 + localZ);
    }
}
```

Key features:
- **Block Storage**: Uses a flat array for 16³ block data (4096 elements)
- **Mesh Generation**: Creates InstancedMesh for efficient rendering of multiple identical blocks
- **Spatial Integration**: Populates the world's spatial hash for fast collision queries
- **Dynamic Updates**: Supports block removal with mesh and hash updates

## TerrainGenerator Class
The `TerrainGenerator` (`src/js/terrainGenerator.js`) handles procedural world generation:

```javascript
export default class TerrainGenerator {
    constructor() {
        this.noise = new SimplexNoise();
        this.params = {
            scale: 0.05,
            amplitude: 8,
            baseHeight: 4
        };
    }

    generateHeight(x, z) {
        const noiseValue = this.noise.noise2D(x * this.params.scale, z * this.params.scale);
        return Math.floor(this.params.baseHeight + noiseValue * this.params.amplitude);
    }
}
```

Responsibilities:
- **Noise Generation**: Uses SimplexNoise for natural-looking terrain
- **Height Calculation**: Determines block height at each (x,z) coordinate
- **Configurable Parameters**: Scale, amplitude, and base height for terrain variety

## SpatialHash for Collision Optimization
The `SpatialHash` class provides O(1) collision detection:

```javascript
export default class SpatialHash {
    constructor(cellSize) {
        this.cellSize = cellSize;
        this.grid = new Map();
    }

    getKey(x, y, z) {
        const cellX = Math.floor(x / this.cellSize);
        const cellY = Math.floor(y / this.cellSize);
        const cellZ = Math.floor(z / this.cellSize);
        return `${cellX},${cellY},${cellZ}`;
    }

    insert(x, y, z) {
        const key = this.getKey(x, y, z);
        if (!this.grid.has(key)) {
            this.grid.set(key, new Set());
        }
        this.grid.get(key).add(`${x},${y},${z}`);
    }

    query(x, y, z, radius = 1) {
        const results = [];
        for (let dx = -radius; dx <= radius; dx++) {
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dz = -radius; dz <= radius; dz++) {
                    const key = this.getKey(x + dx * this.cellSize, y + dy * this.cellSize, z + dz * this.cellSize);
                    const cell = this.grid.get(key);
                    if (cell) {
                        results.push(...cell);
                    }
                }
            }
        }
        return results;
    }

    remove(x, y, z) {
        const key = this.getKey(x, y, z);
        const cell = this.grid.get(key);
        if (cell) {
            cell.delete(`${x},${y},${z}`);
        }
    }
}
```

Benefits:
- **Performance**: Reduces collision checks from O(n) to O(1) average case
- **Memory Efficient**: Groups nearby blocks in grid cells
- **Dynamic**: Supports insertion and removal of blocks

## World Generation Flow
1. **World Creation**: World initializes with empty chunk map and spatial hash
2. **Chunk Generation**: For each coordinate in world bounds, create WorldChunk
3. **Terrain Population**: Each chunk uses TerrainGenerator to fill block array
4. **Mesh Creation**: Convert block data to Three.js InstancedMesh for rendering
5. **Spatial Indexing**: Add all blocks to spatial hash for physics queries
6. **Integration**: Add chunk meshes to world's Three.js Group for scene rendering

## Block Data Structure
Blocks are represented as integers in the chunks' flat array:
- `0`: Air/empty
- `1`: Solid block (grass, dirt, etc.)
- Future: Additional types for different materials

This system enables efficient world streaming, collision detection, and dynamic block modification while maintaining good performance for large worlds.