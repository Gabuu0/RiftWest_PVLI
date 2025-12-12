export default class Watchman extends Phaser.GameObjects.PathFollower {
    constructor(scene, x, y, texture, frame, player, pathPoints, type = "sheriff") {

        //Crea el path
        const path = new Phaser.Curves.Path(pathPoints[0].x, pathPoints[0].y);

        //Dibuja el path
        for (let i = 1; i < pathPoints.length; i++) {
            path.lineTo(pathPoints[i].x, pathPoints[i].y);
        }
        path.lineTo(pathPoints[0].x,pathPoints[0].y); //Une el Ultimo punto con el primero

        //Crea un PathFollower
        super(scene, path, x, y, texture, frame);
        
        this.type = type;
        this.animations = this.getAnimationsByType();

        this.scene = scene;
        this.player = player;
        this.setDepth(10)
        scene.add.existing(this);
        
        scene.physics.add.existing(this);
        this.body.setImmovable(true);
        this.body.setSize(50, 64);
        this.body.setOffset(55,50);

        scene.physics.add.collider(this, this.player);

        this.trigger = scene.add.circle(this.x, this.y, 120, 0x4d0000, 0.3);
        this.trigger.setDepth(0.5)
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
            duration: 30000,
            yoyo: false,
            repeat: -1,
            rotateToPath: false
        });
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);

        //vemos la dirección
        this.updateDireccion();

        this.playAnimations();

        //actualizamos la nueva dirección
        this.anteriorX=this.x;
        this.anteriorY=this.y;

        //Ajusta el area de visión a la posicion del vigilante
        this.trigger.x=this.x;
        this.trigger.y=this.y;
    }

    // watchman.js, método onPlayerEnter() CORREGIDO

    onPlayerEnter(){
        let detectado = false;

        // 1. Si el vigilante va a la DERECHA (1), el jugador debe estar a la derecha (this.player.x > this.x)
        if(this.player.x > this.x && this.direccion == 1){ 
            detectado = true;
        }
        // 2. Si el vigilante va hacia ABAJO (2), el jugador debe estar abajo (this.player.y > this.y)
        else if(this.player.y > this.y && this.direccion == 2){ 
            detectado = true;
        }
        // 3. Si el vigilante va a la IZQUIERDA (3), el jugador debe estar a la izquierda (this.player.x < this.x)
        else if(this.player.x < this.x && this.direccion == 3){ 
            detectado = true;
        }
        // 4. Si el vigilante va hacia ARRIBA (4), el jugador debe estar arriba (this.player.y < this.y)
        else if(this.player.y < this.y && this.direccion == 4){ 
            detectado = true;
        }

        if(detectado){
            this.scene.resetSound.play();
            this.scene.scene.restart();
        }
    }

    updateDireccion(){
        // Calcular cuánto cambió la posición (Actual - Anterior)
        const realX = this.x - this.anteriorX; 
        const realY = this.y - this.anteriorY;

        // Comprueba si se mueve en horizontal o vertical
        if (Math.abs(realX) > Math.abs(realY)) {
            // Movimiento Horizontal
            if (realX > 0) this.direccion = 1; // realX positivo -> Moviéndose a la DERECHA
            if (realX < 0) this.direccion = 3; // realX negativo -> Moviéndose a la IZQUIERDA
        }
        else if (Math.abs(realY) > 0) { // Solo comprueba Y si el movimiento horizontal no es mayor
            // Movimiento Vertical
            if(realY > 0) this.direccion = 2; // realY positivo (eje y va hacia abajo) -> Moviéndose hacia ABAJO
            if(realY < 0) this.direccion = 4; // realY negativo -> Moviéndose hacia ARRIBA
        }
    }

    playAnimations(){
        switch(this.direccion) {
            case 1: // Derecha
                this.play(this.animations.left, true);
                break;

            case 2: // Abajo
                this.play(this.animations.up, true);
                break;

            case 3: // Izquierda
                this.play(this.animations.right, true);
                break;

            case 4: // Arriba
                this.play(this.animations.down, true);
                break;
        }
    }
    
    getAnimationsByType(){
        const animations={
            sheriff: {
                up: "SheriffUp",
                down: "SheriffDown",
                left: "SheriffLeft",
                right: "SheriffRight",
            },
            profesor: {
                up: "ProfesorUp",
                down: "ProfesorDown",
                left: "ProfesorLeft",
                right: "ProfesorRight",
            }
        }
        return animations[this.type];
    }

    triggerSize(size){
        this.trigger.body.setCircle(size);
        this.trigger.setRadius(size);
        this.scene.time.delayedCall(12000,this.resetSize,null,this);
    }
    resetSize(size){
        this.trigger.body.setCircle(120);
        this.trigger.setRadius(120);
    }
}
