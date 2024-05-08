const textureLoader = new ThreeMFLoader.textureLoader();

function loadTexture(path){
    const texture = textureLoader.loadTexture(path);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

const textures =  {
    dirt: loadTexture('texture/dirt.png'),
    grass: loadTexture('texture/grass.png'),
    grassSide: loadTexture('texture/grass_side.png'),
    stone: loadTexture('texture/stone.png'),
    coalOre: loadTexture('texture/coal_ore.png'),
    ironOre: loadTexture('texture/iron_ore.png')
}

export const blocks = {
    empty:{
        id:0,
        name: "empty"
    },
    grass: {
        id:1,
        name: "grass",
        color: 0x559020,
        material: [
            new THREE.MeshLambertMaterial({map: textures.grassSide}), //right
            new THREE.MeshLambertMaterial({map: textures.grassSide}), //left
            new THREE.MeshLambertMaterial({map: textures.grass}), //top
            new THREE.MeshLambertMaterial({map: textures.dirt}), //bottom
            new THREE.MeshLambertMaterial({map: textures.grassSide}), //front
            new THREE.MeshLambertMaterial({map: textures.grassSide}) //back
        ]
    },
    dirt: {
        id:2,
        name: "dirt",
        color: 0x807020,
        material: new THREE.MeshLambertMaterial({map: textures.dirt})
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
            x:20,
            y:20,
            z:20
        },
        scarcity: 0.5,
        material: new THREE.MeshLambertMaterial({map: textures.coalOre})
    },
    ironOre: {
        id:5,
        name: "iron",
        color: 0x806060,
        scale: {
            x:60,
            y:60,
            z:60
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