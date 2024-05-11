import * as THREE from 'three';
import positionToString from './positionHelper';
import { PointerLockControls } from 'three/examples/jsm/Addons.js';
export class Player {
    constructor(scene, domElement, cameraWrapper, playerConfig){
        this.radius = 0.5;
        this.height = 1.75;
        this.maxSpeed = 10;
        this.minSpeed = 0;
        this.playerPosition = new THREE.Vector3(playerConfig.playerPosition.x, playerConfig.playerPosition.y, playerConfig.playerPosition.z);
        this.input = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
        this.cameraWrapper = cameraWrapper;
        //this.cameraWrapper.cameraHelper.visible = false;
        this.controls = new PointerLockControls(this.cameraWrapper.camera, domElement);
        //this.position.set(this.playerPosition.x, this.playerPosition.y, this.playerPosition.z);
        this.position.set(36,20,36);
        scene.add(this.cameraWrapper.camera);
        scene.add(this.cameraWrapper.cameraHelper);

        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    applyInputs(dt){
        if(this.controls.isLocked){
            this.velocity.x = this.input.x;
            this.velocity.z = this.input.z;
            this.controls.moveRight(this.velocity.x * dt);
            this.controls.moveForward(this.velocity.z * dt);

            document.getElementById('player-position').innerHTML = this.cameraWrapper.name + ":" + positionToString(this.position);
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
            case 'KeyR':
                this.position.set(72,16,32);
                this.velocity.set(0,0,0);
                break;
            default:
                console.log('event code:', event.code);
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
            case 'KeyD':
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
        return this.cameraWrapper.position;
    }

    
}