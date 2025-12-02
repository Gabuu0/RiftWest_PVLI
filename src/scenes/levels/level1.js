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
        Paredes2.setDepth(3);   
        
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
        //INTERFAZ
         //MAPS
         this.daphneMap = this.add.image(580, 150, "daphneMap").setVisible(false);
         this.daphneMap.setDepth(10);   
         this.daphneMap.setScrollFactor(0);
         this.percivalMap = this.add.image(250, 150, "percivalMap").setVisible(false);
         this.percivalMap.setDepth(10);   
         this.percivalMap.setScrollFactor(0);
         //ABILITIES
         this.percivalAbility = this.add.image(60, 480, "percivalAbilityReady");
         this.percivalAbility.setScale(0.4);
         this.percivalAbility.setDepth(4);   
         this.percivalAbility.setScrollFactor(0);
         
         this.daphneAbility = this.add.image(480, 480, "daphneAbilityReady");
         this.daphneAbility.setScale(0.4);
         this.daphneAbility.setDepth(4);   
        this.daphneAbility.setScrollFactor(0);
         //HEADERS
         this.percivalHeader = this.add.image(60,50,"percivalHead").setScale(0.4).setDepth(10).setScrollFactor(0);
         this.daphneHeader = this.add.image(480,50,"daphneHead").setScale(0.4).setDepth(10).setScrollFactor(0);

         this.percivalMapIcon =this.add.image(85, 50, "percivalMapEnabled").setScrollFactor(0).setDepth(10).setScale(0.4);

         this.daphneMapIcon =this.add.image(455, 50, "daphneMapEnabled").setScrollFactor(0).setDepth(10).setScale(0.4);

         
         this.cooldowns = {
         percival: 0,
         daphne: 0
        };

        this.skillCooldownTime = 3000; // 3 segundos o lo que quieras

        // Mensajes flotantes
        this.msgPercival = this.add.text(100, 500, "", {
            fontSize: "16px",
            color: "hsla(280, 3%, 82%, 1.00)",
            fontStyle: "bold"
        }).setScrollFactor(0).setDepth(2);

        this.msgDaphne = this.add.text(220, 500, "", {
            fontSize: "16px",
            color: "hsla(280, 3%, 82%, 1.00)",
            fontStyle: "bold"
        }).setScrollFactor(0).setDepth(2);

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
        // Cada cámara ignora el mensaje del otro jugador
       
        this.percivalCam.ignore(this.msgDaphne);
        this.percivalCam.ignore(this.daphneHeader);
        this.percivalCam.ignore(this.daphneAbility);
        this.percivalCam.ignore(this.daphneMapIcon);
        this.percivalCam.ignore(this.daphneMap);
        
        this.daphneCam.ignore(this.msgPercival);
        this.daphneCam.ignore(this.percivalHeader);
        this.daphneCam.ignore(this.percivalAbility);
        this.daphneCam.ignore(this.percivalMapIcon);
        this.daphneCam.ignore(this.percivalMap);


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
        //#region interfaz
        this.load.image('daphneMapEnabled', 'sprites/images/daphne/mapIcon.png');
        this.load.image('percivalMapEnabled', 'sprites/images/percival/mapIcon.png');
        this.load.image('daphneMap', 'sprites/images/daphne/mapLevel1.png');
        this.load.image('percivalMap', 'sprites/images/percival/mapLevel1.png');

        this.load.image('daphneAbilityReady', 'sprites/images/daphne/abilityEnabled.png');
        this.load.image('daphneAbilityUsed', 'sprites/images/daphne/abilityDisabled.png');
        this.load.image('percivalAbilityReady', 'sprites/images/percival/abilityEnabled.png');
        this.load.image('percivalAbilityUsed', 'sprites/images/percival/abilityDisabled.png');

        this.load.image('daphneHead', 'sprites/images/daphne/head.png');
        this.load.image('percivalHead', 'sprites/images/percival/head.png');

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

    UseAbility(playerName, object, action) {
        const now = this.time.now;

        const abilityIcon = playerName === "percival" ? this.PercivalAbility : this.daphneAbility;
        const readyTexture = playerName === "percival" ? "percivalAbilityReady" : "daphneAbilityReady";
        const usedTexture = playerName === "percival" ? "percivalAbilityUsed" : "daphneAbilityUsed";
        const msg = playerName === "percival" ? this.msgPercival : this.msgDaphne;

        if (now < this.cooldowns[playerName]) {
            msg.setText("Habilidad recargando...");
            this.time.delayedCall(this.skillCooldownTime, () => msg.setText(""));
            return;
        }

        if (playerName === "percival") {
            if (action.inRange) {object.breakObject(); 
            this.cooldowns[playerName] = now + this.skillCooldownTime;
            abilityIcon.setTexture(usedTexture);
            this.time.delayedCall(this.skillCooldownTime, () => abilityIcon.setTexture(readyTexture));
            }
            else {
                    msg.setText("No hay nada que romper.");
                    this.time.delayedCall(1000, () => msg.setText(""));
                } 
        } 
        else if (playerName === "daphne") {
            if (action.isDropping) {
                     object.restartCoolDown(); // esto hace toggle, deja el objeto
                    this.cooldowns[playerName] = now + this.skillCooldownTime;
                    abilityIcon.setTexture(usedTexture);
                    this.time.delayedCall(this.skillCooldownTime, () => abilityIcon.setTexture(readyTexture));
                }
            else if(action.inRange){
                object.restartCoolDown();
            }
            else {
                    // por si acaso: mensaje corto (opcional)
                    msg.setText("No estás agarrando nada.");
                    this.time.delayedCall(1000, () => msg.setText(""));
                }
            
        }
    }

    showMessage(text) {
        this.messageText.setText(text);
        this.messageText.setVisible(true);

        this.scene.time.delayedCall(1000, () => {
            this.messageText.setVisible(false);
        });
    }

    showMap(playerName){
        console.log("HOLAAAAAA");
        if(this.playerName === "daphne"){ this.daphneMap.setVisible(!this.daphneMap.visible()); }
        //else { this.percivalMap.setVisible(true); }
    }
    
}