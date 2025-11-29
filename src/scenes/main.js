export default class Menu extends Phaser.Scene {
    constructor() {
        super({ key: "menu" });
    }

    init() {

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
             console.log('JUGAR pulsado');
              this.scene.start('levelPruebas');
         });
    }
}
