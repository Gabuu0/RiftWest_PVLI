import Button from "../objects/UI/button.js";

export default class LevelSelector extends Phaser.Scene {
    constructor() {
        super({ key: "levelSelector" });
    }


    create() {
        const level1Button = new Button(this,100,200,"LEVEL 1",{fontSize: '48px', fill: 'rgb(255, 0, 0)', fontFamily: 'Merriweather'},1,()=>{
            this.scene.run('levelJavi');
        },true);

        const level2Button = new Button(this,400,200,"LEVEL 2",{fontSize: '48px', fill: 'rgb(255, 0, 0)', fontFamily: 'Merriweather'},1,()=>{
            this.scene.run('levelAx');
        },true);
        
        const level3Button = new Button(this,700,200,"LEVEL 3",{fontSize: '48px', fill: 'rgb(250, 0, 0)', fontFamily: 'Merriweather'},1,()=>{
            this.scene.run('levelGabi');
        },true);
    }
}