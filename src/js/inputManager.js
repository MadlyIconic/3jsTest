export default class InputManager{
    constructor(player, world){
        this.world = world;
        this.player = player;
        document.addEventListener('mousedown', this.onMouseDown.bind(this));
    }

    onMouseDown(event){
        let self = this;
        if(self.player.controls.isLocked && this.player.raycasterContainer.selectedCoords){
            console.log('mouse down, player is locked and  selected coords');
            const position = this.player.position;
            this.world.removeBlock(position.x, position.y, position.z);
        }
    }
}