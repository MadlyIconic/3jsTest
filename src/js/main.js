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

export default class Main extends EventDrivenObject{
    constructor(configFile, canvasName, gridsize = 30, griddivisions = 10)
    {
        super();
        this.events = {};
        this.registerEvent('configloaded');
        let self = this;
        this.sceneRenderer = new SceneRenderer(window.innerWidth, window.innerHeight, canvasName);
        this.settings = new Settings(configFile);
        this.options = {};
        this.axesHelper = new THREE.AxesHelper(3);
        this.gui = new dat.GUI();
        this.gridHelper = new THREE.GridHelper(gridsize, griddivisions)
        this.lightingManager = new LightingManager(this.sceneRenderer);
        this.boxBuilder = new BoxBuilder();
        this.cameraBuilder = new CameraBuilder();
        this.planeBuilder = new PlaneBuilder();
        this.sphereBuilder = new SphereBuilder();
        this.settings.addEventListener('loadconfig', function () {
            self.options = self.settings.options;
            console.log('Data is loaded!');
            self.dispatchEvent('configloaded');
          });

        // this.settings.registerEvent('myevent');
        // this.settings.addEventListener('myevent', function () {console.log('This is the myevent listener!');});
        // this.settings.addEventListener('myevent', function () {console.log('This is another myevent listener!');});
        // this.settings.dispatchEvent('myevent');
    }
}