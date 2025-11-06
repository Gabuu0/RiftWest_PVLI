import Players from "./players.js";

export default class BreakableObject extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y,x2, y2, texture, percival, daphne){
        super(scene, x, y, texture)
        this.scene = scene
        this.percival = percival
        this.daphne = daphne
        this.textureKey = texture
        this.scale=0.12;


        //Caja1 (dimensión Percival) 
        this.scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(this.scale);
        this.body.immovable = true;

        //Caja2 (dimensión Daphne)
        this.caja2 = new objetoContenido(scene, x2, y2, texture)
        this.caja2.setScale(this.scale);
        this.caja2.body.immovable = true;

        //ajustar el tamaño
        //this.body.setSize(this.displayWidth, this.displayHeight);
        //this.body.setOffset(-this.displayWidth/2, -this.displayHeight/2);

        //Colliders
        scene.physics.add.collider(this, percival);
        scene.physics.add.collider(this.caja2, daphne);

        // Estado inicial
        this.isBroken = false;
        this.breakRange = 80; // distancia para poder romper

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

        const distance = Phaser.Math.Distance.Between(
            boxCenterX,
            boxCenterY,
            percivalCenterX,
            percivalCenterY
        );

        if (distance < this.breakRange) {
            // Mostrar que se puede romper
            this.setTint(0xff8888);

            // Si pulsa SHIFT → romper
            if (Phaser.Input.Keyboard.JustDown(this.keyShift)) {
                this.breakObject();
            }
        } else {
            this.clearTint();
        }
    }
    breakObject() {
        if (this.isBroken) return;

        this.isBroken = true;

        // Cambiar textura o hacer animación
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