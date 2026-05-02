export default class InputManager{
    constructor(player, world){
        this.world = world;
        this.player = player;
        this.keys = {};
        this.onMouseDownBound = this.onMouseDown.bind(this);
        this.onKeyDownBound = this.onKeyDown.bind(this);
        this.onKeyUpBound = this.onKeyUp.bind(this);
        this.onPointerDownBound = (event) => { event.preventDefault(); event.stopImmediatePropagation(); };
        this.onContextMenuBound = (event) => event.preventDefault();
        this.player.domElement.addEventListener('mousedown', this.onMouseDownBound);
        this.player.domElement.addEventListener('pointerdown', this.onPointerDownBound);
        this.player.domElement.addEventListener('contextmenu', this.onContextMenuBound);
        document.addEventListener('keydown', this.onKeyDownBound);
        document.addEventListener('keyup', this.onKeyUpBound);
    }

    onMouseDown(event){
        event.preventDefault();
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
        if (this.keys['KeyW']) this.player.input.z = this.player.maxSpeed;
        else if (this.keys['KeyS']) this.player.input.z = -this.player.maxSpeed;
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
        this.player.domElement.removeEventListener('mousedown', this.onMouseDownBound);
        this.player.domElement.removeEventListener('pointerdown', this.onPointerDownBound);
        this.player.domElement.removeEventListener('contextmenu', this.onContextMenuBound);
        document.removeEventListener('keydown', this.onKeyDownBound);
        document.removeEventListener('keyup', this.onKeyUpBound);
    }
}