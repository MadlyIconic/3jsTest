import * as THREE from 'three';

export default class PlaneBuilder{

    constructor(){}
    
    build(planeColor, width=30, height=30){
        const planeGeometry = new THREE.PlaneGeometry(width,height);
        const planeMaterial = new THREE.MeshLambertMaterial({
            color: planeColor,
            side: THREE.DoubleSide
        });
        return new THREE.Mesh(planeGeometry, planeMaterial);
    }
}