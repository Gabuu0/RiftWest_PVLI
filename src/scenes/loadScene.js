export default class LoadScene extends Phaser.Scene{
    constructor(){
        super({key:'loadScene'});
    }

    init(){

    }

    preload(){
        this.characterSprites = [];
        this.load.spritesheet('Daphne','sprites/images/daphne/Daphne.png',{frameWidth:160, frameHeight:160});
        this.characterSprites.push('Daphne');
        this.load.spritesheet('Percival','sprites/images/percival/Percival.png',{frameWidth:160, frameHeight:160});
        this.characterSprites.push('Percival');
        this.load.spritesheet('Profesor','sprites/images/profesor/Profesor.png',{frameWidth:160, frameHeight:160});
        this.characterSprites.push('Profesor');
        this.load.spritesheet('Sheriff','sprites/images/sheriff/Sheriff.png',{frameWidth:160, frameHeight:160});
        this.characterSprites.push('Sheriff');


    }
    create(){

    }

    createAnims(){
        this.characterSprites.forEach(character =>{
             this.createAnimsCharacters(character);
        });
    }

    /**
     * 
     * @param {string} characterSprite - Key del spriteSheet del personaje del que se quiere crear las animaciones
     */
    createCharacterAnims(characterSprite){
        let keyIdleAnim = characterSprite + 'Idle';
        let keyDownAnim = characterSprite + 'Down';
        let keyUpAnim = characterSprite + 'Up';
        let keyRightAnim = characterSprite + 'Right';
        let keyLeftAnim = characterSprite + 'Left';

        this.anims.create(
            {key: keyIdleAnim,
            frames:this.anims.generateFrameNumbers(characterSprite,{frames:[0,1,2,3]}),
            frameRate:5,
            repeat:-1
            }
        );
        this.anims.create(
            {key: keyDownAnim,
            frames:this.anims.generateFrameNumbers(characterSprite,{frames:[4,5,6,7]}),
            frameRate:5,
            repeat:-1
            }
        );
        this.anims.create(
            {key: keyUpAnim,
            frames:this.anims.generateFrameNumbers(characterSprite,{frames:[8,9,10,11]}),
            frameRate:5,
            repeat:-1
            }
        );

        this.anims.create(
            {key: keyRightAnim,
            frames:this.anims.generateFrameNumbers(characterSprite,{frames:[12,13,14,15]}),
            frameRate:5,
            repeat:-1
            }
        );

        this.anims.create(
            {key: keyLeftAnim,
            frames:this.anims.generateFrameNumbers(characterSprite,{frames:[16,17,18,19]}),
            frameRate:5,
            repeat:-1
            }
        );
    }

}