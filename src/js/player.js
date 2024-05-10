import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/Addons.js';
export class Player {
    constructor(sceneRenderer){
        this.maxSpeed = 10;
        this.minSpeed = 0;
        this.input = new THREE.Vector2();
        this.sceneRenderer = sceneRenderer;
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 200);
        this.controls = new PointerLockControls(this.camera, this.sceneRenderer.renderer.domElement);
        this.position.set(72,16,32)
        let scene = this.sceneRenderer.getScene();
        scene.add(this.camera);

        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    applyInputs(dt){
        if(this.controls.isLocked){
            console.log('Player Update');
        }
    }

    /**
     * Event handler for 'keydown' event
     * @param {KeyboardEvent} event
     */
    onKeyDown(event){
        if(!this.controls.isLocked){
            this.controls.lock();
            console.log('controls locked');
        }

        switch (event.code) {
            case 'keyW':
                this.input.z = this.maxSpeed;
                break;
            case 'keyA':
                this.input.x = -this.maxSpeed;
                break;
            case 'keyS':
                this.input.z = this.maxSpeed;
                break;
            case 'keyA':
                this.input.x = -this.maxSpeed;
                break;
            default:
                break;
        }
    }

    /**
     * Event handler for 'keyup' event
     * @param {KeyboardEvent} event
     */
    onKeyUp(event){
        switch (event.code) {
            case 'keyW':
                this.input.z = this.minSpeed;
                break;
            case 'keyA':
                this.input.x = -this.minSpeed;
                break;
            case 'keyS':
                this.input.z = this.minSpeed;
                break;
            case 'keyA':
                this.input.x = -this.minSpeed;
                break;
            default:
                break;
        }
    }

    /**
     * Returns the current world position of the player
     * @type {THREE.Vector3}
     */
    get position(){
        return this.camera.position;
    }
}