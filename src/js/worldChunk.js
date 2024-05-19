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

    generate(uuidcollection, startVector){
        
        let self = this;
        self.disposeInstances();
        self.uuidForMeshes = uuidcollection;
        return self.setupWorld(self.size, startVector);
    }

    setupWorld(size, startVector){
        //const start = performance.now();
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
        //console.log(`Loaded chunk in ${Math.round(performance.now() - start)}ms`);
        return meshes;
    }

    getBlock(x,y,z, size){
        let self = this;
        if(self.inBounds(x,y,z, size)){
            return self.data[x][y][z];
        }else{
            return null;
        }
    }


    /**
     * Removes the block at (x,y,z)
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    removeBlock(x,y,z){
        const block = this.getBlock(x,y,z, this.size);
        //console.log(`Block is not empty: ${block.id !== blocks.empty.id}`)
        if(block && block.id !== blocks.empty.id){
            this.deleteBlockInstance(x,y,z);
        }
    }

    getMeshesForWorldChunk(){
        const meshes = Object.values(this.parent.children.find((e) => e.uuid === this.uuid).meshes);
        return meshes;
    }

    getMeshContainingBlock(block){
        
        const meshes = this.getMeshesForWorldChunk();
        const mesh = meshes.find((instanceMesh) => instanceMesh.name === block.id);

        return mesh;
    }

    /**
     * Deletes the block from the instance (x,y,z)
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    deleteBlockInstance(x,y,z){
        const block = this.getBlock(x,y,z, this.size);
        if(block.instanceId === null){
            return;
        }

        const mesh = this.getMeshContainingBlock(block);

        const instanceId = block.instanceId;

        const lastMatrix = new THREE.Matrix4();
        mesh.getMatrixAt(mesh.count -1, lastMatrix);

        const v = new THREE.Vector3();
        v.applyMatrix4(lastMatrix);

        this.setBlockInstanceId(v.x,v.y, v.z,instanceId,this.size);

        mesh.setMatrixAt(instanceId, lastMatrix);
        mesh.count--;

        this.setMeshToUpdateAsEditsHappened(mesh);
        
        this.setBlockInstanceId(x,y,z,null,this.size);
        this.setBlockId(x,y,z,blocks.empty.id, this.size);
    }   

/**
     * Create a new instance for the block at (x,y,z)
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    addBlockInstance(x,y,z){
        const block = this.getBlock(x,y,z, this.size);

        if(block && block.id !== blocks.empty.id && block.instanceId === null){
            const mesh = this.getMeshContainingBlock(block);
            const instanceId = mesh.count++;
            this.setBlockInstanceId(x,y,z,instanceId,this.size);

            const matrix = new THREE.Matrix4();
            matrix.setPosition(x,y,z);
            mesh.setMatrixAt(instanceId, matrix);

            this.setMeshToUpdateAsEditsHappened(mesh);
        }
    }

    setMeshToUpdateAsEditsHappened(mesh){
        mesh.instanceMatrix.needsUpdate = true;
        mesh.computeBoundingSphere();
    }

    setBlockId(x,y,z,id, size){
        let self = this;
        if(self.inBounds(x,y,z, size)){
            self.data[x][y][z].id = id;
        }
    }

    inBounds(x,y,z, size){
        if(x >= 0 && x < size.width &&
            y >= 0 && y < size.height &&
            z >= 0 && z < size.width){
            return true;
        }else{
            return false;
        }
    }

    setBlockInstanceId(x,y,z,instanceId, size){
        let self = this;
        if(self.inBounds(x,y,z, size)){
            self.data[x][y][z].instanceId = instanceId;
        }
    }

    initialiseTerrain(size){
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
    generateResources(size, rng){        
        const simplex = new SimplexNoise(rng);
        resources.forEach(resource => {
            this.generateResourceType(resource, size, simplex);
        });
        
    }

    generateResourceType(resource, size, simplex){
        for (let x = 0; x < size.width; x++) {
            for (let y = 0; y < size.height; y++) {
                for (let z = 0; z < size.width ; z++) {
    
                    const value = simplex.noise3d(
                       (this.position.x + x) / resource.scale.x,
                       (this.position.y + y) / resource.scale.y,
                       (this.position.z + z) / resource.scale.z
                    );

                    if(value > resource.scarcity){
                        this.setBlockId(x,y,z,resource.id,size);
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
                        this.setBlockId(x,y,z,blocks.dirt.id,size);                    
                    }else if(y === height){
                        this.setBlockId(x,y,z,blocks.grass.id,size);                    
                    } else if(y > height){
                        this.setBlockId(x,y,z,blocks.empty.id,size);                    
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
                //mesh.name = blockType.name;
                // Changed for delete block purposes.  Hopefully the name is not used anywhere?
                mesh.name = blockType.id;
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
                
                //mesh.name = blockType.name;
                // Changed for delete block purposes.  Hopefully the name is not used anywhere?
                mesh.name = blockType.id;
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