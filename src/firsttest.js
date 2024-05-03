import Main from "./js/main";
let step = 0;
const perspectiveRatio = window.innerWidth/window.innerHeight;
const main = new Main();
const options = main.settings.options;

const boxColor = 0x00FF00
const spotlightAngle = 0.4;
const sphereRadius = 4;
const ambientLightIntinsity = 0.01;
const spotLightIntinsity = 2000;
const directionalLightIntinsity = 1;
const gui = main.gui;
const camera = main.cameraBuilder.build(options.fov, perspectiveRatio, options.near, options.far);

let lights = main.lightingManager.lights;

const box = main.boxBuilder.build(boxColor);
const plane = main.planeBuilder.build(0xFFFFFF,100,100);
const sphere = main.sphereBuilder.build(sphereRadius, 50, 50, options.wireframe);
sphere.position.set(-10, 10, 0);

plane.rotateX(-0.5 * Math.PI);

gui.addColor(options, 'sphereColor').onChange(function(e){
    sphere.material.color.set(e);
});
gui.add(options, 'wireframe').onChange(function(e){
    sphere.material.wireframe = e;
});
gui.add(options, 'speed',0 , 0.1);
gui.add(options, 'angle',0 , 1);
gui.add(options, 'penumbra',0 , 1);
gui.add(options, 'intensity',0 , spotLightIntinsity);
gui.add(options, 'shadowmap').onChange(function(e){
    main.sceneRenderer.renderer.shadowMap.enabled = e;
})
box.rotation.x = 5;
box.rotation.y = 5;
camera.position.z = 40;
camera.position.y = 30;
camera.position.x = -20;

main.sceneRenderer.addToScene(main.axesHelper);
main.sceneRenderer.addToScene(box);
main.sceneRenderer.addToScene(sphere);
main.sceneRenderer.addToScene(plane);
main.sceneRenderer.addToScene(main.gridHelper);



main.lightingManager.setUpAmbientLight(true, ambientLightIntinsity);
main.lightingManager.setUpDirectionalLight(true, -30, 50, 0, directionalLightIntinsity);
main.lightingManager.setUpSpotLight(true, -50, 50, 0, spotLightIntinsity, spotlightAngle);

function animate(time){
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;
    renderObjects();
    main.sceneRenderer.renderScene(camera);
}

function renderObjects(){
    let lightsWithShadow = lights.filter((light) => light.object.shadow);
    main.sceneRenderer.setupShadows(options, lightsWithShadow, sphere, plane, box);
    step += options.speed;

    sphere.position.y = 10 *Math.abs(Math.sin(step));
    sphere.material.wireframe = options.wireframe;
    sphere.material.color.set(options.sphereColor);
    sphere.material.wireframe =  options.wireframe;
    box.material.wireframe =  options.wireframe;
}

main.sceneRenderer.setUpRenderer(camera);
main.sceneRenderer.renderer.setAnimationLoop(animate);


