import * as THREE from 'three'
import { RNG } from './rng';
import { blocks } from './blocks';


export class World extends THREE.Group {
    /**
     * @type {{
     *  id: number,
     * instanceId: number
     * }[][][]}
     * @param {*} size
     * @param {*} main
     */
    constructor(size = {width:32, height:16}, main){
        super();
        console.log(main.options.params);
        this.size = size;
        this.main = main;
        this.params = main.options.params;
        this.uuidForMeshes = new Map();
        
    }

    generate(){
        let self = this;
        self.main.sceneRenderer.scene.children = self.main.sceneRenderer.scene.children.filter((e) => e.name != "TheBlocks");
        self.setupWorld(self.size);
    }

    setupWorld(size){
        let self = this;
        const rng = new RNG(self.params.seed);
        
        let allButTheBlocks = self.main.sceneRenderer.scene.children
            .filter(function(element){
                if(!self.uuidForMeshes.has(element.uuid))   {
                    return true;
                }else{
                    return false;
                }
            }
                //(e) => e => !self.uuid[e.uuid]
            );
        if(allButTheBlocks.length > 0){
            self.main.sceneRenderer.scene.children = allButTheBlocks;
        }
        self.uuidForMeshes = new Map();
        self.main.boxBuilder.initialiseTerrain(size);
        self.main.boxBuilder.generateResources(size, rng);
        self.main.boxBuilder.generateTerrain(size, self.params, rng);
        let meshes = self.main.boxBuilder.generateMeshes(this.size);
        for (const mesh in meshes) {
            if (meshes.hasOwnProperty(mesh)) {
                if(meshes[mesh].isObject3D){
                    self.uuidForMeshes.set(meshes[mesh].uuid,true);
                    self.main.sceneRenderer.addToScene(meshes[mesh]);          
                }
            }
        }
    }

    getBlock(x,y,z,size){
        let self = this;
        let block = self.main.boxBuilder.getBlock(x,y,z,size);
        return block;
    }
}