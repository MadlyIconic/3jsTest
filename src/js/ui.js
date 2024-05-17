import { resources } from './blocks';
export default class UI {
    constructor(gui, world, cameraWrapper, player, lightingContainer){
        this.gui = gui;
        this.world = world;
        this.cameraWrapper = cameraWrapper;
        this.player = player;
        this.lightingContainer = lightingContainer;
    }

    createUI(){
        let self = this;

        var obj = {
            movePlayerToCamera: function() {
                console.log("Player position:", self.player.cameraWrapper.position);
                console.log("Camera position:", self.cameraWrapper.position);
                self.player.cameraWrapper.position.copy(self.cameraWrapper.position);
            },
            moveCameraToPlayer: function() {
                console.log("Player position:", self.player.cameraWrapper.position);
                console.log("Camera position:", self.cameraWrapper.position);                
                self.cameraWrapper.position.copy(self.player.cameraWrapper.position);
            }
        };
        
        const sceneFolder = self.gui.addFolder('Scene');
        sceneFolder.add(self.world.scene.fog, 'near', 1, 200, 1).name('Fog Near');
        sceneFolder.add(self.world.scene.fog, 'far', 1, 200, 1).name('Fog Far');

        const worldFolder = self.gui.addFolder('World');
        if(this.lightingContainer){
            worldFolder.add(this.lightingContainer.cameraHelper, 'visible').name('Lighting camera visibility')    
            worldFolder.add(this.lightingContainer.lightHelper, 'visible').name('Lighting helper visibility')    
            worldFolder.add(obj, "movePlayerToCamera").name("Move player to camera");
            worldFolder.add(obj, "moveCameraToPlayer").name("Move camera to player");
        }

        if(this.player){
            const playerFolder = self.gui.addFolder('Player');
            playerFolder.add(this.player, 'maxSpeed', 1, 20).name('Max Speed');
            playerFolder.add(this.player.cameraWrapper.cameraHelper, 'visible').name('Camera visibility');
            playerFolder.add(this.player.boundsHelper, 'visible').name('Player visibility');
        }
        
        const cameraFolder = self.gui.addFolder('Camera');
        cameraFolder.add(self.cameraWrapper.position, 'x',-200 , 200).name('X').onChange(function(e){
            //console.log('camera: ', e, self.camera.position.x, self.camera.position.y, self.camera.position.z);
        });
        cameraFolder.add(self.cameraWrapper.position, 'y',-200 , 200).name('Y').onChange(function(e){
            
        });
        cameraFolder.add(self.cameraWrapper.position, 'z',-16 , 128, 1).name('Z').onChange(function(e){
            
        });

        const terrainFolder = self.gui.addFolder('Terrain');
        terrainFolder.add(self.world, 'asyncLoading',0 , 5, 1).name('Draw Async').onChange(function(e){
            self.world.generate();
        });
        terrainFolder.add(self.world, 'drawDistance',0 , 5, 1).name('Draw Distance').onChange(function(e){
            self.world.generate();
        });
        
        terrainFolder.add(self.world.params, 'seed', 1 , 10000).name('Seed').onChange(function(e){
            self.world.generate();
        });
        terrainFolder.add(self.world.params.terrain, 'scale',10,100).name('Scale').onChange(function(e){
            self.world.generate();
        });
        terrainFolder.add(self.world.params.terrain, 'magnitude',0,1).name('Magnitude').onChange(function(e){
            self.world.generate();
        });
        terrainFolder.add(self.world.params.terrain, 'offset',0,0.4).name('Offset').onChange(function(e){
            self.world.generate();
        });

        const resourcesFolder = self.gui.addFolder('Resources');

        resources.forEach(resource => {
            resourcesFolder.add(resource,'scarcity',0,1).name('Scarcity ' + resource.name).onChange(function(e){
                self.world.generate();
            });
            const scaleFolder = resourcesFolder.addFolder('Scale ' + resource.name);
            scaleFolder.add(resource.scale,'x',10,100).name('X Scale').onChange(function(e){
                self.world.generate();
            });
            scaleFolder.add(resource.scale,'y',10,100).name('Y Scale').onChange(function(e){
                self.world.generate();
            });
            scaleFolder.add(resource.scale,'z',10,100).name('Z Scale').onChange(function(e){
                self.world.generate();
            });        
        });

    }
}

export function setupUI(gui, world, orbitCameraWrapper, player, directionalLightingContainer){
    let ui = new UI(gui, world, orbitCameraWrapper, player, directionalLightingContainer);
    ui.createUI();
}