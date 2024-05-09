import * as THREE from 'three'
import Main from "./js/main";
import { World } from "./js/world";

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { blocks, resources } from './js/blocks';
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
    camera = main.cameraBuilder.build(options.fov, calculateAspect(), options.near, options.far);
    camera.position.set(options.cameraPosition.x,options.cameraPosition.y,options.cameraPosition.z);
    
    let world = new World(worldSize, main, options.params);
    world.generate();

    main.sceneRenderer.setUpRenderer(camera);

    let controls = main.sceneRenderer.orbit;
    controls.target.set(64,1,64);
    controls.autoRotate = false;
    controls.update();

    String.prototype.toHex = function() {
        return this.split('').map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join('');
    };

    main.lightingManager.setUpAmbientLight(true, ambientLightIntinsity);
    main.lightingManager.setUpDirectionalLight(true, 90,75,50, directionalLightIntinsity, true);
    //main.lightingManager.setUpDirectionalLight(true, 50,50,50, directionalLightIntinsity, true);

    main.sceneRenderer.renderer.setAnimationLoop(animate);
    main.sceneRenderer.renderer.setClearColor(skyColor);
    
    createUI(world);
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
            editableHelper.update();
        })

        main.sceneRenderer.setupShadows(options, lightsWithShadow);
    }

    window.addEventListener('resize', () => {
        camera.aspect = calculateAspect();
        camera.updateProjectionMatrix();
        main.sceneRenderer.renderSetSize(window.innerWidth, window.innerHeight);
    })
});


function createUI(world){
    const gui = main.gui;
    
    gui.add(world.size, 'width',8 , 128, 1).name('Width').onChange(function(e){
        world.generate();
    });
    gui.add(world.size, 'height',8 , 128, 1).name('Height').onChange(function(e){
        world.generate();
    });
    const cameraFolder = gui.addFolder('Camera');
    cameraFolder.add(camera.position, 'x',-599 , 500, 10).name('X').onChange(function(e){
        
    });
    cameraFolder.add(camera.position, 'y',-599 , 500, 10).name('T').onChange(function(e){
        
    });
    cameraFolder.add(camera.position, 'z',8 , 64, 1).name('Z').onChange(function(e){
        
    });


    const terrainFolder = gui.addFolder('Terrain');
    terrainFolder.add(world.params, 'seed', 1 , 10000).name('Seed').onChange(function(e){
        world.generate();
    });
    terrainFolder.add(world.params.terrain, 'scale',10,100).name('Scale').onChange(function(e){
        world.generate();
    });
    terrainFolder.add(world.params.terrain, 'magnitude',0,1).name('Magnitude').onChange(function(e){
        world.generate();
    });
    terrainFolder.add(world.params.terrain, 'offset',0,1).name('Offset').onChange(function(e){
        world.generate();
    });

    const resourcesFolder = gui.addFolder('Resources');

    resources.forEach(resource => {
        resourcesFolder.add(resource,'scarcity',0,1).name('Scarcity ' + resource.name).onChange(function(e){
            world.generate();
        });
        const scaleFolder = resourcesFolder.addFolder('Scale ' + resource.name);
        scaleFolder.add(resource.scale,'x',10,100).name('X Scale').onChange(function(e){
            world.generate();
        });
        scaleFolder.add(resource.scale,'y',10,100).name('Y Scale').onChange(function(e){
            world.generate();
        });
        scaleFolder.add(resource.scale,'z',10,100).name('Z Scale').onChange(function(e){
            world.generate();
        });        
    });

}

function calculateAspect(){
    const perspectiveRatio = window.innerWidth/window.innerHeight;
    return perspectiveRatio;
}