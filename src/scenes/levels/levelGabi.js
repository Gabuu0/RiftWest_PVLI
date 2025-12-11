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
        this.random = new Phaser.Math.RandomDataGenerator();

        this.registry.set('clownObj', {
            objData: {},
            hasObj: false,
        });

        this.percival = new Players(this,200, 1000,"P",0,"percival");
        //2500,1000 pos algunas cajas
        this.daphne = new Players(this,3250,1000,"D",0,"daphne");
        this.players = this.add.group();
        this.players.add(this.percival);
        this.players.add(this.daphne);
        
        this.keys = this.add.group();
        this.createItems();

        this.percival.setDepth(1);
        this.daphne.setDepth(1);

        this.scene.launch('InventarioPercival',{
            player:this.percival,
            playerScene: this});
        this.scene.launch('InventarioDaphne',{
            player:this.daphne,
            playerScene: this});
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
        //this.percivalCam.setZoom(0.1);
        this.daphneCam = this.cameras.add(540,0,540,540,'DaphneCam');
        this.daphneCam.setViewport(540,0,540,540);
        this.daphneCam.startFollow(this.daphne);

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

        //#region Creacion de los objetos del mapa (puertas, placas de presion, etc)
        /**
         * Se obtienen las layers de los objetos para acceder a los objetos de cada una
         * en cada layer se busca la propiedad identifier de cada objeto, en el caso de las puertas tambien se busca su tipo 
         *      -identifier(int): identificador usado para abrir las puertas segun el mismo, las puertas se abriran si se interactua con un objeto con el mismo identificador
         *      -doorType(int): tipo de puerta usado para saber que frame del spriteSheet de puertas usar
         * Ademas se agrupa cada tipo de objeto en un grupo y se escala el objeto(tanto el tamaño como la posicion)
         */
        const scaling = 5;
        this.doors = this.add.group();
            const doorsLayer = this.map.getObjectLayer('puertas');
            doorsLayer.objects.forEach(obj =>{
            let id = obj.properties.find(prop => prop.name ==='identifier').value;
            let doorType = obj.properties.find(prop => prop.name ==='doorType').value;
            let door = new Door(this, obj.x, obj.y,'doors',doorType,obj.rotation,id);
            this.scaleObject(door,scaling);
            if(obj.rotation == 0){
                door.setOrigin(0,1);
            }
            this.doors.add(door);
        })

        this.preassurePlates = this.add.group();
        const platesLayer = this.map.getObjectLayer('placas_presion');
        platesLayer.objects.forEach(obj =>{
            let id = obj.properties.find(prop => prop.name ==='identifier').value;
            let plate = new PreassurePlate(this, obj.x, obj.y,'preassurePlate',id);
            plate.setScale(scaling);
            this.scaleObject(plate,scaling);
            plate.setOrigin(0,1);
            this.preassurePlates.add(plate);
        });

        this.levers = this.add.group();
        const leversLayer = this.map.getObjectLayer('palancas');
        leversLayer.objects.forEach(obj =>{
            let id = obj.properties.find(prop => prop.name ==='identifier').value;
            let lever = new Lever(this, obj.x, obj.y,'levers',id);
            lever.setScale(scaling);
            this.scaleObject(lever,scaling);
            lever.setOrigin(0,1);
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

        // this.endTriggers = [];
        // const endTLayer = this.map.getObjectLayer('endTriggers');
        // endTLayer.objects.forEach(obj =>{
        //     let endT = new EndTrigger(this, obj.x, obj.y,'endTrigger');
        //     endT.setScale(scaling);
        //     this.scaleObject(endT,scaling);
        //     this.endTriggers.push(endT);
        // });
        //#endregion

        //#region Colisiones
        this.physics.add.collider(this.players,Paredes);
        this.physics.add.collider(this.players,Decoracion);

        //Colisiones con Puertas
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
        
        //Colisiones con Placas de Presion
        this.physics.add.overlap(this.players,this.preassurePlates,(jugador,placa)=>{
            //se miran las puertas y si alguna tiene el mismo identificador que la placa se abre
            this.doors.getChildren().forEach(door =>{
                if(door.identifier === placa.identifier){
                    door.openDoor();
                }
            });

            this.liftingPlatforms.getChildren().forEach(platform =>{
                if(platform.identifier === placa.identifier){
                    platform.activatePlatform();
                }
            });
        });
        
        //Colisiones con Palancas
        this.physics.add.overlap(this.players,this.levers,(jugador,lever)=>{
            //se miran las puertas y si alguna tiene el mismo identificador que la placa se abre
            this.doors.getChildren().forEach(door =>{
                if(door.identifier === lever.identifier){
                    door.destroy(true);
                    lever.useLever();
                }
            });
        }); 

        this.physics.add.overlap(this.players,this.liftingPlatforms,(jugador,platform)=>{
            console.log('j');
            if(!platform.isRaised){
                console.log('j0');
                this.scene.restart({clownGetItemJokes:this.clownGetItemJokes,
                clownGiveItemJokes:this.clownGiveItemJokes,
                clownNoObjectGiven: this.clownNoObjectGiven,
                clownNoObjectTaken: this.clownNoObjectTaken,
                clownLast:this.clownLast
                });
            }
        });

        //Colisiones con Objetos Tirables
        this.physics.add.collider(this.players,this.knockObjects,(jugador,kObject)=>{
                kObject.knock();
            });

        //Colisiones con LLaves
        this.physics.add.overlap(this.players,this.keys,(jugador,llave)=>{
            //se elimina la llave si es posible cogerla (inventario del jugador no lleno)
            if(jugador.pickItem(llave)) {
                this.events.emit('itemPickedP', llave);
                llave.destroy(); 
            }
        });

        //Colisiones con los triggers de Final de Nivel
        this.physics.add.overlap(this.players,this.endTriggers,(jugador, endT)=>{
            endT.on();
            if (this.endTriggers.every(t => t.getIsPressed())) {
                console.log("3Letra, la L");
            }
        });


        // this.cajaM1 = new movableObject(this, 3140, 3100, 980, 3100, "cajaMovible", this.percival, this.daphne, Paredes)
        // this.cajR1 = new breakableObjects(this,475, 3225, 2625, 3225,'cajaRompible',this.percival,this.daphne);
        
        // this.physics.add.overlap(this.cajaM1, this.preassurePlates, (movableObject,tile) => {InteractableObjects.activarPlaca(this, movableObject, tile)});
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
        
    createItems(){
        this.keys.add(new Key(this, 400,3600,'llaveMapa','llaveInventario','keyIdle','Llave to guapa mi bro',1).setDepth(5))
        this.keys.add(new Key(this, 450,3700,'llaveMapa','llaveInventario','keyIdle','Llave de tu vieja',2).setDepth(5))
        this.keys.add(new Key(this, 425,3800,'llaveMapa','llaveInventario','keyIdle','Llavecita de mi cora',3).setDepth(5))
        this.keys.add(new Key(this, 445,3800,'llaveMapa','llaveInventario','keyIdle','Llave inglesa',3).setDepth(5))
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