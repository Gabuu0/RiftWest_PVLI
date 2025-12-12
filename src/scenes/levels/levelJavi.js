import Players from '../../players/players.js'
import Movement from '../../players/movement.js'
import Key from "../../objects/mapObjects/key.js";
import movableObject from '../../objects/mapObjects/movableObject.js';
import Watchman from '../../objects/mapObjects/watchman.js';
import breakableObjects from '../../objects/mapObjects/breakableObjects.js'
import KnockableObject from '../../objects/mapObjects/knockableObject.js';
import EndTrigger from '../../objects/mapObjects/endTrigger.js';
import DialogText from "../../objects/playerObjects/dialogText.js";
import LiftingPlatform from '../../objects/mapObjects/liftingPlatform.js';
import Door from '../../objects/mapObjects/door.js';
import Lever from '../../objects/mapObjects/lever.js';
import PreassurePlate from '../../objects/mapObjects/preassurePlate.js';

export default class LevelJavi extends Phaser.Scene{
    constructor(){
        super({key: "levelJavi"});
    }

    init(data){
        this.clownGetItemJokes = data.clownGetItemJokes;
        this.clownGiveItemJokes = data.clownGiveItemJokes;
        this.clownNoObjectGiven = data.clownNoObjectGiven;
        this.clownNoObjectTaken = data.clownNoObjectTaken;
        this.clownLast = data.clownLast;
    }

    create(){
        this.setInputs();

        //random que se utiliza para elegir los textos del payaso
        this.random = new Phaser.Math.RandomDataGenerator();
        
        //se resetea el registro del payaso al crear el nivel para evitar que pueda tener objetos de otros niveles
        this.registry.set('clownObj', {
            objData: {},
            hasObj: false,
        });

        this.createPlayers();
        
        this.createCameras();
        this.createUI();
        this.setCamerasIgnores();

        //#region AbilitiesCooldowns
        //se resetean los cooldowns de las habilidades de los players
        this.cooldowns = {
         percival: 0,
         daphne: 0
        };
        //cooldown de ambas habilidades
        this.skillCooldownTime = 3000; 
        //#endregion
        
        this.createInventoryScenes();
        this.getScenes();

        //#region Creacion Mapa
        this.map = this.make.tilemap({ key: 'mapLevelJavi' });
        const tileset1 = this.map.addTilesetImage('tileSet1', 'tilesPJ');
        const tilesetD = this.map.addTilesetImage('dustwartsTileset', 'tilesD');
        const tilesetM = this.map.addTilesetImage('magwartsTileset', 'tilesM');
        const tileSetDecoration = this.map.addTilesetImage('Decoration', 'tilesDecoration');
        this.tilesets = [tileset1, tilesetD, tilesetM, tileSetDecoration];

        const Suelo = this.addMapLayer('suelo',false);
        const Paredes = this.addMapLayer('paredes',true);
        Paredes.setDepth(0.6);
        const Paredes2 = this.addMapLayer('paredes(SinColision)',false);
        const Decoracion = this.addMapLayer('decoracion',true);
        Decoracion.setDepth(0.6);
        Paredes2.setDepth(3);   
        //#endregion
       
        this.createTileMapObjects();

        this.createWatchmans();

        this.createItems(Paredes);

        this.createCollisions(Paredes, Decoracion);

        this.createDialog();

        this.createSounds();
    }
    //#region Metodos llamados en el create
     /**
     * Establece los inputs que va a escuchar la escen
     */
    setInputs() {
        this.input.keyboard.enabled = true;

        this.input.keyboard.on('keydown-ESC', () => {
            console.log('ESC pulsado');
            this.scene.launch('pauseMenu'); // Lanza el menú
            this.pauseMenu.setLevel(this.scene.key);
            this.scene.pause(); // Pausa la escena del juego
        });

        this.input.keyboard.on('keydown', (event) => {
            // Evita que el navegador use las teclas (por ejemplo, mover scroll o cursor)
            event.preventDefault();

        });
    }

