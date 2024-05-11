import * as THREE from 'three';
import SkyCamera from './skyCamera';

export default class CameraBuilder{

    constructor(){}
    
    buildSkyCamera(fov,perspectiveRatio,near,far, name, position){        
        let camera = new SkyCamera(
            fov,
            perspectiveRatio,
            near,
            far,
            name
        );

        if(position){
            camera.position.set(position.x,position.y,position.z);
        }

        return camera;
    }
}