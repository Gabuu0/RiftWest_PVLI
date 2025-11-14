export default class Players extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x=0,y=0,texture = "percival",frame=0,type = "percival"){
        super(scene,x,y,texture,frame);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds(false);
        this.body.setSize(50, 20);
        this.body.setOffset(55,100);
        console.log("Body añadido:", this.body);

        const maxObjs = 3;

        this.objects = [];

        this.type = type;
        this.animations = this.getAnimationsByType();
        this.inventory = this.getInventoryByType();
        const inventoryScene = this.scene.scene.get(this.inventory.sceneKey);

        this.scene.input.keyboard.on('keydown',(event)=>{
            if(event.code ===this.inventory.key){

                if(!this.scene.scene.isActive(this.inventory.sceneKey)){
                    this.scene.scene.launch(this.inventory.sceneKey);
                    inventoryScene.setItems(this.objects);
                    return;
                }
                else{
                    this.scene.scene.sleep(this.inventory.sceneKey);
                }
                
            }
        })

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
            percival:{key: 'KeyQ', sceneKey: 'InventarioPercival'},
            daphne:{key: 'ControlRight', sceneKey: 'InventarioDaphne'},
        }
        return inventory[this.type];
    }

    catchItem(item){
        if(this.objects.length < maxObjs){
            item.setIndex(this.objects.length);
            return true;
        }
        else{
            return false;
        }
    }


    

}