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

                let chunk = new WorldChunk(self.params.size,self.main);
                chunk.position.set(x * this.chunkSize.width, 0, z * this.chunkSize.width);
                let startVector2 = chunk.position;
                chunk.generate(self.uuidForMeshes, startVector2);
                self.uuidForMeshes = chunk.uuidForMeshes;
                self.add(chunk);
        
                self.clearuuids();
            }    
        }
    }

    getBlock(x,y,z,size){
        let self = this;
        
        return null; //self.chunk.get(x,y,z,size);
    }

    disposeChunks(){
        let self = this;
        self.traverse((chunk) => {

            if(chunk.disposeInstances){
                chunk.disposeInstances();
            }
        })
    }
}