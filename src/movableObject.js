export default class movableObject extends Phaser.GameObjects.Container{
    constructor(scene, x, y, cx, cy, texture, Player1, Player2, layer){
        super(scene, x, y)

        this.daphne = Player2
        this.offset = 40
        this.tam = 0.75
        this.haveObject = false
        this.coolDown = false
        this.coolDownT = 0
        this.coolDownTMax = 1

        //Lo añado a la escena con fisicas
        this.scene.add.existing(this);
        scene.physics.add.existing(this);
        
        //le añado el sprite y lo coloco para que este en la posicion del collider
        this.sprite = scene.add.sprite(0, 0, texture);
        this.sprite.setScale(0.1);
        this.add(this.sprite);
        this.body.setOffset(-this.offset, -this.offset);
        this.body.setSize(this.offset * 2, this.offset * 2);

        //Creo el objeto hijo
        this.obCon = new objetoContenido(scene, cx, cy, texture)
        this.obCon.setScale(0.1);
        this.add(this.obCon);

        //Creo las colisiones
        this.collision = scene.physics.add.collider(this, Player2, this.addObject, null, this)
        scene.physics.add.collider(this.obCon, Player1)
        scene.physics.add.collider(this, layer)
        scene.physics.add.collider(this.obCon, layer)

        //Hago que el objeto no se pueda empujar por fisicas
        this.body.immovable = true;

        //Hago las dos cajas un poco mas pequeñas
        this.setScale(this.tam)
    }

    preUpdate(t, dt) {
        this.iterate((child) => child.preUpdate(t, dt));

        //CoolDown para evitar fallos
        if (this.coolDown) {
            this.coolDownT -= dt;
            if (this.coolDownT <= 0) {
                this.coolDown = false;
                this.coolDownT = 0;
                console.log('Cooldown terminado');
            }
        }

        this.scene.input.keyboard.on('keydown',(event)=>{
            if(event.code === 'ShiftRight' && this.haveObject && !this.coolDown){
                this.releaseObject(this, this.daphne)
            }
        })
    }

    addObject(obj1, obj2){
        this.scene.input.keyboard.on('keydown',(event)=>{
            if(event.code === 'ShiftRight' && !this.haveObject && !this.coolDown){
                const worldX = obj1.x - obj2.x;
                const worldY = obj1.y - obj2.y;

                obj2.add(obj1);
                obj1.setPosition(worldX, worldY);
            
                this.collision.destroy();
                this.collision = null;
                this.haveObject = true
                console.log(this.haveObject)

                this.coolDownT = this.coolDownTMax
                this.coolDown = true
            }
        })
    }

    releaseObject(obj, Player){
        const worldX = obj.x + Player.x
        const worldY = obj.y + Player.y

        Player.remove(obj);
        obj.setPosition(worldX, worldY)
        this.collision = this.scene.physics.add.collider(this, this.daphne, this.addObject, null, this)

        this.haveObject = false
        console.log(this.haveObject)
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