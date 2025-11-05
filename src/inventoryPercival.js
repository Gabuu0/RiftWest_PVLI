export default class InventoryPercival extends Phaser.Scene{
    constructor(){
        super({key:'InventarioPercival'});
    }

    init(){

    }

    preload(){
        this.load.spritesheet('hueco','sprites/images/inventory/inventorySpace.png',{frameWidth: 64, frameHeight:64});
    }

    create(){
        this.cameras.main.setViewport(0,108,108,270);
        let inventorySpaces = [];

        inventorySpaces.push(this.add.image(42,32,'hueco',0));
        inventorySpaces.push(this.add.image(42,135,'hueco',0));
        inventorySpaces.push(this.add.image(42,238,'hueco',1));
        this.add.text(42,32, "1").setScrollFactor(0);
        this.add.text(42,135, "2").setScrollFactor(0);
        this.add.text(42,238, "3").setScrollFactor(0);

    }


    update(){

    }
}