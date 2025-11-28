export default class Watchman extends Phaser.GameObjects.PathFollower {
    constructor(scene, x, y, texture, player, pathPoints) {

        //Crea el path
        const path = new Phaser.Curves.Path(pathPoints[0].x, pathPoints[0].y);

        //Dibuja el path
        for (let i = 1; i < pathPoints.length; i++) {
            path.lineTo(pathPoints[i].x, pathPoints[i].y);
        }

        path.lineTo(pathPoints[0].x, pathPoints[0].y); //Une el ultimo punto con el primero

        //Crea un PathFollower
        super(scene, path, x, y, texture);

        this.scene = scene;
        this.player = player;

        scene.add.existing(this);
        
        scene.physics.add.existing(this);
        this.body.setImmovable(true);

        this.setScale(0.4);

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
    }
}
