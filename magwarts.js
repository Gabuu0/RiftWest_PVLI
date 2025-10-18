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

