
import EventDrivenObject from "./eventDrivenObject";
import { load } from "./load";

export default class Settings extends EventDrivenObject {

    constructor(configFile){
        super();
        self = this;
        this.events = {};
        this.registerEvent('loadconfig');
        this.options = {};
        this.configLoaded = false;
        Promise.resolve(this.loadConfig(configFile)).then(
            function(value){
                self.options = value;
                self.configLoaded = true;
                self.dispatchEvent('loadconfig');
            }
        );
    }

    async loadConfig(configFile){
        return load(configFile, this.populateOptions);
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