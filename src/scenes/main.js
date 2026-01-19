export default class Menu extends Phaser.Scene {
    constructor() {
        super({ key: "menu" });
    }
    preload(){
    }

    create() {
        const background = this.add.image(0,0,'menuBackground').setOrigin(0,0);
        const jugarButton = this.add.text(540, 330, 'PLAY DEMO', { fontSize: '48px', fill: 'rgb(255, 255, 255)', fontFamily: 'Merriweather'})
        .setInteractive().setOrigin(0.5,0.5);

        jugarButton.on('pointerover', () => { 
            jugarButton.setStyle({ fill: 'rgb(255, 255, 143)' });
        });

        jugarButton.on('pointerout', () => {
            jugarButton.setStyle({ fill: 'rgb(255, 255, 255)' });
        });

         jugarButton.on('pointerdown', () => {
             this.sound.play('select');
            this.scene.run('levelSelector');
            this.scene.sleep('menu');
         });
    }
}
