import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/Addons.js';
export class Player {
    constructor(sceneRenderer){
        this.sceneRenderer = sceneRenderer;
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 200);
        this.controls = new PointerLockControls(this.camera, this.sceneRenderer.renderer.domElement);
        this.camera.position.set(32,16,32)
        let scene = this.sceneRenderer.getScene();
        scene.add(this.camera);
    }
}