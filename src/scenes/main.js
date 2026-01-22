import Button from "../objects/UI/button.js";

export default class Menu extends Phaser.Scene {
    constructor() {
        super({ key: "menu" });
    }
    preload(){
    }

    create() {
        //indica si se esta en la pantalla de los tutoriales o no
        this.tutorial = false;
        this.tutorialSelected = 0;
        //obtiene que niveles estan desbloqueados
        this.levelsUnlocked  = this.registry.get('levels');
        const altoPanel = 35;
        

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


        this.levelLockedIcon = this.add.image(0,0,'lockedIcon').setVisible(false).setDisplaySize(altoPanel,altoPanel).setOrigin(0.5,0.5);
        
        this.jugarButton = new Button(this,540,330,'PLAY DEMO',{ fontSize: '48px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt'},1,()=>{
            this.sound.play('select');
            this.changeActiveButtons(this.jugarButton,false);
            this.changeActiveButtons(this.secondScreenButtons,true);
        },true,true,'rgb(255, 255, 143)');

        this.returnButton = new Button(this,450,450,"RETURN",{fontSize: '36px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt'},1, ()=>{
            this.changeActiveButtons(this.secondScreenButtons,true);
            if(this.tutorial){
                this.changeActiveButtons(this.tutorials,false,true,this.tutorialBackground);
            }
            else{
                this.changeActiveButtons(this.levelsButtons,false,true,this.levelsBackground);
            }
            this.tutorial = false;
            this.changeActiveButtons(this.returnButton,false);
        },true,true,'rgb(255, 255, 143)');


        this.createTransitionScreenButtons();
        this.createLevelsButtons();
        this.createTutorialButtons();
        
        
        this.input.keyboard.on('keydown', (event)=>{
            if(this.tutorial){
                if(event.code === 'ArrowLeft'){
                    if(this.tutorialSelected ==0){
                        this.tutorialSelected = this.tutorialsButtons.length-1;
                    }
                    else{
                        this.tutorialSelected--;
                    }
                    this.showTutorial(this.tutorialsButtons[this.tutorialSelected].text);
                }
                else if(event.code === 'ArrowRight'){
                    if(this.tutorialSelected == this.tutorialsButtons.length -1){
                        this.tutorialSelected = 0;
                    }
                    else{
                        this.tutorialSelected++;
                    }
                    this.showTutorial(this.tutorialsButtons[this.tutorialSelected].text);
                }
            }
            
        })
        
        this.loadTutorials();
        this.changeActiveButtons(this.levelsButtons,false,false,this.levelsBackground);
        this.changeActiveButtons(this.tutorials,false,false,this.tutorialBackground);
        this.changeActiveButtons(this.secondScreenButtons,false);
        this.changeActiveButtons(this.returnButton,false);
    }

    /**
     *  crea los botones de la pantalla para seleccionar el tutorial o los niveles
     */
    createTransitionScreenButtons() {
        const menu = new Button(this, 540, 430, "MENU", { fontSize: '36px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt' }, 1, () => {
            this.changeActiveButtons(this.jugarButton,true);
            this.changeActiveButtons(this.secondScreenButtons,false);
        },true,true,'rgb(255, 255, 143)');
        
        const tutorialButton = new Button(this, 540, 250, 'TUTORIAL', { fontSize: '48px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt' }, 1, () => {
            this.tutorial = true;
            this.changeActiveButtons(this.secondScreenButtons,false);
            this.changeActiveButtons(this.tutorials,true,true,this.tutorialBackground);
            this.changeActiveButtons(this.returnButton,true);
        },true,true,'rgb(255, 255, 143)');
        
        const lvlsButton = new Button(this, 540, 340, 'LEVELS', { fontSize: '48px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt' }, 1, () => {
            this.changeActiveButtons(this.secondScreenButtons,false);
            this.changeActiveButtons(this.levelsButtons,true,true,this.levelsBackground);
            this.changeActiveButtons(this.returnButton,true);
        },true,true,'rgb(255, 255, 143)');

        this.secondScreenButtons = this.add.container(0, 0);
        this.secondScreenButtons.add([menu, tutorialButton, lvlsButton]);
    }

