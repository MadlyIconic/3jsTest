import * as THREE from 'three';

export default class BoxBuilder{

    constructor(){
        
    }

    buildInstanced = function(boxColor, size){
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
                    matrix.setPosition(x+0.5,y+0.5,z+0.5);
                    mesh.setMatrixAt(mesh.count++, matrix);
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