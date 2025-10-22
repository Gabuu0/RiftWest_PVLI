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
        panel.fillRoundedRect(0, 0, panelWidth, panelHeight, radius);

        // Contenedor del panel y sus hijos
        const container = this.add.container(240, 100, [panel]);
        container.setScale(0);
        container.setAlpha(0);
        // Título
        const texto = this.add.text(panelWidth / 2, 60, 'PAUSA', {
            fontSize: '32px',
            fill: 'rgb(255,0,0)',
            fontFamily: 'Merriweather'
        }).setOrigin(0.5);
        container.add(texto);

        // Botón Reanudar
        const continueButton = this.add.text(panelWidth / 2, 150, 'Reanudar', {
            fontSize: '24px',
            fill: 'rgb(255, 255, 255)',
            fontFamily: 'Merriweather'
        }).setOrigin(0.5).setInteractive();
        container.add(continueButton);

        // Botón Inicio
        const menuButton = this.add.text(panelWidth / 2, 200, 'Inicio', {
            fontSize: '24px',
            fill: 'rgb(255, 255, 255)',
            fontFamily: 'Merriweather'
        }).setOrigin(0.5).setInteractive();
        container.add(menuButton);

        // Entrar con animación (panel y fondo)
        this.tweens.add({ targets: container, scale: 1, alpha: 1, duration: 500, ease: 'Power2' });
        this.tweens.add({ targets: background, alpha: 0.5, duration: 500, ease: 'Power2' });

        // Hover para botones
        [continueButton, menuButton].forEach(btn => {
            btn.on('pointerover', () => btn.setStyle({ fill: 'rgb(255, 255, 143)' }));
            btn.on('pointerout',  () => btn.setStyle({ fill: 'rgb(255, 255, 255)' }));
        });

        // Función reutilizable para cerrar el menú con animación
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

        // Botón Reanudar
        continueButton.on('pointerdown', () => {
            cerrarMenu(() => {
                this.scene.stop();
                this.scene.resume('level1');
            });
        });

        // Botón Inicio
        menuButton.on('pointerdown', () => {
            cerrarMenu(() => {
                this.scene.stop('level1');
                this.scene.stop();
                this.scene.start('menu');
            });
        });

        // Tecla ESC también cierra el menú
        this.input.keyboard.on('keydown-ESC', () => {
            cerrarMenu(() => {
                this.scene.stop();
                this.scene.resume('level1');
            });
        });
    }
}
