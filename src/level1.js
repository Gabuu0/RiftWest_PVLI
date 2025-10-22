import Players from "./players.js";
import Movement from "./movement.js";   

export default class Level1 extends Phaser.Scene{
    constructor(){
        super({key: "level1"});
    }
    init(){
        
    }

    create(){
        this.createAnims();
        //Index de los sprites del mapa
        const TI = {
            EIAR: 0, AR1: 1, AR2: 2, EDAR: 5,
            PI1: 10, PI2: 20, PD1: 15, PD2: 25,
            EIAB: 40, AB1: 41, AB2: 42, AB3: 51, AB4: 52, EDAB: 45,
            S1: 11, S2: 12, S3: 13, S4: 14,
            S5: 21, S6: 22, S7: 23, S8: 24,
            S9: 31, S10: 32, S11: 33, S12: 34,
            FF: 78,
        };

        //Crea el mapa
        const map = this.make.tilemap({
            //Se declara las medidas de los sprites
            tileWidth: 16,
            tileHeight: 16,
            width: 7,
            height: 5
            }
        );
        //Le declara el Tileset que se utilizara
        const tileset = map.addTilesetImage("TileSet");

        //Creamos el layer vacio
        const layer1 = map.createBlankLayer("layer1", tileset, 0, 0);

        //Crea el primer layer
        const layer1Data = [
            [TI.EIAR, TI.AR1, TI.AR2, TI.AR2, TI.AR1, TI.EDAR, TI.FF],
            [TI.PI1, TI.S1, TI.S2, TI.S3, TI.S4, TI.PD1, TI.FF],
            [TI.PI2, TI.S5, TI.S6, TI.S7, TI.S8, TI.PD2, TI.FF],
            [TI.PI1, TI.S9, TI.S10, TI.S11, TI.S12, TI.PD2, TI.FF],
            [-1, -1, -1, -1, -1, -1, TI.FF]
        ];
        layer1.putTilesAt(layer1Data, 0, 0);
        layer1.setScale(5);
        layer1.setDepth(0);
        
        // Crea el segundo layer vacio
        const layer2 = map.createBlankLayer("layer2", tileset, 0, 0);

        const layer2Data = [
            [-1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1],
            [TI.EIAB, TI.AB1, TI.AB2, TI.AB3, TI.AB4, TI.EDAB, -1]
        ];
        layer2.putTilesAt(layer2Data, 0, 0);
        layer2.setScale(5);
        layer2.setDepth(10);


		this.add.text(240, 100, "Percival");
		this.add.text(780, 100, "Daphne");

        this.percival = new Players(this,280,300,"P",0,"percival");
        this.daphne = new Players(this,800,300,"D",0,"daphne");

        console.log("Movement:", Movement);
        console.log("Percival:", this.percival);
        console.log("Daphne:", this.daphne);

        this.movementController = new Movement(this, this.percival, this.daphne);

        this.input.keyboard.enabled = true;

        this.input.keyboard.on('keydown', (event) => {
        // Evita que el navegador use las teclas (por ejemplo, mover scroll o cursor)
        event.preventDefault();
});
    }

    update(){
        if (this.movementController) {
            this.movementController.update();
        }
    }

    preload(){
		this.load.spritesheet("D","sprites/images/daphne/DaphneIdle(x5).png",
              { frameWidth: 160, frameHeight: 160});

        this.load.spritesheet("P","sprites/images/percival/PercivalIdle(x5).png",
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
        //Daphne.play('daphneIdle');
    }

    
}