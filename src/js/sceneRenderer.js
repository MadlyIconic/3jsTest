import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export default class SceneRenderer {
    
    constructor(width, height, canvasName){
        let self = this;
        this.orbit = null;
        let myCanvas = document.getElementById(canvasName);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: myCanvas });
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(width, height);
        document.body.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
    }
        
    setUpRenderer(camera){
        let self = this;
        self.orbit = new OrbitControls(camera,this.renderer.domElement);
        self.orbit.update();
    }
    
    renderScene(camera){
        this.renderer.render(this.scene,camera);
    }

    renderSetSize(width, height){
        this.renderer.setSize(width, height);
    }
    
    getScene(){
        return this.scene;
    }
    
    addToScene(obj){
        this.scene.add(obj);
    }
    
    setupShadows(options, lights){
        this.renderer.shadowMap.enabled = options.shadowmap;
        lights.forEach(light => {
            if(light.name == 'spotLight'){
                light.object.castShadow = options.shadowmap;
                light.object.angle = options.angle;
                light.object.penumbra = options.penumbra;
                light.object.intensity = options.spotLightIntensity;
                if(light.helper){
                    light.helper.update();
                }
                
            }

            if(light.name == 'directionalLight'){
                light.object.castShadow = options.shadowmap;
                light.object.angle = options.angle;
                light.object.penumbra = options.penumbra;
                light.object.intensity = options.directionalLightIntinsity;
                if(light.helper){
                    light.helper.update();
                }
                
            }

            if(light.name == 'ambientLight'){
                light.object.angle = options.angle;
                light.object.penumbra = options.penumbra;
                light.object.intensity = options.intinsity;
                if(light.helper){
                    light.helper.update();
                }
                
            }

            light.object.castShadow = options.shadowmap;        
        });        
    }
    
    setUpAnimationLoop(animate){
        renderer.setAnimationLoop(animate);
    }
}