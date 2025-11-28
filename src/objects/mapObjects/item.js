export default class WorldItem extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,texture,textureInventory ,description, identifier){
        super(scene, x,y,texture);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        //identificador del objeto dentro de las escenas 
        //(usado para buscarlo a la hora de borrarlo y de traspasarlo entre inventarios)
        this.identifier = identifier;

        //textura que se muestra en el inventario
        this.textureInventory = textureInventory;
        
        //descripcion del  item (mensaje que se muestra al seleccionarlo en el inventario)
        this.description = description;

    }
}