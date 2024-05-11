import * as THREE from 'three';
import { blocks } from './blocks';

export class Physics {
    constructor(){
        this.cameraName = null;
    }

    update(dt, player, world, cameraName){
        this.cameraName = cameraName;
        this.detectCollisions(player, world);
    }

    detectCollisions(player, world){
        const candidates = this.broadPhase(player, world);
        const collisions = this.narrowPhase(candidates, player);

        if(collisions.length > 0){
            this.resolveCollisions(collisions);
        }
    }
    
    resolveCollisions(collisions){

    }

    narrowPhase(candidates, player){
        return candidates;
    }

    broadPhase(player, world){
        const candidates = [];
        const extents = {
            x: {
                min: Math.floor(player.position.x - player.radius),
                max: Math.ceil(player.position.x + player.radius),
            },
            y: {
                min: Math.floor(player.position.y - player.height),
                max: Math.ceil(player.position.y)
            },
            z: {
                min: Math.floor(player.position.z - player.radius),
                max: Math.ceil(player.position.z + player.radius),
            }
        }

        for (let x = extents.x.min; x <= extents.x.max; x++) {
            for (let y = extents.y.min; y <= extents.y.max; y++) {
                for (let z = extents.z.min; z <= extents.z.max; z++) {
                    const block = world.getBlock(x,y,z,world.size);
                    if(block && block.id !== blocks.empty.id){
                        candidates.push(block);
                    }
                }
            }
        }
        
        if(this.cameraName.includes('Player')){
            let collisionsMessage = `Camera name: ${this.cameraName}, Broadphase candidates: ${candidates.length}`;
            document.getElementById('collisions').innerHTML = collisionsMessage;
        }else{
            let collisionsMessage = `Camera name: ${this.cameraName}`;
            document.getElementById('collisions').innerHTML = collisionsMessage;
        }

        return candidates;
    }
        
}
