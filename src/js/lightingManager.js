import * as THREE from 'three';
import LightingContainer from './lightingContainer';

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
        let lightName = 'directionalLight';
        
        let directionalLightContainer = new LightingContainer(this.sceneRenderer, x, y, z, intensity, includeHelper);
        this.lights.push({name:lightName, object: directionalLightContainer.directionalLight, helper: directionalLightContainer.lightHelper})
        if(isSelected){
            this.selectedLightNames.push(lightName);
        }
        return directionalLightContainer;
    }
}