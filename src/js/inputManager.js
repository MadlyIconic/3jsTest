export default class InputManager{
    constructor(player, world){
        this.world = world;
        this.player = player;
        this.keys = {};
        document.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    onMouseDown(event){
        let self = this;
        if(self.player.controls.isLocked && this.player.raycasterContainer.selectedCoords){
            this.world.removeBlock(
                this.player.raycasterContainer.selectedCoords.x,
                this.player.raycasterContainer.selectedCoords.y,
                this.player.raycasterContainer.selectedCoords.z
            );
        }
    }

    onKeyDown(event){
        if(!this.player.controls.isLocked){
            this.player.controls.lock();
            console.log('controls locked');
        }
        this.keys[event.code] = true;
        this.updatePlayerInput();
        this.handleSpecialKeys(event);
    }

    onKeyUp(event){
        this.keys[event.code] = false;
        this.updatePlayerInput();
    }

    updatePlayerInput(){
        // Movement keys
        if (this.keys['KeyW']) this.player.input.z = -this.player.maxSpeed;
        else if (this.keys['KeyS']) this.player.input.z = this.player.maxSpeed;
        else this.player.input.z = this.player.minSpeed;

        if (this.keys['KeyA']) this.player.input.x = -this.player.maxSpeed;
        else if (this.keys['KeyD']) this.player.input.x = this.player.maxSpeed;
        else this.player.input.x = this.player.minSpeed;
    }

    handleSpecialKeys(event){
        switch (event.code) {
            case 'KeyR':
                this.player.reportVisibleChunks = true;
                break;
            case 'Space':
                if(this.player.onGround){
                    this.player.velocity.y = this.player.jumpSpeed;
                }
                break;
            case "KeyV":
                this.player.boundsHelper.visible = !this.player.boundsHelper.visible;
                this.player.cameraWrapper.cameraHelper.visible = !this.player.cameraWrapper.cameraHelper.visible;
                break;
            case "KeyQ":
                let display = document.getElementById('info').style.display;
                if(display === 'none'){
                    document.getElementById('info').style.display = 'block';
                } else {
                    document.getElementById('info').style.display = 'none';
                }
                break;
        }
    }

    cleanup() {
        document.removeEventListener('mousedown', this.onMouseDown.bind(this));
        document.removeEventListener('keydown', this.onKeyDown.bind(this));
        document.removeEventListener('keyup', this.onKeyUp.bind(this));
    }
}