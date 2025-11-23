export default class InventoryItem extends Phaser.GameObjects.Container{
    constructor(scene,x,y,texture,descriptionBox,description,identifier){
        super(scene,x,y);

        this.scene.add.existing(this);
        this.itemImage = this.scene.add.image(x,y,texture).setScale(3);
        this.add(this.itemImage);
        //el recuadro donde se muestra la descripcion del item
        this.descriptionBg = this.scene.add.image(80,32,descriptionBox);
        this.description = this.scene.add.text(-16,16,description,{
            fontSize: '20px',
            align: 'justify',
            wordWrap: {width: this.descriptionBg.displayWidth, useAdvancedWrap: true}
        });
        this.description.alpha = this.descriptionBg.alpha = 0.8;
        this.add(this.descriptionBg);
        this.add(this.description);
        this.identifier = identifier;
    }

    showDescription(){
        this.list[1].setVisible(true);
        this.list[2].setVisible(true);
        console.log('mostrao');
    }

    hideDescription(){
        this.list[1].setVisible(false);
        this.list[2].setVisible(false);
        console.log('ocultao');
    }
}