import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { World } from "./world";
import UI, { setupUI } from './ui';
import { Player } from "./player";
import { Physics } from './physics';
import { calculateAspect } from './positionHelper';

const stats = new Stats();

export default class Run{
    constructor(){

    }

    mainFunction() {
        console.log('config loaded', this.options);
        let sceneRenderer = this.sceneRenderer;
        let lights = this.lightingManager.lights;

        let worldSize = {width:this.options.worldwidth, height:this.options.worldheight};
        document.body.append(stats.dom);
                
        let playerCameraWrapper = this.cameraBuilder.buildSkyCamera(75, calculateAspect(), 0.1, 2000, 'Player camera');
        const orbitCameraWrapper = this.cameraBuilder.buildSkyCamera(75, calculateAspect(), 0.1, 2000, 'Orbit camera', this.options.cameraPosition);
        
        const player = new Player(this.sceneRenderer.scene, this.sceneRenderer.renderer.domElement, playerCameraWrapper, this.options.playerConfig);
        
        const physics = new Physics(this.sceneRenderer.scene);
        this.lightingManager.setUpAmbientLight(true, this.options.ambientLightIntinsity);
        let directionalLightingContainer = this.lightingManager.setUpDirectionalLight(true, 60,75,50, this.options.directionalLightIntinsity, true);

        this.sceneRenderer.setUpRenderer(orbitCameraWrapper);
        
        let controls = setupOrbitControls(this.sceneRenderer);
        
        this.sceneRenderer.renderer.setClearColor(this.options.skycolor);
        
        
        let world = new World(worldSize, this);
        world.generate();

        setupUI(this.gui, world, orbitCameraWrapper, player, directionalLightingContainer);
        
        let previousCamera = player.controls.isLocked ? 1 : 0;
        let previousTime = performance.now();

        function animate (time){
            let currentTime = performance.now();
            let dt = (currentTime - previousTime)/1000;
            stats.update();
            player.update(dt);
            controls.update();
            physics.update(dt, player, world, sceneRenderer.cameraName);
            updateCameraSelection();
            renderObjects(sceneRenderer, self.options);
            previousTime = currentTime;
        }

        this.sceneRenderer.renderer.setAnimationLoop(
            animate
        );

        

        function updateCameraSelection(){
            let currentCamera = player.controls.isLocked ? 1 : 0;
            if(currentCamera !== previousCamera){
                console.log('Camera changed!');
            }
            let cameraWrapper = player.controls.isLocked ? player.cameraWrapper : orbitCameraWrapper;
            
            sceneRenderer.renderScene(cameraWrapper);
            cameraWrapper.renderLookAt('look-at');
            orbitCameraWrapper.renderPosition('camera-position');
            previousCamera = currentCamera;
        }

        function renderObjects(sceneRenderer, options){
            let lightsWithShadow = lights.filter((light) => light.object.shadow);
            lightsWithShadow.filter((camera) => camera.object.isDirectionalLight == true).forEach((light) => {
                let editableLight = light.object;
                let editableHelper = light.helper;
                
                editableLight.shadow.camera.updateProjectionMatrix();
                // and now update the camera helper we're using to show the light's shadow camera
                if(editableHelper){
                    editableHelper.update();
                }
            })
    
            sceneRenderer.setupShadows(options, lightsWithShadow);

        }
    
        window.addEventListener('resize', () => {
            player.cameraWrapper.camera.aspect = calculateAspect();
            player.cameraWrapper.camera.updateProjectionMatrix();

            orbitCameraWrapper.camera.aspect = calculateAspect();
            orbitCameraWrapper.camera.updateProjectionMatrix();

            this.sceneRenderer.renderSetSize(window.innerWidth, window.innerHeight);
        })
    }
}

function setupOrbitControls(sceneRenderer){
    let controls = sceneRenderer.orbit;
    controls.target.set(1,1,1);
    controls.autoRotate = false;
    controls.update();

    return controls;
}

