class Map extends Phaser.Scene {
	constructor(){super('Map');}
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