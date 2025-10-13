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
		this.load.image('Daphne', 'sprites/images/Daphne.png');
	}
	create ()
    {
		this.add.image(270, 450, 'Daphne');
		this.cameras.main.setViewport(540, 0, 540, 540);
        this.add.text(240, 100, "Daphne");
    }
	
}

class Dustwarts extends Phaser.Scene {
	constructor(){super('Dustwarts');}
	create ()
    {
		this.cameras.main.setViewport(0, 0, 540, 540);
        this.add.text(240, 100, "Percival");
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
