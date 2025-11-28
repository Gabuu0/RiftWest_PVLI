export default class BreakableObject extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y,x2, y2, texture, percival, daphne){

        super(scene, x, y, texture)
        this.scene = scene
        this.percival = percival
        this.daphne = daphne
        this.textureKey = texture
        this.scale = 5;

        //Caja1 (dimensión Percival) 
        this.scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(this.scale);
        this.body.immovable = true;

        //Caja2 (dimensión Daphne)
        this.caja2 = new objetoContenido(scene, x2, y2, texture)
        this.caja2.setScale(this.scale);
        this.caja2.body.immovable = true;

        //Colliders
        scene.physics.add.collider(this, percival);
        scene.physics.add.collider(this.caja2, daphne);

        // Estado inicial
        this.isBroken = false;
        this.breakRange = 90; // distancia para poder romper

        // Asignar tecla SHIFT (para Percival)
        this.keyShift = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    }

    preUpdate(t, dt){
        if (this.isBroken) return;

        // Calcular centro exacto del cuerpo físico de la caja
        const boxCenterX = this.body.x + this.body.width / 2;
        const boxCenterY = this.body.y + this.body.height / 2;

        // Calcular centro del personaje Percival
        const percivalCenterX = this.percival.body.x + this.percival.body.width / 2;
        const percivalCenterY = this.percival.body.y + this.percival.body.height / 2;

        //Calcula la distancia entre la caja y percival
        const distance = Phaser.Math.Distance.Between(
            boxCenterX,
            boxCenterY,
            percivalCenterX,
            percivalCenterY
        );

        //Si percival se encuentra dentro del rango de distancia deja romper la caja
        if (distance < this.breakRange) {

            // Muestra que se puede romper
            if (!this.glowTween) {
             this.glowTween = this.scene.tweens.add({
             targets: this,
             alpha: { from: 1, to: 0.2 },
             duration: 800,
             yoyo: true,
             repeat: -1
             });
            } 

            // Si pulsa SHIFT → romper
            if (Phaser.Input.Keyboard.JustDown(this.keyShift)) {
                this.breakObject();
            }
        } 
        else if (distance >= this.breakRange && this.glowTween) {
            this.glowTween.stop();
            this.glowTween = null;
            this.alpha = 1;
        }
    }

    breakObject() {
        if (this.isBroken) return;

        this.isBroken = true;

        // Cambia la textura
        this.setTexture("cajaRota");
        this.caja2.setTexture("cajaRota");

        // Efecto visual de desaparición
        this.scene.tweens.add({
            targets: [this, this.caja2],
            alpha: 0,
            duration: 500,
            onComplete: () => {
                this.destroy();
                this.caja2.destroy();
            }
        });
    }
}

    
class objetoContenido extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture)

        scene.add.existing(this);
        scene.physics.add.existing(this);
    }
}