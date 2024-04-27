import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
const fov = 75;
const perspectiveRatio = window.innerWidth/window.innerHeight;
const near = 0.1;
const far = 1000;
const renderer = new THREE.WebGLRenderer();

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
const boxMaterial = new THREE.MeshBasicMaterial({color:0x00FF00}) 
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.rotation.x = 5;
box.rotation.y = 5;
camera.position.z = 5;
camera.position.y = 2;
camera.position.x = 0;
orbit.update();
scene.add(axesHelper);
scene.add(box);

function animate(time){
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;
    renderer.render(scene,camera);
}

renderer.setAnimationLoop(animate);