    /**
     * Crea los botones de los distintos niveles del juego y el de desbloquear todos
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
        const unlockLevels = new Button(this, 670, 450, 'UNLOCK ALL', { fontSize: '36px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt' }, 1, () => {
            this.sound.play('select');

            this.registry.set('levels', {
                level1: true,
                level2: true,
                level3: true,
            });
            this.levelsUnlocked = this.registry.get('levels');
        },true,true,'rgb(255, 255, 143)');

        

        this.levelsButtons = this.add.container(0, 0);
        this.levelsButtons.add([level1Button, level2Button, level3Button,unlockLevels]);
    }

    /**
     * crea los botones de los tutoriales
     */
    createTutorialButtons(){
        this.tutorialsButtons = [];
        this.tutorialsMap = new Map();
        this.tutorialsButtons.push(new Button(this, 135, 145, 'LEVER', { fontSize: '18px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt' }, 1, (buttonText) => {
            this.showTutorial(buttonText);
            this.tutorialSelected = this.tutorialsMap.get(buttonText).index;
        },true,true,'rgb(255, 255, 143)'));
        this.tutorialsMap.set('LEVER',
            {
                index:0,
                description:'Al ser accionadas abrirán de forma permanente una o varias puertas del nivel'
            });
        
        this.tutorialsButtons.push(new Button(this, 135, 175, 'PREASSURE PLATE', { fontSize: '18px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt' }, 1, (buttonText) => {
            this.showTutorial(buttonText);
            this.tutorialSelected = this.tutorialsMap.get(buttonText).index;
        },true,true,'rgb(255, 255, 143)'));
        this.tutorialsMap.set('PREASSURE PLATE',
            {
                index:1,
                description:'Mientras que un jugador o caja se mantenga encima de ella mantendrá abierta una o varias puertas del nivel'
            });
        
        this.tutorialsButtons.push(new Button(this, 135, 205, 'WATCHMAN', { fontSize: '18px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt' }, 1, (buttonText) => {
            this.showTutorial(buttonText);
            this.tutorialSelected = this.tutorialsMap.get(buttonText).index;
        },true,true,'rgb(255, 255, 143)'));
        this.tutorialsMap.set('WATCHMAN',
            {
                index:2,
                description:'Vigilantes que merodean por los niveles, si te divisan delante suya perderás el nivel'
            });
        
        this.tutorialsButtons.push(new Button(this, 135, 235, 'LIFTING PLATFORM', { fontSize: '18px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt' }, 1, (buttonText) => {
            this.showTutorial(buttonText);
            this.tutorialSelected = this.tutorialsMap.get(buttonText).index;
        },true,true,'rgb(255, 255, 143)'));
        this.tutorialsMap.set('LIFTING PLATFORM',
            {
                index:3,
                description:'Plataformas levadizas que son accionadas por placas de presion, pueden iniciar estando subidas o bajas. Su estado cambia al estar pulsando la placa correspondiente.Si la pisas estando bajada pierdes el nivel'
            });
        
        this.tutorialsButtons.push(new Button(this, 135, 265, 'CLOWN/INVENTORY', { fontSize: '18px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt' }, 1, (buttonText) => {
            this.showTutorial(buttonText);
            this.tutorialSelected = this.tutorialsMap.get(buttonText).index;
        },true,true,'rgb(255, 255, 143)'));
        this.tutorialsMap.set('CLOWN/INVENTORY',
            {
                index:4,
                description:''
            });
        
        this.tutorialsButtons.push(new Button(this, 135, 295, 'KNOCKABLE OBJECTS', { fontSize: '18px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt' }, 1, (buttonText) => {
            this.showTutorial(buttonText);
            this.tutorialSelected = this.tutorialsMap.get(buttonText).index;

        },true,true,'rgb(255, 255, 143)'));
        this.tutorialsMap.set('KNOCKABLE OBJECTS',
            {
                index:5,
                description:''
            });
        
        this.tutorialsButtons.push(new Button(this, 135, 325, 'DAPHNE ABILITY', { fontSize: '18px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt' }, 1, (buttonText) => {
            this.showTutorial(buttonText);
            this.tutorialSelected = this.tutorialsMap.get(buttonText).index;
        },true,true,'rgb(255, 255, 143)'));
        this.tutorialsMap.set('DAPHNE ABILITY',
            {
                index:6,
                description:''
            });
        
        this.tutorialsButtons.push(new Button(this, 135, 355, 'PERCIVAL ABILITY', { fontSize: '18px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt' }, 1, (buttonText) => {
            this.showTutorial(buttonText);
            this.tutorialSelected = this.tutorialsMap.get(buttonText).index;
        },true,true,'rgb(255, 255, 143)'));
        this.tutorialsMap.set('PERCIVAL ABILITY',
            {
                index:7,
                description:''
            });

        this.tutorials = this.add.container(0, 0);
        this.tutorials.add(this.tutorialsButtons);
    }

    changeActiveButtons(buttons,activate,changeBackground = false, background= null){
        buttons.setActive(activate).setVisible(activate);
        if(changeBackground){
            background.setVisible(activate);
        }

        if(this.tutorial){
            this.video.setVisible(true);
            this.tutorialText.setVisible(true);
        }
        else{
            this.video.setVisible(false);
            this.tutorialText.setVisible(false);
        }
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

    //Carga todos los nombres de los videos de todos los tutoriales y los guarda en un array, 
    // ademas establece el primer tutorial que se muestra (tanto el video como el texto)
    loadTutorials(){
        this.tutorialsVideos = ['LEVER_Tutorial',
            'PREASSURE PLATE_Tutorial',
            'WATCHMAN_Tutorial',
            'LIFTING PLATFORM_Tutorial',
            'CLOWN/INVENTORY_Tutorial',
            'KNOCKABLE OBJECTS_Tutorial',
            'DAPHNE ABILITY_Tutorial',
            'PERCIVAL ABILITY_Tutorial'
        ];
        this.video = this.add.video(200,200,this.tutorialsVideos[this.tutorialSelected]);
        this.video.setLoop(true).setMute(true).setVisible(false);

        this.tutorialText = this.add.text(935,145,
            this.tutorialsButtons[this.tutorialSelected].text +'\n \n'+ this.tutorialsMap.get(this.tutorialsButtons[this.tutorialSelected].text).description,
            { fontSize: '18px', fill: 'rgb(255, 255, 255)', fontFamily: 'upheavtt' ,align:'justify', wordWrap:{width:200, useAdvancedWrap:true}}).setOrigin(0.5,0).setVisible(false);
    }

    /**
     * Cambia el video y el texto del tutorial a mostrar
     * @param {string} tutorial tutorial a mostrar
     */
    showTutorial(tutorial){
        this.tutorialText.setText(tutorial +'\n \n'+this.tutorialsMap.get(tutorial).description);
        this.video.stop();
        this.video.load(this.tutorialsVideos[this.tutorialSelected]);
        this.video.play();
    }
}
