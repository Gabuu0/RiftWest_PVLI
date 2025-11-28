export default class InventorySlot extends Phaser.GameObjects.Container{
    constructor(scene,x,y,imagekey,selected){
        super(scene,x,y)

        this.scene.add.existing(this);
        this.isSelected= selected;
        
        this.slotImage = this.scene.add.sprite(0,0,imagekey,0);
        this.add(this.slotImage);
        
        this.setSize(this.slotImage.width,this.slotImage.height);
    }
    
    setIsSelected(){
        this.isSelected = !this.isSelected;
        this.manageItemDescription();
        this.manageAnimation();
    }
    
    manageItemDescription(){
        if(this.length >1){
            if(this.isSelected) this.list[1].showDescription();
            else this.list[1].hideDescription();
        }
    }

    manageAnimation(){
        if(this.isSelected){
            this.slotImage.play('SlotSelected');
        }
        else{
            this.slotImage.play('SlotIdle');
        }
    }


}

