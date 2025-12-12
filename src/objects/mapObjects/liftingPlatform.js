export default class LiftingPlatform extends Phaser.Physics.Arcade.Sprite {
    /**
     * @param {int} identifier -Identificador para levantar/bajar la plataforma al interacctuar con un objeto con el mismo identificador
     * @param {boolean} isRaised -Si la plataforma inicia levantada o no
     */
    constructor(scene,x,y,texture, frame,identifier,isRaised){
        super(scene,x,y,texture,frame);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setImmovable(true);
        this.isRaised = isRaised;
        this.originalState = isRaised;
        this.identifier = identifier;
        this.setFrameByState();
    }

    /**
     * este metodo activa la plataforma, si su estado inicial es estar levantada la baja y viceversa
     */
    activatePlatform(){
        if(this.isRaised === !this.originalState) return;
        this.isRaised = !this.originalState;
        this.setFrameByState();
        this.scene.time.delayedCall(200,this.desactivatePlatform,null,this);
    }

    /**
     * Este metodo devuelve a la plataforma a su estado inicial
     */
    desactivatePlatform(){
        this.isRaised = !this.isRaised;
        this.setFrameByState();
    }

    setFrameByState(){
      this.setFrame(this.isRaised ? 0 : 1)
    }
}