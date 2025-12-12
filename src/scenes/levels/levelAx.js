import Players from '../../players/players.js'
import Movement from '../../players/movement.js'
import Key from "../../objects/mapObjects/key.js";
import InteractableObjects from '../../objects/mapObjects/interactableObjects.js';
import movableObject from '../../objects/mapObjects/movableObject.js';
import breakableObjects from '../../objects/mapObjects/breakableObjects.js'
import DialogText from "../../objects/playerObjects/dialogText.js";
import Watchman from "../../objects/mapObjects/watchman.js";
import PreassurePlate from '../../objects/mapObjects/preassurePlate.js';
import EndTrigger from '../../objects/mapObjects/endTrigger.js';
import Door from '../../objects/mapObjects/door.js';

export default class LevelAx extends Phaser.Scene {
    constructor(){
        super({key: "levelAx"});
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
        this.setCamerasIgnores()

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
        this.map = this.make.tilemap({ key: 'mapLevelAxel' });
        const tileset1 = this.map.addTilesetImage('TileSetPJ', 'tilesPJ');
        const tilesetD = this.map.addTilesetImage('DustwartsTileset', 'tilesD');
        const tilesetM = this.map.addTilesetImage('MagwartsTileset', 'tilesM');
        const tilesetDec = this.map.addTilesetImage('decoration', 'tilesDecoration');
        this.tilesets = [tileset1, tilesetD, tilesetM, tilesetDec];

        const Suelo = this.addMapLayer('suelo',false);
        const Paredes = this.addMapLayer('paredes',true);
        const Paredes2 = this.addMapLayer('paredes(sin_colision)',false);
        Paredes2.setDepth(3);  
        //#endregion 

        this.createTileMapObjects();
        
        this.createWatchmans();
        
        this.createItems(Paredes);

        this.createCollisions(Paredes);
        
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
        this.percival = new Players(this, 1240, 1800, "P", 0, "percival");
        this.daphne = new Players(this, 4520, 1800, "D", 0, "daphne");
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
    
    // 1. Capa de Puertas
    const doorsLayer = this.map.getObjectLayer('puertas');
    if (doorsLayer && doorsLayer.objects) { // ¡Comprobación de seguridad!
        doorsLayer.objects.forEach(obj => {
            const idProp = obj.properties.find(prop => prop.name === 'identifier');
            const typeProp = obj.properties.find(prop => prop.name === 'doorType');
            
            let id = idProp ? idProp.value : 0;
            let doorType = typeProp ? typeProp.value : 0;
            
            let door = new Door(this, obj.x, obj.y, 'doors', doorType, obj.rotation, id);
            this.scaleObject(door, scaling);
            if (obj.rotation == 0) {
                door.setOrigin(0, 1);
            }
            this.doors.add(door);
        });
    }

    this.preassurePlates = this.add.group();
    
    // 2. Capa de Placas de Presión
    const platesLayer = this.map.getObjectLayer('placas_presion');
    if (platesLayer && platesLayer.objects) { // ¡Comprobación de seguridad!
        platesLayer.objects.forEach(obj => {
            const idProp = obj.properties.find(prop => prop.name === 'identifier');
            let id = idProp ? idProp.value : 0;
            
            let plate = new PreassurePlate(this, obj.x, obj.y, 'preassurePlate', id);
            plate.setScale(scaling);
            this.scaleObject(plate, scaling);
            this.preassurePlates.add(plate);
        });
    }

    this.endTriggers = [];
    
    // 3. Capa de EndTriggers
    const endTLayer = this.map.getObjectLayer('endTrigger');
    if (endTLayer && endTLayer.objects) { // ¡Comprobación de seguridad!
        endTLayer.objects.forEach(obj => {
            let endT = new EndTrigger(this, obj.x, obj.y, 'preassurePlate');
            endT.setScale(scaling);
            this.scaleObject(endT, scaling);
            endT.setOrigin(0, 1);
            this.endTriggers.push(endT);
        });
    }
}
    
