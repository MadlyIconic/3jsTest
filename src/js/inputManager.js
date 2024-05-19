export default class InputManager{
    constructor(player, world){
        this.world = world;
        this.player = player;
        document.addEventListener('mousedown', this.onMouseDown.bind(this));
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
}