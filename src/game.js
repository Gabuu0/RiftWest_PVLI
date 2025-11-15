import InventoryDaphne from "./inventoryDaphne.js";
import InventoryPercival from "./inventoryPercival.js";
import Level1 from "./level1.js";
import Menu from "./main.js";
import PauseMenu from "./pauseMenu.js";

const config = {
	type: Phaser.CANVAS,
	canvas: document.getElementById('juego'),
	width: 1080,
	height: 540,
	scale: {
	autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
	},
	scene: [Menu, Level1,InventoryDaphne,InventoryPercival, PauseMenu],
	physics: {
        default: "arcade",
        arcade: {
            debug: true,
            gravity: { y: 0 },
        },
    },
	pixelArt: true,
	fps: {target: 60, forceSetTimeOut: true}
};

 new Phaser.Game(config);

