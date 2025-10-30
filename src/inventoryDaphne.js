export default class InventoryDaphne extends Phaser.Scene{
    constructor(){
        super({key:'InventarioDaphne'});
    }

    init(){

    }

    preload(){
        this.load.image('Hueco','sprites/images/inventory/inventorySpace.png');
    }

    create(){
        this.cameras.main.setViewport(0,108,108,270);
        let inventorySpaces = [];

        inventorySpaces.push(this.add.image(42,32,'Hueco'));
        inventorySpaces.push(this.add.image(42,135,'Hueco'));
        inventorySpaces.push(this.add.image(42,238,'Hueco'));
        this.add.text(42,32, "1").setScrollFactor(0);
        this.add.text(42,135, "2").setScrollFactor(0);
        this.add.text(42,238, "3").setScrollFactor(0);

    }


    update(){

    }
}