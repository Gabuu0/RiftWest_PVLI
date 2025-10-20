export default class Players extends Phaser.Physics.Arcade.Sprite{
    constructor(scene,x=0,y=0,texture = "percival",frame=0,type = "percival"){
        super(scene,x,y,texture,frame);

        this.scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.body.setSize(60,80);
        console.log("Body añadido:", this.body);
        this.type = type;
        this.animations = this.getAnimationsByType();

        this.play(type === "percival" ? "PercivalIdle" : "DaphneIdle", true);
    }

    preUpdate(time, delta){
    super.preUpdate(time, delta); // <- muy importante
    }

    getAnimationsByType(){
        const animations={
            percival:{ idle: "PercivalIdle"},
            daphne:{ idle: "DaphneIdle"},
        }
        return animations[this.type];
        console.log("Animación actual:", this.anims.currentAnim?.key);
    }

}