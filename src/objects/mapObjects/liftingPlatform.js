export default class LiftingPlatform extends Phaser.Physics.Arcade.Sprite {
    /**
     * 
     * @param {int} identifier -Identificador para levantar/bajar la plataforma al interacctuar con un objeto con el mismo identificador
     * @param {boolean} isRaised -Si la plataforma inicia levantada o no
     */
    constructor(scene,x,y,texture, frame,identifier,isRaised){
        super(scene,x,y,texture,frame);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setImmovable(true);
        if(rotationAngle != 0){
            this.setRotation(Phaser.Math.DegToRad(rotationAngle));
            this.body.setSize(this.displayHeight,this.displayWidth);
        }
        this.isOpen = isOpen;
        this.originalState = isOpen;

        this.identifier = identifier;
    }


    activatePlatform(){
        if(this.isOpen === !this.originalState) return;
        this.isOpen = !this.originalState;
        this.setFrameByState();
        this.scene.time.delayedCall(200,this.desactivatePlatform,null,this);
    }
    
    desactivatePlatform(){
        this.isOpen = !this.isOpen;
        this.setFrameByState();
    }

    setFrameByState(){
        if(this.isOpen){
            this.setFrame(1);
        }
        else{
            this.setFrame(0);
        }
    }
}