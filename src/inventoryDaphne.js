import InventorySlot from "./inventorySlot.js";
import InventoryItem from "./inventoryItem.js";
export default class InventoryDaphne extends Phaser.Scene{
    constructor(){
        super({key:'InventarioDaphne'});
    }

    init(){

    }

    preload(){
        this.load.spritesheet('hueco','sprites/images/inventory/inventorySpace.png',{frameWidth: 64, frameHeight:64});
    }

    create(){
        this.cameras.main.setViewport(972,108,108,270);

        //array de los huecos de inventario
        this.inventorySlots = [];
        this.inventorySlots.push(new InventorySlot(this,42,32,'slot',0,false,'SlotSelected'));
        this.inventorySlots.push(new InventorySlot(this,42,135,'slot',0,false,'SlotSelected'));
        this.inventorySlots.push(new InventorySlot(this,42,238,'slot',0,false,'SlotSelected'));
        this.slotSelected = 0;
        this.inventorySlots[this.slotSelected].setIsSelected();

        this.slotSelected = 0;

        //Gestion del movimiento por el inventario: 1 para subir 2 para bajar
        this.input.keyboard.on('keydown', (event)=>{
            if(event.code === 'Numpad1'){
                if(this.slotSelected > 0){
                    this.inventorySlots[this.slotSelected].setIsSelected();
                    this.inventorySlots[--this.slotSelected].setIsSelected();
                }
            }
            else if(event.code === 'Numpad2'){
               if(this.slotSelected < inventorySlots.length-1){
                    this.inventorySlots[this.slotSelected].setIsSelected();
                    this.inventorySlots[++this.slotSelected].setIsSelected();
                }
            }
            else if(event.code === 'Escape'){
                this.scene.pause();
            }

        })

      
    }


    update(){

    }

    setItems(objects){
        for(i = 0;i<this.inventorySlots.length && i<objects.length;i++){
            this.inventorySlots[i].add(objects[i]);
        }
    }
}