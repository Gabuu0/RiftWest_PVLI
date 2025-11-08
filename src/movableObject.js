export default class movableObject extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, cx, cy, texture, Player1, Player2, layer){
        super(scene, x, y, texture)

        this.tam = 5
        this.haveObject = false
        this.coolDown = false
        this.coolDownT = 0
        this.coolDownTMax = 10
        this.daphne = Player2
        this.distanceMax = 90
        this.distance;
        this.isGlowing = false;

        //Lo añado a la escena con fisicas
        this.scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(this.tam);
        this.body.immovable = true;

        //Creo el objeto hijo
        this.obCon = new objetoContenido(scene, cx, cy, texture)
        this.obCon.setScale(this.tam);
        this.body.immovable = true;

        //Creo las colisiones
        this.collision = scene.physics.add.collider(this, Player2)
        scene.physics.add.collider(this.obCon, Player1)
        scene.physics.add.collider(this, layer)
        scene.physics.add.collider(this.obCon, layer)
    }

    preUpdate(t, dt) {

        // Calcular centro exacto del cuerpo físico de la caja
        const boxCenterX = this.body.x + this.body.width / 2;
        const boxCenterY = this.body.y + this.body.height / 2;
        // Calcular centro del personaje Percival
        const percivalCenterX = this.daphne.body.x + this.daphne.body.width / 2;
        const percivalCenterY = this.daphne.body.y + this.daphne.body.height / 2;
        //Calcula la distancia entre la caja y percival
        this.distance = Phaser.Math.Distance.Between(
            boxCenterX,
            boxCenterY,
            percivalCenterX,
            percivalCenterY
        );

        if (this.distance < this.distanceMax) {
            if(!this.isGlowing){
                this.isGlowing = true;
                this.glowTween = this.scene.tweens.add({
                    targets: this,
                    alpha: { from: 1, to: 0.2 },
                    duration: 800,
                    yoyo: true,
                    repeat: -1
                });
            }
        } 
        else {
            if(this.isGlowing || this.haveObject){
                this.isGlowing = false;
                this.glowTween.stop();
                this.setAlpha(1);
            }
        } 

        //CoolDown para evitar fallos
        if (this.coolDown) {
            this.coolDownT -= dt;
            if (this.coolDownT <= 0) {
                this.coolDown = false;
                this.coolDownT = 0;
            }
        }

        //Para dejar/coger el objeto
        this.scene.input.keyboard.on('keydown',(event)=>{
            if(event.code === 'ShiftRight'){
                if(!this.coolDown && this.distance < this.distanceMax){
                    this.restartCoolDown()
                }
            }
        })

        //Si tiene el objetor, pero se aleja de el, lo suelta
        if(this.distance > this.distanceMax && this.haveObject){
            this.restartCoolDown()
        }

        //Si tiene el objeto, su movimiento sera igual al del personaje
        if(this.haveObject){
            this.body.velocity.x = this.daphne.body.velocity.x
            this.body.velocity.y = this.daphne.body.velocity.y
        }
        //El objeto de la dimension de percival, siempre sige al de la dimension de daphne
        this.obCon.body.velocity.x = this.body.velocity.x
        this.obCon.body.velocity.y = this.body.velocity.y
    }

    //Esta funcion no solo controla el CoolDown, tambien toda la logica de coger y dejar
    restartCoolDown(){
        this.haveObject = !this.haveObject
        this.coolDownT = this.coolDownTMax
        this.coolDown = true
    }
}

class objetoContenido extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture)

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.immovable = true;
    }
}