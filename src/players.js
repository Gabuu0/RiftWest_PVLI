import InventoryItem from "./inventoryItem.js";


export default class Players extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x=0,y=0,texture = "percival",frame=0,type = "percival"){
        super(scene,x,y,texture,frame);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds(false);
        this.body.setSize(50, 20);
        this.body.setOffset(55,100);
        console.log("Body añadido:", this.body);

        this.maxObjs = 3;

        this.objects = [];

        this.type = type;
        this.animations = this.getAnimationsByType();
        this.inventory = this.getInventoryByType();
        this.scene.scene.launch(this.inventory.sceneKey);
        this.scene.scene.sleep(this.inventory.sceneKey);
        this.inventoryScene = this.scene.scene.get(this.inventory.sceneKey);
        
        this.scene.input.keyboard.on('keydown',(event)=>{
            if(event.code ===this.inventory.key){
                
                if(!this.scene.scene.isActive(this.inventory.sceneKey)){
                    this.scene.scene.launch(this.inventory.sceneKey);
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
        return animations[this.type];
    }

    getInventoryByType(){
        const inventory ={
            percival:{key: 'KeyQ', sceneKey: 'InventarioPercival'},
            daphne:{key: 'ControlRight', sceneKey: 'InventarioDaphne'},
        }
        return inventory[this.type];
    }

    pickItem(item){
        if(this.objects.length < this.maxObjs){
            const itemData = new InventoryItem(item.texture, item.textureInventory,
                              item.description,this.objects.length)
            this.objects.push(itemData);
            this.inventoryScene.setItem();
            return true;
        }
        else{
            return false;
        }
    }


    

}