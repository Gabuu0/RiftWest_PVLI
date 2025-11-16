export default class InventoryItem extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,texture,description,identifier){
        super(scene,x,y,texture);

        this.scene.add.existing(this);
        this.description = description;
        this.identifier = identifier;
    }
}