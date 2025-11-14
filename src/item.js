export default class Item extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,texture,textureInventory ,description ){
        super(scene, x,y,texture);

        //textura que se muestra en el inventario
        this.textureInventory = textureInventory;


        //descripcion del  item (mensaje que se muestra al seleccionarlo en el inventario)
        this.description = description;

        this.index =0;

    }

    setIndex(i){
        this.index = i;
    }



}