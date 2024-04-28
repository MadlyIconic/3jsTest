import * as THREE from 'three';
import * as dat from 'dat.gui'; 
import SceneRenderer from './sceneRenderer';
import LightingManager from './lightingManager';
const sceneRenderer = new SceneRenderer();
const lightingManager = new LightingManager(sceneRenderer);
//sceneRenderer.getScene();
const sphereRadius = 4;
const fov = 75;
const perspectiveRatio = window.innerWidth/window.innerHeight;
const near = 0.1;
const far = 100;

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
let lights = lightingManager.lights;

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
camera.position.z = 40;
camera.position.y = 30;
camera.position.x = -20;

sceneRenderer.addToScene(axesHelper);
sceneRenderer.addToScene(box);
sceneRenderer.addToScene(sphere);
sceneRenderer.addToScene(plane);
sceneRenderer.addToScene(gridHelper);



lightingManager.setUpAmbientLight();
lightingManager.setUpDirectionalLight(true);
lightingManager.setUpSpotLight();
const selectedLightName = lightingManager.selectedLightName;
function animate(time){
    console.log('selectedLightName', selectedLightName);
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;
    renderObjects(selectedLightName);
    sceneRenderer.renderScene(camera);
}

function renderObjects(selectedLight){
    let light = lights.find((element) => element.name == selectedLight);
    if(light){
        sceneRenderer.setupShadows(options, light.object, sphere, plane);
    }
    
    step += options.speed;
    sphere.position.y = 10 *Math.abs(Math.sin(step));
    sphere.material.wireframe = options.wireframe;
    sphere.material.color.set(options.sphereColor);
    sphereMaterial.wireframe =  options.wireframe;
}

sceneRenderer.setUpRenderer(camera);
sceneRenderer.renderer.setAnimationLoop(animate);


