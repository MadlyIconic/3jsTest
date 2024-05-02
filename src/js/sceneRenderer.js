import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export default class SceneRenderer {
    
    constructor(nebula, stars){
        let self = this;
        this.renderer = new THREE.WebGLRenderer();
        document.body.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        const cubeTextureLoader = new THREE.CubeTextureLoader();
        // this.scene.background = cubeTextureLoader.load([
        //     nebula,
        //     nebula,
        //     stars,
        //     stars,
        //     stars,
        //     stars,
        // ]);
    }
        
    setUpRenderer(camera){
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.orbit = new OrbitControls(camera,this.renderer.domElement);
        this.orbit.update();
    }
    
    renderScene(camera){
        this.renderer.render(this.scene,camera);
    }
    
    getScene(){
        return this.scene;
    }
    
    addToScene(obj){
        this.scene.add(obj);
    }
    
    setupShadows(options, lights, sphere, plane, box){
        this.renderer.shadowMap.enabled = options.shadowmap;
        lights.forEach(light => {
            if(light.name == 'spotLight'){
                light.object.angle = options.angle;
                light.object.penumbra = options.penumbra;
                light.object.intensity = options.intensity;
                light.helper.update();
            }
            light.object.castShadow = options.shadowmap;        
        });
        
        box.castShadow = options.shadowmap;
        sphere.castShadow = options.shadowmap;
        plane.receiveShadow = options.shadowmap;    
    }
    
    setUpAnimationLoop(animate){
        renderer.setAnimationLoop(animate);
    }
}