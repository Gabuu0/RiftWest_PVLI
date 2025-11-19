export default class Watchman extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, player, pathPoints) {
        super(scene, x, y, texture);

        this.scene = scene;
        this.player = player;
        this.path = pathPoints;      // Array de posiciones
        this.pathIndex = 0;          // Punto actual al que va
        this.speed = 70;             // Velocidad del vigilante
        this.visionDistance = 120;   // Cuánto ve
        this.visionAngle = 45;       // Ángulo hacia delante
        this.isAlert = false;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setScale(0.3);
        this.body.setImmovable(true);
    }

     preUpdate(t, dt) {
        super.preUpdate(t, dt);

        this.followPath();
    }
    
    followPath() {
        const target = this.path[this.pathIndex];

        // Distancia hacia el punto objetivo
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 5) {
            // Avanza al siguiente punto
            this.pathIndex++;

            // Si llegó al final → vuelve al principio
            if (this.pathIndex >= this.path.length) {
                this.pathIndex = 0;
            }
            return;
        }

        // Movimiento normalizado
        const angle = Math.atan2(dy, dx);

        this.body.setVelocity(
            Math.cos(angle) * this.speed,
            Math.sin(angle) * this.speed
        );
    }
}