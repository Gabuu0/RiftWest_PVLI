import Button from "../objects/UI/button.js";

export default class Menu extends Phaser.Scene {
    constructor() {
        super({ key: "menu" });
    }
    preload(){
    }

    create() {
        const background = this.add.image(0,0,'menuBackground').setOrigin(0,0);
        this.levelsUnlocked  = this.registry.get('levels');
        const altoPanel = 35;
        this.levelLockedIcon = this.add.image(0,0,'lockedIcon').setVisible(false).setDisplaySize(altoPanel,altoPanel).setOrigin(0.5,0.5);
        
        this.jugarButton = new Button(this,540,330,'PLAY DEMO',{ fontSize: '48px', fill: 'rgb(255, 255, 255)', fontFamily: 'Merriweather'},1,()=>{
            this.sound.play('select');
            this.jugarButton.setVisible(false).setActive(false);
            this.setSecondScreenButtonsVisibility(true);
        },true,true,'rgb(255, 255, 143)')


        const { lvlsButton, tutorialButton, menu } = this.createTransitionScreenButtons();
        const { level1Button, level2Button, level3Button ,returnButton, unlockLevels} = this.createLevelsButtons();
        
        this.setLevelsButtonsVisibility(false);
        this.setSecondScreenButtonsVisibility(false);
    }

    /**
     *  crea los botones de la pantalla para seleccionar el tutorial o los niveles
     * @returns 
     */
    createTransitionScreenButtons() {
        const menu = new Button(this, 540, 450, "MENU", { fontSize: '25px', fill: 'rgb(255, 255, 255)', fontFamily: 'Merriweather' }, 1, () => {
            this.setSecondScreenButtonsVisibility( false);
            this.jugarButton.setActive(true).setVisible(true);
        });

        const tutorialButton = new Button(this, 540, 250, 'TUTORIAL', { fontSize: '48px', fill: 'rgb(255, 255, 255)', fontFamily: 'Merriweather' }, 1, () => {
            this.sound.play('select');
            this.scene.start('levelGabi');
            this.scene.sleep('levelSelector');
        });

        const lvlsButton = new Button(this, 540, 340, 'LEVELS', { fontSize: '48px', fill: 'rgb(255, 255, 255)', fontFamily: 'Merriweather' }, 1, () => {
            this.setSecondScreenButtonsVisibility(false);
            this.setLevelsButtonsVisibility(true);
        });
        this.secondScreenButtons = this.add.container(0, 0);
        this.secondScreenButtons.add([menu, tutorialButton, lvlsButton]);
        return { lvlsButton, tutorialButton, menu };
    }
    /**
     * Crea los botones de los distintos niveles del juego y el de desbloquear todos
     * @param {*} levels los niveles a crear
     * @returns 
     */
    createLevelsButtons() {
        const level1Button = new Button(this, 540, 225, "LEVEL 1", { fontSize: '48px', fill: 'rgb(255, 108, 243)', fontFamily: 'Merriweather' }, 1, () => {
            if (this.levelsUnlocked.level1) {
                //se inicia el siguiente nivel, se le pasan todos los dialogos de payaso(SIEMPRE PASAR LOS DIALOGOS)
                this.scene.start('levelJavi');
                this.scene.sleep('levelSelector');
            }
            else {
                this.showLevelLocked('level1');
            }
        });

        const level2Button = new Button(this, 540, 300, "LEVEL 2", { fontSize: '48px', fill: 'rgb(95, 156, 255)', fontFamily: 'Merriweather' }, 1, () => {
            this.sound.play('select');
            if (this.levelsUnlocked.level2) {
                //se inicia el siguiente nivel, se le pasan todos los dialogos de payaso(SIEMPRE PASAR LOS DIALOGOS)
                this.scene.start('levelAx');
                this.scene.sleep('levelSelector');
            }
            else {
                this.showLevelLocked('level2');
            }
        });

        const level3Button = new Button(this, 540, 375, "LEVEL 3", { fontSize: '48px', fill: 'rgb(255, 252, 79)', fontFamily: 'Merriweather' }, 1, () => {
            this.sound.play('select');
            if (this.levelsUnlocked.level3) {
                this.scene.start('levelGabi');
                this.scene.sleep('levelSelector');
            }
            else {
                this.showLevelLocked();
            }
        });


        //cheat para desbloquear todos los niveles
        const unlockLevels = new Button(this, 800, 450, 'UNLOCK \n ALL', { fontSize: '24px', fill: 'rgb(255, 252, 79)', fontFamily: 'Merriweather' }, 1, () => {
            this.sound.play('select');

            this.registry.set('levels', {
                level1: true,
                level2: true,
                level3: true,
            });
            this.levelsUnlocked = this.registry.get('levels');
        });

        const returnButton = new Button(this,540,450,"RETURN",{fontSize: '25px', fill: 'rgb(255, 255, 255)', fontFamily: 'Merriweather'},1, ()=>{
            this.setSecondScreenButtonsVisibility(true);
            this.setLevelsButtonsVisibility(false);
        });

        this.levelsButtons = this.add.container(0, 0);
        this.levelsButtons.add([level1Button, level2Button, level3Button,unlockLevels,returnButton]);
        return { level1Button, level2Button, level3Button , unlockLevels,returnButton};
    }
    
    /**
     * 
     * @param {*} visible si los botones se van a mostrar u ocultar
     */
    setSecondScreenButtonsVisibility(visible) {
        this.secondScreenButtons.setActive(visible).setVisible(visible);
    }

    /**
     * 
     * @param {*} visible si los botones se van a mostrar u ocultar
     */
    setLevelsButtonsVisibility(visible) {
        this.levelsButtons.setActive(visible).setVisible(visible);
    }


    /**
     * muestra el mensaje de que un nivel esta bloqueado actualmente
     */
    showLevelLocked(level = ''){
        let offsetIcon = 130;
        this.iconPosition = (level == 'level1') ? {x:540,y:225}: (level == 'level2')? {x:540,y: 300}: {x:540,y:375};
        this.levelLockedIcon.setPosition(this.iconPosition.x+offsetIcon,this.iconPosition.y);

        if (this.fadeTween) this.fadeTween.stop();

        //se muestran y colocan el texto y su panel
        this.levelLockedIcon.setAlpha(1).setVisible(true);

        this.fadeTween = this.tweens.add({
        targets: [this.levelLockedIcon],
        alpha: 0,
        duration: 500, // Duración del desvanecimiento
        delay: 2000,   // Tiempo que se queda visible antes de empezar a desaparecer
        });
    }
}
