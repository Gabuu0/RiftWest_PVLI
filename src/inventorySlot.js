export default class InventorySlot extends Phaser.GameObjects.Container{
    constructor(scene,x,y,imagekey){
        super(scene,x,y)

        this.scene.add.existing(this);
        this.isSelected= false;
        
        const slotImage = this.scene.add.image(0,0,imagekey,0);

        //Cambia el frame segun si esta seleccionado o no
        if(!this.isSelected) slotImage.setFrame(0);
        else slotImage.setFrame(1);
    }

    setIsSelected(){
        this.isSelected = !this.isSelected;
    }
}