import Players from "./players.js";
import Movement from "./movement.js";   
import PauseMenu from "./pauseMenu.js";
import InteractableObjects from './interactableObjects.js';

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

        this.percival = new Players(this,200,500,"P",0,"percival");
        this.daphne = new Players(this,900,500,"D",0,"daphne");

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
        const tileset1 = map.addTilesetImage('tileSet1', 'tilesPJ');
        const tilesetD = map.addTilesetImage('dustwarts', 'tilesD');
        const tilesetM = map.addTilesetImage('magwarts', 'tilesM');
        const tilesets = [tileset1, tilesetD, tilesetM];

        const Suelo = map.createLayer('Suelo', tilesets, -500, -500);
        Suelo.setScale(5);

        const Paredes = map.createLayer('Paredes', tilesets, -500, -500);
        Paredes.setCollisionByExclusion([-1]);
        Paredes.setScale(5);

        this.Puertas = map.createLayer('Puertas', tilesets, -500, -500);
        this.Puertas.setCollisionByExclusion([-1]);
        this.Puertas.setScale(5);

        const PlacasDePresion = map.createLayer('PlacasDePresion', tilesets, -500, -500);
        PlacasDePresion.setCollisionByExclusion([-1]);
        PlacasDePresion.setScale(5);
        
        const Paredes2 = map.createLayer('Paredes(SinColision)', tilesets, -500, -500);
        Paredes2.setScale(5);
        this.physics.add.collider(this.daphne, Paredes);
        this.physics.add.collider(this.daphne, this.Puertas);
        this.physics.add.overlap(this.daphne, PlacasDePresion, (jugador,tile) => {InteractableObjects.activarPlaca(this, jugador, tile)});

        this.physics.add.collider(this.percival, Paredes);
        this.physics.add.collider(this.percival, this.Puertas);
        this.physics.add.overlap(this.percival, PlacasDePresion, (jugador,tile) => {InteractableObjects.activarPlaca(this, jugador, tile)});

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
        
        this.load.image('tilesPJ', 'Sprites/TileSet/TileSetPJ.png');
        this.load.image('tilesD', 'Sprites/TileSet/Dustwarts.png');
        this.load.image('tilesM', 'Sprites/TileSet/Magwarts.png');
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