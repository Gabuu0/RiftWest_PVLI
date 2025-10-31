import Players from "./players.js";

export default class movableObject extends Phaser.GameObjects.Container{
    constructor(scene, x, y, cx, cy, texture, Player1, Player2){
        super(scene, x, y)

        this.scene.add.existing(this);
        scene.physics.add.existing(this);

        this.sprite = scene.add.sprite(0, 0, texture);
        this.add(this.sprite);

        this.obCon = new objetoContenido(scene, cx, cy, texture)
        this.obCon.setScale(0.1);
        this.add(this.obCon);

        scene.physics.add.collider(this, Player1)
        scene.physics.add.collider(this, Player2)

        scene.physics.add.collider(this.obCon, Player1)
        scene.physics.add.collider(this.obCon, Player2)
    }

    preUpdate(t, dt){
        this.iterate( (child) => child.preUpdate(t,dt) );
    }
}

class objetoContenido extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture)

        scene.add.existing(this);
        scene.physics.add.existing(this);
    }
}