export default class WorldItem extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,texture,textureInventory ,description ){
        super(scene, x,y,texture);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        //textura que se muestra en el inventario
        this.textureInventory = textureInventory;
        
        //descripcion del  item (mensaje que se muestra al seleccionarlo en el inventario)
        this.description = description;

    }
}