import Players from '../../players/players.js'
import Movement from '../../players/movement.js'
import Key from "../../objects/mapObjects/key.js";
import movableObject from '../../objects/mapObjects/movableObject.js';
import breakableObjects from '../../objects/mapObjects/breakableObjects.js'
import DialogText from "../../objects/playerObjects/dialogText.js";
import LiftingPlatform from '../../objects/mapObjects/liftingPlatform.js';
import Door from '../../objects/mapObjects/door.js';
import Lever from '../../objects/mapObjects/lever.js';
import PreassurePlate from '../../objects/mapObjects/preassurePlate.js';
import EndTrigger from '../../objects/mapObjects/endTrigger.js';

export default class LevelGabi extends Phaser.Scene{
    constructor(){
        super({key: "levelGabi"});
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

        //se obtienen los dialogos del payaso
        this.clownJokes =  this.registry.get('clownJokes');
        
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
        
        
        this.map = this.make.tilemap({ key: 'mapLevelGabi' });
        const tileset1 = this.map.addTilesetImage('TileSetPJ', 'tilesPJ');
        const tilesetD = this.map.addTilesetImage('DustwartsTileset', 'tilesD');
        const tilesetD2 = this.map.addTilesetImage('Dustwarts', 'tilesD2');
        const tilesetM = this.map.addTilesetImage('MagwartsTileset', 'tilesM');
        const tilesetM2 = this.map.addTilesetImage('Magwarts', 'tilesM2');
        const tileSetDecoration = this.map.addTilesetImage('decoration', 'tilesDecoration');
        this.tilesets = [tileset1, tilesetD,tilesetD2, tilesetM,tilesetM2,tileSetDecoration];

        const Suelo = this.addMapLayer('suelo',false);
        const Paredes = this.addMapLayer('paredes',true);
        const Paredes2 = this.addMapLayer('paredes(sin_colision)',false);
        const Decoracion = this.addMapLayer('decoracion',true);
        Paredes2.setDepth(3);   
        //#endregion

        this.createTileMapObjects();

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
            this.percival = new Players(this, 200, 1000, "P", 0, "percival");
            this.daphne = new Players(this, 3250, 1000, "D", 0, "daphne");
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
        this.percivalCam.setBounds(130,50,2610,1950);
        this.daphneCam = this.cameras.add(540, 0, 540, 540, 'DaphneCam');
        this.daphneCam.setViewport(540, 0, 540, 540);
        this.daphneCam.startFollow(this.daphne);
        this.daphneCam.setBounds(3160,50,3300,1950);
    }

