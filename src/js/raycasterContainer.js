import * as THREE from 'three'

export default class RayCasterContainer{
    constructor(){
        this.raycaster = new THREE.Raycaster(null,null, 0, 3);
        this.selectedCoords = null;
    }
}