import * as THREE from 'three'

export class World extends THREE.Group {
    /**
     * @type {{
     *  id: number,
     * instanceId: number
     * }[][][]}
     * @param {*} size
     * @param {*} main
     */
    // data = [];
    constructor(size = {width:32, height:16}, main, params){
        super();
        console.log(params);
        this.size = size;
        this.main = main;
        this.params = params;
        
    }


    // getBlock(x,y,z){
    //     if(thgis.inBounds(x,y,z)){
    //         return this.data[x][y][z];
    //     }else{
    //         return null;
    //     }
    // }

    // setBlockId(x,y,z,id){
    //     if(this.inBounds(x,y,z)){
    //         this.data[x][y][z].id = id;
    //     }
    // }

    // inBounds(x,y,z){
    //     if(x >= 0 && x < this.size.width &&
    //         y >= 0 && y < this,size.height &&
    //         z >= 0 && z < this.size.width){
    //         return true;
    //     }else{
    //         return false;
    //     }
    // }

    // setBlockInstanceId(x,y,z,instanceId){
    //     if(this.inBounds(x,y,z)){
    //         this.data[x][y][z].instanceId = instanceId;
    //     }
    // }

    // generateTerrain(){
    //     this.data = [];
    //     for (let x = 0; x < this.size.width; x++) {
    //         const slice = [];
    //         for (let y = 0; y < this.size.height; y++) {
    //             const row = [];
    //             for (let z = 0; z < this.size.width; z++) {
    //                 row.push({
    //                     id:1,
    //                     instanceId: null
    //                 })
    //             }
    //             slice.push(row);
    //         }
    //         this.data.push(slice);
    //     }
    // }

    generate(boxGeometry, boxMaterial){
        let self = this;
        self.main.sceneRenderer.scene.children = self.main.sceneRenderer.scene.children.filter((e) => e.name != "TheBlocks");
        self.setupWorld(self.size, boxGeometry, boxMaterial);
    }

    setupWorld(size, boxGeometry, boxMaterial){
        let self = this;
        self.main.boxBuilder.initialiseTerrain(size);
        self.main.boxBuilder.generateTerrain(size, self.params);
        let mesh = self.main.boxBuilder.buildInstanced(0x00d000, this.size);
        self.main.sceneRenderer.addToScene(mesh);
    }
}