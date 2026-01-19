import InventoryDaphne from "./scenes/inventories/inventoryDaphne.js";
import InventoryPercival from "./scenes/inventories/inventoryPercival.js";
import Level1 from "./scenes/levels/level1.js";
import LevelGabi from "./scenes/levels/levelGabi.js";
import LevelJavi from "./scenes/levels/levelJavi.js";
import LevelJavi2 from "./scenes/levels/levelJavi2.js";
import TheEnd from "./scenes/theEnd.js";
import Menu from "./scenes/main.js";
import PauseMenu from "./scenes/pauseMenu.js";
import LevelAx from "./scenes/levels/levelAx.js";
import BootScene from "./scenes/bootScene.js";
import LevelPruebas from "./scenes/levels/levelPruebas.js";
import LevelSelector from "./scenes/levelSelector.js";

const config = {
	type: Phaser.CANVAS,
	canvas: document.getElementById('juego'),
	width: 1080,
	height: 540,
	scale: {
	autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
	},
	scene: [BootScene, LevelSelector, Menu, LevelJavi, LevelJavi2, LevelGabi, LevelPruebas,Level1,LevelAx,InventoryDaphne,InventoryPercival, PauseMenu, TheEnd],
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

