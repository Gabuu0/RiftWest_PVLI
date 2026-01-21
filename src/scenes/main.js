import Button from "../objects/UI/button.js";

export default class Menu extends Phaser.Scene {
    constructor() {
        super({ key: "menu" });
    }
    preload(){
    }

    create() {
        const background = this.add.image(0,0,'menuBackground').setOrigin(0,0);
        this.tutorialBackground = this.add.image(0,0,'tutorialBackground').setOrigin(0,0).setVisible(false);
        this.levelsBackground = this.add.image(0,0,'levelsBackground').setOrigin(0,0).setVisible(false);
        this.fullscreenButton = this.add.image(1050, 510, 'iconFullScreen').setScrollFactor(0).setInteractive();

        this.fullscreenButton.on('pointerup', () => {
        if (!this.scale.isFullscreen) {
            this.scale.startFullscreen();
            this.fullscreenButton.setTexture('iconNotFullScreen');
        } else {
            this.scale.stopFullscreen();
            this.fullscreenButton.setTexture('iconFullScreen');
        }
        });

        this.levelsUnlocked  = this.registry.get('levels');
        const altoPanel = 35;
        this.levelLockedIcon = this.add.image(0,0,'lockedIcon').setVisible(false).setDisplaySize(altoPanel,altoPanel).setOrigin(0.5,0.5);
        
        this.jugarButton = new Button(this,540,330,'PLAY DEMO',{ fontSize: '48px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt'},1,()=>{
            this.sound.play('select');
            this.jugarButton.setVisible(false).setActive(false);
            this.setSecondScreenButtonsVisibility(true);
        },true,true,'rgb(255, 255, 143)')


        const { lvlsButton, tutorialButton, menu } = this.createTransitionScreenButtons();
        const { level1Button, level2Button, level3Button ,returnButton, unlockLevels} = this.createLevelsButtons();
        const { levers, preassurePlates, watchMans ,liftingPlatforms, clownInventory, knockableObjects, daphneAbility, percivalAbility, returnButtons} = this.createTutorialButtons();
        
        this.setLevelsButtonsVisibility(false);
        this.setTutorialButtonsVisibility(false);
        this.setSecondScreenButtonsVisibility(false);
    }

