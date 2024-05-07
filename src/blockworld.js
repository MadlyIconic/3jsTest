import * as THREE from 'three'
import Main from "./js/main";
import { World } from "./js/world";
import Stats from 'three/examples/jsm/libs/stats.module.js';
const stats = new Stats();
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
    let camera = main.cameraBuilder.build(options.fov, calculateAspect(), options.near, options.far);
    camera.position.set(-32,16,-32);
    //camera.lookAt(0,0,0);

    let world = new World(worldSize, main);
    const boxGeometry = new THREE.BoxGeometry();
    const boxMaterial = new THREE.MeshLambertMaterial({color: 0x00a0e0})
    world.generate(boxGeometry, boxMaterial);


    main.sceneRenderer.setUpRenderer(camera);

    let controls = main.sceneRenderer.orbit;
    controls.target.set(16,0,16);
    controls.update();

    String.prototype.toHex = function() {
        return this.split('').map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join('');
    };

    main.sceneRenderer.renderer.setAnimationLoop(animate);
    main.sceneRenderer.renderer.setClearColor(skyColor);
    main.lightingManager.setUpAmbientLight(true, ambientLightIntinsity);
    main.lightingManager.setUpDirectionalLight(true, 10,10,1, directionalLightIntinsity);
    main.lightingManager.setUpDirectionalLight(true, -1,1,-0.5, directionalLightIntinsity/2);

    function animate(time){
        stats.update();
        renderObjects();
        main.sceneRenderer.renderScene(camera);
    }

    function renderObjects(){
        let lightsWithShadow = lights.filter((light) => light.object.shadow);
        let theBlocks = main.sceneRenderer.scene.children.filter((e) => e.name == "TheBlocks");
        
        main.sceneRenderer.setupShadows(options, lightsWithShadow, null, null, theBlocks);

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