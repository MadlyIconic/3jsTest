import * as THREE from 'three';

export default class BoxBuilder{

    constructor(){
        
    }

    build = function(boxColor){
        const boxGeometry = new THREE.BoxGeometry();
        const boxMaterial = new THREE.MeshStandardMaterial({
            color: boxColor
        }) 
        return new THREE.Mesh(boxGeometry, boxMaterial);
    }
}