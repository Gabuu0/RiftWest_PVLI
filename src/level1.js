import Players from "./players.js";
import Movement from "./movement.js";   
import PauseMenu from "./pauseMenu.js";
import Key from "./key.js";
import InteractableObjects from './interactableObjects.js';
import movableObject from './movableObject.js';
import breakableObjects from './breakableObjects.js'

export default class Level1 extends Phaser.Scene{
    constructor(){
        super({key: "level1"});
    }

    init(){
        
    }

    create(){
        this.createAnims();

        this.percival = new Players(this,350, 3600,"P",0,"percival");
        this.daphne = new Players(this,2500,3600,"D",0,"daphne");
        
        const players = this.add.group();
        players.add(this.percival);
        players.add(this.daphne);


        this.keys = this.add.group();
        this.createItems();

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
        const tilesetD = map.addTilesetImage('dustwartsTileset', 'tilesD');
        const tilesetM = map.addTilesetImage('magwartsTileset', 'tilesM');
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
        Paredes2.setDepth(10);   
        
        this.physics.add.collider(this.daphne, Paredes);
        this.physics.add.collider(this.daphne, this.Puertas);
        this.physics.add.overlap(this.daphne, PlacasDePresion, (jugador,tile) => {InteractableObjects.activarPlaca(this, jugador, tile)});
        this.physics.add.overlap(players,keys,(jugador,llave)=>{
            //se oculta la llave si es posible cogerla
            if(jugador.catchItem(llave)) llave.setVisible(false);
        })

        this.physics.add.collider(this.percival, Paredes);
        this.physics.add.collider(this.percival, this.Puertas);
        this.physics.add.overlap(this.percival, PlacasDePresion, (jugador,tile) => {InteractableObjects.activarPlaca(this, jugador, tile)});

        this.cajaM1 = new movableObject(this, 3140, 3100, 980, 3100, "cajaMovible", this.percival, this.daphne, Paredes)
        this.cajR1 = new breakableObjects(this,475, 3225, 2625, 3225,'cajaRompible',this.percival,this.daphne);

        this.physics.add.overlap(this.cajaM1, PlacasDePresion, (movableObject,tile) => {InteractableObjects.activarPlaca(this, movableObject, tile)});
    //#endregion
    }

    update(t, dt){
        if (this.movementController) {
            this.movementController.update();
        }
    }

    preload(){
		this.load.spritesheet("D","sprites/images/daphne/DaphneIdle(x5).png",
              { frameWidth: 160, frameHeight: 160});

        this.load.spritesheet("P","sprites/images/percival/PercivalIdle(x5).png",
              { frameWidth: 160, frameHeight: 160});
        
        this.load.image('tilesPJ', 'sprites/tileSet/TileSetPJ.png');
        this.load.image('tilesD', 'sprites/tileSet/DustwartsTileset.png');
        this.load.image('tilesM', 'sprites/tileSet/MagwartsTileset.png');
        this.load.tilemapTiledJSON('mapa', 'sprites/tileSet/Mapa.json');

        this.load.image('cajaMovible', 'sprites/images/items/cajaMovible.png');
        this.load.image('cajaRompible','sprites/images/items/cajaRompible.png');
        this.load.image('cajaRota','sprites/images/items/cajaRompibleRota.png');
        this.load.spritesheet('llaveMapa','sprite/images/items/keyMap.png');
        this.load.image('llaveInventario', 'sprite/images/items/keyInventory.png')

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



        this.anims.create(
            {key:'keyIdle',
                frames: this.anims.generateFrameNumbers('llaveMapa', {frames:[0,1,2,1]}),
                frameRate: 4,
                repeat:-1,
            }
        );
    }


    createItems(){
        this.keys.add(new Key(this, 360,3600,'llaveMapa','llaveInventario','keyIdle','Llave to guapa mi bro'))
    }

    
}