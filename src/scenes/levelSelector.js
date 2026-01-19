import Button from "../objects/UI/button.js";

export default class LevelSelector extends Phaser.Scene {
    constructor() {
        super({ key: "levelSelector" });
    }


    create() {
        const levels  = this.registry.get('levels');
        const altoPanel = 48;
        this.levelBlockedText = this.add.text(0,0,'BLOQUEADO',{fontSize:'20px',fill:'rgb(255, 255, 255)', fontFamily:'Merriweather'}).setVisible(false).setDepth(1);
        this.levelBlockedPanel = this.add.image(0,0,'textPanel').setVisible(false).setDisplaySize(altoPanel*3,altoPanel).setOrigin(0,0.25);

        const level1Button = new Button(this,100,200,"LEVEL 1",{fontSize: '48px', fill: 'rgb(255, 0, 0)', fontFamily: 'Merriweather'},1,()=>{
            if(levels.level1){
                this.scene.run('levelJavi');
                this.scene.sleep('levelSelector');
            }
        },true);
        
        const level2Button = new Button(this,400,200,"LEVEL 2",{fontSize: '48px', fill: 'rgb(255, 0, 0)', fontFamily: 'Merriweather'},1,()=>{
            if(levels.level2){
                this.scene.run('levelAx');
                this.scene.sleep('levelSelector');
            }
            else{
                this.showLevelBlockedText('level2');
            }
        },true);
        
        const level3Button = new Button(this,700,200,"LEVEL 3",{fontSize: '48px', fill: 'rgb(250, 0, 0)', fontFamily: 'Merriweather'},1,()=>{
            if(levels.level3){
                this.scene.run('levelGabi');
                this.scene.sleep('levelSelector');
            }
            else{
                this.showLevelBlockedText('level3');
            }
        },true);
    }
    /**
     * muestra el mensaje de que un nivel esta bloqueado actualmente
     */
    showLevelBlockedText(level){
        let offset = 10;
        this.messagePosition = (level == 'level2') ? {x:420,y:100}: (level == 'level3')? {x:720,y: 100}: {x:100,y:100};
        this.levelBlockedText.setPosition(this.messagePosition.x+offset,this.messagePosition.y);
        this.levelBlockedPanel.setPosition(this.messagePosition.x,this.messagePosition.y);

        if (this.fadeTween) this.fadeTween.stop();

        //se muestran y colocan el texto y su panel
        this.levelBlockedText.setAlpha(1).setVisible(true);
        this.levelBlockedPanel.setAlpha(1).setVisible(true);

        this.fadeTween = this.tweens.add({
        targets: [this.levelBlockedText, this.levelBlockedPanel],
        alpha: 0,
        duration: 500, // Duración del desvanecimiento
        delay: 2000,   // Tiempo que se queda visible antes de empezar a desaparecer
        onComplete: () => {
            this.hideLevelBlockedText();
        }
        });
    }

    /**
     * oculta el mensaje de que un nivel esta bloqueado actualmente
     */
    hideLevelBlockedText(){
        this.levelBlockedText.setVisible(false);
        this.levelBlockedPanel.setVisible(false);
    }
}