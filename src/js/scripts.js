import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
const fov = 45;
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
const boxMaterial = new THREE.MeshBasicMaterial({
    color:0x00FF00
}) 
const box = new THREE.Mesh(boxGeometry, boxMaterial);

const planeGeometry = new THREE.PlaneGeometry(30,30);
const planeMaterial = new THREE.MeshBasicMaterial({
    color:0xFFFFFF,
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);

const sphereGeometry = new THREE.SphereGeometry(4,50,50);
const sphereMaterial = new THREE.MeshBasicMaterial({
    color:0x0000FF,
    wireframe: true
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

plane.rotation.x = -0.5 * Math.PI;
//plane.rotateX(-0.5 * Math.PI);
const gridHelper = new THREE.GridHelper(30,10)

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

function animate(time){
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;
    renderer.render(scene,camera);
}

renderer.setAnimationLoop(animate);
