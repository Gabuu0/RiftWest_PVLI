export default class Menu extends Phaser.Scene {
    constructor() {
        super({ key: "menu" });
    }
    preload(){
    }

    init(data) {
        this.clownGetItemJokes = data.clownGetItemJokes;
        this.clownGiveItemJokes = data.clownGiveItemJokes;
        this.clownNoObjectGiven = data.clownNoObjectGiven;
        this.clownNoObjectTaken = data.clownNoObjectTaken;
        this.clownLast = data.clownLast;
    }

    create() {
        const jugarButton = this.add.text(470, 230, 'JUGAR', { fontSize: '48px', fill: 'rgb(255, 255, 255)', fontFamily: 'Merriweather'})
        .setInteractive();

        jugarButton.on('pointerover', () => {
            jugarButton.setStyle({ fill: 'rgb(255, 255, 143)' });
        });

        jugarButton.on('pointerout', () => {
            jugarButton.setStyle({ fill: 'rgb(255, 255, 255)' });
        });

         jugarButton.on('pointerdown', () => {
             this.sound.play('select');
            this.scene.run('levelGabi',{clownGetItemJokes:this.clownGetItemJokes,
            clownGiveItemJokes:this.clownGiveItemJokes,
            clownNoObjectGiven: this.clownNoObjectGiven,
            clownNoObjectTaken: this.clownNoObjectTaken,
            clownLast:this.clownLast
            });
            this.scene.sleep('menu');
         });
    }
}
