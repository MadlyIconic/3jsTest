import * as THREE from 'three';
import positionToString from './positionHelper';
import { PointerLockControls } from 'three/examples/jsm/Addons.js';
export class Player {
    constructor(scene, domElement, cameraWrapper, playerConfig){
        this.radius = 0.5;
        this.height = 1.75;
        this.jumpSpeed = 10;
        this.onGround = false;
        this.maxSpeed = 10;
        this.minSpeed = 0;
        this.localWorldVelocity = new THREE.Vector3();
        this.reportVisibleChunks = false;
        //this.playerPosition = new THREE.Vector3(playerConfig.playerPosition.x, playerConfig.playerPosition.y, playerConfig.playerPosition.z);
        this.input = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
        this.cameraWrapper = cameraWrapper;
        this.cameraWrapper.cameraHelper.visible = false;
        this.controls = new PointerLockControls(this.cameraWrapper.camera, domElement);
        //this.position.set(this.playerPosition.x, this.playerPosition.y, this.playerPosition.z);
        //this.position.set(36,20,36);
        this.position.set(playerConfig.playerPosition.x, playerConfig.playerPosition.y, playerConfig.playerPosition.z);
        this.cameraWrapper.camera.lookAt(new THREE.Vector3(8,16,8));
        scene.add(this.cameraWrapper.camera);
        scene.add(this.cameraWrapper.cameraHelper);

        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));

        this.boundsHelper = new THREE.Mesh(
            new THREE.CylinderGeometry(this.radius, this.radius, this.height,16),
            new THREE.MeshBasicMaterial({wireframe: true})
        )
        this.boundsHelper.visible = false;
        scene.add(this.boundsHelper);   
    }

    update(timeStep){        
        this.applyInputs(timeStep);
        this.updateBoundsHelper(timeStep);
    }

    get worldVelocity(){
        this.localWorldVelocity.copy(this.velocity);
        this.localWorldVelocity.applyEuler(new THREE.Euler(0, this.cameraWrapper.camera.rotation.y, 0));
        return this.localWorldVelocity;
    }

    applyWorldDeltaVelocity(dv){
        dv.applyEuler(new THREE.Euler(0, -this.cameraWrapper.camera.rotation.y, 0));
        this.velocity.add(dv);
    }

    applyInputs(dt){
        if(this.controls.isLocked){
            this.velocity.x = this.input.x;
            this.velocity.z = this.input.z;

            this.controls.moveRight(this.velocity.x * dt);
            this.controls.moveForward(this.velocity.z * dt);
            this.position.y += this.velocity.y * dt;    
        }
    }

    updateBoundsHelper(){
        this.boundsHelper.position.copy(this.position);
        this.boundsHelper.position.y -= this.height / 2;
    }

    /**
     * Event handler for 'keydown' event
     * @param {KeyboardEvent} event
     */
    onKeyDown(event){
        if(!this.controls.isLocked){
            this.controls.lock();
            //console.log('controls locked');
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
                this.reportVisibleChunks = true;
                break;
            case 'Space':
                //console.log('event code:', event.code, this.onGround);
                if(this.onGround){
                    this.velocity.y = this.jumpSpeed;
                }
                break;
            case "KeyV":
                this.boundsHelper.visible = !this.boundsHelper.visible;
                this.cameraWrapper.cameraHelper.visible = !this.cameraWrapper.cameraHelper.visible;
                break;
            default:
                //console.log('event code:', event.code);
                break;
        }
    }

    renderKeyPress(keyCode){
        document.getElementById('keypress').innerHTML = keyCode;
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