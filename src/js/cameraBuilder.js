import * as THREE from 'three';

export default class CameraBuilder{

    constructor(){}
    
    build(fov,perspectiveRatio,near,far){
        let camera = new THREE.PerspectiveCamera(
            fov,
            perspectiveRatio,
            near,
            far
        );

        return camera;
    }
}