import * as THREE from 'three';
import * as dat from 'dat.gui'; 
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { DirectionalLightHelper } from 'three';
const sphereRadius = 4;
const fov = 45;
const perspectiveRatio = window.innerWidth/window.innerHeight;
const near = 0.1;
const far = 1000;
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
let step = 0;

const gui = new dat.GUI();

const options = {
    sphereColor: '#ffea00',
    wireframe: true,
    speed: 0.01,
    shadowmap: true
}
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    fov,
    perspectiveRatio,
    near,
    far
);

const orbit = new OrbitControls(camera,renderer.domElement);
const axesHelper = new THREE.AxesHelper(3);

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshStandardMaterial({
    color:0x00FF00
}) 
const box = new THREE.Mesh(boxGeometry, boxMaterial);

const planeGeometry = new THREE.PlaneGeometry(30,30);
const planeMaterial = new THREE.MeshStandardMaterial({
    color:0xFFFFFF,
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);

const sphereGeometry = new THREE.SphereGeometry(sphereRadius,50,50);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color:0x0000FF,
    wireframe: false
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = 0;
sphere.position.y = sphereRadius;
sphere.position.z = 8;
sphere.castShadow = true;

plane.rotation.x = -0.5 * Math.PI;
//plane.rotateX(-0.5 * Math.PI);
plane.receiveShadow = true;
const gridHelper = new THREE.GridHelper(30,10)



gui.addColor(options, 'sphereColor').onChange(function(e){
    sphere.material.color.set(e);
});
gui.add(options, 'wireframe').onChange(function(e){
    sphere.material.wireframe = e;  
});
gui.add(options, 'speed',0,0.1);
gui.add(options, 'shadowmap').onChange(function(e){
    renderer.shadowMap.enabled = e;  
})
box.rotation.x = 5;
box.rotation.y = 5;
camera.position.z = -10;
camera.position.y = 30;
camera.position.x = 30;
orbit.update();
scene.add(axesHelper);
scene.add(box);
scene.add(sphere);
scene.add(plane);
scene.add(gridHelper);

const ambientLight = new THREE.AmbientLight(0xFFFFFF);
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 8);
const directionalLightHelper = new DirectionalLightHelper(directionalLight,5);
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
directionalLight.position.set(-30, 20, 0);
directionalLight.castShadow = true;
scene.add(ambientLight);
scene.add(directionalLight);
scene.add(directionalLightHelper);
scene.add(directionalLightCameraHelper);
function animate(time){
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;
    step += options.speed;
    sphere.position.y = 10 *Math.abs(Math.sin(step));
    renderer.render(scene,camera);
}

renderer.setAnimationLoop(animate);
