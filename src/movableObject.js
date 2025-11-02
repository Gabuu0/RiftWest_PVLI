import Players from "./players.js";

export default class movableObject extends Phaser.GameObjects.Container{
    constructor(scene, x, y, cx, cy, texture, Player1, Player2, layer){
        super(scene, x, y)

        this.offset = 40

        this.scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.sprite = scene.add.sprite(0, 0, texture);
        this.sprite.setScale(0.1);
        this.add(this.sprite);
        this.body.setOffset(-this.offset, -this.offset);
        this.body.setSize(this.offset * 2, this.offset * 2);

        this.obCon = new objetoContenido(scene, cx, cy, texture)
        this.obCon.setScale(0.1);
        this.add(this.obCon);

        scene.physics.add.collider(this, Player1)
        scene.physics.add.collider(this.obCon, Player2)
        scene.physics.add.collider(this, layer)
        
        this.body.immovable = true;
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
        this.body.immovable = true;
    }
}