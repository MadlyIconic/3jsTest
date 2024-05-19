import * as THREE from 'three'

export default class RayCasterContainer{
    constructor(cameraWrapper,world){
        this.CENTER_SCREEN = new THREE.Vector2();
        this.world = world;
        this.cameraWrapper = cameraWrapper;
        this.raycaster = new THREE.Raycaster(new THREE.Vector3(),new THREE.Vector3(), 0, 3);
        
        this.selectedCoords = null;
        this.addSelectionHelper();
    }

    updateRaycaster(){
        //const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(this.cameraWrapper.camera.quaternion);
        this.raycaster.setFromCamera(this.CENTER_SCREEN, this.cameraWrapper.camera);
        if(this.world.loaded){
            const meshes = this.world.scene.children.filter((e) => e.type === 'Mesh' && e.name !== '');
            let intersections = null;

            for (let x = 0; x < meshes.length; x++) {
                intersections = this.raycaster.intersectObject(meshes[x], true);
                if(intersections.length >0){
                    break;
                }
            }
            
            if(intersections.length > 0){
                const intersection = intersections[0];

                const chunk = intersection.object.parent;

                // gets transformation matrix of the intersected block
                const blockMatrix = new THREE.Matrix4();
                intersection.object.getMatrixAt(intersection.instanceId, blockMatrix);
        
                this.selectedCoords = chunk.position.clone();
                
                this.selectedCoords.applyMatrix4(blockMatrix);
                this.selectionHelper.position.copy(this.selectedCoords);
        
                this.selectionHelper.visible = true;
                //console.log(this.selectedCoords );
            }else{
                this.selectedCoords = null;
                //console.log('Nothing found');
                this.selectionHelper.visible = false;
            }
        }
    }

    addSelectionHelper(){
        const selectionMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0.2,
            color: 0xffffaa
        });
        const selectionGeometry = new THREE.BoxGeometry(1.01,1.01,1.01);
        this.selectionHelper = new THREE.Mesh(selectionGeometry, selectionMaterial);
        this.world.scene.add(this.selectionHelper);
    }
}