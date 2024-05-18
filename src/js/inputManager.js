export default class InputManager{
    constructor(player){
        this.player = player;
        document.addEventListener('mousedown', this.onMouseDown);
    }

    onMouseDown(event){
        if(this.player.controls.isLocked){
            
        }
        console.log('mouse down');
    }
}