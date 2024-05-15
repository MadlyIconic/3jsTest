import * as THREE from 'three'
import { RNG } from './rng';
import { blocks } from './blocks';
import { uuidv4 } from './positionHelper';


export class WorldChunk extends THREE.Group {
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
        //console.log(main.options.params);
        this.size = size;
        this.main = main;
        this.params = main.options.params;
        this.uuidForMeshes = null;
        
    }

    generate(uuidcollection){
        let self = this;
        self.uuidForMeshes = uuidcollection;
        //self.main.sceneRenderer.scene.children = self.main.sceneRenderer.scene.children.filter((e) => e.name != "TheBlocks");
        self.setupWorld(self.size);
    }

    setupWorld(size){
        let self = this;
        const rng = new RNG(self.params.seed);
        
        let allButTheBlocks = self.main.sceneRenderer.scene.children
            .filter(function(element){
                if(!self.uuidForMeshes.uuids.has(element.uuid))   {
                    return true;
                }else{
                    return false;
                }
            })
            ;
        if(allButTheBlocks.length > 0){
            self.main.sceneRenderer.scene.children = allButTheBlocks;
        }
        
        self.main.boxBuilder.initialiseTerrain(size);
        self.main.boxBuilder.generateResources(size, rng);
        self.main.boxBuilder.generateTerrain(size, self.params, rng);
        let meshes = self.main.boxBuilder.generateMeshes(this.size);
        self.uuidForMeshes = {id:self.uuidForMeshes.id, uuids : new Map()};
        for (const mesh in meshes) {
            if (meshes.hasOwnProperty(mesh)) {
                if(meshes[mesh].isObject3D){
                    self.uuidForMeshes.uuids.set(meshes[mesh].uuid,true);
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

    disposeInstances(){
        this.traverse((obj) => {
            if(obj.dispose){
                obj.dispose();
            }
        });

        this.clear();
    }
}