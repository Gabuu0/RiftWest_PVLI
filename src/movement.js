export default class Movement{
    constructor(scene, percival, daphne){
        this.scene=scene;
        this.percival=percival;
        this.daphne=daphne;

        this.percivalKeys= scene.input.keyboard.addKeys({
            up:Phaser.Input.Keyboard.KeyCodes.W,
            down:Phaser.Input.Keyboard.KeyCodes.S,
            left:Phaser.Input.Keyboard.KeyCodes.A,
            right:Phaser.Input.Keyboard.KeyCodes.D
        })

        this.daphneKeys = scene.input.keyboard.createCursorKeys();

        this.speed=200;
    }

    update(){
        this.movePlayer(this.percival, this.percivalKeys);
        this.movePlayer(this.daphne, this.daphneKeys);
    }

    movePlayer(player, keys){
        if (!player || !player.body || !keys) 
            return;

        player.body.setVelocity(0, 0);

        if(keys.up.isDown){
            player.body.setVelocityY(-this.speed);
        }
        else if(keys.down.isDown){
            player.body.setVelocityY(this.speed);
        }
        if(keys.left.isDown){
            player.body.setVelocityX(-this.speed);
        }
        else if(keys.right.isDown){
            player.body.setVelocityX(this.speed);
        }

        player.body.velocity.normalize().scale(this.speed);


    }
}
