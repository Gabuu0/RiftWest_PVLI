import InventoryItem from "./inventoryItem.js";
import InventorySlot from "./inventorySlot.js";
export default class InventoryPercival extends Phaser.Scene{
    constructor(){
        super({key:'InventarioPercival'});
    }

    init(player){
        this.player = player;

    }

    preload(){
    }

    create(){
        this.cameras.main.setViewport(0,108,256,384);
        
        
        //array de los huecos de inventario
        this.inventorySlots = [];
        this.inventorySlots.push(new InventorySlot(this,42,32,'slot',0,false,'SlotSelected'));
        this.inventorySlots.push(new InventorySlot(this,42,135,'slot',0,false,'SlotSelected'));
        this.inventorySlots.push(new InventorySlot(this,42,238,'slot',0,false,'SlotSelected'));
        this.slotSelected = 0;
        this.inventorySlots[this.slotSelected].setIsSelected();
        
        //Gestion del movimiento por el inventario: 1 para subir 2 para bajar
        this.input.keyboard.on('keydown', (event)=>{
            if(event.code === 'Digit1'){
                if(this.slotSelected > 0){
                    this.inventorySlots[this.slotSelected].setIsSelected();
                    this.inventorySlots[--this.slotSelected].setIsSelected();
                }
            }
            else if(event.code === 'Digit2'){
                if(this.slotSelected < this.inventorySlots.length-1){
                    this.inventorySlots[this.slotSelected].setIsSelected();
                    this.inventorySlots[++this.slotSelected].setIsSelected();
                }
            }
            else if(event.code === 'Escape'){
                this.scene.pause();
            }
            else if(event.code ==='Tab'){
                this.registry.set('object',this.inventorySlots[this.slotSelected][1]);
                this.player.removeItem(this.inventorySlots[this.slotSelected].list[1].identifier);
                this.inventorySlots[this.slotSelected].list[1].destroy(true);
                console.log('tuvieja2.0');
            }
        })

    }


    update(){

    }

    setItem(item){
       let i= 0;
       let itemPicked = false;

       //se coloca el item en la primera posicion vacia del inventario
       while(i<this.inventorySlots.length &&!itemPicked){
            if(this.inventorySlots[i].length === 1){
                itemPicked = true;
                this.inventorySlots[i].add(new InventoryItem(this,0,0,item.texture,'descriptionBox',item.description,item.identifier));
                this.inventorySlots[i].manageItemDescription();
            }
            else {i++;}

       }
    }
}