import * as THREE from 'three';
import positionToString from './positionHelper';

export default class SkyCamera{
    constructor(fov,perspectiveRatio,near,far, name, isHelperVisible){
        this.name = name;
        console.log('creating a camera: ', fov,perspectiveRatio,near,far, name);
        this.camera = new THREE.PerspectiveCamera(
            fov,
            perspectiveRatio,
            near,
            far
        );
        this.cameraHelper = new THREE.CameraHelper(this.camera);
        //this.cameraHelper.visible = isHelperVisible;
    }

    get position(){
        return this.camera.position;
    }

    renderPosition(domElement){
        document.getElementById(domElement).innerHTML =  this.name + ":" + positionToString(this.position);
    }

    // Not sure this is working...
    // renderLookAt(domElement){
    //     var vector = new THREE.Vector3( 0, 0, - 1 );
    //     vector.applyQuaternion( this.camera.quaternion );
    //     let lookat = document.getElementById(domElement);
    //     if(lookat){
    //         lookat.innerHTML = "Looking at:" + positionToString(vector);
    //     }
    // }
}