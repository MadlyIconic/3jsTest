import * as THREE from 'three';
import sceneRenderer from './sceneRenderer';

function setUpAmbientLight(){
    const ambientLight = new THREE.AmbientLight(0xFFFFFF);
    sceneRenderer.addToScene(ambientLight);

    return ambientLight;
}

function setUpDirectionalLight(){
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 8);
    directionalLight.position.set(-30, 50, 0);
    directionalLight.shadow.camera.bottom = -10.5;
    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight,5);
    const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    sceneRenderer.addToScene(directionalLight);
    sceneRenderer.addToScene(directionalLightHelper);
    sceneRenderer.addToScene(directionalLightCameraHelper);

    return directionalLight;
}

exports.setUpAmbientLight = setUpAmbientLight
exports.setUpDirectionalLight = setUpDirectionalLight