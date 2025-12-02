import Players from '../../players/players.js'
import Movement from '../../players/movement.js'
import Key from "../../objects/mapObjects/key.js";
import InteractableObjects from '../../objects/mapObjects/interactableObjects.js';
import movableObject from '../../objects/mapObjects/movableObject.js';
import breakableObjects from '../../objects/mapObjects/breakableObjects.js'
import DialogText from "../../objects/playerObjects/dialogText.js";

export default class Level1 extends Phaser.Scene{
    constructor(){
        super({key: "level1"});
    }

    init(){
        
    }

    create(){
        this.createAnims();

        this.registry.set('clownObj', {
            objData: {},
            hasObj: false,
        });


        this.percival = new Players(this,350, 3600,"P",0,"percival");
        this.daphne = new Players(this,2500,3600,"D",0,"daphne");
        
        this.keys = this.add.group();
        this.createItems();

        this.percival.setDepth(1);
        this.daphne.setDepth(1);
/*
        console.log("Movement:", Movement);
        console.log("Percival:", this.percival);
        console.log("Daphne:", this.daphne);
*/
        this.scene.launch('InventarioPercival',this.percival);
        this.scene.launch('InventarioDaphne',this.daphne);
        this.inventario1 = this.scene.get('InventarioPercival');
        this.inventario2 = this.scene.get('InventarioDaphne');


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
        this.daphneCam = this.cameras.add(540,0,540,540,'DaphneCam');
        this.daphneCam.setViewport(540,0,540,540);
        this.daphneCam.startFollow(this.daphne);

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
        
        //#endregion

        //#region Colisiones
        this.physics.add.collider(this.daphne, Paredes);
        this.physics.add.collider(this.daphne, this.Puertas);
        this.physics.add.overlap(this.daphne, PlacasDePresion, (jugador,tile) => {InteractableObjects.activarPlaca(this, jugador, tile)});
        this.physics.add.overlap(this.percival,this.keys,(jugador,llave)=>{
            //se oculta la llave si es posible cogerla
            if(jugador.pickItem(llave)) {
                this.events.emit('itemPickedP', llave);
                llave.destroy(); 
            }
        })

        this.physics.add.overlap(this.daphne,this.keys,(jugador,llave)=>{
            //se oculta la llave si es posible cogerla
            if(jugador.pickItem(llave)) {
                this.events.emit('itemPickedD', llave);
                llave.destroy(); 
            }
        })

        this.physics.add.collider(this.percival, Paredes);
        this.physics.add.collider(this.percival, this.Puertas);
        this.physics.add.overlap(this.percival, PlacasDePresion, (jugador,tile) => {InteractableObjects.activarPlaca(this, jugador, tile)});

        this.cajaM1 = new movableObject(this, 3140, 3100, 980, 3100, "cajaMovible", this.percival, this.daphne, Paredes)
        this.cajR1 = new breakableObjects(this,475, 3225, 2625, 3225,'cajaRompible',this.percival,this.daphne);
        
        this.physics.add.overlap(this.cajaM1, PlacasDePresion, (movableObject,tile) => {InteractableObjects.activarPlaca(this, movableObject, tile)});
        //#endregion
        //#region SistemaDialogos

        this.dialog = new DialogText(this, {camera: this.percivalCam});
        this.dialog.setDepth(10);
        
        this.dialog.setTextArray([
            [1, "Bryant Myers"],
            [2, "Hoy de nuevo te voy a ver (Anonimus, this is the remix)"],
            [0, "Si llaman, pichea el cel (Anuel, Almighty)"],
            [1, "Estamos fumando marihuana (Maybach Música)"],
            [2, "Hoy serás mi esclava en el cuarto de un motel (Carbon Fiber Music)"]
        ], true);
        //#endregion
    }

    update(t, dt){
        if (this.movementController) {
            this.movementController.update();
        }
    }

