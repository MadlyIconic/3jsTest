import Main from "./js/main";
import Run from "./js/run";

let run = new Run();
const main = new Main('../configfiles/blockworld.json', 'myCanvas');
main.addEventListener('configloaded', run.mainFunction.bind(main));

