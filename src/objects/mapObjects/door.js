export default class Door extends Phaser.Physics.Arcade.Sprite {
    constructor(scene,x,y,texture, frame,rotationAngle,identifier){
        super(scene,x,y,texture,frame);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setImmovable(true);
        if(rotationAngle != 0){
            this.setRotation(Phaser.Math.DegToRad(rotationAngle));
            this.body.setSize(this.displayHeight,this.displayWidth);
        }
        this.isOpen = false;

        this.identifier = identifier;
    }


    openDoor(type){
        if(this.isOpen) return;
        this.isOpen = true;
        this.disableBody(false,true);
        if(type === "preassurePlate"){this.scene.time.delayedCall(200,this.closeDoor,null,this);}
    }

    closeDoor(){
        this.enableBody(false,0,0,true,true);
        this.isOpen = false;
    }
}