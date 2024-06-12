import Stats from 'three/examples/jsm/libs/stats.module.js';
import UI, { setupUI } from './ui';
import { Player } from "./player";
import { Physics } from './physics';
import { calculateAspect } from './positionHelper';
import { World } from './world';
import RayCasterContainer from './raycasterContainer';
import InputManager from './inputManager';

const stats = new Stats();

export default class Run{
    constructor(){

    }

    mainFunction() {
        console.log('config loaded', this.options);
        let sceneRenderer = this.sceneRenderer;
        let lights = this.lightingManager.lights;

        //let worldSize = {width:this.options.worldwidth, height:this.options.worldheight};
        document.body.append(stats.dom);
        
        let playerCameraWrapper = this.cameraBuilder.buildSkyCamera(75, calculateAspect(), 0.1, 2000, 'Player camera');
        const orbitCameraWrapper = this.cameraBuilder.buildSkyCamera(75, calculateAspect(), 0.1, 2000, 'Orbit camera', this.options.cameraPosition);
        
        const physics = new Physics(this.sceneRenderer.scene);

        this.sceneRenderer.setUpRenderer(orbitCameraWrapper);
        
        let controls = setupOrbitControls(this.sceneRenderer);
        
        this.sceneRenderer.renderer.setClearColor(this.options.skycolor);
        
        let world = new World(this);
        //let worldChunk = new WorldChunk(worldSize, this);
        let raycasterContainer = new RayCasterContainer(playerCameraWrapper, world);
        world.generate();
        const player = new Player(world, this.sceneRenderer.renderer.domElement, playerCameraWrapper, this.options.playerConfig, raycasterContainer);
        let inputmanager = new InputManager(player, world);

        setupUI(this.gui, world, orbitCameraWrapper, player, world.directionalLightingContainer);
        
        let previousCamera = player.controls.isLocked ? 1 : 0;
        let previousTime = performance.now();

        function animate (time){
            let currentTime = performance.now();
            let dt = (currentTime - previousTime)/1000;
            stats.update();
            
            controls.update();
            if(player.controls.isLocked){
                player.update(physics.timeStep);
                physics.update(dt, player, world, sceneRenderer.cameraName);
                if(world.initialWorldLoaded){
                    world.update(player);
                }
            }
            
            updateCameraSelection();
            renderObjects(sceneRenderer, self.options);
            
            previousTime = currentTime;
        }

        this.sceneRenderer.renderer.setAnimationLoop(
            // The animate function
            animate
        );

        

        function updateCameraSelection(){
            let currentCamera = player.controls.isLocked ? 1 : 0;
            if(currentCamera !== previousCamera){
                console.log('Camera changed!');
            }
            let cameraWrapper = player.controls.isLocked ? player.cameraWrapper : orbitCameraWrapper;
            
            sceneRenderer.renderScene(cameraWrapper);
            
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