        /**
         * Crea todos los vigilantes con sus respectivos paths
         */
        createWatchmans() {
         
            const {teacherPathPoints,sheriffPathPoints } = createWatchmansPaths();
            this.watchmans = this.add.group();
            // Crea el vigilante y lo sigue
            this.profesor = new Watchman(this,4920, 1880,"S",0,this.daphne,teacherPathPoints, "profesor");
            this.sheriff = new Watchman(this,1640, 1320,"Pr",0,this.percival,sheriffPathPoints, "sheriff");
    
            this.watchmans.add(this.sheriff);
            this.watchmans.add(this.profesor);
            
            function createWatchmansPaths() {
                const sheriffPathPoints = [    
                { x: 1640, y: 1320 },
                { x: 1880, y: 1320 },
                { x: 1880, y: 1560 },
                { x: 1640, y: 1560 },
                { x: 1640, y: 1880 },
                { x: 1880, y: 1880 },
                { x: 1880, y: 1640 }, 
                { x: 1640, y: 1640 } ];
    
                const teacherPathPoints = [
                { x: 4920, y: 1880 },
                { x: 5160, y: 1880 },
                { x: 5160, y: 1640 },
                { x: 4920, y: 1640 },
                { x: 4920, y: 1320 },
                { x: 5160, y: 1320 },
                { x: 5160, y: 1560 },
                { x: 4920, y: 1560 } ];
    
                
                return { teacherPathPoints, sheriffPathPoints };
            }
        }
    
        /**
         * Crea todos los objetos del mapa que no estan en el tilemap
         * @param {*} Paredes 
         */
        createItems(Paredes){
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
        }
    
        /**
         * Este metodo establece todas las colisiones necesarias entre objetos 
         * Se le pasan las layers con las que se pueda colisionar (mirar en la 
         * @param {TilemapLayer} Paredes 
         * @param {TilemapLayer} Decoracion 
         */
        createCollisions(Paredes) {
            this.physics.add.collider(this.players,Paredes);
            this.physics.add.collider(this.players,this.doors,(jugador,puerta)=>{
                //si el jugador tiene un item con el mismo identificador que la puerta esta se destruye
                if(jugador.haveItem(puerta.identifier)){
                    this.doors.getChildren().forEach(door =>{
                        if(door.identifier === puerta.identifier){
                            door.destroy(true);
                        }
                    });
                }   
            });
            this.physics.add.overlap(this.players,this.preassurePlates,(jugador,placa)=>{
                //se miran las puertas y si alguna tiene el mismo identificador que la placa se abre
                this.doors.getChildren().forEach(door =>{
                    if(door.identifier === placa.identifier){
                        door.openDoor();
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
        }
    
        /**
         * Este metodo crea el texto de dialogo el cual se usara posteriormente para mostrar los mensajes del payaso
         */
        createDialog() {
            this.dialog = new DialogText(this, { camera: this.percivalCam });
            this.dialog.setDepth(10);
    
            this.dialog.setTextArray([
                [1, "Otro piso más… ¿y tú sigues siendo tan difícil de alcanzar?"],
                [2, "Dejate de tonterias Percival, puto mago torpe."],
                [2, "Escucho al Director de fondo, sera mejor que le esquivemos"],
                [1, "Lo que tu digas, pero date prisa que yo habia quedado para cenar y jugar al fifa."]
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
                [playerToIgnore,this.clownLast[this.random.integerInRange(0, this.clownLast.length-1)]]
            ],true);
        }else if(!itemReceived && hadItem && clownEmpty){
             this.dialog.setTextArray([
                [playerToIgnore,this.clownGiveItemJokes[this.random.integerInRange(0, this.clownGiveItemJokes.length-1)]],
                 [playerToIgnore,this.clownLast[this.random.integerInRange(0, this.clownLast.length-1)]]
            ],true);
        }
        else if(itemReceived && hadItem && !clownEmpty){
            this.dialog.setTextArray([
                [playerToIgnore,this.clownNoObjectTaken[this.random.integerInRange(0, this.clownNoObjectTaken.length-1)]],
                 [playerToIgnore,this.clownLast[this.random.integerInRange(0, this.clownLast.length-1)]]
            ],true);
        }
        else if(!itemReceived && !hadItem && clownEmpty){
            this.dialog.setTextArray([
                [playerToIgnore,this.clownNoObjectGiven[this.random.integerInRange(0, this.clownNoObjectGiven.length-1)]],
                 [playerToIgnore,this.clownLast[this.random.integerInRange(0, this.clownLast.length-1)]]
            ],true);
        }
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