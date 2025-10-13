// function devuelveTextoDeAlerta() {
//   return "uooooo! Vaya alerta";
// }

// function desaparece(nombre) {
// 	var button = document.getElementById(nombre);
//   button.style.visibility='hidden';
// }

class Magwarts extends Phaser.Scene {
	constructor(){super('Magwarts');}
	
	preload() 
	{
		this.load.spritesheet('DaphneSpriteSheet', 'sprites/images/daphne/DaphneIdle(x5).png', { frameWidth: 160, frameHeight: 160});
	}

 	create() 
	{
		this.cameras.main.setViewport(540, 0, 540, 540);
		this.add.text(240, 100, "Daphne");
		let Daphne = this.add.sprite(270, 450, 'DaphneSpriteSheet');

		this.anims.create({
		key: 'daphneIdle',
		frames: this.anims.generateFrameNumbers('DaphneSpriteSheet', { start: 0, end: 4 }),
		frameRate: 5,
		repeat: -1
		});
		Daphne.play('daphneIdle');
	}


}

class Dustwarts extends Phaser.Scene {
	constructor(){super('Dustwarts');}
	preload() 
	{
		this.load.spritesheet('PercivalSpriteSheet', 'sprites/images/percival/PercivalIdle(x5).png', { frameWidth: 160, frameHeight: 160});
	}

 	create() 
	{
		this.cameras.main.setViewport(0, 0, 540, 540);
		this.add.text(240, 100, "Percival");
		let Percival = this.add.sprite(270, 450, 'PercivalSpriteSheet');

		this.anims.create({
		key: 'percivalIdle',
		frames: this.anims.generateFrameNumbers('PercivalSpriteSheet', { start: 0, end: 4 }),
		frameRate: 5,
		repeat: -1
		});
		Percival.play('percivalIdle');
	}
}

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
