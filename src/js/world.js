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

    setupWorld(boxGeometry, boxMaterial){
        let self = this;
        let maxCount = this.size.width * this.size.width * this.size.height;
        let mesh = new THREE.InstancedMesh(boxGeometry, boxMaterial, maxCount);
        mesh.count = 0;

        const matrix  = new THREE.Matrix4();

        for (let x = 0; x < self.size.width; x++) {
            for (let y = 0; y < self.size.height; y++) {
                for (let z = 0; z < self.size.width; z++) {
                    matrix.setPosition(x+0.5,y+0.5,z+0.5);
                    mesh.setMatrixAt(mesh.count++, matrix);   
                }
            }
        }
        self.main.sceneRenderer.addToScene(mesh);
    }
}