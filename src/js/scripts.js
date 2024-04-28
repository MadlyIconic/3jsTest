import * as THREE from 'three';
import * as dat from 'dat.gui'; 
import sceneRenderer from './sceneRenderer';
import lightingManager from './lightingManager';

sceneRenderer.getScene();
const sphereRadius = 4;
const fov = 45;
const perspectiveRatio = window.innerWidth/window.innerHeight;
const near = 0.1;
const far = 1000;

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
    shadowmap: true
}


let step = 0;
let boxColor = 0x00FF00

sceneRenderer.setUpRenderer(camera);

const axesHelper = new THREE.AxesHelper(3);

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshStandardMaterial({
    color: boxColor
}) 
const box = new THREE.Mesh(boxGeometry, boxMaterial);

const planeGeometry = new THREE.PlaneGeometry(30,30);
const planeMaterial = new THREE.MeshStandardMaterial({
    color:0xaaaeFF,
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);

const sphereGeometry = new THREE.SphereGeometry(sphereRadius,50,50);
const sphereMaterial = new THREE.MeshStandardMaterial({
    wireframe: options.shadowmap
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
gui.add(options, 'speed',0,0.1);
gui.add(options, 'shadowmap').onChange(function(e){
    sceneRenderer.renderer.shadowMap.enabled = e;
})
box.rotation.x = 5;
box.rotation.y = 5;
camera.position.z = 50;
camera.position.y = 50;
camera.position.x = 0;

sceneRenderer.addToScene(axesHelper);
sceneRenderer.addToScene(box);
sceneRenderer.addToScene(sphere);
sceneRenderer.addToScene(plane);
sceneRenderer.addToScene(gridHelper);



lightingManager.setUpAmbientLight();
directionalLight = lightingManager.setUpDirectionalLight();

function animate(time){
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;
    renderObjects();
    sceneRenderer.renderScene(camera);
}

function renderObjects(){
    sceneRenderer.setupShadows(options, directionalLight, sphere, plane);
    step += options.speed;
    sphere.position.y = 10 *Math.abs(Math.sin(step));
    sphere.material.wireframe = options.wireframe;
    sphere.material.color.set(options.sphereColor);
    sphereMaterial.wireframe =  options.wireframe;
}

sceneRenderer.setUpAnimationLoop(animate);


