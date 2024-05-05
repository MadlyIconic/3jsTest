import { load } from "./load";

export default class Settings{

    constructor(debug){
        this.options = {};
        
    }

    async loadConfig(){
        let localoptions = {};
        let mydatajson = load('../configfiles/mydata.json', this.populateOptions);
        
        Promise.resolve(mydatajson.then(function(data){
            localoptions = data
            return localoptions;
        })).then(value => {
            this.options = value;
            console.log(value);
        })
    }

    populateOptions = function(localoptions){
        localoptions = {
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
    }


}