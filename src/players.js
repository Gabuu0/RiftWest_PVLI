export default class Players extends Phaser.GameObjects.Sprite{
    constructor(scene,x=0,y=0,texture = "percival",frame=0,type = "percival"){
        super(scene,x,y,texture,frame);

        this.scene.add.existing(this);
        this.type = type;
        this.animations = this.getAnimationsByType();

        this.play(this.animations.idle, true);

    }

    preUpdate(t,dt){
        //this.play(this.animations.idle, true);
    }

    getAnimationsByType(){
        const animations={
            percival:{ idle: "PercivalIdle"},
            daphne:{ idle: "DaphneIdle"},
        }
        return animations[this.type];
    }

}