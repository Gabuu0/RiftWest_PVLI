import Level1 from "./level1.js";
import Menu from "./main.js";

export default class PauseMenu extends Phaser.Scene {
    constructor(){
        super({key: 'pauseMenu'});
    }

    create(){
        const panelWidth = 400;
        const panelHeight = 300;
        const radius = 20;

        // Fondo translúcido (negro, opaco al inicio)
        const background = this.add.graphics();
        background.fillStyle(0x000000, 1);
        background.fillRect(0, 0, 1080, 540);
        background.alpha = 0; // inicial transparente

        // Panel con esquinas redondeadas
        const panel = this.add.graphics();
        panel.fillStyle(0xffffff, 0.2);
        panel.fillRoundedRect(-panelWidth/2,-panelHeight/2, panelWidth, panelHeight, radius);

        // Contenedor del panel y sus hijos
        const container = this.add.container(540, 270, [panel]);
        container.setScale(0);
        container.setAlpha(0);
        // Título
        const texto = this.add.text(0, -90, 'PAUSA', {
            fontSize: '32px',
            fill: 'rgb(255,0,0)',
            fontFamily: 'Merriweather'
        }).setOrigin(0.5);
        container.add(texto);

        // Botón Reanudar
        const continueButton = this.add.text(0, -20, 'Reanudar', {
            fontSize: '24px',
            fill: 'rgb(255, 255, 255)',
            fontFamily: 'Merriweather'
        }).setOrigin(0.5).setInteractive();
        container.add(continueButton);

        // Botoon Inicio
        const menuButton = this.add.text(0, 40, 'Inicio', {
            fontSize: '24px',
            fill: 'rgb(255, 255, 255)',
            fontFamily: 'Merriweather'
        }).setOrigin(0.5).setInteractive();
        container.add(menuButton);

        // Entrar con animacion (panel y fondo)
        this.tweens.add({ targets: container, scale: 1, alpha: 1, duration: 500, ease: 'Power2' });
        this.tweens.add({ targets: background, alpha: 0.5, duration: 500, ease: 'Power2' });

        // Interaccion con boton de continue y menu
        continueButton.on('pointerover', () => continueButton.setStyle({ fill: 'rgb(255, 255, 143)' }));
        menuButton.on('pointerover', () => menuButton.setStyle({ fill: 'rgb(255, 255, 143)' }));

        continueButton.on('pointerout',  () => continueButton.setStyle({ fill: 'rgb(255, 255, 255)' }));
        menuButton.on('pointerout',  () => menuButton.setStyle({ fill: 'rgb(255, 255, 255)' }));


        const cerrarMenu = (callback) => {
            this.tweens.add({
                targets: container,
                scale: 0,
                alpha: 0,
                duration: 300,
                ease: 'Back.In'
            });
            this.tweens.add({
                targets: background,
                alpha: 0,
                duration: 300,
                ease: 'Power2',
                onComplete: callback
            });
        };

        // Interaccion con boton de reanudar
        continueButton.on('pointerdown', () => {
            cerrarMenu(() => {
                this.scene.stop();
                this.scene.resume('level1');
                this.scene.resume('InventarioPercival');
                this.scene.resume('InventarioDaphne');
            });
        });

        // Interaccion con boton de inicio
        menuButton.on('pointerdown', () => {
            cerrarMenu(() => {
                this.scene.stop('level1');
                this.scene.stop();
                this.scene.start('menu');
            });
        });

        // Tecla ESC para cerrar menu
        this.input.keyboard.on('keydown-ESC', () => {
            cerrarMenu(() => {
                this.scene.stop();
                this.scene.resume('level1');
            });
        });
    }
}
