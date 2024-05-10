import * as THREE from 'three';
import * as dat from 'dat.gui'; 
import SceneRenderer from './sceneRenderer';
import LightingManager from './lightingManager';
import nebula from '../img/nebula.jpg'
import stars from '../img/stars.jpg'
import BoxBuilder from './boxBuilder'
import PlaneBuilder from './planeBuilder';
import CameraBuilder from './cameraBuilder';
import SphereBuilder from './sphereBuilder';
import Settings from './settings';
import EventDrivenObject from './eventDrivenObject';
import { Player } from './player';

export default class Main extends EventDrivenObject{
    constructor(configFile, canvasName, gridsize = 150, griddivisions = 10)
    {
        super();
        this.events = {};
        this.registerEvent('configloaded');
        let self = this;
        this.gridHelper = new THREE.GridHelper(gridsize, griddivisions)
        this.axesHelper = new THREE.AxesHelper(5);
        this.sceneRenderer = new SceneRenderer(window.innerWidth, window.innerHeight, canvasName);
        this.sceneRenderer.addToScene(this.gridHelper);
        this.sceneRenderer.addToScene(this.axesHelper);

        this.scene = this.sceneRenderer.getScene();
        this.settings = new Settings(configFile);
        this.options = {};
        
        this.gui = new dat.GUI();

        
        this.lightingManager = new LightingManager(this.sceneRenderer);
        this.boxBuilder = new BoxBuilder();
        this.cameraBuilder = new CameraBuilder();
        this.planeBuilder = new PlaneBuilder();
        this.sphereBuilder = new SphereBuilder();
        //this.player = new Player(this.sceneRenderer.scene, this.sceneRenderer.renderer.domElement);
        this.settings.addEventListener('loadconfig', function () {
            self.options = self.settings.options;
            console.log('Data is loaded!');
            self.dispatchEvent('configloaded');
          });
    }
}