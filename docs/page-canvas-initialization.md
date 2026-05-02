# Blockworld Application Initialization

## Overview
The Blockworld application is a Minecraft-like simulator built with JavaScript using Three.js for 3D rendering on an HTML5 Canvas. This document focuses on how the web page and canvas are initialized, from loading the HTML to setting up the rendering environment.

## HTML Structure
The application starts with a simple HTML file (`src/blockworld.html`) that provides the basic page structure:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <link rel="stylesheet" href="styles/styles.css">
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>The Three.js Tutorial</title>
        <style>
            body{margin:0}
        </style>
    </head>
    <body>
        <script src="./blockworld.js" type="module"></script>
        <div id="gameContainer" tabindex="0">
            <canvas id="myCanvas"></canvas>
        </div>
        <div id="info">
            <div id="player-position"></div>
            <div id="camera-position"></div>
            <div id="collisions"></div>
            <div id="collisions2"></div>
            <div id="chunk"></div>
            <div id="look-at"></div>
            <div id="block"></div>
        </div>
    </body>
</html>
```

Key elements:
- **Canvas Container**: A `<div id="gameContainer">` wraps the `<canvas id="myCanvas">` and has `tabindex="0"` to make it focusable for pointer lock controls
- **Info Panel**: A `<div id="info">` contains various debug information displays
- **Script Loading**: The main JavaScript is loaded via `<script src="./blockworld.js" type="module"></script>`

## JavaScript Entry Point
The `src/blockworld.js` file serves as the application's entry point:

```javascript
import Main from './js/main.js';

const main = new Main();
main.loadConfig('./configfiles/blockworld.json').then(() => {
    main.run();
});
```

This file:
1. Imports the `Main` class from `js/main.js`
2. Creates a new `Main` instance
3. Loads configuration from `configfiles/blockworld.json`
4. Calls `main.run()` to start the application

## Main Class and Configuration Loading
The `Main` class (`src/js/main.js`) handles the overall application lifecycle:

```javascript
export default class Main extends EventDrivenObject {
    constructor() {
        super();
        this.options = {};
    }

    async loadConfig(configPath) {
        const response = await fetch(configPath);
        this.options = await response.json();
        console.log('config loaded', this.options);
    }

    run() {
        // Create core systems
        this.sceneRenderer = new SceneRenderer(this.options);
        this.lightingManager = new LightingManager(this.sceneRenderer.scene, this.options);
        this.cameraBuilder = new CameraBuilder();
        this.planeBuilder = new PlaneBuilder();
        this.boxBuilder = new BoxBuilder();
        this.sphereBuilder = new SphereBuilder();
        
        // Start the run loop
        const runInstance = new Run();
        runInstance.options = this.options;
        runInstance.sceneRenderer = this.sceneRenderer;
        runInstance.lightingManager = this.lightingManager;
        runInstance.cameraBuilder = this.cameraBuilder;
        runInstance.planeBuilder = this.planeBuilder;
        runInstance.boxBuilder = this.boxBuilder;
        runInstance.sphereBuilder = this.sphereBuilder;
        runInstance.mainFunction();
    }
}
```

The `loadConfig` method asynchronously fetches and parses the JSON configuration file, which contains settings for world size, player properties, lighting, and other game parameters.

## Canvas and Renderer Setup
The actual canvas initialization happens in the `SceneRenderer` class (`src/js/sceneRenderer.js`):

```javascript
export default class SceneRenderer {
    constructor(config) {
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('myCanvas'),
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // Additional renderer configuration...
    }

    setUpRenderer(cameraWrapper) {
        // Set up camera and rendering loop
    }
}
```

The `SceneRenderer`:
1. Creates a Three.js `Scene` object
2. Initializes a `WebGLRenderer` attached to the existing canvas element (`myCanvas`)
3. Configures renderer settings like size, shadows, and tone mapping
4. Sets up the camera and rendering loop

## Run Loop Initialization
The `Run` class (`src/js/run.js`) orchestrates the main game loop and component initialization:

```javascript
export default class Run {
    constructor() {}

    mainFunction() {
        // Access config and create systems
        let sceneRenderer = this.sceneRenderer;
        let lights = this.lightingManager.lights;

        // Set up cameras
        let playerCameraWrapper = this.cameraBuilder.buildSkyCamera(/* params */);
        const orbitCameraWrapper = this.cameraBuilder.buildSkyCamera(/* params */);
        
        // Initialize physics, world, player, etc.
        const physics = new Physics(this.sceneRenderer.scene);
        this.sceneRenderer.setUpRenderer(orbitCameraWrapper);
        
        let world = new World(this);
        let raycasterContainer = new RayCasterContainer(playerCameraWrapper, world);
        world.generate();
        
        const player = new Player(world, document.getElementById('gameContainer'), /* params */);
        let inputmanager = new InputManager(player, world);

        // Set up UI and start animation loop
        setupUI(/* params */);
        
        function animate(time) {
            // Main game loop
            requestAnimationFrame(animate);
            // Update physics, player, world, render scene
        }
        animate();
    }
}
```

This method:
1. Creates camera systems for both player (first-person) and orbit (debug) views
2. Initializes physics, world generation, and player systems
3. Sets up input handling and UI
4. Starts the main animation/rendering loop

## Initialization Flow Summary
1. **HTML loads** → Canvas element is created in DOM
2. **blockworld.js executes** → Creates Main instance and loads config
3. **Main.run()** → Initializes SceneRenderer (attaches to canvas), LightingManager, builders
4. **Run.mainFunction()** → Creates cameras, physics, world, player, input systems
5. **Animation loop starts** → Game begins rendering and updating

The canvas is initialized early in the process and remains the central rendering target throughout the application's lifecycle, with Three.js handling all WebGL operations on this single canvas element.