    preload(){

        //#region Personajes
		this.load.spritesheet("D","sprites/images/daphne/DaphneIdle(x5).png",
              { frameWidth: 160, frameHeight: 160});

        this.load.spritesheet("P","sprites/images/percival/PercivalIdle(x5).png",
              { frameWidth: 160, frameHeight: 160});
        //#endregion

        //#region Tilemaps

        this.load.spritesheet("DUp","sprites/images/daphne/Daphne-caminando-arriba(x5).png",
              { frameWidth: 160, frameHeight: 160});

        this.load.spritesheet("PUp","sprites/images/percival/Percival-caminando-arriba(x5).png",
              { frameWidth: 160, frameHeight: 160});

        this.load.spritesheet("DDown","sprites/images/daphne/Daphne-caminando-abajo(x5).png",
                { frameWidth: 160, frameHeight: 160});

        this.load.spritesheet("PDown","sprites/images/percival/Percival-caminando-abajo(x5).png",
                { frameWidth: 160, frameHeight: 160});

        this.load.spritesheet("DLeft","sprites/images/daphne/Daphne-caminando-derecha(x5).png",
                { frameWidth: 160, frameHeight: 160});

        this.load.spritesheet("PLeft","sprites/images/percival/Percival-caminando-derecha(x5).png",
                { frameWidth: 160, frameHeight: 160});

        this.load.spritesheet("DRight","sprites/images/daphne/Daphne-caminando-izquierda(x5).png",
                { frameWidth: 160, frameHeight: 160});

        this.load.spritesheet("PRight","sprites/images/percival/Percival-caminando-izquierda(x5).png",
                { frameWidth: 160, frameHeight: 160});
        
        this.load.image('tilesPJ', 'sprites/tileSet/TileSetPJ.png');
        this.load.image('tilesD', 'sprites/tileSet/DustwartsTileset.png');
        this.load.image('tilesM', 'sprites/tileSet/MagwartsTileset.png');
        this.load.tilemapTiledJSON('mapa', 'sprites/tileSet/Mapa.json');
        //#endregion

        //#region Objetos
        this.load.image('cajaMovible', 'sprites/images/items/cajaMovible.png');
        this.load.image('cajaRompible','sprites/images/items/cajaRompible.png');
        this.load.image('cajaRota','sprites/images/items/cajaRompibleRota.png');

        this.load.spritesheet('llaveMapa','sprites/images/items/keyMap.png',
              {frameWidth:16, frameHeight:16}
        );
        this.load.image('llaveInventario', 'sprites/images/items/keyInventory.png')
        //#endregion

        this.load.spritesheet('slot','sprites/images/inventory/inventorySpace.png',{frameWidth: 64, frameHeight:64});
        this.load.image('descriptionBox','sprites/images/inventory/descriptionBox.png');
    }

    createAnims(){
        //#region Personajes
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
            {key: "DaphneUp",
            frames: this.anims.generateFrameNumbers("DUp", {frames:[0,1,2,3]}),
            frameRate: 5,
            repeat: -1,}
        );
        this.anims.create(
            {key: "PercivalUp",
            frames: this.anims.generateFrameNumbers("PUp", {frames:[0,1,2,3]}),
            frameRate: 5,
            repeat: -1,}
        );
        
        this.anims.create(
            {key: "DaphneDown",
            frames: this.anims.generateFrameNumbers("DDown", {frames:[0,1,2,3]}),
            frameRate: 5,
            repeat: -1,}
        );
        this.anims.create(
            {key: "PercivalDown",
            frames: this.anims.generateFrameNumbers("PDown", {frames:[0,1,2,3]}),
            frameRate: 5,
            repeat: -1,}
        );
        
        this.anims.create(
            {key: "DaphneLeft",
            frames: this.anims.generateFrameNumbers("DLeft", {frames:[0,1,2,3]}),
            frameRate: 5,
            repeat: -1,}
        );
        this.anims.create(
            {key: "PercivalLeft",
            frames: this.anims.generateFrameNumbers("PLeft", {frames:[0,1,2,3]}),
            frameRate: 5,
            repeat: -1,}
        );

        this.anims.create(
            {key: "DaphneRight",
            frames: this.anims.generateFrameNumbers("DRight", {frames:[0,1,2,3]}),
            frameRate: 5,
            repeat: -1,}
        );
        this.anims.create(
            {key: "PercivalRight",
            frames: this.anims.generateFrameNumbers("PRight", {frames:[0,1,2,3]}),
            frameRate: 5,
            repeat: -1,}
        );
        //#endregion

        //#region Objetos
        this.anims.create(
            {key:'keyIdle',
                frames: this.anims.generateFrameNumbers('llaveMapa', {frames:[0,1,2,1]}),
                frameRate: 4,
                repeat:-1,
            }
        );
        //#endregion

        //#region Inventario
        this.anims.create(
            {key: 'SlotSelected',
            frames: this.anims.generateFrameNumbers('slot', {frames:[1,2]}),
            frameRate: 2,
            repeat: -1,}
        );

        this.anims.create(
            {key: 'SlotIdle',
            frames: this.anims.generateFrameNumbers('slot', {frames:[0]}),
            frameRate: 2,
            repeat: -1,}
        );
        //#endregion
    }


    createItems(){
        this.keys.add(new Key(this, 400,3600,'llaveMapa','llaveInventario','keyIdle','Llave to guapa mi bro',1).setDepth(5))
        this.keys.add(new Key(this, 450,3700,'llaveMapa','llaveInventario','keyIdle','Llave de tu vieja',2).setDepth(5))
        this.keys.add(new Key(this, 425,3800,'llaveMapa','llaveInventario','keyIdle','Llavecita de mi cora',3).setDepth(5))
        this.keys.add(new Key(this, 445,3800,'llaveMapa','llaveInventario','keyIdle','Llave inglesa',3).setDepth(5))
    }

    
}