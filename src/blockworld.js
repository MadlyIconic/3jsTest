import Main from "./js/main";

const perspectiveRatio = window.innerWidth/window.innerHeight;
const main = new Main();
main.addEventListener('configloaded', function () {
    console.log('config loaded', main.options);

});
