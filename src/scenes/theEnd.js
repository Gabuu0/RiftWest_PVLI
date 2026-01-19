
export default class TheEnd extends Phaser.Scene {
    constructor(){
        super({key: 'theEnd'});
        this.level = 'levelGabi';
    }

    create(){
        const panelWidth = 600;
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
        const texto = this.add.text(60, -90, '¡ENHORABUENA!', {
            fontSize: '35px',
            fill: 'rgba(201, 0, 187, 1)',
            fontFamily: 'Merriweather'
        }).setOrigin(0.5);
        container.add(texto);

        const icon = this.add.image(-170, -90, "GameCharacters").setScale(0.8);
        container.add(icon);

        const description = this.add.text(0, -10, '!!Acabas de completar la demo de RIFT WEST.\nMuchas gracias por jugar.', {
            fontSize: '18px',
            fill: 'rgba(255, 255, 255, 1)',
            fontFamily: 'Merriweather'
        }).setOrigin(0.5);
        container.add(description);

        //Función para el sonido de seleccionar
        const sounds = () => {
            this.sound.play('select');
            const levelScene = this.scene.get(this.level);
            if (levelScene && levelScene.music && levelScene.music.isPlaying) {
                levelScene.music.stop(); 
            }
        };
        // Boton Inicio
        const menuButton = this.add.text(0, 40, 'Volver al menú principal', {
            fontSize: '24px',
            fill: 'rgba(201, 0, 187, 1)',
            fontFamily: 'Merriweather'
        }).setOrigin(0.5).setInteractive();
        container.add(menuButton);

        // Entrar con animacion (panel y fondo)
        this.tweens.add({ targets: container, scale: 1, alpha: 1, duration: 500, ease: 'Power2' });
        this.tweens.add({ targets: background, alpha: 0.5, duration: 500, ease: 'Power2' });

        // Interaccion con boton de continue y menu
        menuButton.on('pointerover',  () => menuButton.setStyle({ fill: 'rgba(210, 206, 93, 1)' }));

        menuButton.on('pointerout', () => menuButton.setStyle({ fill: 'rgba(201, 0, 187, 1)' }));

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

        // Interaccion con boton de inicio
        menuButton.on('pointerdown', () => {
            sounds();
            cerrarMenu(() => {
                this.scene.stop(this.level);
                this.scene.stop('InventarioPercival');
                this.scene.stop('InventarioDaphne');
                this.scene.stop();
                this.scene.start('menu');
            });
        });
    }
}
