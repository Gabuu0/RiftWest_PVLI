export default class Players extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x=0,y=0,texture = "percival",frame=0,type = "percival"){
        super(scene,x,y,texture,frame);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds(false);
        this.body.setSize(50, 20);
        this.body.setOffset(55,100);
        console.log("Body añadido:", this.body);

        this.type = type;
        this.animations = this.getAnimationsByType();
        this.inventory = this.getInventoryByType();

        this.scene.input.keyboard.on('keydown',(event)=>{
            if(event.code ===this.inventory.key){

                if(!this.scene.scene.isActive(this.inventory.scene)){
                    this.scene.scene.launch(this.inventory.scene);
                    console.log('Escena cargada:' + this.inventory.scene);
                    return;
                }
                
                if(!this.scene.scene.isSleeping(this.inventory.scene)){
                    this.scene.scene.sleep(this.inventory.scene);
                    console.log('Escena dormida:' + this.inventory.scene);
                }
                else{
                    this.scene.scene.wake(this.inventory.scene);
                }
            }
        })

        //this.play(type === "percival" ? "PercivalIdle" : "DaphneIdle", true);
        this.play(this.animations.idle);
    }

    preUpdate(time, delta){
    super.preUpdate(time, delta);
    }

    getAnimationsByType(){
        const animations={
            percival:{ idle: "PercivalIdle"},
            daphne:{ idle: "DaphneIdle"},
        }
        console.log("Animación actual:", this.anims.currentAnim?.key);
        return animations[this.type];
    }

    getInventoryByType(){
        const inventory ={
            percival:{key: 'KeyQ', scene: 'InventarioPercival'},
            daphne:{key: 'ControlRight', scene: 'InventarioDaphne'},
        }
        return inventory[this.type];
    }

}