export default class InventoryPercival extends Phaser.Scene{
    constructor(){
        super({key:'InventarioPercival'});
    }

    init(){

    }

    preload(){
        this.load.spritesheet('Hueco','sprites/images/inventory/inventorySpace.png',{frameWidth: 64, frameHeight:64});
    }

    create(){
        this.cameras.main.setViewport(0,108,108,270);
        let inventorySpaces = [];

        inventorySpaces.push(this.add.image(42,32,'Hueco',0));
        inventorySpaces.push(this.add.image(42,135,'Hueco',0));
        inventorySpaces.push(this.add.image(42,238,'Hueco',1));
        this.add.text(42,32, "1").setScrollFactor(0);
        this.add.text(42,135, "2").setScrollFactor(0);
        this.add.text(42,238, "3").setScrollFactor(0);

    }


    update(){

    }
}