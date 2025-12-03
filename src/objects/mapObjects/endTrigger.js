export default class EndTrigger extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,texture){
        super(scene,x,y,texture);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setImmovable(true);

        this.isPressed = false;
    }

    on(){
        if (this.isPressed) return;
        this.isPressed = true;
        this.scene.time.delayedCall(200, () => {
            this.out();
        });
    }
    out(){
        this.isPressed = false;
    }
    getIsPressed(){
        return this.isPressed;
    }

    //----------Esto es lo que hay q poner en el Nvl----------
    // this.physics.add.overlap(this.players,this.endTriggers,(jugador, endT)=>{
    //     endT.on();
    //     if (this.endTriggers.every(t => t.getIsPressed())) {
    //         console.log("3Letra, la L");
    //     }
    // });
}