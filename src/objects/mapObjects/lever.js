export default class Lever extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,texture,identifier){
        super(scene,x,y,texture);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setImmovable(true);

        this.currentFrame = 0;
        this.setFrame(this.currentFrame);
        this.identifier = identifier;
    }

    useLever() {
    this.currentFrame = 1;
        this.setFrame(this.currentFrame);
    }
}

