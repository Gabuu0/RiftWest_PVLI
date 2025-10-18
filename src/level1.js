import Players from "./players.js";
export default class Level1 extends Phaser.Scene{
    constructor(){
        super({key: "level1"});
    }
    init(){
        
    }

    create(){
        this.createAnims();

		this.add.text(240, 100, "Percival");
		this.add.text(780, 100, "Daphne");

        let percival = new Players(this,280,300,"Percival",0,"percival");
        let daphne = new Players(this,800,300,"Daphne",0,"daphne");
    }

    preload(){
		this.load.spritesheet("D",
             "sprites/images/daphne/DaphneIdle(x5).png",
              { frameWidth: 160, frameHeight: 160});

        this.load.spritesheet("P",
             "sprites/images/percival/PercivalIdle(x5).png",
              { frameWidth: 160, frameHeight: 160});

    }

    createAnims(){
       
        this.anims.create(
            {key: "DaphneIdle",
            frames: this.anims.generateFrameNumbers("D", {frames:[0,1,2,3]}),
            frameRate: 5,
            repeat: -1,}
        );

         this.anims.create(
            {key: "PercivalIdle",
            frames: this.anims.generateFrameNumbers("P", {frames:[0,1,2,3]}),
            frameRate: 5,
            repeat: -1,}
        );
    }

    
}