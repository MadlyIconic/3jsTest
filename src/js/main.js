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

export default class Main{
    constructor(gridsize = 30, griddivisions = 10)
    {
        this.axesHelper = new THREE.AxesHelper(3);
        this.gui = new dat.GUI();
        this.gridHelper = new THREE.GridHelper(gridsize, griddivisions)
        this.sceneRenderer = new SceneRenderer(nebula, stars);
        this.lightingManager = new LightingManager(this.sceneRenderer);
        this.boxBuilder = new BoxBuilder();
        this.cameraBuilder = new CameraBuilder();
        this.planeBuilder = new PlaneBuilder();
        this.sphereBuilder = new SphereBuilder();
        this.settings = new Settings(true);
    
    }
}

