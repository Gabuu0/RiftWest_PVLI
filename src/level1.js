import Players from "./players.js";
import Movement from "./movement.js";   
import PauseMenu from "./pauseMenu.js";

export default class Level1 extends Phaser.Scene{
    constructor(){
        super({key: "level1"});
    }

    init(){
        
    }

    create(){
        this.createAnims();

        this.pText = this.add.text(240, 100, "Percival").setScrollFactor(0);
		this.dText = this.add.text(240, 100, "Daphne").setScrollFactor(0);

        this.percival = new Players(this,280,250,"P",0,"percival");
        this.daphne = new Players(this,900,250,"D",0,"daphne");

        this.percival.setDepth(1);
        this.daphne.setDepth(1);

        console.log("Movement:", Movement);
        console.log("Percival:", this.percival);
        console.log("Daphne:", this.daphne);

        this.movementController = new Movement(this, this.percival, this.daphne);

        this.input.keyboard.enabled = true;

        this.input.keyboard.on('keydown-ESC', () => {
            console.log('ESC pulsado');
            this.scene.launch('pauseMenu');   // Lanza el menú
            this.scene.pause();              // Pausa la escena del juego
        });

        this.input.keyboard.on('keydown', (event) => {
        // Evita que el navegador use las teclas (por ejemplo, mover scroll o cursor)
        event.preventDefault();

         });

        this.percivalCam = this.cameras.main;
        this.percivalCam.setViewport(0,0,540,540);
        this.percivalCam.startFollow(this.percival);
        this.percivalCam.ignore(this.dText);
        this.daphneCam = this.cameras.add(540,0,540,540,'DaphneCam');
        this.daphneCam.setViewport(540,0,540,540);
        this.daphneCam.startFollow(this.daphne);
        this.daphneCam.ignore(this.pText);

        //#region Creacion Mapa
        const map = this.make.tilemap({ key: 'mapa' });
        const tileset = map.addTilesetImage('tileSet1', 'tiles');

        const Suelo = map.createLayer('Suelo', tileset, -500, -500);
        Suelo.setScale(5);

        const Paredes = map.createLayer('Paredes', tileset, -500, -500);
        Paredes.setCollisionByExclusion([-1]);
        Paredes.setScale(5);

        this.physics.add.collider(this.daphne, Paredes);
        this.physics.add.collider(this.percival, Paredes);

        //#endregion
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
        
        this.load.image('tiles', 'Sprites/TileSet/TileSetPJ.png');
        this.load.tilemapTiledJSON('mapa', 'Sprites/TileSet/Mapa.json');
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