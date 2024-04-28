import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();

function setUpRenderer(camera){
    document.body.appendChild(renderer.domElement);
    renderer.setSize(window.innerWidth, window.innerHeight);
    const orbit = new OrbitControls(camera,renderer.domElement);
    orbit.update();
}

function renderScene(camera){
    renderer.render(scene,camera);
}

function getScene(){
    console.log('Returning a previously created scene');
    return scene;
}

function addToScene(obj){
    scene.add(obj);
}

function setupShadows(options, directionalLight, sphere, plane){
        renderer.shadowMap.enabled = options.shadowmap;
        directionalLight.castShadow = options.shadowmap;    
        sphere.castShadow = options.shadowmap;
        plane.receiveShadow = options.shadowmap;    
}

function setUpAnimationLoop(animate){
    renderer.setAnimationLoop(animate);
}

exports.renderer = renderer;
exports.setUpAnimationLoop = setUpAnimationLoop;
exports.setUpRenderer = setUpRenderer;
exports.renderScene = renderScene;
exports.addToScene = addToScene;
exports.getScene = getScene;
exports.setupShadows = setupShadows;