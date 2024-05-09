import Main from "./js/main";
import { World } from "./js/world";

import Stats from 'three/examples/jsm/libs/stats.module.js';
import UI from './js/ui';
const stats = new Stats();
var camera = null;

document.body.append(stats.dom);
const main = new Main('../configfiles/blockworld.json', 'myCanvas');
main.addEventListener('configloaded', function () {
    console.log('config loaded', main.options);
    let lights = main.lightingManager.lights;
    let options = main.options;
    let worldWidth = options.worldwidth;
    let worldHeight = options.worldheight;
    let worldSize = {width:worldWidth, height:worldHeight};
    let skyColor = options.skycolor;
    const directionalLightIntinsity = options.directionalLightIntinsity;
    const ambientLightIntinsity = options.ambientLightIntinsity;
    // camera = main.cameraBuilder.build(options.fov, calculateAspect(), options.near, options.far);
    // camera.position.set(options.cameraPosition.x,options.cameraPosition.y,options.cameraPosition.z);
    camera = main.cameraBuilder.build(75, calculateAspect(), 0.1, 2000);
    camera.position.set(136,26,31);
    
    let world = new World(worldSize, main, options.params);
    world.generate();

    main.sceneRenderer.setUpRenderer(camera);

    let controls = main.sceneRenderer.orbit;
    controls.target.set(1,1,1);
    controls.autoRotate = false;
    controls.update();

    String.prototype.toHex = function() {
        return this.split('').map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join('');
    };

    main.lightingManager.setUpAmbientLight(true, ambientLightIntinsity);
    main.lightingManager.setUpDirectionalLight(true, 60,75,50, directionalLightIntinsity, true);
    //main.lightingManager.setUpDirectionalLight(true, 50,50,50, directionalLightIntinsity, true);

    main.sceneRenderer.renderer.setAnimationLoop(animate);
    main.sceneRenderer.renderer.setClearColor(skyColor);
    let ui = new UI(main.gui, world, camera);
    ui.createUI();
    function animate(time){
        stats.update();
        renderObjects();
        main.sceneRenderer.renderScene(camera);
        controls.update();
    }

    function renderObjects(){
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

        main.sceneRenderer.setupShadows(options, lightsWithShadow);
    }

    window.addEventListener('resize', () => {
        camera.aspect = calculateAspect();
        camera.updateProjectionMatrix();
        main.sceneRenderer.renderSetSize(window.innerWidth, window.innerHeight);
    })
});




function calculateAspect(){
    const perspectiveRatio = window.innerWidth/window.innerHeight;
    return perspectiveRatio;
}