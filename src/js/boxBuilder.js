import * as THREE from 'three';
import {SimplexNoise} from 'three/examples/jsm/math/SimplexNoise.js'
import {RNG} from './rng';
import { blocks } from './blocks';

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
                        id: blocks.empty.id,
                        instanceId: null
                    })
                }
                slice.push(row);
            }
            self.data.push(slice);
        }   
    }

    generateTerrain(size, params){
        const rng = new RNG(params.seed);
        const simplex = new SimplexNoise(rng);
        for (let x = 0; x < size.width; x++) {
            for (let z = 0; z < size.width; z++) {
                const value = simplex.noise(
                    x / params.terrain.scale,
                    z / params.terrain.scale
                );
                
                const scaledNoise = params.terrain.offset + params.terrain.magnitude * value;
                let height = Math.floor(size.height * scaledNoise);
                height = Math.max(0, Math.min(height, size.height));

                for (let y = 0; y < size.height; y++) {
                    //this.setBlockId(x,y,z,1,size);                    
                    if(y < height){
                        //console.log('Setting block as dirt');
                        this.setBlockId(x,y,z,blocks.dirt.id,size);                    
                    }else if(y == height){
                        this.setBlockId(x,y,z,blocks.grass.id,size);                    
                    } else{
                        this.setBlockId(x,y,z,blocks.empty.id,size);                    
                    }
                }
            }            
        }
    }

    buildInstanced = function(boxColor, size){
        let self =this;
        const boxGeometry = new THREE.BoxGeometry();
        const boxMaterial = new THREE.MeshLambertMaterial() 
        
        let maxCount = size.width * size.width * size.height;
        let mesh = new THREE.InstancedMesh(boxGeometry, boxMaterial, maxCount);
        mesh.name = "TheBlocks";
        mesh.count = 0;
        
        const matrix  = new THREE.Matrix4();

        for (let x = 0; x < size.width; x++) {
            for (let y = 0; y < size.height; y++) {
                for (let z = 0; z < size.width; z++) {
                    const blockId = this.getBlock(x,y,z, size).id;
                    const blockType = Object.values(blocks).find(e => e.id === blockId);
                    const instanceId = mesh.count;
                    if(blockId!== blocks.empty.id && !this.isBlockObscured(x,y,z, size)){
                        matrix.setPosition(x+0.5,y+0.5,z+0.5);
                        mesh.setMatrixAt(instanceId, matrix);
                        mesh.setColorAt(instanceId, new THREE.Color(blockType.color))
                        self.setBlockInstanceId(x,y,z,instanceId, size);
                        mesh.count++;
                    }
                    
                }
            }
        }

        return mesh;
    }

    isBlockObscured(x,y,z, size){
        const up = this.getBlock(x,y+1,z, size)?.id ?? blocks.empty.id;
        const down = this.getBlock(x,y-1,z, size)?.id ?? blocks.empty.id;
        const left = this.getBlock(x+1,y,z, size)?.id ?? blocks.empty.id;
        const right = this.getBlock(x-1,y,z, size)?.id ?? blocks.empty.id;
        const forward = this.getBlock(x,y,z+1, size)?.id ?? blocks.empty.id;
        const back = this.getBlock(x,y,z-1, size)?.id ?? blocks.empty.id;

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
}