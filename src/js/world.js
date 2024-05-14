import * as THREE from 'three'
import { WorldChunk } from './worldChunk';

export class World extends THREE.Group {
    constructor(main){
        super();
        let self = this;
        self.main = main;
        self.chunkSize = main.options.chunkSize;
        self.seed = main.options.params.seed;
        self.params = main.options.params;
    }

    generate(){
        let self = this;
        // self.chunk = new WorldChunk(self.params.size,self.main);
        // self.chunk.generate();

        // this.add(self.chunk);
        this.disposeChunks();
        let iCountBottom = -1;
        let iCountTop = 1;
        for (let x = iCountBottom; x <= iCountTop; x++) {
            for (let z = iCountBottom; z <= iCountTop; z++) {
                const chunk = new WorldChunk(self.chunkSize, self.main);
                chunk.position.set(x * this.chunkSize.width, 0, z * this.chunkSize.width);
                chunk.userData = {x,z};
                chunk.generate();
                this.add(chunk);
                console.log('Added chunk', chunk.userData);
            }    
        }

        self.children.forEach(element => {
            console.log("User data: ", element.userData, " Position: ", element.position);
        });
    }

    getBlock(x,y,z,size){
        let self = this;
        
        return null; //self.chunk.get(x,y,z,size);
    }

    disposeChunks(){
        this.traverse((chunk) => {
            if(chunk.disposeInstances){
                chunk.disposeInstances();
            }
        })
    }
}