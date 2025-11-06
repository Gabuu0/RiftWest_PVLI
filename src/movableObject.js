export default class movableObject extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, cx, cy, texture, Player1, Player2, layer){
        super(scene, x, y, texture)

        this.tam = 0.075
        this.haveObject = false
        this.coolDown = false
        this.coolDownT = 0
        this.coolDownTMax = 10
        this.daphne = Player2
        this.distanceMax = 100
        this.distance;

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
        this.collision = scene.physics.add.collider(this, Player2, this.checkPickup.bind(this))
        scene.physics.add.collider(this.obCon, Player1)
        scene.physics.add.collider(this, layer)
        scene.physics.add.collider(this.obCon, layer)
    }

    preUpdate(t, dt) {
        //CoolDown para evitar fallos
        if (this.coolDown) {
            this.coolDownT -= dt;
            if (this.coolDownT <= 0) {
                this.coolDown = false;
                this.coolDownT = 0;
            }
        }

        //Para dejar el objeto
        this.scene.input.keyboard.on('keydown',(event)=>{
            if(event.code === 'ShiftRight'){
                if(this.haveObject && !this.coolDown){
                    this.restartCoolDown()
                }
            }
        })

        //Si tiene el objeto, su movimiento sera igual al del personaje
        if(this.haveObject && this.distance < this.distanceMax){
            this.distance = Phaser.Math.Distance.Between(this.daphne.x, this.daphne.y, this.x, this.y);
            console.log(this.distance)
            this.body.velocity.x = this.daphne.body.velocity.x
            this.body.velocity.y = this.daphne.body.velocity.y
        }
        //El objeto de la dimension de percival, siempre sige al de la dimension de daphne
        this.obCon.body.velocity.x = this.body.velocity.x
        this.obCon.body.velocity.y = this.body.velocity.y
    }

    checkPickup() {
        this.scene.input.keyboard.on('keydown', (event) => {
            if (event.code === 'ShiftRight' && !this.coolDown) {
                this.distance = Phaser.Math.Distance.Between(this.daphne.x, this.daphne.y, this.x, this.y);
                if (this.distance < this.distanceMax) {
                    if (!this.haveObject) {
                        this.restartCoolDown();
                    }
                }
            }
        });
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