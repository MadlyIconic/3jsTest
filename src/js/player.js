import * as THREE from 'three';
import positionToString, { renderPosition } from './positionHelper';
import { PointerLockControls } from 'three/examples/jsm/Addons.js';

export class Player {
    
    constructor(world, domElement, cameraWrapper, playerConfig, raycasterContainer){
        this.radius = 0.5;
        this.height = 1.75;
        this.jumpSpeed = 10;
        this.onGround = false;
        this.maxSpeed = 10;
        this.minSpeed = 0;
        this.localWorldVelocity = new THREE.Vector3();
        this.reportVisibleChunks = false;
        
        this.input = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
        this.cameraWrapper = cameraWrapper;
        this.cameraWrapper.cameraHelper.visible = false;
        this.controls = new PointerLockControls(this.cameraWrapper.camera, domElement);
        this.world = world;
        this.raycasterContainer = raycasterContainer;
        this.position.set(playerConfig.playerPosition.x, playerConfig.playerPosition.y, playerConfig.playerPosition.z);
        this.cameraWrapper.camera.lookAt(new THREE.Vector3(8,10,8));
        this.world.scene.add(this.cameraWrapper.camera);
        this.world.scene.add(this.cameraWrapper.cameraHelper);

        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));

        this.boundsHelper = new THREE.Mesh(
            new THREE.CylinderGeometry(this.radius, this.radius, this.height,16),
            new THREE.MeshBasicMaterial({wireframe: true})
        )
        this.boundsHelper.visible = false;
        this.world.scene.add(this.boundsHelper);  
        
    }

    

    update(timeStep){        
        this.applyInputs(timeStep);
        this.updateBoundsHelper(timeStep);
        
        this.raycasterContainer.updateRaycaster();
        if(this.raycasterContainer.selectedCoords){
            renderPosition(this.raycasterContainer.selectedCoords, 'look-at', 'Look:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
        }
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
            case "KeyQ":
                let display = document.getElementById('info').style.display;
                if(display === 'none'){
                    document.getElementById('info').style.display = 'block';
                }else{
                    document.getElementById('info').style.display = 'none';    
                }
                
                break;
            default:
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