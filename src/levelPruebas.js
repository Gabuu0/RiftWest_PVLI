import Players from "./players.js";
import Movement from "./movement.js";   
import PauseMenu from "./pauseMenu.js";
import Key from "./key.js";
import Door from "./door.js";
import PreassurePlate from "./preassurePlate.js";
import InteractableObjects from './interactableObjects.js';
import movableObject from './movableObject.js';
import breakableObjects from './breakableObjects.js'
import DialogText from "./dialogText.js";

export default class LevelPruebas extends Phaser.Scene{
    constructor(){
        super({key: "levelPruebas"});
    }

    init(){
        
    }

    create(){
        this.createAnims();

        this.registry.set('clownObj', {
            objData: {},
            hasObj: false,
        });

        this.players = this.add.group();
        this.percival = new Players(this,1500, 500,"P",0,"percival");
        this.daphne = new Players(this,4000,500,"D",0,"daphne");
        this.players.add(this.percival);
        this.players.add(this.daphne);
        
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
            let pauseScene = this.scene.manager.getScene('pauseMenu');
            if(pauseScene.level != this.scene.key){
                pauseScene.level = this.scene.key;
            }
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


        this.map = this.make.tilemap({ key: 'mapa' });
        const tileset1 = this.map.addTilesetImage('TileSetPJ', 'tilesPJ');
        const tilesetD = this.map.addTilesetImage('DustwartsTileset', 'tilesD');
        const tilesetM = this.map.addTilesetImage('MagwartsTileset', 'tilesM');
        this.tilesets = [tileset1, tilesetD, tilesetM];

        const Suelo = this.addMapLayer('suelo',false);

        const Paredes = this.addMapLayer('paredes',true);

        const Paredes2 = this.addMapLayer('paredes(sin_colision)',false);
        Paredes2.setDepth(3);   

        //#region Creacion de los objetos del mapa (puertas, placas de presion, etc)

        //Se obtienen las layers de los objetos para acceder a los objetos de cada una
        //en cada layer se busca la propiedad identifier de cada objeto, en el caso de las puertas tambien se busca su tipo 
        //  -identifier(int): identificador usado para abrir las puertas segun el mismo, las puertas se abriran si se interactua con un objeto con el mismo identificador
        //  -doorType(int): tipo de puerta usado para saber que frame del spriteSheet de puertas usar
        //Ademas se agrupa cada tipo de objeto en un grupo y se escala el objeto(tanto el tamaño como la posicion)

        const scaling = 5;
        this.doors = this.add.group();
        const doorsLayer = this.map.getObjectLayer('puertas');
        doorsLayer.objects.forEach(obj =>{
            let id = obj.properties.find(prop => prop.name ==='identifier').value;
            let doorType = obj.properties.find(prop => prop.name ==='doorType').value;
            let door = new Door(this, obj.x, obj.y,'doors',doorType,obj.rotation,id);
            this.scaleObject(door,scaling);
            this.doors.add(door);
        })

        this.preassurePlates = this.add.group();
        const platesLayer = this.map.getObjectLayer('placas_presion');
        platesLayer.objects.forEach(obj =>{
            let id = obj.properties.find(prop => prop.name ==='identifier').value;
            let plate = new PreassurePlate(this, obj.x, obj.y,'preassurePlate',id);
            plate.setScale(scaling);
            this.scaleObject(plate,scaling);
            this.preassurePlates.add(plate);
        });
        //#endregion
        
        
        
        //#endregion

        //#region Colisiones
        this.physics.add.collider(this.players,Paredes);
        this.physics.add.collider(this.players,this.doors);
        this.physics.add.overlap(this.players,this.preassurePlates);
        this.physics.add.overlap(this.players,this.keys,(jugador,llave)=>{
            //se elimina la llave si es posible cogerla (inventario del jugador no lleno)
            if(jugador.pickItem(llave)) {
                this.events.emit('itemPickedP', llave);
                llave.destroy(); 
            }
        });




        //this.physics.add.overlap(this.daphne, PlacasDePresion, (jugador,tile) => {InteractableObjects.activarPlaca(this, jugador, tile)});
       

       

        //this.physics.add.overlap(this.percival, PlacasDePresion, (jugador,tile) => {InteractableObjects.activarPlaca(this, jugador, tile)});

        this.cajaM1 = new movableObject(this, 3140, 3100, 980, 3100, "cajaMovible", this.percival, this.daphne, Paredes)
        this.cajR1 = new breakableObjects(this,475, 3225, 2625, 3225,'cajaRompible',this.percival,this.daphne);
        
        //this.physics.add.overlap(this.cajaM1, PlacasDePresion, (movableObject,tile) => {InteractableObjects.activarPlaca(this, movableObject, tile)});
        //#endregion
        //#region SistemaDialogos
        this.dialog = new DialogText(this, {});
        this.dialog.setDepth(10);
        
        this.dialog.setTextArray([
            "Bryant Myers",
            "Hoy de nuevo te voy a ver (Anonimus, this is the remix)",
            "Si llaman, pichea el cel (Anuel, Almighty)",
            "Estamos fumando marihuana (Maybach Música)",
            "Hoy serás mi esclava en el cuarto de un motel (Carbon Fiber Music)"
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
        this.load.image('tilesPJ', 'sprites/tileSet/TileSetPJ.png');
        this.load.image('tilesD', 'sprites/tileSet/DustwartsTileset.png');
        this.load.image('tilesM', 'sprites/tileSet/MagwartsTileset.png');
        this.load.tilemapTiledJSON('mapa', 'sprites/tileSet/PruebaPuertas.json');
        this.load.spritesheet('doors','sprites/tileSet/Doors.png',{frameWidth:32, frameHeight:16});
        this.load.image('preassurePlate','sprites/tileSet/PreassurePlate.png');
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
        this.keys.add(new Key(this, 2000,600,'llaveMapa','llaveInventario','keyIdle','Llave to guapa mi bro',1).setDepth(5))
        this.keys.add(new Key(this, 2050,700,'llaveMapa','llaveInventario','keyIdle','Llave de tu vieja',2).setDepth(5))
        this.keys.add(new Key(this, 2025,800,'llaveMapa','llaveInventario','keyIdle','Llavecita de mi cora',3).setDepth(5))
        this.keys.add(new Key(this, 2145,800,'llaveMapa','llaveInventario','keyIdle','Llave inglesa',3).setDepth(5))
    }


    addMapLayer(name,collision){
        let layer = this.map.createLayer(name, this.tilesets,0,0);
        layer.setScale(5);
        if(collision){
            layer.setCollisionByExclusion([-1]);
        }
        return layer;
    }

    scaleObject(object,scaling){
        object.x *= scaling;
        object.y *= scaling;
        object.y += (object.height*scaling);
        object.setScale(scaling);
    }
}