import Main from "./js/main";
const main = new Main('../configfiles/blockworld.json');
main.addEventListener('configloaded', function () {
    console.log('config loaded', main.options);
});
