import * as THREE from 'three';
import positionToString from './positionHelper';

export default class SkyCamera{
    constructor(fov,perspectiveRatio,near,far, name){
        this.name = name;
        console.log('creating a camera: ', fov,perspectiveRatio,near,far, name);
        this.camera = new THREE.PerspectiveCamera(
            fov,
            perspectiveRatio,
            near,
            far
        );
        this.cameraHelper = new THREE.CameraHelper(this.camera);
    }

    get position(){
        return this.camera.position;
    }

    renderPosition(domElement){
        document.getElementById(domElement).innerHTML = positionToString(this);
    }
}