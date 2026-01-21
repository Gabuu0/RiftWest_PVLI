export default class BootScene extends Phaser.Scene{
    constructor(){
        super({key:'boot'});
    }

    init(){

    }

    preload(){
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(380, 270, 320, 50);

        let loadingTexts = ["Cargando diálogos", "Cargando imágenes","Cargando animaciones","Cargando mapas"];

        var loadingText = this.add.text(450,240,"Cargando...",{color:'#d2d2d267' ,fontSize:20});
        var percentText = this.add.text(this.cameras.main.width/2-20,285,"0%",{color:'#d2d2d267' ,fontSize:20});
        
        this.load.on('progress', function(value){
            loadingText.setText(loadingTexts[value < 0.25 ? 0:value<0.5 ? 1: value< 0.75 ? 2: 3]);
            percentText.setText(parseInt(value *100)+'%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(390, 280, 300 * value, 30);
        });
        this.load.on('complete',()=>{
            this.createClownDialogs();
            this.scene.run('menu');
            this.scene.sleep('boot');
        });

        this.load.image('GameLogo', 'assets/sprites/logos/logoJuego.png');
        this.load.image('GameCharacters', 'assets/sprites/logos/logoPersonajes.png');
        this.load.image('menuBackground', 'assets/sprites/logos/background.png');
        this.load.image('tutorialBackground', 'assets/sprites/logos/background2.png');
        this.load.image('levelsBackground', 'assets/sprites/logos/background3.png');
        this.load.image('iconNotFullScreen', 'assets/sprites/logos/iconNotFullScreen.png');
        this.load.image('iconFullScreen', 'assets/sprites/logos/iconFullScreen.png');

        this.characterSprites = [];
        this.load.spritesheet('Daphne','assets/sprites/images/daphne/Daphne.png',{frameWidth:160, frameHeight:160});
        this.characterSprites.push('Daphne');
        this.load.spritesheet('Percival','assets/sprites/images/percival/Percival.png',{frameWidth:160, frameHeight:160});
        this.characterSprites.push('Percival');
        this.load.spritesheet('Profesor','assets/sprites/images/profesor/Profesor.png',{frameWidth:160, frameHeight:160});
        this.characterSprites.push('Profesor');
        this.load.spritesheet('Sheriff','assets/sprites/images/sheriff/Sheriff.png',{frameWidth:160, frameHeight:160});
        this.characterSprites.push('Sheriff');

        //#region Tilemaps
        this.load.image('tilesPJ', 'assets/sprites/tileSet/TileSetPJ.png');
        this.load.image('tilesD', 'assets/sprites/tileSet/DustwartsTileset.png');
        this.load.image('tilesD2', 'assets/sprites/tileSet/Dustwarts.png');
        this.load.image('tilesM', 'assets/sprites/tileSet/MagwartsTileset.png');
        this.load.image('tilesM2', 'assets/sprites/tileSet/Magwarts.png');
        this.load.image('tilesDecoration','assets/sprites/tileSet/decoration.png');
        this.load.tilemapTiledJSON('mapLevelAxel', 'assets/sprites/tileSet/LvlAxel.json');
        this.load.tilemapTiledJSON('mapLevelJavi', 'assets/sprites/tileSet/LevelJavi.json');
        this.load.tilemapTiledJSON('mapLevelJavi2', 'assets/sprites/tileSet/LevelJavi2.json');
        this.load.tilemapTiledJSON('mapLevelGabi', 'assets/sprites/tileSet/LevelGabi.json');
        this.load.tilemapTiledJSON('mapa', 'assets/sprites/tileSet/PruebaPuertas.json');
        this.load.spritesheet('doors','assets/sprites/tileSet/Doors.png',{frameWidth:32, frameHeight:16});
        this.load.spritesheet('levers','assets/sprites/tileSet/Levers.png',{frameWidth:16, frameHeight:16});
        this.load.spritesheet('knockableObject','assets/sprites/tileSet/KnockableObject.png',{frameWidth:13, frameHeight:19});
        this.load.image('preassurePlate','assets/sprites/tileSet/PreassurePlate.png');
        this.load.spritesheet('liftingPlatform','assets/sprites/tileSet/liftingPlatform.png',{frameWidth:32,frameHeight:32});
        //#endregion

        //#region Objetos
        this.load.image('cajaMovible', 'assets/sprites/images/items/cajaMovible.png');
        this.load.image('cajaRompible','assets/sprites/images/items/cajaRompible.png');
        this.load.image('cajaRota','assets/sprites/images/items/cajaRompibleRota.png');

        this.load.spritesheet('llaveMapa','assets/sprites/images/items/keyMap.png',
              {frameWidth:16, frameHeight:16}
        );
        this.load.image('llaveInventario', 'assets/sprites/images/items/keyInventory.png')
        //#endregion

        //#region Interfaz
        this.load.spritesheet('slot','assets/sprites/images/inventory/inventorySpace.png',{frameWidth: 64, frameHeight:64});
        this.load.image('descriptionBox','assets/sprites/images/inventory/descriptionBox.png');

        this.load.image('daphneMapEnabled', 'assets/sprites/images/daphne/mapIcon.png');
        this.load.image('percivalMapEnabled', 'assets/sprites/images/percival/mapIcon.png');
        this.load.image('daphneMap', 'assets/sprites/images/daphne/mapLevel1.png');
        this.load.image('percivalMap', 'assets/sprites/images/percival/mapLevel1.png');

        this.load.image('daphneAbilityReady', 'assets/sprites/images/daphne/AbilityEnabled.png');
        this.load.image('daphneAbilityUsed', 'assets/sprites/images/daphne/AbilityDisabled.png');
        this.load.image('percivalAbilityReady', 'assets/sprites/images/percival/AbilityEnabled.png');
        this.load.image('percivalAbilityUsed', 'assets/sprites/images/percival/AbilityDisabled.png');

        this.load.image('daphneHead', 'assets/sprites/images/daphne/head.png');
        this.load.image('percivalHead', 'assets/sprites/images/percival/head.png');

        this.load.image('textPanel','assets/sprites/images/UI/PanelNivelBloqueado.png')
        this.load.image('lockedIcon','assets/sprites/images/UI/LockedIcon.png')
        //#endregion

        //#region Sonidos
        this.load.audio('pasos', 'assets/sounds/pasos.mp3');
        this.load.audio('romper', 'assets/sounds/romper.mp3');
        this.load.audio('pickItem', 'assets/sounds/pickItem.mp3');
        this.load.audio('reset', 'assets/sounds/reset.mp3');
        this.load.audio('musicaLevelJavi', 'assets/sounds/musicaLevelJavi.mp3');
        this.load.audio('musicaLevelAx', 'assets/sounds/musicaLevelAx.mp3');
        this.load.audio('musicaLevelGabi', 'assets/sounds/musicaLevelGabi.mp3');
        this.load.audio('select', 'assets/sounds/select.mp3');
        //#endregion

    }
    create(){
        this.registry.set('clownObj', {
            objData: {},
            hasObj: false,
        });

        //se establece que solo el primer nivel es accesible
        this.registry.set('levels', {
            level1: true,
            level2: false,
            level3: false,
        });
        this.createAnims();
    }

    createAnims(){
        this.characterSprites.forEach(character =>{
             this.createCharacterAnims(character);
        });

        if (!this.anims.exists('keyIdle')){
            this.anims.create(
            {key:'keyIdle',
                frames: this.anims.generateFrameNumbers('llaveMapa', {frames:[0,1,2,1]}),
                frameRate: 4,
                repeat:-1,
            }
        );}

        if (!this.anims.exists('SlotSelected')){
            this.anims.create(
            {key: 'SlotSelected',
            frames: this.anims.generateFrameNumbers('slot', {frames:[1,2]}),
            frameRate: 2,
            repeat: -1,}
        );}

    
        if (!this.anims.exists('SlotIdle')){
             this.anims.create(
            {key: 'SlotIdle',
            frames: this.anims.generateFrameNumbers('slot', {frames:[0]}),
            frameRate: 2,
            repeat: -1,}
        );}
        
    }

    /**
     * Este metodo se encarga de crear todas las animaciones de los personajes que tiene animacion Idle, Up, Down, Right y Left.
     * El spriteSheet tiene que estar ordenado en el orden que aparece abajo y cada animacion debe tener solo 4 frames.
     * @param {string} characterSprite - Key del spriteSheet del personaje del que se quiere crear las animaciones
     */
    createCharacterAnims(characterSprite){
        let keyIdleAnim = characterSprite + 'Idle';
        let keyDownAnim = characterSprite + 'Down';
        let keyUpAnim = characterSprite + 'Up';
        let keyRightAnim = characterSprite + 'Right';
        let keyLeftAnim = characterSprite + 'Left';

        if (!this.anims.exists(keyIdleAnim)){
            this.anims.create(
            {key: keyIdleAnim,
            frames:this.anims.generateFrameNumbers(characterSprite,{frames:[0,1,2,3]}),
            frameRate:5,
            repeat:-1
            }
        );}

        if (!this.anims.exists(keyDownAnim)){
            this.anims.create(
            {key: keyDownAnim,
            frames:this.anims.generateFrameNumbers(characterSprite,{frames:[4,5,6,7]}),
            frameRate:5,
            repeat:-1
            }
        );}

        if (!this.anims.exists(keyUpAnim)){
            this.anims.create(
            {key: keyUpAnim,
            frames:this.anims.generateFrameNumbers(characterSprite,{frames:[8,9,10,11]}),
            frameRate:5,
            repeat:-1
            }
        );}

        if (!this.anims.exists(keyRightAnim)){
            this.anims.create(
            {key: keyRightAnim,
            frames:this.anims.generateFrameNumbers(characterSprite,{frames:[12,13,14,15]}),
            frameRate:5,
            repeat:-1
            }
        );}

        if (!this.anims.exists(keyLeftAnim)){
            this.anims.create(
            {key: keyLeftAnim,
            frames:this.anims.generateFrameNumbers(characterSprite,{frames:[16,17,18,19]}),
            frameRate:5,
            repeat:-1
            }
        );}
    }

    /**
     * crea todos los posbiles dialogos del payaso a la hora de interactuar 
     * con él al traspasar objetos entre jugadores
     */
    createClownDialogs(){
        this.registry.set('clownJokes',{

            //chistes cuando pillas un item del payaso
            getItem:[
            "Manin pa ti el objeto, que pesa mucho , pero no tanto como tu vieja",
            "Uff menos mal que me lo has cogido, y el objeto tambien",
            "Jope, ya le empezaba a tener cariño a ese objeto :(",
            "Toma, pa que digas que nunca recibes *gime*",
            "Se nota que te gusta recibir eh",
            "Te lo voy a dar todo bro. Eso me dijo ella... espera, asi no era"],
            
            //chistes cuando le pasas un item al payaso
            giveItem:[
            "Tranqui, yo te lo sujeto sin problema",
            "epale, lo pillé",
            "¡Gracias! Me encanta que me des ... objetos claro",
            "¡Por fin me tocó recibir!",
            "Si estos son los regalos que dais, entiendo perfectamente porque seguis solteros"],
            
            //frases cuando el payaso esta vacio y pero no se selecionó ningun item
            noItemGiven:[
            "Si seleccionas un objeto casi que mejor manin",
            "Si no me das un objeto no puedo agarrar na, a no ser que quieras que agarre otra cosa...",
            "Sigo estando igual de vacio que cuando ella te dejó, la próxima dame algo venga",
            "Toma, un cachico más de vacio",
            "Cuanto es 50 + 17? SIX SEVEEENNN!!!, este chiste esta igual de vacio que mi inventario KLK"],

            //frases cuando el payaso no esta vacio y pero no se pudo pillar el item (inventario lleno)
            noItemTaken:[
            "Estas mu cargao colega, no creo que soportes un objeto más",
            "Sé que dices que los límites están en la mente, pero tu inventario dice lo contrario",
            "Ojala poder dartelo, y el objeto tambien",
            "No creo que debas pillar un objeto más, no eres CJ",
            "Lo siento, no puedo dar y recibir al mismo tiempo...",
            "A este paso te dejo lleno bro *risa perturbadora*"],

            //últimas frases del payaso
            last:[
            "chao pescao",
            "me las piro vampiro",
            "hasta la vista baby"]
        }
        );
    }


}