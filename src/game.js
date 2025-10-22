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
	scene: [Menu, Level1, PauseMenu],
	physics: {
        default: "arcade",
        arcade: {
            debug: true,
            gravity: { y: 0 }
        },
    },
	pixelArt: true
};

 new Phaser.Game(config);

