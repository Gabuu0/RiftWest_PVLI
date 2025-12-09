import InventoryDaphne from "./scenes/inventories/inventoryDaphne.js";
import InventoryPercival from "./scenes/inventories/inventoryPercival.js";
import Level1 from "./scenes/levels/level1.js";
import LevelPruebas from "./scenes/levels/levelPruebas.js";
import Menu from "./scenes/main.js";
import PauseMenu from "./scenes/pauseMenu.js";
import LevelAx from "./scenes/levels/levelAx.js";

const config = {
	type: Phaser.CANVAS,
	canvas: document.getElementById('juego'),
	width: 1080,
	height: 540,
	scale: {
	autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
	},
	scene: [Menu, LevelPruebas, Level1,InventoryDaphne,InventoryPercival, PauseMenu, LevelAx],
	physics: {
        default: "arcade",
        arcade: {
            debug: false,
            gravity: { y: 0 },
        },
    },
	pixelArt: true,
	fps: {target: 60, forceSetTimeOut: true}
};

 new Phaser.Game(config);

