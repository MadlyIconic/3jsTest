import * as THREE from 'three';
const textureLoader = new THREE.TextureLoader();

function loadTexture(path){
    const texture = textureLoader.load(path);
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

const textures =  {
    dirt: loadTexture('texttures/dirt.png'),
    grass: loadTexture('texttures/grass.png'),
    grassSide: loadTexture('texttures/grass_side.png'),
    stone: loadTexture('texttures/stone.png'),
    coalOre: loadTexture('texttures/coal_ore.png'),
    ironOre: loadTexture('texttures/iron_ore.png')
}

export const blocks = {
    empty:{
        id:0,
        name: "empty",
        color: 0xe8e8e8
    },
    dirt: {
        id:1,
        name: "dirt",
        color: 0x807020,
        useTestMaterial: false,
        material: new THREE.MeshLambertMaterial({map: textures.dirt}),
        testMaterial: new THREE.MeshBasicMaterial({color: new THREE.Color(0x00ff00), wireframe: true})
    },
    grass: {
        id:2,
        name: "grass",
        color: 0x559020,
        useTestMaterial: false,
        material: [
            new THREE.MeshLambertMaterial({map: textures.grassSide}), //right
            new THREE.MeshLambertMaterial({map: textures.grassSide}), //left
            new THREE.MeshLambertMaterial({map: textures.grass}), //top
            new THREE.MeshLambertMaterial({map: textures.dirt}), //bottom
            new THREE.MeshLambertMaterial({map: textures.grassSide}), //front
            new THREE.MeshLambertMaterial({map: textures.grassSide}) //back
        ],
        testMaterial: new THREE.MeshBasicMaterial({color: new THREE.Color(0xffff00), wireframe: true})
    },
    
    stone: {
        id:3,
        name: "stone",
        color: 0x808080,
        scale: {
            x:30,
            y:30,
            z:30
        },
        scarcity: 0.05,
        material: new THREE.MeshLambertMaterial({map: textures.stone})
    },
    coalOre: {
        id:4,
        name: "coal",
        color: 0x202020,
        scale: {
            x:15,
            y:15,
            z:15
        },
        scarcity: 0.6,
        material: new THREE.MeshLambertMaterial({map: textures.coalOre})
    },
    ironOre: {
        id:5,
        name: "iron",
        color: 0x806060,
        scale: {
            x:16,
            y:16,
            z:16
        },
        scarcity: 0.5,
        material: new THREE.MeshLambertMaterial({map: textures.ironOre})
    },
}

export const resources =[
    blocks.stone,
    blocks.coalOre,
    blocks.ironOre
]