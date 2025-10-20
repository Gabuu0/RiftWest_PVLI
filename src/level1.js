import Players from "./players.js";
import movement from "./movement.js";   

export default class Level1 extends Phaser.Scene{
    constructor(){
        super({key: "level1"});
    }
    init(){
        
    }

    create(){
        this.createAnims();
        //Informacion del mapa
        const mapData = [
            [0, 1, 2, 3, 4, 5],
            [10, 11, 12, 13, 14, 15],
            [20, 21, 22, 23, 24, 25],
            [30, 31, 32, 33, 34, 35],
            [40, 41, 42, 43, 44, 45],
        ];

        //Crea el mapa
        const map = this.make.tilemap({
            //Coje la informacion del mapa
            data: mapData,
            //Coje las medidas de los sprites
            tileWidth: 16,
            tileHeight: 16});
        
        //Le dice al mapa que TileSet se usa para el mapa
        const tileset = map.addTilesetImage("TileSet");
        //Crea la capa en la que esta el mapa
        const layer = map.createLayer(0, tileset, 0, 0);
        //Escalar los tyles de la escena
        layer.setScale(5);

		this.add.text(240, 100, "Percival");
		this.add.text(780, 100, "Daphne");

        let percival = new Players(this,280,300,"Percival",0,"percival");
        let daphne = new Players(this,800,300,"Daphne",0,"daphne");

        this.movementController = new Movement(this, this.percival, this.daphne);
    }

    update(){
        if (this.movementController) {
            this.movementController.update();
        }
    }

    preload(){
		this.load.spritesheet("D",
             "sprites/images/daphne/DaphneIdle(x5).png",
              { frameWidth: 160, frameHeight: 160});

        this.load.spritesheet("P",
             "sprites/images/percival/PercivalIdle(x5).png",
              { frameWidth: 160, frameHeight: 160});
        
        this.load.spritesheet("TileSet",
            "Sprites/TileSet/TileSetPJ.png",
            {frameWidth:16, frameHeight:16});

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