    /**
     *  crea los botones de la pantalla para seleccionar el tutorial o los niveles
     * @returns 
     */
    createTransitionScreenButtons() {
        const menu = new Button(this, 540, 450, "MENU", { fontSize: '25px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt' }, 1, () => {
            this.setSecondScreenButtonsVisibility( false);
            this.jugarButton.setActive(true).setVisible(true);
        },true,true,'rgb(255, 255, 143)');

        const tutorialButton = new Button(this, 540, 250, 'TUTORIAL', { fontSize: '48px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt' }, 1, () => {
            this.setSecondScreenButtonsVisibility(false);
            this.setTutorialButtonsVisibility(true);
        },true,true,'rgb(255, 255, 143)');

        const lvlsButton = new Button(this, 540, 340, 'LEVELS', { fontSize: '48px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt' }, 1, () => {
            this.setSecondScreenButtonsVisibility(false);
            this.setLevelsButtonsVisibility(true);
        },true,true,'rgb(255, 255, 143)');

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
        const level1Button = new Button(this, 540, 225, "LEVEL 1", { fontSize: '48px', fill: 'rgb(197, 83, 188)', fontFamily: 'upheavtt' }, 1, () => {
            if (this.levelsUnlocked.level1) {
                //se inicia el siguiente nivel, se le pasan todos los dialogos de payaso(SIEMPRE PASAR LOS DIALOGOS)
                this.scene.start('levelGabi');
                this.scene.sleep('levelSelector');
            }
            else {
                this.showLevelLocked('level1');
            }
        },true,true,'rgb(255, 108, 243)');

        const level2Button = new Button(this, 540, 300, "LEVEL 2", { fontSize: '48px', fill: 'rgb(66, 108, 177)', fontFamily: 'upheavtt' }, 1, () => {
            this.sound.play('select');
            if (this.levelsUnlocked.level2) {
                //se inicia el siguiente nivel, se le pasan todos los dialogos de payaso(SIEMPRE PASAR LOS DIALOGOS)
                this.scene.start('levelAx');
                this.scene.sleep('levelSelector');
            }
            else {
                this.showLevelLocked('level2');
            }
        },true,true,'rgb(95, 156, 255)');

        const level3Button = new Button(this, 540, 375, "LEVEL 3", { fontSize: '48px', fill: 'rgb(175, 173, 54)', fontFamily: 'upheavtt' }, 1, () => {
            this.sound.play('select');
            if (this.levelsUnlocked.level3) {
                this.scene.start('levelJavi');
                this.scene.sleep('levelSelector');
            }
            else {
                this.showLevelLocked();
            }
        },true,true,'rgb(255, 252, 79)');


        //cheat para desbloquear todos los niveles
        const unlockLevels = new Button(this, 610, 450, 'UNLOCK ALL', { fontSize: '24px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt' }, 1, () => {
            this.sound.play('select');

            this.registry.set('levels', {
                level1: true,
                level2: true,
                level3: true,
            });
            this.levelsUnlocked = this.registry.get('levels');
        },true,true,'rgb(255, 255, 143)');

        const returnButton = new Button(this,450,450,"RETURN",{fontSize: '25px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt'},1, ()=>{
            this.setSecondScreenButtonsVisibility(true);
            this.setLevelsButtonsVisibility(false);
        },true,true,'rgb(255, 255, 143)');

        this.levelsButtons = this.add.container(0, 0);
        this.levelsButtons.add([level1Button, level2Button, level3Button,unlockLevels,returnButton]);
        return { level1Button, level2Button, level3Button , unlockLevels,returnButton};
    }
    createTutorialButtons(){
        const levers = new Button(this, 135, 165, 'LEVER', { fontSize: '15px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt' }, 1, () => {
            this.ShowTutorial(levers);
        },true,true,'rgb(255, 255, 143)');
        const preassurePlates = new Button(this, 135, 195, 'PREASSURE PLATE', { fontSize: '15px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt' }, 1, () => {
            this.ShowTutorial(preassurePlates);
        },true,true,'rgb(255, 255, 143)');
        const watchMans = new Button(this, 135, 225, 'WATCHMAN', { fontSize: '15px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt' }, 1, () => {
            this.ShowTutorial(watchMans);
        },true,true,'rgb(255, 255, 143)');
        const liftingPlatforms = new Button(this, 135, 255, 'LIFTING PLATFORM', { fontSize: '15px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt' }, 1, () => {
            this.ShowTutorial(liftingPlatforms);
        },true,true,'rgb(255, 255, 143)');
        const clownInventory = new Button(this, 135, 285, 'CLOWN / INVENTORY', { fontSize: '15px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt' }, 1, () => {
            this.ShowTutorial(clownInventory);
        },true,true,'rgb(255, 255, 143)');
        const knockableObjects = new Button(this, 135, 315, 'KNOCKABLE OBJECTS', { fontSize: '15px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt' }, 1, () => {
            this.ShowTutorial(knockableObjects);
        },true,true,'rgb(255, 255, 143)');
        const daphneAbility = new Button(this, 135, 345, 'DAPHNE ABILITY', { fontSize: '15px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt' }, 1, () => {
            this.ShowTutorial(daphneAbility);
        },true,true,'rgb(255, 255, 143)');
        const percivalAbility = new Button(this, 135, 375, 'PERCIVAL ABILITY', { fontSize: '15px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt' }, 1, () => {
            this.ShowTutorial(percivalAbility);
        },true,true,'rgb(255, 255, 143)');
        const returnButton = new Button(this, 540, 450, 'RETURN', { fontSize: '25px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt' }, 1, () => {
            this.jugarButton.setActive(true).setVisible(true);
            this.setTutorialButtonsVisibility(false);

        },true,true,'rgb(255, 255, 143)');

        this.tutorialButtons = this.add.container(0, 0);
        this.tutorialButtons.add([levers, preassurePlates,liftingPlatforms, watchMans, clownInventory, knockableObjects, daphneAbility, percivalAbility,returnButton]);
        return { levers, preassurePlates, watchMans, liftingPlatforms, clownInventory, knockableObjects, daphneAbility, percivalAbility, returnButton};
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
        this.levelsBackground.setVisible(visible);
    }
    /**
     * 
     * @param {*} visible si los botones se van a mostrar u ocultar
     */
    setTutorialButtonsVisibility(visible) {
        this.tutorialButtons.setActive(visible).setVisible(visible);
        this.tutorialBackground.setVisible(visible);
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
