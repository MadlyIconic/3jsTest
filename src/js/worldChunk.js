import * as THREE from 'three'
import { RNG } from './rng';
import {SimplexNoise} from 'three/examples/jsm/math/SimplexNoise.js'
import { blocks, resources } from './blocks';


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
        this.size = size;
        this.main = main;
        this.params = main.options.params;
        this.uuidForMeshes = null;        
    }

    generate(uuidcollection, startVector, runBefore){
        let self = this;
        self.disposeInstances();
        self.uuidForMeshes = uuidcollection;
        if(runBefore !== true){
            self.setupWorld(self.size, startVector);
        }
    }

    setupWorld(size, startVector){
        let self = this;
        const rng = new RNG(self.params.seed);
        
        // let allButTheBlocks = self.main.sceneRenderer.scene.children
        //     .filter(function(element){
        //         if(!self.uuidForMeshes.uuids.has(element.uuid))   {
        //             return true;
        //         }else{
        //             return false;
        //         }
        //     })
        //     ;
        // if(allButTheBlocks.length > 0){
        //     self.main.sceneRenderer.scene.children = allButTheBlocks;
        // }
        
        self.initialiseTerrain(size, startVector);
        self.generateResources(size, rng, startVector);
        self.generateTerrain(size, self.params, rng, startVector);
        let meshes = self.generateMeshes(this.size, startVector);
        self.uuidForMeshes = {id:self.uuidForMeshes.id, uuids : new Map()};
        for (const mesh in meshes) {
            if (meshes.hasOwnProperty(mesh)) {
                if(meshes[mesh].isObject3D){
                    meshes[mesh].userData = 'TerrainMesh';
                    self.uuidForMeshes.uuids.set(meshes[mesh].uuid,true);
                    self.main.sceneRenderer.addToScene(meshes[mesh]);          
                }
            }
        }
    }

    getBlock(x,y,z, size, startVector){
        let self = this;
        if(self.inBounds(x,y,z, size, startVector)){
            return self.data[x][y][z];
        }else{
            return null;
        }
    }

    setBlockId(x,y,z,id, size, startVector){
        let self = this;
        if(self.inBounds(x,y,z, size, startVector)){
            self.data[x][y][z].id = id;
        }
    }

    inBounds(x,y,z, size, startVector){
        if(x >= 0 && x < size.width &&
            y >= 0 && y < size.height &&
            z >= 0 && z < size.width){
            return true;
        }else{
            return false;
        }
    }

    setBlockInstanceId(x,y,z,instanceId, size, startVector){
        let self = this;
        if(self.inBounds(x,y,z, size, startVector)){
            self.data[x][y][z].instanceId = instanceId;
        }
    }

    initialiseTerrain(size,startVector){
        let self = this;
        self.data = [];
        for (let x = 0; x < size.width; x++) {
            const slice = [];
            for (let y = 0; y < size.height; y++) {
                const row = [];
                for (let z = 0; z < size.width; z++) {
                    row.push({
                        id: blocks.empty.id,
                        instanceId: null
                    })
                }
                slice.push(row);
            }
            self.data.push(slice);
        }   
    }
    generateResources(size, rng, startVector){        
        const simplex = new SimplexNoise(rng);
        resources.forEach(resource => {
            this.generateResourceType(resource, size, simplex, startVector);
        });
        
    }

    generateResourceType(resource, size, simplex, startVector){
        for (let x = 0; x < size.width; x++) {
            for (let y = 0; y < size.height; y++) {
                for (let z = 0; z < size.width ; z++) {
    
                    const value = simplex.noise3d(
                       (this.position.x + x) / resource.scale.x,
                       (this.position.y + y) / resource.scale.y,
                       (this.position.z + z) / resource.scale.z
                    );

                    if(value > resource.scarcity){
                        this.setBlockId(x,y,z,resource.id,size, startVector);
                    }
                }   
            }
        }
    }

    generateTerrain(size, params, rng, startVector){        
        const simplex = new SimplexNoise(rng);
        for (let x = 0; x < size.width; x++) {
            for (let z = 0; z < size.width; z++) {
                const value = simplex.noise(
                    (this.position.x + x) / params.terrain.scale,
                    (this.position.z + z) / params.terrain.scale
                );
                
                const scaledNoise = params.terrain.offset + params.terrain.magnitude * value;
                let height = Math.floor(size.height * scaledNoise);
                height = Math.max(0, Math.min(height, size.height));

                for (let y = 0; y < size.height; y++) {
                                    
                    if(y < height && this.getBlock(x,y,z,size, startVector).id === blocks.empty.id){
                        this.setBlockId(x,y,z,blocks.dirt.id,size, startVector);                    
                    }else if(y === height){
                        this.setBlockId(x,y,z,blocks.grass.id,size, startVector);                    
                    } else if(y > height){
                        this.setBlockId(x,y,z,blocks.empty.id,size, startVector);                    
                    }
                }
            }            
        }
    }

    generateMeshes = function(size, startVector){
        let self =this;
        let maxCount = size.width * size.width * size.height;
        const boxGeometry = new THREE.BoxGeometry();
        const meshes = {};
        Object.values(blocks)
            .filter(blockType => blockType.id === blocks.empty.id)
            .forEach(blockType => {
                let mesh = new THREE.InstancedMesh(boxGeometry);
                mesh.name = blockType.name;
                mesh.count = 0;
                mesh.color =  blockType.color;
                mesh.castShadow = false;
                mesh.receiveShadow = false;
                meshes[blockType.id] = mesh;
            })
        Object.values(blocks)
            .filter(blockType => blockType.id !== blocks.empty.id)
            .forEach(blockType => {
                let mesh = null;
                if(blockType.useTestMaterial){
                    mesh = new THREE.InstancedMesh(boxGeometry, blockType.testMaterial, maxCount);
                }
                else{
                    mesh = new THREE.InstancedMesh(boxGeometry, blockType.material, maxCount);
                }
                
                mesh.name = blockType.name;
                mesh.count = 0;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                meshes[blockType.id] = mesh;
            })
        
        
        const matrix  = new THREE.Matrix4();

        for (let x = 0; x < size.width; x++) {
            for (let y = 0; y < size.height; y++) {
                for (let z = 0; z < size.width; z++) {
                    const blockId = this.getBlock(x,y,z, size, startVector)?.id;
                    if(!blockId || blockId === blocks.empty.id){
                        continue;
                    }
                    const mesh = meshes[blockId];
                    // console.log(x,y,z);
                    // if(x == 0 && y == 0 && z == 0){
                    //     debugger;
                    // }
                    const instanceId = mesh.count;
                    if(!this.isBlockObscured(x,y,z, size, startVector)){
                        matrix.setPosition(x + startVector.x,y,z + startVector.z);
                        mesh.setMatrixAt(instanceId, matrix);
                        mesh.instanceMatrix.needsUpdate = true;
                        self.setBlockInstanceId(x,y,z,instanceId, size, startVector);
                        mesh.count++;
                    }
                    
                }
            }
        }

        return meshes;
    }

    isBlockObscured(x,y,z, size, startVector){
        const up = this.getBlock(x,y+1,z, size, startVector)?.id ?? blocks.empty.id;
        const down = this.getBlock(x,y-1,z, size, startVector)?.id ?? blocks.empty.id;
        const left = this.getBlock(x+1,y,z, size, startVector)?.id ?? blocks.empty.id;
        const right = this.getBlock(x-1,y,z, size, startVector)?.id ?? blocks.empty.id;
        const forward = this.getBlock(x,y,z+1, size, startVector)?.id ?? blocks.empty.id;
        const back = this.getBlock(x,y,z-1, size, startVector)?.id ?? blocks.empty.id;

        if( up === blocks.empty.id ||
            down === blocks.empty.id ||
            left === blocks.empty.id ||
            right === blocks.empty.id ||
            forward === blocks.empty.id ||
            back === blocks.empty.id            
        ){
            return false;
        }else{
            return true;
        }
    }

    build = function(boxColor, name, isBasicMaterial){
        const boxGeometry = new THREE.BoxGeometry();
        let boxMaterial = null;
        if(isBasicMaterial){
            boxMaterial = new THREE.MeshBasicMaterial({
                color: boxColor
            }) 
        }else{
            boxMaterial = new THREE.MeshLambertMaterial({color: boxColor}) 
        }
        
        let block = new THREE.Mesh(boxGeometry, boxMaterial);
        block.name = name;
        return block;
    }

    disposeInstances(){
        let self = this;
        self.traverse(obj => obj.dispose?.())
        self.data = [];
        self.uuidForMeshes = null
        self.clear();
    }
}