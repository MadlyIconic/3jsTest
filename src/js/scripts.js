import * as THREE from 'three';
import * as dat from 'dat.gui'; 
import SceneRenderer from './sceneRenderer';
import LightingManager from './lightingManager';
import nebula from '../img/nebula.jpg'
import stars from '../img/stars.jpg'
import BoxBuilder from './boxBuilder'
import PlaneBuilder from './planeBuilder';
import CameraBuilder from './cameraBuilder';
import SphereBuilder from './sphereBuilder';
import Settings from './settings';

const axesHelper = new THREE.AxesHelper(3);
const gui = new dat.GUI();
const gridHelper = new THREE.GridHelper(30,10)
const sceneRenderer = new SceneRenderer(nebula, stars);
const lightingManager = new LightingManager(sceneRenderer);
const boxBuilder = new BoxBuilder();
const cameraBuilder = new CameraBuilder();
const planeBuilder = new PlaneBuilder();
const sphereBuilder = new SphereBuilder();
const settings = new Settings(true);

const options =settings.options;

let step = 0;
const boxColor = 0x00FF00
const spotlightAngle = 0.4;
const sphereRadius = 4;
const perspectiveRatio = window.innerWidth/window.innerHeight;
const fov = 75;
const near = 0.1;
const far = 200;
const ambientLightIntinsity = 0.01;
const spotLightIntinsity = 2000;
const directionalLightIntinsity = 1;

const camera = cameraBuilder.build(fov, perspectiveRatio, near, far);

let lights = lightingManager.lights;

const box = boxBuilder.build(boxColor);
const plane = planeBuilder.build(0xFFFFFF,100,100);
const sphere = sphereBuilder.build(sphereRadius, 50, 50, options.wireframe);
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
lightingManager.setUpDirectionalLight(true, -30, 50, 0, directionalLightIntinsity);
lightingManager.setUpSpotLight(true, -50, 50, 0, spotLightIntinsity, spotlightAngle);

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
    sphere.material.wireframe =  options.wireframe;
    box.material.wireframe =  options.wireframe;
}

sceneRenderer.setUpRenderer(camera);
sceneRenderer.renderer.setAnimationLoop(animate);


