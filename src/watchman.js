export default class Watchman extends Phaser.GameObjects.PathFollower {
    constructor(scene, x, y, texture, player, pathPoints) {

        //Crea el path
        const path = new Phaser.Curves.Path(pathPoints[0].x, pathPoints[0].y);

        //Dibuja el path
        for (let i = 1; i < pathPoints.length; i++) {
            path.lineTo(pathPoints[i].x, pathPoints[i].y);
        }
        path.lineTo(pathPoints[0].x,pathPoints[0].y); //Une el Ultimo punto con el primero

        //Crea un PathFollower
        super(scene, path, x, y, texture);

        this.scene = scene;
        this.player = player;

        scene.add.existing(this);
        
        scene.physics.add.existing(this);
        this.body.setImmovable(true);

        scene.physics.add.collider(this, this.player);

        this.setScale(0.4);

        this.trigger= scene.add.circle(this.x, this.y, 120, 0x00ff00, 0.1);
        scene.physics.add.existing(this.trigger);

        this.trigger.body.setCircle(120);
        this.trigger.body.setAllowGravity(false);
        this.trigger.body.setImmovable(true);

        this.trigger.body.isSensor = true;
        
        // Collider con el jugador
        this.scene.physics.add.overlap(this.trigger, this.player,() => this.onPlayerEnter(), null, this);

        //Movimiento
        this.startFollow({
            duration: 10000,
            yoyo: false,
            repeat: -1,
            rotateToPath: false
        });
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);
        this.trigger.x=this.x;
        this.trigger.y=this.y;
    }

    onPlayerEnter(){
        console.log("jugador detectado");
    }
}
