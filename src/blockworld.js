import * as THREE from 'three'
import Main from "./js/main";
import { World } from "./js/world";
import Stats from 'three/examples/jsm/libs/stats.module.js';
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
    camera.position.set(32,86,-1);
    //camera.lookAt(0,0,0);

    let world = new World(worldSize, main, options.params);
    const boxGeometry = new THREE.BoxGeometry();
    const boxMaterial = new THREE.MeshLambertMaterial({color: 0x00a0e0})
    world.generate(boxGeometry, boxMaterial);

    main.sceneRenderer.setUpRenderer(camera);

    let controls = main.sceneRenderer.orbit;
    controls.target.set(64,1,64);
    controls.autoRotate = false;
    controls.update();

    String.prototype.toHex = function() {
        return this.split('').map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join('');
    };

    main.sceneRenderer.renderer.setAnimationLoop(animate);
    main.sceneRenderer.renderer.setClearColor(skyColor);
    main.lightingManager.setUpAmbientLight(true, ambientLightIntinsity);
    //main.lightingManager.setUpDirectionalLight(true, 180,100,400, directionalLightIntinsity, true);
    main.lightingManager.setUpDirectionalLight(true, 380,200,500, directionalLightIntinsity, true);

    createUI(world);
    function animate(time){
        stats.update();
        renderObjects();
        main.sceneRenderer.renderScene(camera);
        controls.update();
    }

    function renderObjects(){
        let lightsWithShadow = lights.filter((light) => light.object.shadow);
        let theBlocks = main.sceneRenderer.scene.children.filter((e) => !e.isLight);
        lightsWithShadow.filter((camera) => camera.object.isDirectionalLight == true).forEach((e) => {
            // Attempt at getting a light to rotate like the sun
            // camera.position.copy( theBlocks );
            // camera.position.x+=Math.sin(camera.rotationy)*3;
            // camera.position.z+=Math.cos(camera.rotationy)*3;
            // camera.position.y+=cameraHeight; // optional
            // tempVector.copy(theBlocks).y+=cameraHeight; // the += is optional
            // camera.lookAt( tempVector );
        })

        main.sceneRenderer.setupShadows(options, lightsWithShadow, null, null, theBlocks);

        

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
    terrainFolder.add(world.params.terrain, 'scale',10,100).name('Scale').onChange(function(e){
        world.generate();
    });
    terrainFolder.add(world.params.terrain, 'magnitude',0,1).name('Magnitude').onChange(function(e){
        world.generate();
    });
    terrainFolder.add(world.params.terrain, 'offset',0,1).name('Offset').onChange(function(e){
        world.generate();
    });
    // gui.add(world, 'threshold',0 , 1).name('Noise').onChange(function(e){
    //     world.generate();
    // });
    //gui.add(world, 'generate');
}

function calculateAspect(){
    const perspectiveRatio = window.innerWidth/window.innerHeight;
    return perspectiveRatio;
}