import mydatajson from '../configfiles/mydata.json'

export default class Settings{

    constructor(debug){
        this.options = {
            sphereColor: mydatajson.sphereColor,
            wireframe: mydatajson.wireframe,
            speed: mydatajson.speed,
            shadowmap: mydatajson.shadowmap,
            angle: mydatajson.angle,
            penumbra: mydatajson.penumbra,
            intensity: mydatajson.intensity,
            fov: mydatajson.fov,
            near: mydatajson.near,
            far: mydatajson.far
        }

        if(debug){
            console.log(this.options);
        }
    }

}