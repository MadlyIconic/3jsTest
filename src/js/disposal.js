import * as THREE from 'three'
export function disposeNode(chunk, scene, renderer) {
    for (let x = 0; x < Object.keys(chunk.meshes).length; x++) {
        let node = chunk.meshes[x];
        console.log(node instanceof THREE.Mesh);
    
        if (node instanceof THREE.Mesh) {
        if (node.geometry) {
            node.geometry.dispose();
            node.geometry = undefined; // fixed problem
        }

        if (node.material) {
            if (node.material instanceof THREE.MeshBasicMaterial || node.material instanceof THREE.MeshLambertMaterial) {
                if(Array.isArray(node.material)){
                    node.material.forEach( function(mtrl, idx) {
                        //let mtrl = node.material;
                        if (mtrl.map) mtrl.map.dispose();
                        if (mtrl.lightMap) mtrl.lightMap.dispose();
                        if (mtrl.bumpMap) mtrl.bumpMap.dispose();
                        if (mtrl.normalMap) mtrl.normalMap.dispose();
                        if (mtrl.specularMap) mtrl.specularMap.dispose();
                        if (mtrl.envMap) mtrl.envMap.dispose();
        
                        mtrl.dispose();
                        mtrl = undefined; // fixed problem
                        });    
                }else{
                //node.material.forEach( function(mtrl, idx) {
                    let mtrl = node.material;
                    if (mtrl.map) mtrl.map.dispose();
                    if (mtrl.lightMap) mtrl.lightMap.dispose();
                    if (mtrl.bumpMap) mtrl.bumpMap.dispose();
                    if (mtrl.normalMap) mtrl.normalMap.dispose();
                    if (mtrl.specularMap) mtrl.specularMap.dispose();
                    if (mtrl.envMap) mtrl.envMap.dispose();
                    mtrl.dispose();
                    mtrl = undefined; // fixed problem
                }
            };
        }
        else {
            // if (node.material.map) node.material.map.dispose();
            // if (node.material.lightMap) node.material.lightMap.dispose();
            // if (node.material.bumpMap) node.material.bumpMap.dispose();
            // if (node.material.normalMap) node.material.normalMap.dispose();
            // if (node.material.specularMap) node.material.specularMap.dispose();
            // if (node.material.envMap) node.material.envMap.dispose();

            node.material.dispose();
            node.material = undefined; // fixed problem
            }
        }
        }
        console.log('node before removal: ', chunk);
        scene.remove( chunk );
        renderer.dispose(); // ***EDIT*** improved even memory more original scene heap is 12.4 MB; add objects increases to 116 MB or 250 MB (different models), clearing always brings down to 13.3 MB ... there still might be some artifacts.  
        //node = undefined; // unnecessary
    };
  

  function disposeHierchy(node, callback) {
    for (var i = node.children.length - 1; i >= 0; i--) {
      var child = node.children[i];

      disposeHierchy(child, callback);
      callback(child);
    }
  }