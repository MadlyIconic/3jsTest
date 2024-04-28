import * as THREE from 'three';

export default class LightingManager{

    constructor(sceneRenderer){
        let self = this;
        this.sceneRenderer = sceneRenderer;
        this.selectedLightName = '';
        this.lights = [];
    }
    
    setUpSpotLight(isSelected){
        const spotLight = new THREE.SpotLight(0xFFFFFF);
        let lightName = 'spotLight';
        this.sceneRenderer.addToScene(spotLight);
        this.lights.push({name:lightName, object: spotLight})
        if(isSelected){
            this.selectedLightName = lightName;
        }
    }
    
    setUpAmbientLight(isSelected){
        const ambientLight = new THREE.AmbientLight(0xFFFFFF);
        let lightName = 'ambientLight';
        this.sceneRenderer.addToScene(ambientLight);
        this.lights.push({name:lightName, object: ambientLight})
        if(isSelected){
            this.selectedLightName = lightName;
        }
        return ambientLight;
    }
    
    setUpDirectionalLight(isSelected){
        const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 8);
        let lightName = 'directionalLight';
        directionalLight.position.set(-30, 50, 0);
        directionalLight.shadow.camera.bottom = -10.5;
        const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight,5);
        const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
        this.sceneRenderer.addToScene(directionalLight);
        this.sceneRenderer.addToScene(directionalLightHelper);
        this.sceneRenderer.addToScene(directionalLightCameraHelper);
    
        this.lights.push({name:lightName, object: directionalLight})
        if(isSelected){
            this.selectedLightName = lightName;
        }
        return directionalLight;
    }
}



// exports.lights = lights;
// //exports.selectedLightName = selectedLightName;
// exports.setUpSpotLight = setUpSpotLight
// exports.setUpAmbientLight = setUpAmbientLight
// exports.setUpDirectionalLight = setUpDirectionalLight