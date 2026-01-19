export default class Menu extends Phaser.Scene {
    constructor() {
        super({ key: "menu" });
    }
    preload(){
    }

    create() {
        const LogoJuego = this.add.image(140,50,'GameLogo').setScale(0.5).setOrigin(0,0);
        const jugarButton = this.add.text(450, 330, 'JUGAR', { fontSize: '48px', fill: 'rgb(255, 255, 255)', fontFamily: 'Merriweather'})
        .setInteractive().setOrigin(0,0);

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
