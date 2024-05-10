import * as THREE from 'three';
import SkyCamera from './skyCamera';

export default class CameraBuilder{

    constructor(){}
    
    buildSkyCamera(fov,perspectiveRatio,near,far, name){        
        let camera = new SkyCamera(
            fov,
            perspectiveRatio,
            near,
            far,
            name
        );

        return camera;
    }
}