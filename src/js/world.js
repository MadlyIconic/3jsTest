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
    constructor(size = {width:32, height:16}, main, params){
        super();
        console.log(params);
        this.size = size;
        this.main = main;
        this.params = params;
        
    }

    generate(){
        let self = this;
        self.main.sceneRenderer.scene.children = self.main.sceneRenderer.scene.children.filter((e) => e.name != "TheBlocks");
        self.setupWorld(self.size);
    }

    setupWorld(size){
        let self = this;
        const rng = new RNG(self.params.seed);
        let allButTheBlocks = self.main.sceneRenderer.scene.children.filter((e) => e.type !== 'Mesh');
        if(allButTheBlocks.length > 0){
            self.main.sceneRenderer.scene.children = allButTheBlocks;
        }

        self.main.boxBuilder.initialiseTerrain(size);
        self.main.boxBuilder.generateResources(size, rng);
        self.main.boxBuilder.generateTerrain(size, self.params, rng);
        let meshes = self.main.boxBuilder.generateMeshes(this.size);
        for (const mesh in meshes) {
            if (meshes.hasOwnProperty(mesh)) {
                if(meshes[mesh].isObject3D){
                    self.main.sceneRenderer.addToScene(meshes[mesh]);          
                }
            }
        }
    }
}