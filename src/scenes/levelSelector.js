import Button from "../objects/UI/button.js";

export default class LevelSelector extends Phaser.Scene {
    constructor() {
        super({ key: "levelSelector" });
    }


    create() {
        const background = this.add.image(0,0,'menuBackground').setOrigin(0,0);
        const levels  = this.registry.get('levels');
        const altoPanel = 35;
        this.levelLockedIcon = this.add.image(0,0,'lockedIcon').setVisible(false).setDisplaySize(altoPanel,altoPanel).setOrigin(0.5,0.5);

        const level1Button = new Button(this,540,225,"LEVEL 1",{fontSize: '48px', fill: 'rgb(255, 108, 243)', fontFamily: 'Merriweather'},1,()=>{
            if(levels.level1){
                //se inicia el siguiente nivel, se le pasan todos los dialogos de payaso(SIEMPRE PASAR LOS DIALOGOS)
                this.scene.start('levelJavi',{
                    clownGetItemJokes: this.clownGetItemJokes,
                    clownGiveItemJokes: this.clownGiveItemJokes,
                    clownNoObjectGiven: this.clownNoObjectGiven,
                    clownNoObjectTaken: this.clownNoObjectTaken,
                    clownLast: this.clownLast,
                });
                this.scene.sleep('levelSelector');
            }
        },true).setOrigin(0.5,0.5);
        
        const level2Button = new Button(this,540,300,"LEVEL 2",{fontSize: '48px', fill: 'rgb(95, 156, 255)', fontFamily: 'Merriweather'},1,()=>{
            if(levels.level2){
                //se inicia el siguiente nivel, se le pasan todos los dialogos de payaso(SIEMPRE PASAR LOS DIALOGOS)
                this.scene.start('levelAx',{
                    clownGetItemJokes: this.clownGetItemJokes,
                    clownGiveItemJokes: this.clownGiveItemJokes,
                    clownNoObjectGiven: this.clownNoObjectGiven,
                    clownNoObjectTaken: this.clownNoObjectTaken,
                    clownLast: this.clownLast,
                });
                this.scene.sleep('levelSelector');
            }
            else{
                this.showLevelLocked('level2');
            }
        },true).setOrigin(0.5,0.5);
        
        const level3Button = new Button(this,540,375,"LEVEL 3",{fontSize: '48px', fill: 'rgb(255, 252, 79)', fontFamily: 'Merriweather'},1,()=>{
            if(levels.level3){
                //se inicia el siguiente nivel, se le pasan todos los dialogos de payaso(SIEMPRE PASAR LOS DIALOGOS)
                this.scene.start('levelGabi',{
                    clownGetItemJokes: this.clownGetItemJokes,
                    clownGiveItemJokes: this.clownGiveItemJokes,
                    clownNoObjectGiven: this.clownNoObjectGiven,
                    clownNoObjectTaken: this.clownNoObjectTaken,
                    clownLast: this.clownLast,
                });
                this.scene.sleep('levelSelector');
            }
            else{
                this.showLevelLocked('level3');
            }
        },true).setOrigin(0.5,0.5);
        
        const menu = new Button(this,540,450,"BACK MENU",{fontSize: '25px', fill: 'rgb(255, 255, 255)', fontFamily: 'Merriweather'},1, ()=>{
        this.scene.start('menu')
        }).setOrigin(0.5,0.5);
    }
    /**
     * muestra el mensaje de que un nivel esta bloqueado actualmente
     */
    showLevelLocked(level){
        let offsetIcon = 130;
        this.iconPosition = (level == 'level2') ? {x:540,y:300}: (level == 'level3')? {x:540,y: 375}: {x:540,y:225};
        this.levelLockedIcon.setPosition(this.iconPosition.x+offsetIcon,this.iconPosition.y);

        if (this.fadeTween) this.fadeTween.stop();

        //se muestran y colocan el texto y su panel
        this.levelLockedIcon.setAlpha(1).setVisible(true);

        this.fadeTween = this.tweens.add({
        targets: [this.levelLockedIcon],
        alpha: 0,
        duration: 500, // Duración del desvanecimiento
        delay: 2000,   // Tiempo que se queda visible antes de empezar a desaparecer
        onComplete: () => {
            this.hideLevelLocked();
        }
        });
    }

    /**
     * oculta el mensaje de que un nivel esta bloqueado actualmente
     */
    hideLevelLocked(){
        this.levelLockedText.setVisible(false);
        this.levelLockedIcon.setVisible(false);
    }
}