import * as THREE from 'three';
export default class LightingContainer{
    constructor(sceneRenderer, x, y, z, intensity, includeHelper, color = 0xFFFFFF){
        this.lightHelper = null;
        this.cameraHelper = null;
        this.directionalLight = new THREE.DirectionalLight(color, intensity);
        this.lightName = 'directionalLight';
        this.directionalLight.position.set(x, y, z);
        
        this.setUpShadows();

        if(includeHelper){
            this.lightHelper = new THREE.DirectionalLightHelper(this.directionalLight,5, 0xFFFFFF);
            this.lightHelper.visible = false;
            sceneRenderer.addToScene(this.lightHelper);
            this.cameraHelper = new THREE.CameraHelper(this.directionalLight.shadow.camera);
            this.cameraHelper.visible = false;
            sceneRenderer.addToScene(this.cameraHelper);
        }
               
        sceneRenderer.addToScene(this.directionalLight);        
    }

    setUpShadows(){
        this.directionalLight.shadow.camera.left = -100;
        this.directionalLight.shadow.camera.right = 100;
        this.directionalLight.shadow.camera.top = 100;
        this.directionalLight.shadow.camera.bottom = -100;
        this.directionalLight.shadow.camera.near = 0.1;
        this.directionalLight.shadow.camera.far = 200;
        this.directionalLight.shadow.bias = -0.0001;
        this.directionalLight.shadow.mapSize = new THREE.Vector2(2048,2048);
    }

    get position(){
        return this.camera.position;
    }
}