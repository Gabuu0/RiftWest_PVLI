import Players from "./players.js";
import Movement from "./movement.js";   
import PauseMenu from "./pauseMenu.js";
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

        this.pText = this.add.text(240, 100, "Percival").setScrollFactor(0);
		this.dText = this.add.text(240, 100, "Daphne").setScrollFactor(0);

        this.percival = new Players(this,350, 3600,"P",0,"percival");
        this.daphne = new Players(this,2500,3600,"D",0,"daphne");

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
        Paredes2.setDepth(1);   
        
        this.physics.add.collider(this.daphne, Paredes);
        this.physics.add.collider(this.daphne, this.Puertas);
        this.physics.add.overlap(this.daphne, PlacasDePresion, (jugador,tile) => {InteractableObjects.activarPlaca(this, jugador, tile)});

        this.physics.add.collider(this.percival, Paredes);
        this.physics.add.collider(this.percival, this.Puertas);
        this.physics.add.overlap(this.percival, PlacasDePresion, (jugador,tile) => {InteractableObjects.activarPlaca(this, jugador, tile)});

        this.cajaM1 = new movableObject(this, 3140, 3100, 980, 3100, "cajaMovible", this.percival, this.daphne, Paredes)
        this.cajR1 = new breakableObjects(this,475, 3225, 2625, 3225,'cajaRompible',this.percival,this.daphne);

        this.physics.add.overlap(this.cajaM1, PlacasDePresion, (movableObject,tile) => {InteractableObjects.activarPlaca(this, movableObject, tile)});
        this.physics.add.overlap(this.cajaM1.obCon, PlacasDePresion, (movableObject,tile) => {InteractableObjects.activarPlaca(this, movableObject, tile)});
    //#endregion

    //INTERFAZ
         this.PercivalAbility = this.add.image(60, 480, "percivalAbilityReady");
         this.PercivalAbility.setScale(0.4);
        this.PercivalAbility.setDepth(2);   
         this.PercivalAbility.setScrollFactor(0);
         
         this.daphneAbility = this.add.image(480, 480, "daphneAbilityReady");
         this.daphneAbility.setScale(0.4);
         this.daphneAbility.setDepth(2);   
         this.daphneAbility.setScrollFactor(0);

        this.cooldowns = {
        percival: 0,
        daphne: 0
        };

        this.skillCooldownTime = 3000; // 3 segundos o lo que quieras

        this.events.on("tryAbility", this.UseAbility, this);

        // Mensajes flotantes
        this.msgPercival = this.add.text(100, 500, "", {
            fontSize: "16px",
            color: "hsla(280, 3%, 82%, 1.00)",
            fontStyle: "bold"
        }).setScrollFactor(0).setDepth(10);

        this.msgDaphne = this.add.text(220, 500, "", {
            fontSize: "16px",
            color: "hsla(280, 3%, 82%, 1.00)",
            fontStyle: "bold"
        }).setScrollFactor(0).setDepth(10);

        // Cada cámara ignora el mensaje del otro jugador
        this.percivalCam.ignore(this.msgDaphne);
        this.percivalCam.ignore(this.daphneAbility);
        this.daphneCam.ignore(this.msgPercival);
        this.daphneCam.ignore(this.PercivalAbility);



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

        this.load.image('cajaMovible', 'sprites/images/cajaMovible.png');
        this. load.image('cajaRompible','sprites/images/cajaRompible.png');
        this.load.image('cajaRota','sprites/images/cajaRompibleRota.png');
        this.load.image('daphneAbilityReady', 'sprites/images/daphne/abilityEnabled.png');
        this.load.image('daphneAbilityUsed', 'sprites/images/daphne/abilityDisabled.png');

        this.load.image('percivalAbilityReady', 'sprites/images/percival/abilityEnabled.png');
        this.load.image('percivalAbilityUsed', 'sprites/images/percival/abilityDisabled.png');
        this.load.image('tilesM', 'sprites/tileSet/MagwartsTileset.png');
        this.load.image('tilesM', 'sprites/tileSet/MagwartsTileset.png');

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

    UseAbility(playerName, object, action) {
        const now = this.time.now;

        const abilityIcon = playerName === "percival" ? this.PercivalAbility : this.daphneAbility;
        const readyTexture = playerName === "percival" ? "percivalAbilityReady" : "daphneAbilityReady";
        const usedTexture = playerName === "percival" ? "percivalAbilityUsed" : "daphneAbilityUsed";
        const msg = playerName === "percival" ? this.msgPercival : this.msgDaphne;

        // Si la habilidad todavía está en cooldown
        if (now < this.cooldowns[playerName]) {
            msg.setText("Habilidad recargando...");
            this.time.delayedCall(this.skillCooldownTime, () => msg.setText(""));
            return;
        }

        if (playerName === "percival") {
            // Siempre se ejecuta
            if (action.inRange) {object.breakObject(); 
            this.cooldowns[playerName] = now + this.skillCooldownTime;
            abilityIcon.setTexture(usedTexture);
            this.time.delayedCall(this.skillCooldownTime, () => abilityIcon.setTexture(readyTexture));
            }
            else {
                    // por si acaso: mensaje corto (opcional)
                    msg.setText("No hay nada que romper.");
                    this.time.delayedCall(1000, () => msg.setText(""));
                } 
        } 
        else if (playerName === "daphne") {
            if (action.isDropping) {
                // Asegúrate de que el objeto realmente estaba cogido antes de soltar
                     object.restartCoolDown(); // esto hace toggle: deja el objeto
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

    setSkillIcon(playerName, textureKey) {
        this.skillIcons[playerName].setTexture(textureKey);
    }

    showMessage(text) {
        this.messageText.setText(text);
        this.messageText.setVisible(true);

        this.scene.time.delayedCall(1000, () => {
            this.messageText.setVisible(false);
        });
    }
    
}