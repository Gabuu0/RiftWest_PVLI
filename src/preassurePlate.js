export default class PreassurePlate extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,texture,identifier){
        super(scene,x,y,texture);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.identifier = identifier;
    }
}