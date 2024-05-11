import * as THREE from 'three';
export default class LightingContainer{
    constructor(sceneRenderer, x, y, z, intensity, includeHelper){
        this.lightHelper = null;
        this.cameraHelper = null;
        this.directionalLight = new THREE.DirectionalLight(0xFFFFFF, intensity);
        let lightName = 'directionalLight';
        this.directionalLight.position.set(x, y, z);
        
        this.directionalLight.shadow.camera.left = -70;
        this.directionalLight.shadow.camera.right = 50;
        this.directionalLight.shadow.camera.top = 50;
        this.directionalLight.shadow.camera.bottom = -70;
        this.directionalLight.shadow.camera.near = 0.1;
        this.directionalLight.shadow.camera.far = 140;
        this.directionalLight.shadow.bias = -0.0005;
        this.directionalLight.shadow.mapSize = new THREE.Vector2(512,512);

        if(includeHelper){
            this.lightHelper = new THREE.DirectionalLightHelper(this.directionalLight,5, 0xFFFFFF);
            sceneRenderer.addToScene(this.lightHelper);
            this.cameraHelper = new THREE.CameraHelper(this.directionalLight.shadow.camera);
            sceneRenderer.addToScene(this.cameraHelper);
        }
               
        sceneRenderer.addToScene(this.directionalLight);        
    }
}