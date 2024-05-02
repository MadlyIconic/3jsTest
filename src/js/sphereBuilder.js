import * as THREE from 'three';

export default class SphereBuilder{

    constructor(){}
    
    build(sphereRadius, width=30, height=30, isWireframe){
        const sphereGeometry = new THREE.SphereGeometry(sphereRadius,width,height);
        const sphereMaterial = new THREE.MeshStandardMaterial({
            wireframe: isWireframe
        })
        return new THREE.Mesh(sphereGeometry, sphereMaterial);
    }
}