    /**
     * Crea los jugadores, los añade a un grupo y crea el movimiento de ambos
     */
    createPlayers() {
        this.percival = new Players(this, 930, 3400, "P", 0, "percival");
        this.daphne = new Players(this, 3100, 3400, "D", 0, "daphne");
        this.players = this.add.group();
        this.players.add(this.percival);
        this.players.add(this.daphne);
        this.percival.setDepth(1);
        this.daphne.setDepth(1);

        this.movementController = new Movement(this, this.percival, this.daphne);
    }

    /**
     * Crea las camaras de los jugadores
     */
    createCameras() {
        this.percivalCam = this.cameras.main;
        this.percivalCam.setViewport(0, 0, 540, 540);
        this.percivalCam.startFollow(this.percival);
        this.daphneCam = this.cameras.add(540, 0, 540, 540, 'DaphneCam');
        this.daphneCam.setViewport(540, 0, 540, 540);
        this.daphneCam.startFollow(this.daphne);
    }

    /**
     * Se crean todos los elementos de la UI de los jugadores (imagenes de las habilidades, mensajes, ect)
     */
    createUI() {
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
        this.percivalHeader = this.add.image(60, 50, "percivalHead").setScale(0.4).setDepth(10).setScrollFactor(0);
        this.daphneHeader = this.add.image(480, 50, "daphneHead").setScale(0.4).setDepth(10).setScrollFactor(0);

        this.percivalMapIcon = this.add.image(85, 50, "percivalMapEnabled").setScrollFactor(0).setDepth(10).setScale(0.4);
        this.daphneMapIcon = this.add.image(455, 50, "daphneMapEnabled").setScrollFactor(0).setDepth(10).setScale(0.4);
    }

