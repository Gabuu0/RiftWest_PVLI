export default class InventorySlot extends Phaser.GameObjects.Container{
    constructor(scene,x,y,imagekey,selected){
        super(scene,x,y)

        this.scene.add.existing(this);
        this.isSelected= selected;
        
        this.slotImage = this.scene.add.image(x,y,imagekey,0);
        this.setImageFrame(); 

       
    }

    setIsSelected(){
        this.isSelected = !this.isSelected;
        this.setImageFrame();    
    }


    //Cambia el frame segun si esta seleccionado o no
    setImageFrame(){
        if(!this.isSelected){
            this.slotImage.setFrame(0); 
        } 
        else{
            this.slotImage.setFrame(1);
        } 
    }
}

