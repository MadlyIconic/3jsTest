import * as THREE from 'three'
import { WorldChunk } from './worldChunk';
import { uuidv4 } from './positionHelper';
import { blocks } from './blocks';

export class World extends THREE.Group {

    /**
     * Whether or not we want the chunks to load asynchronously
     */
    asyncLoading = true;

    constructor(main){
        super();
        let self = this;
        self.numberOfCallsToGenerate = 0;
        self.initialWorldLoaded = false;
        self.drawDistance = 2;
        self.main = main;
        self.scene = main.sceneRenderer.scene;
        self.loaded - false;
        self.chunkSize = main.options.chunkSize;
        self.seed = main.options.params.seed;
        self.params = main.options.params;
        self.uuidForMeshes = {
            id: uuidv4(),
            uuids: new Map()
        };
        main.lightingManager.setUpAmbientLight(true, main.options.ambientLightIntinsity);
        self.directionalLightingContainer = main.lightingManager.setUpDirectionalLight(true, 60,75,50, main.options.directionalLightIntinsity, true);
        self.scene.fog = new THREE.Fog( new THREE.Color(main.options.skycolor), 25, 48);
    }

    /**
     *
     * @param {Player} player
     */
    update(player){
        let self = this;
        if(this.initialWorldLoaded){
            this.initialWorldLoaded = false;
            let visibleChunks = this.getVisibleChunks(player)
            const chunksToAdd = this.getChunksToAdd(visibleChunks);
            this.removeUnusedChunks(visibleChunks);
            
            requestIdleCallback(function(){
                for (const chunk of chunksToAdd) {
                    self.generateChunk(chunk.x, chunk.z);
                }
                self.initialWorldLoaded = true;
            }, {timeout:2000})
            
    
            //console.log(chunks.length);
            if(player.reportVisibleChunks){
                console.log('Visible Chunks')
                visibleChunks.forEach(chunk => {
                    console.log(chunk);
                });
    
                console.log('Chunks to add')
                chunksToAdd.forEach(chunk => {
                    console.log(chunk);
                });
            }
        }

        const sun = self.directionalLightingContainer.directionalLight;
        sun.position.copy(player.position);
        sun.position.sub(new THREE.Vector3(-50,-50,-50));
        sun.target.position.copy(player.position);
        self.main.sceneRenderer.scene.add(sun.target);
    }

    /**
     * Returns an array of coordinates of chunks
     * that are not yet loaded and need to be adde to the scene
     * @param {{x:number, z:number}[]} visibleChunks
     * @returns {{x:number, z:number}[]}
     */
    getChunksToAdd(visibleChunks){
        const filteredChunks = visibleChunks.filter((chunk) => {
            const chunkExists = this.children
                .map((obj) => obj.userData)
                .find(({x,z}) =>
                    chunk.x === x && chunk.z === z
                );

            return !chunkExists;
        })

        return filteredChunks;
    }

        /**
     * Returns an array of coordinates of chunks
     * that are not yet loaded and need to be adde to the scene
     * @param {{x:number, z:number}[]} visibleChunks
     * @returns {{x:number, z:number}[]}
     */
        getChunksToAdd(visibleChunks){
            const filteredChunks = visibleChunks.filter((chunk) => {
                const chunkExists = this.children
                    .map((obj) => obj.userData)
                    .find(({x,z}) =>
                        chunk.x === x && chunk.z === z
                    );

                return !chunkExists;
            })

            return filteredChunks;
        }

    /**
     * Removes current loaded chunks that are no longer visible due to draw distance
     * @param {{x:number, z:number}[]} visibleChunks
     */
    removeUnusedChunks(visibleChunks){
        const chunksToRemove = this.children.filter((chunk) => {
            const {x,z} = chunk.userData;
            const chunkExists = visibleChunks
                .find((visibleChunk) =>
                    visibleChunk.x === x && visibleChunk.z === z
                );

            return !chunkExists;
        })

        for (const chunk of chunksToRemove) {
            chunk.disposeInstances();
            //console.log(`Removing chunk at X: ${chunk.userData.x}, Z: ${chunk.userData.z}`);
            
            this.disposeChunk(chunk);
            this.remove(chunk);
        }
    }

    /**
     * Finds all MeshInstances by uuid and removes them from the scene
     * Then calls disposeInstances on the WorldChunk 
     * @param {WorldChunk} chunk 
     */
    disposeChunk(chunk){
        
        let meshesUuids = [];
        for (let x = 0; x < Object.keys(chunk.meshes).length; x++) {
            meshesUuids.push(this.main.sceneRenderer.scene.children.find(e => e.uuid == chunk.meshes[x].uuid).uuid);
        }
        let scene = this.main.sceneRenderer.scene;
        meshesUuids.forEach(uuid => {
            let mesh = scene.getObjectByProperty( 'uuid', uuid ).geometry;
            mesh.geometry?.dispose( );
            mesh.material?.dispose( );
        });
        
        let allButTheBlocks = this.main.sceneRenderer.scene.children
            .filter(e => !meshesUuids.includes(e.uuid))
            ;
        if(allButTheBlocks.length > 0){
            this.main.sceneRenderer.scene.children = allButTheBlocks;
        }
        // Use to remove objects from memory.  Not sure if it is needed or works..?
        //disposeNode(chunk, scene, this.main.sceneRenderer.renderer);
        if(chunk.disposeInstances){
            chunk.disposeInstances();
       }
    }