    /**
     * Se establecen los ignore de las camaras, en general la camara de cada jugador ignora la HUD de la del otro
     */
    setCamerasIgnores() {
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
   
    /**
     * Crea/lanza las escenas de inventarios y les pasa los personajes de cada una
     */
    createInventoryScenes() {
        this.scene.launch('InventarioPercival', {
            player: this.percival,
            playerScene: this
        });
        this.scene.launch('InventarioDaphne', {
            player: this.daphne,
            playerScene: this
        });

        this.scene.sleep('InventarioPercival');
        this.scene.sleep('InventarioDaphne');
    }

    /**
     *Obtiene las escenas de las cuales es necesario llamar métodos en algun momento 
     */
    getScenes() {
        this.inventario1 = this.scene.get('InventarioPercival');
        this.inventario2 = this.scene.get('InventarioDaphne');
        this.pauseMenu = this.scene.get('pauseMenu');
    }

    /**
     * Se obtienen las layers de los objetos para acceder a los objetos de cada una
     * en cada layer se busca la propiedad identifier de cada objeto, en el caso de las puertas tambien se busca su tipo 
     *      -identifier(int): identificador usado para abrir las puertas segun el mismo, las puertas se abriran si se interactua con un objeto con el mismo identificador
     *      -doorType(int): tipo de puerta usado para saber que frame del spriteSheet de puertas usar
     * Ademas se agrupa cada tipo de objeto en un grupo y se escala el objeto(tanto el tamaño como la posicion)
     */
    createTileMapObjects() {
        const scaling = 5;
        this.doors = this.add.group();
        const doorsLayer = this.map.getObjectLayer('puertas');
        doorsLayer.objects.forEach(obj => {
            let id = obj.properties.find(prop => prop.name === 'Identifier').value;
            let doorType = obj.properties.find(prop => prop.name === 'doorType').value;
            let door = new Door(this, obj.x, obj.y, 'doors', doorType, obj.rotation, id);
            this.scaleObject(door, scaling);
            door.setDepth(0.7);
            //se mueve el origin en el caso de las puertas puestas en vertical porque sino aparecen descolocadas
            if (obj.rotation == 0) {
                door.setOrigin(0, 1);
            }
            this.doors.add(door);
        });

        this.preassurePlates = this.add.group();
        const platesLayer = this.map.getObjectLayer('placas_presion');
        platesLayer.objects.forEach(obj => {
            let id = obj.properties.find(prop => prop.name === 'Identifier').value;
            let plate = new PreassurePlate(this, obj.x, obj.y, 'preassurePlate', id);
            plate.setScale(scaling);
            this.scaleObject(plate, scaling);
            plate.setOrigin(0, 1);
            this.preassurePlates.add(plate);
        });

        this.levers = this.add.group();
        const leversLayer = this.map.getObjectLayer('levers');
        leversLayer.objects.forEach(obj => {
            let id = obj.properties.find(prop => prop.name === 'Identifier').value;
            let lever = new Lever(this, obj.x, obj.y, 'levers', id);
            lever.setScale(scaling);
            this.scaleObject(lever, scaling);
            lever.setOrigin(0, 1);
            this.levers.add(lever);
        });

        this.knockObjects = this.add.group();
        const knockObject = this.map.getObjectLayer('tirables');
        knockObject.objects.forEach(obj => {
            let kObject = new KnockableObject(this, obj.x + 10, obj.y, 'knockableObject');
            kObject.setScale(scaling);
            this.scaleObject(kObject, scaling);
            this.knockObjects.add(kObject);
        });


        this.endTriggers = [];
        const endTLayer = this.map.getObjectLayer('endTrigger');
        endTLayer.objects.forEach(obj => {
            let endT = new EndTrigger(this, obj.x, obj.y, 'preassurePlate');
            endT.setScale(scaling);
            this.scaleObject(endT, scaling);
            endT.setOrigin(0, 1);
            this.endTriggers.push(endT);
        });
    }

    /**
     * Crea todos los vigilantes con sus respectivos paths
     */
    createWatchmans() {
        const { sheriff1PathPoints, sheriff2PathPoints, teacher1PathPoints } = createWatchmansPaths();
        this.watchmans = this.add.group();
        // Crea el vigilante y lo sigue
        this.Sheriff1 = new Watchman(
            this,
            sheriff1PathPoints[0].x,
            sheriff1PathPoints[0].y,
            'sheriffSprite',
            0,
            this.percival,
            sheriff1PathPoints,
            "sheriff"
        );

        this.Sheriff2 = new Watchman(
            this,
            sheriff2PathPoints[0].x,
            sheriff2PathPoints[0].y,
            'sheriffSprite',
            0,
            this.percival,
            sheriff2PathPoints,
            "sheriff"
        );
        this.Teacher1 = new Watchman(
            this,
            teacher1PathPoints[0].x,
            teacher1PathPoints[0].y,
            'profesorSprite',
            0,
            this.daphne,
            teacher1PathPoints,
            "profesor"
        );

        this.watchmans.add(this.Sheriff1);
        this.watchmans.add(this.Sheriff2);
        this.watchmans.add(this.Teacher1);
        
        function createWatchmansPaths() {
            const sheriff1PathPoints = [
                { x: 920, y: 2680 },
                { x: 920, y: 2360 },
                { x: 1480, y: 2360 },
                { x: 1480, y: 2040 },
                { x: 1480, y: 2360 },
                { x: 920, y: 2360 },
            ];

            const sheriff2PathPoints = [
                { x: 1800, y: 3000 },
                { x: 1800, y: 2360 },
                { x: 1800, y: 2120 }
            ];

            const teacher1PathPoints = [
                { x: 3960, y: 3000 },
                { x: 3960, y: 2560 },
                { x: 3960, y: 2360 },
                { x: 3960, y: 2120 },
                { x: 3960, y: 2360 },
                { x: 3960, y: 2560 },
            ];
            return { sheriff1PathPoints, sheriff2PathPoints, teacher1PathPoints };
        }
    }

    /**
     * Crea todos los objetos del mapa que no estan en el tilemap
     * @param {*} Paredes 
     */
    createItems(Paredes){
        this.keys = this.add.group();
        this.llavePasillo = this.keys.add(new Key(this, 1800,3000,'llaveMapa','llaveInventario','keyIdle','LLave del pasillo',2).setDepth(5));
        this.llaveComedor = this.keys.add(new Key(this, 3960,1600,'llaveMapa','llaveInventario','keyIdle','LLave del comedor',7).setDepth(5));
        this.cajaM1 = new movableObject(this, 3800, 2120, 1640, 2120, "cajaMovible", this.percival, this.daphne, Paredes)
        this.cajaR1 = new breakableObjects(this,1080, 2680, 3240, 2680,'cajaRompible',this.percival,this.daphne);
        this.cajaR2 = new breakableObjects(this,1080, 2600, 3240, 2600,'cajaRompible',this.percival,this.daphne);
    }

    /**
     * Este metodo establece todas las colisiones necesarias entre objetos 
     * Se le pasan las layers con las que se pueda colisionar (mirar en la 
     * @param {TilemapLayer} Paredes 
     * @param {TilemapLayer} Decoracion 
     */
    createCollisions(Paredes, Decoracion) {
        this.physics.add.collider(this.players, Paredes);
        this.physics.add.collider(this.players, Decoracion);

        //Colisiones con Puertas
        this.physics.add.collider(this.players, this.doors, (jugador, puerta) => {
            //si el jugador tiene un item con el mismo identificador que la puerta esta se destruye
            if (jugador.haveItem(puerta.identifier)) {
                this.doors.getChildren().forEach(door => {
                    if (door.identifier === puerta.identifier) {
                        door.destroy(true);
                    }
                });
            }
        });

        //Colisiones con Placas de Presion
        this.physics.add.overlap(this.players, this.preassurePlates, (jugador, placa) => {
            //se miran las puertas y si alguna tiene el mismo identificador que la placa se abre
            this.doors.getChildren().forEach(door => {
                if (door.identifier === placa.identifier) {
                    door.openDoor();
                }
            });
        });

        //Colisiones con Palancas
        this.physics.add.overlap(this.players, this.levers, (jugador, lever) => {
            //se miran las puertas y si alguna tiene el mismo identificador que la palanca se abre
            this.doors.getChildren().forEach(door => {
                if (door.identifier === lever.identifier) {
                    door.destroy(true);
                    lever.useLever();
                    //se recorren todos los vigilantes y se les aumenta su collider
                    this.watchmans.getChildren().forEach(watchman => {
                    watchman.triggerSize(160);
                    });
                }
            });
        });

        //Colisiones con Objetos Tirables
        this.physics.add.collider(this.players, this.knockObjects, (jugador, kObject) => {
            kObject.knock();
            //se recorren todos los vigilantes y se les aumenta su collider
            this.watchmans.getChildren().forEach(watchman => {
            watchman.triggerSize(160);
            });
        });

        //Colisiones con LLaves
        this.physics.add.overlap(this.players, this.keys, (jugador, llave) => {
            //se elimina la llave si es posible cogerla (inventario del jugador no lleno)
            if (jugador.pickItem(llave)) {
                this.events.emit('itemPickedP', llave);
                llave.destroy();
            }
        });

        //Colisiones con los triggers de Final de Nivel
        this.physics.add.overlap(this.players, this.endTriggers, (jugador, endT) => {
            endT.on();
            if (this.endTriggers.every(t => t.getIsPressed())) {
                this.scene.stop();
                this.scene.start('levelGabi');
            }
        });
    }

    /**
     * Este metodo crea el texto de dialogo el cual se usara posteriormente para mostrar los mensajes del payaso
     */
    createDialog() {
        this.dialog = new DialogText(this, { camera: this.percivalCam });
        this.dialog.setDepth(10);

        this.dialog.setTextArray([
            [1, "Bryant Myers"],
            [2, "Hoy de nuevo te voy a ver (Anonimus, this is the remix)"],
            [0, "Si llaman, pichea el cel (Anuel, Almighty)"],
            [1, "Estamos fumando marihuana (Maybach Música)"],
            [2, "Hoy serás mi esclava en el cuarto de un motel (Carbon Fiber Music)"]
        ], true);
    }

    /**
     * Crea todos los sonidos que se van a usar 
     */
    createSounds() {
        this.walkSound = this.sound.add('pasos', { loop: false });
        this.breakSound = this.sound.add('romper');
        this.resetSound = this.sound.add('reset', { loop: false, volume: 0.3 });
        this.music = this.sound.add('musicaLevelJavi', { loop: true, volume: 0.7 });
    }
    //#endregion
    

    update(t, dt){
        if (this.movementController) {
            this.movementController.update();
        }
        this.updateSounds();
    }
    

    /**
     * Este metodo se encarga de crear el dialogo del payaso al interactuar con él según los siguientes parámetros:
     * @param {string} player - Personaje que ha interactuado con el payaso 
     * @param {boolean} itemReceived - Si el personaje ha recibido un objeto del payaso 
     * @param {boolean} hadItem - Si el personaje tiene un item seleccionado (en caso de dar un item al payaso)
     * @param {boolean} clownEmpty - Si el payaso no tiene ningun objeto
     * 
     * Se usan los arrays de dialogos creados en {@link createClownDialogs()}
     */
    showClownMessage(player,itemReceived,hadItem = true,clownEmpty = false){
        if(this.dialog.visible){
            this.dialog.toggleWindow();
        }

        let ignorePlayer;
        if(player === "percival"){
            ignorePlayer = 1;
        }else{
            ignorePlayer = 2;
        }
         
        this.dialog.toggleWindow();

        this.setClownMessage(ignorePlayer,itemReceived,hadItem,clownEmpty);
    }
    /**
     * Establece el texto del dialogo del payaso al interactuar con él
     * @param {boolean} itemReceived - Si el personaje ha recibido un objeto del payaso 
     * @param {boolean} hadItem - Si el personaje tiene un item seleccionado (en caso de dar un item al payaso)
     * @param {boolean} clownEmpty - Si el payaso no tiene ningun objeto
     */
    setClownMessage(playerToIgnore,itemReceived,hadItem,clownEmpty){
        if(itemReceived && !hadItem && !clownEmpty){
            this.dialog.setTextArray([
                [playerToIgnore,this.clownGetItemJokes[this.random.integerInRange(0, this.clownGetItemJokes.length-1)]],
                [playerToIgnore,this.clownLast[this.random.integerInRange(0, this.clownLast.length)]]
            ],true);
        }else if(!itemReceived && hadItem && clownEmpty){
             this.dialog.setTextArray([
                [playerToIgnore,this.clownGiveItemJokes[this.random.integerInRange(0, this.clownGiveItemJokes.length-1)]],
                 [playerToIgnore,this.clownLast[this.random.integerInRange(0, this.clownLast.length)]]
            ],true);
        }
        else if(itemReceived && hadItem && !clownEmpty){
            this.dialog.setTextArray([
                [playerToIgnore,this.clownNoObjectTaken[this.random.integerInRange(0, this.clownNoObjectTaken.length-1)]],
                 [playerToIgnore,this.clownLast[this.random.integerInRange(0, this.clownLast.length)]]
            ],true);
        }
        else if(!itemReceived && !hadItem && clownEmpty){
            this.dialog.setTextArray([
                [playerToIgnore,this.clownNoObjectGiven[this.random.integerInRange(0, this.clownNoObjectGiven.length-1)]],
                 [playerToIgnore,this.clownLast[this.random.integerInRange(0, this.clownLast.length)]]
            ],true);
        }
    }
 
    /**
     * Añade al mapa la layer dada y establece si esta tiene colision o no
     * @param {string} name - Key de la layer que se quiere añadir
     * @param {boolean} collision - Si tiene colision o no la layer
     * @returns 
     */
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
        //object.y += (object.height*scaling);
        object.setScale(scaling);
    }

