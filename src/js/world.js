import * as THREE from 'three'
import { RNG } from './rng';


export class World extends THREE.Group {
    /**
     * @type {{
     *  id: number,
     * instanceId: number
     * }[][][]}
     * @param {*} size
     * @param {*} main
     */
    // data = [];
    constructor(size = {width:32, height:16}, main, params){
        super();
        console.log(params);
        this.size = size;
        this.main = main;
        this.params = params;
        
    }

    generate(boxGeometry, boxMaterial){
        let self = this;
        self.main.sceneRenderer.scene.children = self.main.sceneRenderer.scene.children.filter((e) => e.name != "TheBlocks");
        self.setupWorld(self.size, boxGeometry, boxMaterial);
    }

    setupWorld(size, boxGeometry, boxMaterial){
        let self = this;
        const rng = new RNG(self.params.seed);
        self.main.boxBuilder.initialiseTerrain(size);
        self.main.boxBuilder.generateResources(size, rng);
        self.main.boxBuilder.generateTerrain(size, self.params, rng);
        let mesh = self.main.boxBuilder.generateMeshes(this.size);
        self.main.sceneRenderer.addToScene(mesh);
    }
}