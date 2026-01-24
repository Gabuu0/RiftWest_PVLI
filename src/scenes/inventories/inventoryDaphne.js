import InventorySlot from "../../objects/playerObjects/inventorySlot.js";
import InventoryItem from "../../objects/playerObjects/inventoryItem.js";
export default class InventoryDaphne extends Phaser.Scene{
    constructor(){
        super({key:'InventarioDaphne'});
    }

    init(data){
        this.player = data.player;
        this.activeScene = data.playerScene;
    }

    preload(){
    }

    create(){
        this.cameras.main.setViewport(826,108,256,384);

        //array de los huecos de inventario
        this.inventorySlots = [];
        this.inventorySlots.push(new InventorySlot(this,222,32,'slot',0,false,'SlotSelected'));
        this.inventorySlots.push(new InventorySlot(this,222,135,'slot',0,false,'SlotSelected'));
        this.inventorySlots.push(new InventorySlot(this,222,238,'slot',0,false,'SlotSelected'));
        this.slotSelected = 0;
        this.inventorySlots[this.slotSelected].setIsSelected();

        //Gestion del movimiento por el inventario: 1 para subir 2 para bajar
        this.input.keyboard.on('keydown', (event)=>{
            if(event.code === 'Digit9'){
                if(this.slotSelected > 0){
                    this.inventorySlots[this.slotSelected].setIsSelected();
                    this.inventorySlots[--this.slotSelected].setIsSelected();
                }
            }
            else if(event.code === 'Digit0'){
               if(this.slotSelected < this.inventorySlots.length-1){
                    this.inventorySlots[this.slotSelected].setIsSelected();
                    this.inventorySlots[++this.slotSelected].setIsSelected();
                }
            }
            else if(event.code === 'Escape'){
                this.scene.pause();
            }
             else if(event.code ==='Enter'){
                let clown = this.registry.get('clownObj');
                if(clown.hasObj){
                    if(this.player.pickItem(clown.objData)){
                        this.activeScene.showClownMessage(this.player.type,true,false,false);
                        this.registry.set('clownObj',{
                            objData: {},
                            hasObj: false,
                        })
                    }
                    else{
                        this.activeScene.showClownMessage(this.player.type,true,);
                    }
                }
                else if(!clown.hasObj){
                    if(this.inventorySlots[this.slotSelected].length < 2){
                        this.activeScene.showClownMessage(this.player.type,false,false,true);
                        return;
                    }
                    this.registry.set('clownObj',{
                        objData: this.inventorySlots[this.slotSelected].list[1].itemData,
                        hasObj:true
                    });
                    this.player.removeItem(this.inventorySlots[this.slotSelected].list[1].identifier);
                    this.inventorySlots[this.slotSelected].list[1].destroy(true);
                    this.activeScene.showClownMessage(this.player.type,false,true,true);
                }
            }
        })

        this.events.on('sleep', () => {
            console.log('sleep' + this.key)
            this.input.enabled = false;
        });
        
        this.events.on('wake', () => {
            console.log('wake' + this.key)
            this.input.enabled = true;
        });
    }


    update(){

    }

    setItem(item){
           let i= 0;
           let itemPicked = false;
           const descriptionPos = {x:-80,y:32};

           //se coloca el item en la primera posicion vacia del inventario
           while(i<this.inventorySlots.length &&!itemPicked){
                if(this.inventorySlots[i].length === 1){
                    itemPicked = true;
                    this.inventorySlots[i].add(new InventoryItem(this,0,0,item.texture,'descriptionBox',item.description,descriptionPos,item.identifier));
                    this.inventorySlots[i].manageItemDescription();
                }
                else {i++;}
    
           }
    }

    removeItem(itemId){
    let i= 0;
       let itemRemoved = false;
       //se coloca el item en la primera posicion vacia del inventario
       while(i<this.inventorySlots.length &&!itemRemoved){
            if(this.inventorySlots[i].length === 2 && this.inventorySlots[i].list[1].identifier === itemId){
                itemRemoved = true;
                this.inventorySlots[this.slotSelected].list[1].destroy(true);

            }
            else {i++;}

       }
    }
}