    //Se crean todos los elementos de la UI de los jugadores (imagenes de las habilidades, mensajes, ect)
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
            let id = obj.properties.find(prop => prop.name === 'identifier').value;
            let doorType = obj.properties.find(prop => prop.name === 'doorType').value;
            let door = new Door(this, obj.x, obj.y, 'doors', doorType, obj.rotation, id);
            this.scaleObject(door, scaling);
            //se mueve el origin en el caso de las puertas puestas en vertical porque sino aparecen descolocadas
            if (obj.rotation == 0) {
                door.setOrigin(0, 1);
            }
            this.doors.add(door);
        });

        this.preassurePlates = this.add.group();
        const platesLayer = this.map.getObjectLayer('placas_presion');
        platesLayer.objects.forEach(obj => {
            let id = obj.properties.find(prop => prop.name === 'identifier').value;
            let plate = new PreassurePlate(this, obj.x, obj.y, 'preassurePlate', id);
            plate.setScale(scaling);
            this.scaleObject(plate, scaling);
            plate.setOrigin(0, 1);
            this.preassurePlates.add(plate);
        });

        this.levers = this.add.group();
        const leversLayer = this.map.getObjectLayer('palancas');
        leversLayer.objects.forEach(obj => {
            let id = obj.properties.find(prop => prop.name === 'identifier').value;
            let lever = new Lever(this, obj.x, obj.y, 'levers', id);
            lever.setScale(scaling);
            this.scaleObject(lever, scaling);
            lever.setOrigin(0, 1);
            this.levers.add(lever);
        });

        /**
        * Las plataformas levadizas tienen el atributo isRaised (boolean) que determina 
        * si su estado inicial es estar levantada o no
        */
        this.liftingPlatforms = this.add.group();
        const liftingPlatformsLayer = this.map.getObjectLayer('plataforma_levadiza');
        liftingPlatformsLayer.objects.forEach(obj =>{
            let id = obj.properties.find(prop => prop.name ==='identifier').value;
            let raised = obj.properties.find(prop => prop.name ==='isRaised').value;
            let liftingPlatform = new LiftingPlatform(this, obj.x, obj.y,'liftingPlatform',0,id,raised);
            liftingPlatform.setScale(scaling);
            this.scaleObject(liftingPlatform,scaling);
            liftingPlatform.setOrigin(0,1);
            this.liftingPlatforms.add(liftingPlatform);
        });

        this.endTriggers = [];
        const endTLayer = this.map.getObjectLayer('endTrigger');
        endTLayer.objects.forEach(obj => {
            let endT = new EndTrigger(this, obj.x, obj.y, 'preassurePlate');
            endT.setScale(scaling);
            endT.setOrigin(0, 1);
            this.scaleObject(endT, scaling);
            this.endTriggers.push(endT);
        });
    }

    /**
     * Crea todos los objetos del mapa que no estan en el tilemap
     * @param {*} Paredes 
     */
    createItems(Paredes){
        this.keys = this.add.group();
        this.llaveHabitacion = this.keys.add(new Key(this, 5250,700,'llaveMapa','llaveInventario','keyIdle','LLave de la habitacion',12).setDepth(5));
        this.llaveHabitacion = this.keys.add(new Key(this, 2640,1500,'llaveMapa','llaveInventario','keyIdle','LLave sala de emergencia',14).setDepth(5));

        this.movableBoxes = this.add.group();
        this.cajaMovible1 = new movableObject(this, 6030, 1200, 2500, 960, "cajaMovible", this.percival, this.daphne, Paredes)
        this.movableBoxes.add(this.cajaMovible1);
        this.cajaMovible2 = new movableObject(this, 5500, 1840, 10000, 10000, "cajaMovible", this.percival, this.daphne, Paredes)
        this.movableBoxes.add(this.cajaMovible2);
        this.cajaRompible1 = new breakableObjects(this,2400, 920, 5940, 1160,'cajaRompible',this.percival,this.daphne);
        this.cajaRompible2 = new breakableObjects(this,2400, 1000, 5940, 1240,'cajaRompible',this.percival,this.daphne);
        this.cajaRompible3 = new breakableObjects(this,1200, 1080, 4280, 1000,'cajaRompible',this.percival,this.daphne);
        this.cajaRompible4 = new breakableObjects(this,1800, 600, 5400, 680,'cajaRompible',this.percival,this.daphne);
        this.cajaRompible5 = new breakableObjects(this,1800, 520, 5400, 760,'cajaRompible',this.percival,this.daphne);
    }

    /**
     * Este metodo establece todas las colisiones necesarias entre objetos 
     * Se le pasan las layers con las que se pueda colisionar (mirar en la 
     * @param {TilemapLayer} Paredes 
     * @param {TilemapLayer} Decoracion 
     */
    createCollisions(Paredes, Decoracion) {
        // this.physics.add.collider(this.players, Paredes);
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
            //se miran las puertas y plataformas, si alguna tiene el mismo identificador que la placa se abre/activa
            this.doors.getChildren().forEach(door => {
                if (door.identifier === placa.identifier) {
                    door.openDoor();
                }
            });
            this.liftingPlatforms.getChildren().forEach(platform => {
                if (platform.identifier === placa.identifier) {
                    platform.activatePlatform();
                }
            });
        });

        this.physics.add.overlap(this.movableBoxes,this.preassurePlates,(box,placa)=>{
            //se miran las puertas y si alguna tiene el mismo identificador que la placa se abre
            this.doors.getChildren().forEach(door => {
                if (door.identifier === placa.identifier) {
                    door.openDoor();
                }
            });

            this.liftingPlatforms.getChildren().forEach(platform => {
                if (platform.identifier === placa.identifier) {
                    platform.activatePlatform();
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
                }
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

        //Colisiones con Plataformas levadizas
        this.physics.add.overlap(this.players,this.liftingPlatforms,(jugador,platform)=>{
            if(!platform.isRaised){
                this.resetSound.play();
                this.music.stop();
                this.scene.restart({clownGetItemJokes:this.clownGetItemJokes,
                clownGiveItemJokes:this.clownGiveItemJokes,
                clownNoObjectGiven: this.clownNoObjectGiven,
                clownNoObjectTaken: this.clownNoObjectTaken,
                clownLast:this.clownLast
                });
            }
        });

        //Colisiones con los triggers de Final de Nivel
        this.physics.add.overlap(this.players, this.endTriggers, (jugador, endT) => {
            endT.on();
            if (this.endTriggers.every(t => t.getIsPressed())) {
                this.scene.stop();
                this.scene.start('levelJavi');
            }
        });
    }

    /**
     * Crea todos los sonidos que se van a usar 
     */
    createSounds() {
        this.walkSound = this.sound.add('pasos', { loop: false });
        this.breakSound = this.sound.add('romper');
        this.resetSound = this.sound.add('reset', { loop: false, volume: 0.3 });
        this.music = this.sound.add('musicaLevelGabi', { loop: true, volume: 0.2 });
    }

    /**
     * Este metodo crea el texto de dialogo el cual se usara posteriormente para mostrar los mensajes del payaso
    */
    createDialog() {
        this.dialog = new DialogText(this, { camera: this.percivalCam });
        this.dialog.setDepth(10);

        this.dialog.setTextArray([
            [1, "Daphne… ¿me escuchas?"],
            [2, "¡Perci! ¿Dónde estás?"],
            [1, "No sé cómo explicarlo… creo que un hechizo me ha teletransportado a otra dimensión."],
            [2, "¿Otra dimensión? ¡Eso suena peligroso!"],
            [1, "Sí… todo se ve raro aquí, distinto… es como si estuviera en el salvaje oeste."],
            [2, "Ten cuidado… no sé como vamos a hacer para traerte de vuelta."],
            [1, "Lo primero sera encontrar un hechizo que lo haga, ¡Busquemoslo!"]
        ], true);
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
                [playerToIgnore,this.clownJokes.getItem[this.random.integerInRange(0, this.this.clownJokes.getItem.length-1)]],
                [playerToIgnore,this.clownJokes.last[this.random.integerInRange(0, this.clownJokes.last.length-1)]]
            ],true);
        }else if(!itemReceived && hadItem && clownEmpty){
             this.dialog.setTextArray([
                [playerToIgnore,this.clownJokes.giveItem[this.random.integerInRange(0, this.clownJokes.giveItem.length-1)]],
                 [playerToIgnore,this.clownJokes.last[this.random.integerInRange(0, this.clownJokes.last.length-1)]]
            ],true);
        }
        else if(itemReceived && hadItem && !clownEmpty){
            this.dialog.setTextArray([
                [playerToIgnore,this.clownJokes.noItemTaken[this.random.integerInRange(0, this.clownJokes.noItemTaken.length-1)]],
                 [playerToIgnore,this.clownJokes.last[this.random.integerInRange(0, this.clownJokes.last.length-1)]]
            ],true);
        }
        else if(!itemReceived && !hadItem && clownEmpty){
            this.dialog.setTextArray([
                [playerToIgnore,this.clownJokes.noItemGiven[this.random.integerInRange(0, this.clownJokes.noItemGiven.length-1)]],
                 [playerToIgnore,this.clownJokes.last[this.random.integerInRange(0, this.clownJokes.last.length-1)]]
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
        object.y += (object.height*scaling);
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