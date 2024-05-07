import * as THREE from 'three';
import {SimplexNoise} from 'three/examples/jsm/math/SimplexNoise.js'

export default class BoxBuilder{
    
    constructor(){
        this.data = [];
    }

    getBlock(x,y,z, size){
        let self = this;
        if(self.inBounds(x,y,z, size)){
            return self.data[x][y][z];
        }else{
            return null;
        }
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
                        id: 0,
                        instanceId: null
                    })
                }
                slice.push(row);
            }
            self.data.push(slice);
        }   
    }

    generateTerrain(size, params){
        const simplex = new SimplexNoise();
        for (let x = 0; x < size.width; x++) {
            for (let z = 0; z < size.width; z++) {
                const value = simplex.noise(
                    x / params.terrain.scale,
                    z / params.terrain.scale
                );
                
                const scaledNoise = params.terrain.offset + params.terrain.magnitude * value;
                let height = Math.floor(size.height * scaledNoise);
                height = Math.max(0, Math.min(height, size.height));

                for (let y = 0; y < height; y++) {
                    this.setBlockId(x,y,z,1,size);                    
                }
            }            
        }
    }

    buildInstanced = function(boxColor, size){
        let self =this;
        const boxGeometry = new THREE.BoxGeometry();
        const boxMaterial = new THREE.MeshLambertMaterial({color: boxColor}) 
        
        let maxCount = size.width * size.width * size.height;
        let mesh = new THREE.InstancedMesh(boxGeometry, boxMaterial, maxCount);
        mesh.name = "TheBlocks";
        mesh.count = 0;
        
        const matrix  = new THREE.Matrix4();

        for (let x = 0; x < size.width; x++) {
            for (let y = 0; y < size.height; y++) {
                for (let z = 0; z < size.width; z++) {
                    const blockId = this.getBlock(x,y,z, size).id;
                    const instanceId = mesh.count;
                    if(blockId!==0){
                        matrix.setPosition(x+0.5,y+0.5,z+0.5);
                        mesh.setMatrixAt(instanceId, matrix);
                        self.setBlockInstanceId(x,y,z,instanceId, size);
                        mesh.count++;
                    }
                    
                }
            }
        }

        return mesh;
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
}