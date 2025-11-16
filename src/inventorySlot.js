export default class InventorySlot extends Phaser.GameObjects.Container{
    constructor(scene,x,y,imagekey,selected){
        super(scene,x,y)

        this.scene.add.existing(this);
        this.isSelected= selected;
        
        this.slotImage = this.scene.add.image(0,0,imagekey,0);
        this.add(this.slotImage);
        
        this.setSize(this.slotImage.width,this.slotImage.height);
        this.setImageFrame();
        
       
    }

    setIsSelected(){
        this.isSelected = !this.isSelected;
        this.setImageFrame();    
    }


    //Cambia el frame segun si esta seleccionado o no
    setImageFrame(){
       this.slotImage.setFrame(this.isSelected ? 1 : 0);
    }
}