    /**
     * Returns an array of chunks that are visible to the player
     * @param {Player} player
     * @returns {{x:number, z:number}[]}
     */
    getVisibleChunks(player){
        const visibleChunks = [];
        const coords = this.worldToChunkCoords(player.position.x,player.position.y, player.position.z);

        const chunkX = coords.chunk.x;
        const chunkZ = coords.chunk.z;

        for (let x = (chunkX - this.drawDistance); x <= (chunkX + this.drawDistance); x++) {
            for (let z = (chunkZ - this.drawDistance); z <= (chunkZ + this.drawDistance); z++) {
                visibleChunks.push({x,z});
            }
        }

        return visibleChunks;
    }

    clearuuids(){
        let self = this;
        self.uuidForMeshes = {
            id: uuidv4(),
            uuids: new Map()
        };
    }

    generate(){
        let self = this;
        self.disposeChunks();
        let iCountBottom = -self.drawDistance;
        let iCountTop = self.drawDistance;
        for (let x = iCountBottom; x <= iCountTop; x++) {
            for (let z = iCountBottom; z <= iCountTop; z++) {
                self.generateChunk(x,z);
                self.clearuuids();
            }
        }

        self.initialWorldLoaded = true;
    }

    /**
     * Generate a chunk at the (x, z) coordinates
     * @param {number} x 
     * @param {number} z 
     */
    generateChunk(x,z){
        let self = this;
        let chunk = null;
        chunk = new WorldChunk(self.chunkSize,self.main);
        let xpos = x * self.chunkSize.width;
        let zpos = z * self.chunkSize.width;
        chunk.position.set(xpos, 0, zpos);
        let startVector2 = chunk.position;
        chunk.userData = {x,z};
        if(self.asyncLoading){
            requestIdleCallback(function(){
                let meshes = chunk.generate(self.uuidForMeshes, startVector2);
                self.uuidForMeshes = chunk.uuidForMeshes;
                chunk.meshes = meshes;
                self.loaded = true;
                self.add(chunk);
            })
        }else{
            let meshes = chunk.generate(self.uuidForMeshes, startVector2);
            self.uuidForMeshes = chunk.uuidForMeshes;
            chunk.meshes = meshes;
            self.loaded = true;
            self.add(chunk);
        }
    }

    getBlock(x,y,z,size){
        let self = this;
        const coords = self.worldToChunkCoords(x,y,z)
        const chunk = self.getChunk(coords.chunk.x, coords.chunk.z);
        let block = null;
        if(chunk && self.loaded){
            block = chunk.getBlock(
                coords.block.x,
                coords.block.y,
                coords.block.z,
                size
            )
        }
        return block; //self.chunk.get(x,y,z,size);
    }

    /**
     * @param {*} x
     * @param {*} y
     * @param {*} z
     * @returns {{
     *      chunk: {x: number, z: number},
     *      block: {x: number, y: number, z: number}
     * }}
     */
    worldToChunkCoords(x,y,z){
        const chunkCoords = {
            x: Math.floor(x / this.chunkSize.width),
            z: Math.floor(z / this.chunkSize.width),
        }

        const blockCoords = {
            x: x - this.chunkSize.width * chunkCoords.x,
            y: y,
            z: z - this.chunkSize.width * chunkCoords.z
        }

        return {
            chunk: chunkCoords,
            block: blockCoords
        }
    }

    /**
     * @param {*} chunkX
     * @param {*} chunkZ
     * @returns {WorldChunk | null}
     */
    getChunk(chunkX, chunkZ){

        let findChunk = function(chunk){
            let x =  chunk.userData.x;
            let z =  chunk.userData.z;
            if(x === chunkX && z === chunkZ){
                return true;
            }else{
                return false;
            }
        }

        let chunk = this.children.find(findChunk)

        return chunk;
    }

    disposeChunks(){
        let self = this;
        self.traverse((chunk) => {
            if(chunk.disposeInstances){
                chunk.disposeInstances();
            }
        })
        self.uuidForMeshes = {
            id: uuidv4(),
            uuids: new Map()
        };
        let allButTheBlocks = self.main.sceneRenderer.scene.children
            .filter(e => e.userData !== "TerrainMesh")
            ;
        if(allButTheBlocks.length > 0){
            self.main.sceneRenderer.scene.children = allButTheBlocks;
        }
        this.clear();
    }

    /**
     * Removes the block at (x,y,z) and sets it to empty
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    removeBlock(x,y,z){
        const coords = this.worldToChunkCoords(x,y,z);
        const chunk = this.getChunk(coords.chunk.x,coords.chunk.z);
        
        if(chunk){
            const block = coords.block;
            chunk.removeBlock(
                block.x, 
                block.y,
                block.z
            )
            // Reveal adjecent neighbours if they were hidden by the leaving block
            // this.revealBlock(x-1,y,z);
            // this.revealBlock(x+1,y,z);
            // this.revealBlock(x,y-1,z);
            // this.revealBlock(x,y-+1,z);
            // this.revealBlock(x,y,z-1);
            // this.revealBlock(x,y,z+1);
        }
    }

    /**
     * Reveals the block at (x,y,z) by adding a new mesh instance
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    revealBlock(x,y,z){
        const coords = this.worldToChunkCoords(x,y,z);
        const chunk = this.getChunk(coords.chunk.x,coords.chunk.z);

        if(chunk){
            const block = coords.block;
            chunk.addBlockInstance(
                block.x, 
                block.y,
                block.z
            )
        }
    }
}