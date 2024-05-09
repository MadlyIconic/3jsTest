import { resources } from './blocks';
export default class UI {
    constructor(gui, world, camera){
        this.gui = gui;
        this.world = world;
        this.camera = camera;
    }

    createUI(){
        let self = this;
        self.gui.add(self.world.size, 'width',8 , 128, 1).name('Width').onChange(function(e){
            self.world.generate();
        });
        self.gui.add(self.world.size, 'height',8 , 128, 1).name('Height').onChange(function(e){
            self.world.generate();
        });
        const cameraFolder = self.gui.addFolder('Camera');
        cameraFolder.add(self.camera.position, 'x',-599 , 500).name('X').onChange(function(e){
            
        });
        cameraFolder.add(self.camera.position, 'y',-599 , 500).name('T').onChange(function(e){
            
        });
        cameraFolder.add(self.camera.position, 'z',-16 , 128, 1).name('Z').onChange(function(e){
            
        });


        const terrainFolder = self.gui.addFolder('Terrain');
        terrainFolder.add(self.world.params, 'seed', 1 , 10000).name('Seed').onChange(function(e){
            self.world.generate();
        });
        terrainFolder.add(self.world.params.terrain, 'scale',10,100).name('Scale').onChange(function(e){
            self.world.generate();
        });
        terrainFolder.add(self.world.params.terrain, 'magnitude',0,1).name('Magnitude').onChange(function(e){
            self.world.generate();
        });
        terrainFolder.add(self.world.params.terrain, 'offset',0,1).name('Offset').onChange(function(e){
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