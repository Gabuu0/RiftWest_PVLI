const config = {
	type: Phaser.CANVAS,
	canvas: document.getElementById('juego'),
	width: 1080,
	height: 540,
	scale: {
	autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
	},
	scene: [Dustwarts, Magwarts]
};

const game = new Phaser.Game(config);


game.scene.start('Dustwarts');
game.scene.start('Magwarts');
const dustwarts = game.scene.getScene('Dustwarts');
const magwarts = game.scene.getScene('Magwarts');