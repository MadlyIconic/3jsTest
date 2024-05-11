export default function positionToString(obj){
    let str = '';
    str += `X: ${obj.x.toFixed(3)} `;
    str += `Y: ${obj.y.toFixed(3)} `;
    str += `Z: ${obj.z.toFixed(3)} `;

    return str;
}