import Level1 from "./level1.js";

const config = {
	type: Phaser.CANVAS,
	canvas: document.getElementById('juego'),
	width: 1080,
	height: 540,
	scale: {
	autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
	},
	scene: [Level1],
	pixelArt: true
};

 new Phaser.Game(config);

