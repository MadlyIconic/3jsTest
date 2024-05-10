import Stats from 'three/examples/jsm/libs/stats.module.js';
import { World } from "./world";
import UI from './ui';
import { Player } from "./player";

const stats = new Stats();

export default class Run{
    constructor(){

    }

    mainFunction() {
        console.log('config loaded', this.options);
        let worldSize = {width:this.options.worldwidth, height:this.options.worldheight};
        document.body.append(stats.dom);
        let sceneRenderer = this.sceneRenderer;
        let lights = this.lightingManager.lights;
        let options = this.options;

        let skyColor = options.skycolor;
        const directionalLightIntinsity = options.directionalLightIntinsity;
        const ambientLightIntinsity = options.ambientLightIntinsity;
        // camera = main.cameraBuilder.build(options.fov, calculateAspect(), options.near, options.far);
        // camera.position.set(options.cameraPosition.x,options.cameraPosition.y,options.cameraPosition.z);
        let camera = this.cameraBuilder.build(75, calculateAspect(), 0.1, 2000);

        camera.position.set(136,26,31);
        
        sceneRenderer.setUpRenderer(camera);
    
        let controls = setupOrbitControls(sceneRenderer);
    
        this.lightingManager.setUpAmbientLight(true, ambientLightIntinsity);
        this.lightingManager.setUpDirectionalLight(true, 60,75,50, directionalLightIntinsity, true);
        //main.lightingManager.setUpDirectionalLight(true, 50,50,50, directionalLightIntinsity, true);
        let previousTime = performance.now();
        function animate (time){
            let currentTime = performance.now();
            let dt = (currentTime - previousTime)/1000;
            stats.update();
            player.applyInputs(dt);
            renderObjects(sceneRenderer);
            //main.sceneRenderer.renderScene(camera);
            sceneRenderer.renderScene(player.camera);
            controls.update();
            previousTime = currentTime;
        }

        this.sceneRenderer.renderer.setAnimationLoop(
            animate
        );
        this.sceneRenderer.renderer.setClearColor(skyColor);
        
    
        let world = new World(worldSize, this, options.params);
        world.generate();
        let ui = new UI(this.gui, world, camera);
        ui.createUI();
    
        const player = new Player(this.sceneRenderer);
    
        function renderObjects(sceneRenderer){
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
            camera.aspect = calculateAspect();
            camera.updateProjectionMatrix();
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

function calculateAspect(){
    const perspectiveRatio = window.innerWidth/window.innerHeight;
    return perspectiveRatio;
}