export default class Door extends Phaser.GameObjects.Sprite {
    constructor(scene,x,y,texture, frame,identifier){
        super(scene,x,y,texture,frame);
        this.setRotation(-Math.PI/2);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.identifier = identifier;
    }

}