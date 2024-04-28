import * as THREE from 'three';
import * as dat from 'dat.gui'; 
import SceneRenderer from './sceneRenderer';
import LightingManager from './lightingManager';
import nebula from '../img/nebula.jpg'
import stars from '../img/stars.jpg'
const sceneRenderer = new SceneRenderer(nebula, stars);
const lightingManager = new LightingManager(sceneRenderer);
//sceneRenderer.getScene();
const sphereRadius = 4;
const fov = 75;
const perspectiveRatio = window.innerWidth/window.innerHeight;
const near = 0.1;
const far = 100;
const ambientLightIntinsity = 0.01;
const spotLightIntinsity = 2000;
const directionalLightIntinsity = 1;

const gridHelper = new THREE.GridHelper(30,10)
const camera = new THREE.PerspectiveCamera(
    fov,
    perspectiveRatio,
    near,
    far
);

const gui = new dat.GUI();
const options = {
    sphereColor: '#ff00ff',
    wireframe: false,
    speed: 0.02,
    shadowmap: true,
    angle: 0.05,
    penumbra: 0,
    intensity: 200
}


let step = 0;
let boxColor = 0x00FF00
let lights = lightingManager.lights;

const axesHelper = new THREE.AxesHelper(3);

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshStandardMaterial({
    color: boxColor
}) 
const box = new THREE.Mesh(boxGeometry, boxMaterial);

const planeGeometry = new THREE.PlaneGeometry(30,30);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);

const sphereGeometry = new THREE.SphereGeometry(sphereRadius,50,50);
const sphereMaterial = new THREE.MeshStandardMaterial({
    wireframe: options.wireframe
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(-10, 10, 0);

plane.rotateX(-0.5 * Math.PI);


gui.addColor(options, 'sphereColor').onChange(function(e){
    sphere.material.color.set(e);
});
gui.add(options, 'wireframe').onChange(function(e){
    sphere.material.wireframe = e;  
});
gui.add(options, 'speed',0 , 0.1);
gui.add(options, 'angle',0 , 1);
gui.add(options, 'penumbra',0 , 1);
gui.add(options, 'intensity',0 , spotLightIntinsity);
gui.add(options, 'shadowmap').onChange(function(e){
    sceneRenderer.renderer.shadowMap.enabled = e;
})
box.rotation.x = 5;
box.rotation.y = 5;
camera.position.z = 40;
camera.position.y = 30;
camera.position.x = -20;

sceneRenderer.addToScene(axesHelper);
sceneRenderer.addToScene(box);
sceneRenderer.addToScene(sphere);
sceneRenderer.addToScene(plane);
sceneRenderer.addToScene(gridHelper);



lightingManager.setUpAmbientLight(true, ambientLightIntinsity);
//lightingManager.setUpDirectionalLight(true, -30, 50, 0, directionalLightIntinsity);
lightingManager.setUpSpotLight(true, -50, 50, 0, spotLightIntinsity);

function animate(time){
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;
    renderObjects();
    sceneRenderer.renderScene(camera);
}

function renderObjects(){
    let lightsWithShadow = lights.filter((light) => light.object.shadow);
    sceneRenderer.setupShadows(options, lightsWithShadow, sphere, plane, box);
    step += options.speed;
    
    sphere.position.y = 10 *Math.abs(Math.sin(step));
    sphere.material.wireframe = options.wireframe;
    sphere.material.color.set(options.sphereColor);
    sphereMaterial.wireframe =  options.wireframe;
    boxMaterial.wireframe =  options.wireframe;
}

sceneRenderer.setUpRenderer(camera);
sceneRenderer.renderer.setAnimationLoop(animate);


