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

        this.trigger= scene.add.circle(this.x, this.y, 120, 0xFF0000, 0.1);
        scene.physics.add.existing(this.trigger);

        this.trigger.body.setCircle(120);
        this.trigger.body.setAllowGravity(false);
        this.trigger.body.setImmovable(true);

        this.trigger.body.isSensor = true;
        
        // Collider con el jugador
        this.scene.physics.add.overlap(this.trigger, this.player,() => this.onPlayerEnter(), null, this);

        //Valores para calcular la direccion del vigilante
        this.anteriorX = this.x;
        this.anteriorY = this.y;
        this.direccion; //Derecha=1, Abajo=2, Izquierda=3, Arriba=4

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

        //vemos la dirección
        this.updateDireccion();

        //actualizamos la nueva dirección
        this.anteriorX=this.x;
        this.anteriorY=this.y;

        //Ajusta el area de visión a la posicion del vigilante
        this.trigger.x=this.x;
        this.trigger.y=this.y;
    }

    onPlayerEnter(){
        if(this.player.x < this.x && this.direccion==1){console.log("REINICIAR PARTIDA");}
        else if(this.player.x > this.x && this.direccion==3){console.log("REINICIAR PARTIDA");}
        else if(this.player.y < this.y && this.direccion==2){console.log("REINICIAR PARTIDA");}
        else if(this.player.y > this.y && this.direccion==4){console.log("REINICIAR PARTIDA");}
    }

    updateDireccion(){
        const realX=this.anteriorX-this.x;
        const realY=this.anteriorY-this.y;

        //Comprueba si se mueve en horizontal o vertical
        if (Math.abs(realX) > Math.abs(realY)) {
            if (realX>0) this.direccion=1; //Va a la derecha
            if (realX<0) this.direccion=3; //Va la izquierda
        }
        else{
            if(realY>0) this.direccion=2; //Va hacia abajo
            if(realY<0) this.direccion=4; //Va hacia arriba
        }
    }
}
