import * as THREE from 'three';

export default function positionToString(obj){
    // Comment
    let str = '';
    str += `X: ${obj.x?.toFixed(1)} `;
    if(obj.y){
        str += `Y: ${obj.y?.toFixed(1)} `;
    }
    str += `Z: ${obj.z?.toFixed(1)} `;

    return str;
}

export function renderPosition(position, domElement, prefix){
    document.getElementById(domElement).innerHTML = prefix + ' ' + positionToString(position);
}

export function renderText(position, domElement, prefix){
    document.getElementById(domElement).innerHTML = prefix + ' ' + position;
}

export function calculateAspect(){
    const perspectiveRatio = window.innerWidth/window.innerHeight;
    return perspectiveRatio;
}

export function addMonitorBlock(boxBuilder, scene, vector){
    let color = new THREE.Color();
    let colorRepresentation = 0xffffff * Math.random();
    let monitorBlock = boxBuilder.build(color.set(colorRepresentation), 'monitorBlock', true);
    monitorBlock.position.set(vector.x, vector.y, vector.z);
    scene.add(monitorBlock);
}

export function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
  }