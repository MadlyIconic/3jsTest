import * as THREE from 'three'
import { WorldChunk } from './worldChunk';
import { uuidv4 } from './positionHelper';

export class World extends THREE.Group {
    constructor(main){
        super();
        let self = this;
        self.main = main;
        self.chunkSize = main.options.chunkSize;
        self.seed = main.options.params.seed;
        self.params = main.options.params;
        self.uuidForMeshes = {
            id: uuidv4(),
            uuids: new Map()
        }; 
    }

    clearuuids(){
        let self = this;
        self.uuidForMeshes = {
            id: uuidv4(),
            uuids: new Map()
        };
    }

    generate(){
        let self = this;
        self.disposeChunks();
        let iCountBottom = -1;
        let iCountTop = 1;
        for (let x = iCountBottom; x <= iCountTop; x++) {
            for (let z = iCountBottom; z <= iCountTop; z++) {

                let chunk = new WorldChunk(this.chunkSize,self.main);
                chunk.position.set(x * this.chunkSize.width, 0, z * this.chunkSize.width);
                let startVector2 = chunk.position;
                chunk.userData = {x,z};
                chunk.generate(self.uuidForMeshes, startVector2);
                self.uuidForMeshes = chunk.uuidForMeshes;
                self.add(chunk);
        
                self.clearuuids();
            }    
        }
    }

    getBlock(x,y,z,size){
        let self = this;
        const coords = self.worldToChunkCoords(x,y,z)
        const chunk = self.getChunk(coords.chunk.x, coords.chunk.z);
        let block = null;
        if(chunk){
            block = chunk.getBlock(
                coords.block.x,
                coords.block.y,
                coords.block.z,
                size
            )
        }
        return block; //self.chunk.get(x,y,z,size);
    }

    /**
     * @param {*} x 
     * @param {*} y 
     * @param {*} z 
     * @returns {{
     *      chunk: {x: number, z: number},
     *      block: {x: number, y: number, z: number}
     * }}
     */
    worldToChunkCoords(x,y,z){
        const chunkCoords = {
            x: Math.floor(x / this.chunkSize.width),
            z: Math.floor(z / this.chunkSize.width),
        }

        const blockCoords = {
            x: x - this.chunkSize.width * chunkCoords.x,
            y: y,
            z: z - this.chunkSize.width * chunkCoords.z
        }

        return {
            chunk: chunkCoords,
            block: blockCoords
        }
    }

    /**
     * @param {*} chunkX 
     * @param {*} chunkZ 
     * @returns {WorldChunk | null}
     */
    getChunk(chunkX, chunkZ){

        let findChunk = function(chunk){
            let x =  chunk.userData.x;
            let z =  chunk.userData.z;
            if(x === chunkX && z === chunkZ){
                return true;
            }else{
                return false;
            }
        }

        let chunk = this.children.find(findChunk)

        return chunk;
    }

    disposeChunks(){
        let self = this;
        self.traverse((chunk) => {
            if(chunk.disposeInstances){
                chunk.disposeInstances();
            }
        })
        this.clear();
    }
}