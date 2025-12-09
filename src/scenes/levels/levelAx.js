import Players from '../../players/players.js'
import Movement from '../../players/movement.js'
import Key from "../../objects/mapObjects/key.js";
import InteractableObjects from '../../objects/mapObjects/interactableObjects.js';
import movableObject from '../../objects/mapObjects/movableObject.js';
import breakableObjects from '../../objects/mapObjects/breakableObjects.js'
import DialogText from "../../objects/playerObjects/dialogText.js";
import Watchman from "../../watchman.js";
import PreassurePlate from '../../objects/mapObjects/preassurePlate.js';
import EndTrigger from '../../objects/mapObjects/endTrigger.js';
import Door from '../../objects/mapObjects/door.js';

export default class LevelAx extends Phaser.Scene {
    constructor(){
        super({key: "levelAx"});
    }

    init(){

    }

    create(){
        //#region Creacion Personajes
        this.createAnims();

        this.percival = new Players(this,1240,1800,"P",0,"percival");
        this.daphne = new Players(this,4520,1800,"D",0,"daphne");

        this.players = this.add.group();
        this.players.add(this.percival);
        this.players.add(this.daphne);

        this.percival.setDepth(1);
        this.daphne.setDepth(1);

        this.scene.launch('InventarioPercival',this.percival);
        this.scene.launch('InventarioDaphne',this.daphne);
        this.inventario1 = this.scene.get('InventarioPercival');
        this.inventario2 = this.scene.get('InventarioDaphne');

        this.movementController = new Movement(this, this.percival, this.daphne);

        this.percivalCam = this.cameras.main;
        this.percivalCam.setViewport(0,0,540,540);
        this.percivalCam.startFollow(this.percival);
        this.daphneCam = this.cameras.add(540,0,540,540,'DaphneCam');
        this.daphneCam.setViewport(540,0,540,540);
        this.daphneCam.startFollow(this.daphne);
        
        //#endregion

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

        this.endTriggers = [];
        const endTLayer = this.map.getObjectLayer('end_trigger');
        endTLayer.objects.forEach(obj =>{
            let endT = new EndTrigger(this, obj.x, obj.y,'preassurePlate');
            endT.setScale(scaling);
            this.scaleObject(endT,scaling);
            this.endTriggers.push(endT);
        });

        this.keys = this.add.group();
        this.keys.add(new Key(this, 1800,600,'llaveMapa','llaveInventario','keyIdle','Llave salida magica',5).setDepth(5))
        this.keys.add(new Key(this, 5080,600,'llaveMapa','llaveInventario','keyIdle','Llave salida oeste',6).setDepth(5))
        this.keys.add(new Key(this, 1800,1880,'llaveMapa','llaveInventario','keyIdle','Llave sala principal-trastero',0).setDepth(5))
        this.keys.add(new Key(this, 5080,1880,'llaveMapa','llaveInventario','keyIdle','Llave sala principal-pasillos',1).setDepth(5))

        this.cajaM1 = new movableObject(this, 4280, 1240, 1000, 1240, "cajaMovible", this.percival, this.daphne, Paredes)
        this.cajaM2 = new movableObject(this, 4920, 1240, 1640, 1240, "cajaMovible", this.percival, this.daphne, Paredes)
        this.cajaM3 = new movableObject(this, 3960, 1720, 600, 1720, "cajaMovible", this.percival, this.daphne, Paredes)
        this.cajaM4 = new movableObject(this, 4280, 760, 1000, 760, "cajaMovible", this.percival, this.daphne, Paredes)
        this.cajaM5 = new movableObject(this, 4760, 760, 1480, 760, "cajaMovible", this.percival, this.daphne, Paredes)

        this.cajR1 = new breakableObjects(this, 1240, 1160, 4520, 1160,'cajaRompible',this.percival,this.daphne);
        this.cajR2 = new breakableObjects(this, 840, 1560, 4120, 1560,'cajaRompible',this.percival,this.daphne);
        this.cajR3 = new breakableObjects(this, 1160, 920, 4520, 920,'cajaRompible',this.percival,this.daphne);
        this.cajR4 = new breakableObjects(this, 1480, 920, 4840, 920,'cajaRompible',this.percival,this.daphne);
        this.cajR5 = new breakableObjects(this, 680, 520, 3960, 520,'cajaRompible',this.percival,this.daphne);
        this.cajR6 = new breakableObjects(this, 840, 1080, 4120, 1000,'cajaRompible',this.percival,this.daphne);
        
        // this.physics.add.overlap(this.cajaM1, PlacasDePresion, (movableObject,tile) => {InteractableObjects.activarPlaca(this, movableObject, tile)});
        //#endregion

        //#region Colisiones
        this.physics.add.collider(this.players,Paredes);
        this.physics.add.collider(this.players,this.doors,(jugador,puerta)=>{
            //si el jugador tiene un item con el mismo identificador que la puerta esta se destruye
            if(jugador.haveItem(puerta.identifier)){
                puerta.destroy(true);
            }
        });
        this.physics.add.overlap(this.players,this.preassurePlates,(jugador,placa)=>{
            //se miran las puertas y si alguna tiene el mismo identificador que la placa se abre
            this.doors.getChildren().forEach(door =>{
                if(door.identifier === placa.identifier){
                    door.openDoor("preassurePlate");
                }
            });
        });
        this.physics.add.overlap(this.players,this.keys,(jugador,llave)=>{
            //se elimina la llave si es posible cogerla (inventario del jugador no lleno)
            if(jugador.pickItem(llave)) {
                this.events.emit('itemPickedP', llave);
                llave.destroy(); 
            }
        });
        this.physics.add.overlap(this.players,this.endTriggers,(jugador, endT)=>{
            endT.on();
            if (this.endTriggers.every(t => t.getIsPressed())) {
                console.log("3Letra, la L");
            }
        });
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
                
        //WatchMans
        this.load.spritesheet("S","sprites/images/profesor/Profesor-idle.png",
              { frameWidth: 160, frameHeight: 160});
        this.load.spritesheet("Pr","sprites/images/sheriff/Sheriif-idle.png",
              { frameWidth: 160, frameHeight: 160});

        this.load.spritesheet("SUp","sprites/images/sheriff/Sheriif-up.png",
              { frameWidth: 160, frameHeight: 160});
        this.load.spritesheet("PrUp","sprites/images/profesor/Profesor-up.png",
              { frameWidth: 160, frameHeight: 160});

        this.load.spritesheet("SDown","sprites/images/sheriff/Sheriif-down.png",
                { frameWidth: 160, frameHeight: 160});
        this.load.spritesheet("PrDown","sprites/images/profesor/Profesor-down.png",
                { frameWidth: 160, frameHeight: 160});

        this.load.spritesheet("SLeft","sprites/images/sheriff/Sheriif-left.png",
                { frameWidth: 160, frameHeight: 160});
        this.load.spritesheet("PrLeft","sprites/images/profesor/Profesor-left.png",
                { frameWidth: 160, frameHeight: 160});

        this.load.spritesheet("SRight","sprites/images/sheriff/Sheriif-right.png",
                { frameWidth: 160, frameHeight: 160});
        this.load.spritesheet("PrRight","sprites/images/profesor/Profesor-right.png",
                { frameWidth: 160, frameHeight: 160});
        
        this.load.image('profesor','sprites/images/profesor.jpg');
        this.load.image('sheriff','sprites/images/sheriff.jpeg');
        //#endregion

        //#region Tilemaps
        this.load.image('tilesPJ', 'sprites/tileSet/TileSetPJ.png');
        this.load.image('tilesD', 'sprites/tileSet/DustwartsTileset.png');
        this.load.image('tilesM', 'sprites/tileSet/MagwartsTileset.png');
        this.load.tilemapTiledJSON('mapa', 'sprites/tileSet/LvlAxel.json');
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
            frames: this.anims.generateFrameNumbers("D", {frames:[0,1,2,3]}), frameRate: 5, repeat: -1,}
        );
        this.anims.create(
            {key: "PercivalIdle",
            frames: this.anims.generateFrameNumbers("P", {frames:[0,1,2,3]}), frameRate: 5, repeat: -1,}
        );
        this.anims.create(
            {key: "DaphneUp",
            frames: this.anims.generateFrameNumbers("DUp", {frames:[0,1,2,3]}), frameRate: 5, repeat: -1,}
        );
        this.anims.create(
            {key: "PercivalUp",
            frames: this.anims.generateFrameNumbers("PUp", {frames:[0,1,2,3]}), frameRate: 5, repeat: -1,}
        );
        this.anims.create(
            {key: "DaphneDown",
            frames: this.anims.generateFrameNumbers("DDown", {frames:[0,1,2,3]}), frameRate: 5, repeat: -1,}
        );
        this.anims.create(
            {key: "PercivalDown",
            frames: this.anims.generateFrameNumbers("PDown", {frames:[0,1,2,3]}), frameRate: 5, repeat: -1,}
        );
        this.anims.create(
            {key: "DaphneLeft",
            frames: this.anims.generateFrameNumbers("DLeft", {frames:[0,1,2,3]}), frameRate: 5, repeat: -1,}
        );
        this.anims.create(
            {key: "PercivalLeft",
            frames: this.anims.generateFrameNumbers("PLeft", {frames:[0,1,2,3]}), frameRate: 5, repeat: -1,}
        );
        this.anims.create(
            {key: "DaphneRight",
            frames: this.anims.generateFrameNumbers("DRight", {frames:[0,1,2,3]}), frameRate: 5, repeat: -1,}
        );
        this.anims.create(
            {key: "PercivalRight",
            frames: this.anims.generateFrameNumbers("PRight", {frames:[0,1,2,3]}), frameRate: 5, repeat: -1,}
        );

        this.anims.create(
            {key: "SheriffDown",
            frames: this.anims.generateFrameNumbers("SDown", {frames:[0,1,2,3]}), frameRate: 5, repeat: -1,}
        );
        this.anims.create(
            {key: "ProfesorDown",
            frames: this.anims.generateFrameNumbers("PrDown", {frames:[0,1,2,3]}), frameRate: 5,
            repeat: -1,}
        );
        this.anims.create(
            {key: "SheriffUp",
            frames: this.anims.generateFrameNumbers("SUp", {frames:[0,1,2,3]}), frameRate: 5, repeat: -1,}
        );
        this.anims.create(
            {key: "ProfesorUp",
            frames: this.anims.generateFrameNumbers("PrUp", {frames:[0,1,2,3]}), frameRate: 5, repeat: -1,}
        );
        this.anims.create(
            {key: "SheriffLeft",
            frames: this.anims.generateFrameNumbers("SLeft", {frames:[0,1,2,3]}), frameRate: 5, repeat: -1,}
        );
        this.anims.create(
            {key: "ProfesorLeft",
            frames: this.anims.generateFrameNumbers("PrLeft", {frames:[0,1,2,3]}), frameRate: 5, repeat: -1,}
        );
        this.anims.create(
            {key: "SheriffRight",
            frames: this.anims.generateFrameNumbers("SRight", {frames:[0,1,2,3]}), frameRate: 5, repeat: -1,}
        );
        this.anims.create(
            {key: "ProfesorRight",
            frames: this.anims.generateFrameNumbers("PrRight", {frames:[0,1,2,3]}), frameRate: 5, repeat: -1,}
        );
        //#endregion

        //#region Objetos
        this.anims.create(
            {key:'keyIdle',
                frames: this.anims.generateFrameNumbers('llaveMapa', {frames:[0,1,2,1]}), frameRate: 4, repeat:-1,
            }
        );
        //#endregion

        //#region Inventario
        this.anims.create(
            {key: 'SlotSelected',
            frames: this.anims.generateFrameNumbers('slot', {frames:[1,2]}), frameRate: 2, repeat: -1,}
        );

        this.anims.create(
            {key: 'SlotIdle',
            frames: this.anims.generateFrameNumbers('slot', {frames:[0]}), frameRate: 2, repeat: -1,}
        );
        //#endregion
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