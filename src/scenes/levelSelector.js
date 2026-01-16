import Button from "../objects/UI/button.js";

export default class LevelSelector extends Phaser.Scene {
    constructor() {
        super({ key: "levelSelector" });
    }


    create() {
        const level1Button = new Button(this,200,200,"LEVEL 1",{fontSize: '48px', fill: 'rgb(255, 255, 255)', fontFamily: 'Merriweather'},1,()=>{
            this.scene.run('levelAx');
        },true);

        const level2Button = new Button(this,200,200,"LEVEL 1",{fontSize: '48px', fill: 'rgb(255, 255, 255)', fontFamily: 'Merriweather'},1,()=>{
            this.scene.run('levelAx');
        },true);
        
        const level3Button = new Button(this,200,200,"LEVEL 1",{fontSize: '48px', fill: 'rgb(255, 255, 255)', fontFamily: 'Merriweather'},1,()=>{
            this.scene.run('levelAx');
        },true);
    }
}