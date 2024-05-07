import * as THREE from 'three';

export default class LightingManager{

    constructor(sceneRenderer){
        let self = this;
        this.sceneRenderer = sceneRenderer;
        this.selectedLightNames = [];
        this.lights = [];
    }
    
    setUpSpotLight(isSelected, x, y, z, intensity, angle, includeHelper){
        const spotLight = new THREE.SpotLight(0xFFFFFF,intensity);
        let lightName = 'spotLight';
        spotLight.position.set(x, y, z);
        spotLight.angle = angle;
        let spotlightHelper = null;
        if(includeHelper){
            spotlightHelper = new THREE.SpotLightHelper(spotLight);
            this.sceneRenderer.addToScene(spotlightHelper);
        }
        
        this.sceneRenderer.addToScene(spotLight);
        this.lights.push({name:lightName, object: spotLight, helper:spotlightHelper})
        if(isSelected){
            this.selectedLightNames.push(lightName);
        }
    }
    
    setUpAmbientLight(isSelected, intensity){
        const ambientLight = new THREE.AmbientLight(0xFFFFFF, intensity);
        let lightName = 'ambientLight';
        this.sceneRenderer.addToScene(ambientLight);
        this.lights.push({name:lightName, object: ambientLight, helper:null})
        if(isSelected){
            this.selectedLightNames.push(lightName);
        }
        return ambientLight;
    }
    
    setUpDirectionalLight(isSelected, x, y, z, intensity, includeHelper){
        const directionalLight = new THREE.DirectionalLight(0xFFFFFF, intensity);
        let lightName = 'directionalLight';
        directionalLight.position.set(x, y, z);
        directionalLight.shadow.camera.bottom = -20.5;
        let directionalLightHelper = null;
        if(includeHelper){
            console.log('Including helper');
            directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight,5);
            this.sceneRenderer.addToScene(directionalLightHelper);
            const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
            this.sceneRenderer.addToScene(directionalLightCameraHelper);
        }
               
        this.sceneRenderer.addToScene(directionalLight);
            
        this.lights.push({name:lightName, object: directionalLight, helper: directionalLightHelper})
        if(isSelected){
            this.selectedLightNames.push(lightName);
        }
        return directionalLight;
    }
}



// exports.lights = lights;
// //exports.selectedLightName = selectedLightName;
// exports.setUpSpotLight = setUpSpotLight
// exports.setUpAmbientLight = setUpAmbientLight
// exports.setUpDirectionalLight = setUpDirectionalLight