    UseAbility(playerName, object, action) {
        const now = this.time.now;

        const abilityIcon = playerName === "percival" ? this.percivalAbility : this.daphneAbility;
        const readyTexture = playerName === "percival" ? "percivalAbilityReady" : "daphneAbilityReady";
        const usedTexture = playerName === "percival" ? "percivalAbilityUsed" : "daphneAbilityUsed";
        const msg = playerName === "percival" ? this.msgPercival : this.msgDaphne;

        if (now < this.cooldowns[playerName]) {
            msg.setText("Habilidad recargando...");
            console.log();
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

    updateSounds(){
        //SONIDO DE PASOS
        const percivalIsMoving = (this.percival.body.velocity.x !== 0 || this.percival.body.velocity.y !== 0);
        const daphneIsMoving = (this.daphne.body.velocity.x !== 0 || this.daphne.body.velocity.y !== 0);
        const isMoving = percivalIsMoving || daphneIsMoving;

        if (isMoving && !this.walkSound.isPlaying) {
            // Al menos un jugador se mueve y el sonido no está sonando.
            this.walkSound.play();
         } else if (!isMoving && this.walkSound.isPlaying) {
            // Ningún jugador se mueve y el sonido está sonando.
            this.walkSound.pause(); 
         }

         //MUSICA
         if(!this.music.isPlaying){
         this.music.play();
         }
    }
}