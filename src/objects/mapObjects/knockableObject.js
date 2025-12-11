export default class KnockableObject extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,texture){
        super(scene,x,y,texture);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setSize(this.width, this.height * 0.25);
        this.body.setOffset(0.2, this.height * 0.6);

        this.body.setImmovable(true);

        this.currentFrame = 0;
        this.setFrame(this.currentFrame);
    }

    knock() {
        this.currentFrame = 1;
        this.setFrame(this.currentFrame);
        this.scene.tweens.add({
        targets: this,
        alpha: 0,
        duration: 2000,
        ease: 'Linear',
        onComplete: () => {
            this.disableCollider();
        }
        });
    }
    disableCollider() {
        this.destroy(true)
    }
}
