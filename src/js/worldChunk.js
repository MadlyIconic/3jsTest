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
        //console.log('World chunk being created');
        this.size = size;
        this.main = main;
        this.params = main.options.params;    
    }

    generate(){        
        let self = this;
        self.disposeInstances();
        return self.setupWorld();
    }

    setupWorld(x,z, newPositionX, newPositionZ){
        let self = this;
        const rng = new RNG(self.params.seed);
        self.initialiseTerrain();
        self.generateResources(rng);
        self.generateTerrain(rng);
        let meshes = self.generateMeshes();        
        for (const mesh in meshes) {
        //     if (meshes.hasOwnProperty(mesh)) {
        //         if(meshes[mesh].isObject3D){
        //             meshes[mesh].userData = 'TerrainMesh';
        //             self.uuidForMeshes.uuids.set(meshes[mesh].uuid,true);
                     self.main.sceneRenderer.addToScene(meshes[mesh]);          
        //         }
             }
        // }
    }

    getBlock(x,y,z){
        let self = this;
        if(self.inBounds(x,y,z)){
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
        const objWithMeshes = Object.values(this.parent.children.find((e) => e.uuid === this.uuid));
        // Hard coded index is not good!?!
        const meshes = Object.keys(objWithMeshes[31]).map(
            function(k){
                return objWithMeshes[31][k]
            });
        return meshes;
    }

    getMeshContainingBlock(block){
        
        const meshes = this.getMeshesForWorldChunk();
        const mesh = meshes.find((instanceMesh) => {
            //console.log(`Instance mesh name: ${instanceMesh.name}.  Desired name: ${block.id}`)
            return instanceMesh.name === block.id;
        });
        //console.log(`Mesh being returned: ${mesh.name}`);
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
            console.log('Nothing to remove');
            return;
        }
        //console.log(`Looking for mesh with name: ${block.id}`);
        const mesh = this.getMeshContainingBlock(block);
        //console.log(`Found mesh with name: ${mesh.name}`);

        const instanceId = block.instanceId;
        //console.log(`Deleting block ${block.id} ${instanceId}`);
        const lastMatrix = new THREE.Matrix4();
        mesh.getMatrixAt(mesh.count -1, lastMatrix);

        const v = new THREE.Vector3();
        v.applyMatrix4(lastMatrix);

        this.setBlockInstanceId(v.x,v.y, v.z,instanceId,this.size);
        //console.log(`Deleting block ${v.x} ${v.y} ${v.z} ${instanceId}`);
        
        mesh.setMatrixAt(instanceId, lastMatrix);

        mesh.count--;
        this.setBlockInstanceId(x,y,z,null,this.size);
        this.setBlockId(x,y,z,blocks.empty.id, this.size);

        this.setMeshToUpdateAsEditsHappened(mesh);
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
        //console.log('Set mesh to update');
    }

    setBlockId(x,y,z,id){
        let self = this;
        if(self.inBounds(x,y,z)){
            //console.log('setting block');
            self.data[x][y][z].id = id;
        }
    }

    inBounds(x,y,z){
        let self = this;
        if(x >= 0 && x < self.size.width &&
            y >= 0 && y < self.size.height &&
            z >= 0 && z < self.size.width){
            return true;
        }else{
            return false;
        }
    }

    setBlockInstanceId(x,y,z,instanceId){
        let self = this;
        if(self.inBounds(x,y,z)){
            self.data[x][y][z].instanceId = instanceId;
        }
    }

    initialiseTerrain(){
        let self = this;
        self.data = [];
        for (let x = 0; x < self.size.width; x++) {
            const slice = [];
            for (let y = 0; y < self.size.height; y++) {
                const row = [];
                for (let z = 0; z < self.size.width; z++) {
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
    generateResources(rng){
        let self = this;        
        const simplex = new SimplexNoise(rng);
        resources.forEach(resource => {
            //console.log("generate", resource);
            this.generateResourceType(resource, simplex);
        });
        
    }

    generateResourceType(resource,simplex){
        let self = this;
        for (let x = 0; x < self.size.width; x++) {
            for (let y = 0; y < self.size.height; y++) {
                for (let z = 0; z < self.size.width ; z++) {
    
                    const value = simplex.noise3d(
                       (this.position.x + x) / resource.scale.x,
                       (this.position.y + y) / resource.scale.y,
                       (this.position.z + z) / resource.scale.z
                    );

                    if(value > resource.scarcity){
                        self.setBlockId(x,y,z,resource.id);
                    }
                }   
            }
        }
    }

    generateTerrain(rng){        
        let self = this;
        const simplex = new SimplexNoise(rng);
        for (let x = 0; x < self.size.width; x++) {
            for (let z = 0; z < self.size.width; z++) {
                const value = simplex.noise(
                    (this.position.x + x) / self.params.terrain.scale,
                    (this.position.z + z) / self.params.terrain.scale
                );
                
                const scaledNoise = self.params.terrain.offset + self.params.terrain.magnitude * value;
                let height = Math.floor(self.size.height * scaledNoise);
                height = Math.max(0, Math.min(height, self.size.height));

                for (let y = 0; y < self.size.height; y++) {
                                    
                    if(y < height && this.getBlock(x,y,z).id === blocks.empty.id){
                        this.setBlockId(x,y,z,blocks.dirt.id);                    
                    }else if(y === height){
                        this.setBlockId(x,y,z,blocks.grass.id);                    
                    } else if(y > height){
                        this.setBlockId(x,y,z,blocks.empty.id);                    
                    }
                }
            }            
        }
    }

    generateMeshes = function(){
        let self =this;
        let maxCount = self.size.width * self.size.width * self.size.height;
        const boxGeometry = new THREE.BoxGeometry();
        const meshes = {};
        Object.values(blocks)
            .filter(blockType => blockType.id === blocks.empty.id)
            .forEach(blockType => {
                let mesh = new THREE.InstancedMesh(boxGeometry);
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

        for (let x = 0; x < self.size.width; x++) {
            for (let y = 0; y < self.size.height; y++) {
                for (let z = 0; z < self.size.width; z++) {
                    const blockId = this.getBlock(x,y,z)?.id;
                    if(!blockId || blockId === blocks.empty.id){
                        continue;
                    }
                    const mesh = meshes[blockId];
                    // console.log(x,y,z);
                    // if(x == 0 && y == 0 && z == 0){
                    //     debugger;
                    // }
                    const instanceId = mesh.count;
                    if(!self.isBlockObscured(x,y,z)){                        
                        matrix.setPosition(x,y,z);
                        mesh.setMatrixAt(instanceId, matrix);
                        mesh.instanceMatrix.needsUpdate = true;
                        self.setBlockInstanceId(x,y,z,instanceId);
                        mesh.count++;
                    }
                    
                }
            }
        }

        return meshes;
    }

    isBlockObscured(x,y,z){
        const up = this.getBlock(x,y+1,z)?.id ?? blocks.empty.id;
        const down = this.getBlock(x,y-1,z)?.id ?? blocks.empty.id;
        const left = this.getBlock(x+1,y,z)?.id ?? blocks.empty.id;
        const right = this.getBlock(x-1,y,z)?.id ?? blocks.empty.id;
        const forward = this.getBlock(x,y,z+1)?.id ?? blocks.empty.id;
        const back = this.getBlock(x,y,z-1)?.id ?? blocks.empty.id;

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
        self.clear();
    }
}