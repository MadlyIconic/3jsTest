export default function positionToString(obj){
    let str = '';
    str += `X: ${obj.position.x.toFixed(3)} `;
    str += `Y: ${obj.position.y.toFixed(3)} `;
    str += `Z: ${obj.position.z.toFixed(3)} `;

    return str;
}