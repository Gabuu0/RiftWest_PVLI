export default class Door extends Phaser.GameObjects.Sprite {
    constructor(scene,x,y,texture, frame,rotationAngle,identifier){
        super(scene,x,y,texture,frame);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setImmovable(true);
        if(rotationAngle != 0){
            this.setRotation(Phaser.Math.DegToRad(rotationAngle));
            this.body.setSize(this.displayHeight,this.displayWidth);
        }

        this.identifier = identifier;
    }
}