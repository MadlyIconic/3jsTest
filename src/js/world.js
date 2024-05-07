import * as THREE from 'three'

export class World extends THREE.Group {
    constructor(size = {width:32, height:16}, main){
        super();
        this.size = size;
        this.main = main;
    }

    generate(boxGeometry, boxMaterial){
        let self = this;
        self.setupWorld(self.size, boxGeometry, boxMaterial);
    }

    setupWorld(size, boxGeometry, boxMaterial){
        let self = this;
        let mesh = self.main.boxBuilder.buildInstanced(0x00d000, this.size);
        self.main.sceneRenderer.addToScene(mesh);
    }
}