import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/Addons.js';
export class Player {
    constructor(sceneRenderer){
        this.maxSpeed = 10;
        this.minSpeed = 0;
        this.input = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
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
            this.velocity.x = this.input.x;
            this.velocity.z = this.input.z;
            this.controls.moveRight(this.velocity.x * dt);
            this.controls.moveForward(this.velocity.z * dt);
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
            case 'KeyW':
                this.input.z = this.maxSpeed;
                break;
            case 'KeyA':
                this.input.x = -this.maxSpeed;
                break;
            case 'KeyS':
                this.input.z = -this.maxSpeed;
                break;
            case 'KeyD':
                this.input.x = this.maxSpeed;
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
            case 'KeyW':
                this.input.z = this.minSpeed;
                break;
            case 'KeyA':
                this.input.x = this.minSpeed;
                break;
            case 'KeyS':
                this.input.z = this.minSpeed;
                break;
            case 'KweyD':
                this.input.x = this.minSpeed;
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