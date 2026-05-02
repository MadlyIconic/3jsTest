import * as THREE from 'three'
import {SimplexNoise} from 'three/examples/jsm/math/SimplexNoise.js'
import { blocks } from './blocks';

export class TerrainGenerator {
    constructor(params, size) {
        this.params = params;
        this.size = size;
    }

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