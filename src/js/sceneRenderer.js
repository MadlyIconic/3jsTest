import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export default class SceneRenderer {
    
    constructor(){
        let self = this;
        this.renderer = new THREE.WebGLRenderer();
        document.body.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
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
    
    setupShadows(options, directionalLight, sphere, plane){
        this.renderer.shadowMap.enabled = options.shadowmap;
        directionalLight.castShadow = options.shadowmap;    
        sphere.castShadow = options.shadowmap;
        plane.receiveShadow = options.shadowmap;    
    }
    
    setUpAnimationLoop(animate){
        renderer.setAnimationLoop(animate);
    }
}



// exports.renderer = renderer;
// exports.setUpAnimationLoop = setUpAnimationLoop;
// exports.setUpRenderer = setUpRenderer;
// exports.renderScene = renderScene;
// exports.addToScene = addToScene;
// exports.getScene = getScene;
// exports.setupShadows = setupShadows;