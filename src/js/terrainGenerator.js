import * as THREE from 'three'
import {SimplexNoise} from 'three/examples/jsm/math/SimplexNoise.js'
import { blocks } from './blocks';

/**
 * Handles procedural terrain generation using Simplex noise
 */
export class TerrainGenerator {
    /**
     * @param {Object} params - Terrain generation parameters
     * @param {Object} params.terrain - Terrain specific params
     * @param {number} params.terrain.scale - Noise scale
     * @param {number} params.terrain.offset - Height offset
     * @param {number} params.terrain.magnitude - Height magnitude
     * @param {Object} size - Chunk size dimensions
     * @param {number} size.width - Chunk width
     * @param {number} size.height - Chunk height
     */
    constructor(params, size) {
        this.params = params;
        this.size = size;
    }

    /**
     * Generates terrain for a chunk
     * @param {Object} rng - Random number generator
     * @param {Array[][][]} data - 3D block data array to fill
     * @param {number} chunkX - Chunk X coordinate
     * @param {number} chunkZ - Chunk Z coordinate
     */
    generate(rng, data, chunkX, chunkZ) {
        const simplex = new SimplexNoise(rng);
        for (let x = 0; x < this.size.width; x++) {
            for (let z = 0; z < this.size.width; z++) {
                const value = simplex.noise(
                    (chunkX * this.size.width + x) / this.params.terrain.scale,
                    (chunkZ * this.size.width + z) / this.params.terrain.scale
                );
                
                const scaledNoise = this.params.terrain.offset + this.params.terrain.magnitude * value;
                let height = Math.floor(this.size.height * scaledNoise);
                height = Math.max(0, Math.min(height, this.size.height));

                for (let y = 0; y < this.size.height; y++) {
                                    
                    if(y < height && data[x][y][z].id === blocks.empty.id){
                        data[x][y][z].id = blocks.dirt.id;                    
                    }else if(y === height){
                        data[x][y][z].id = blocks.grass.id;                    
                    } else if(y > height){
                        data[x][y][z].id = blocks.empty.id;                    
                    }
                }
            }            
        }
    }
}