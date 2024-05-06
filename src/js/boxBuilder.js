import * as THREE from 'three';

export default class BoxBuilder{

    constructor(){
        
    }

    build = function(boxColor, name, isBasicMaterial, x,y,z){
        const boxGeometry = new THREE.BoxGeometry();
        let boxMaterial = null;
        if(isBasicMaterial){
            boxMaterial = new THREE.MeshBasicMaterial({
                color: boxColor
            }) 
        }else{
            boxMaterial = new THREE.MeshLambertMaterial({color: boxColor}) 
        }
        let maxCount = width*width*height;
        let block = new THREE.Mesh(boxGeometry, boxMaterial);
        block.name = name;
        block.position.set(x,y,z);
        return block;
    }
}