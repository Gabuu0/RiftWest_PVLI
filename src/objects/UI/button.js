export default class Button extends Phaser.GameObjects.Text{
    /**
     * clase boton generico que realiza la accion que se le indique al pulsar
     * al pasar el raton por encima se altera un poco el tamaño del sprite
     * @param {*} scene 
     * @param {*} x 
     * @param {*} y 
     * @param {string} key clave para acceder al sprite del boton
     * @param {number} baseScale escala a la que poner el sprite designado
     * @param {funcion} func funcion llamada al pulsar el boton
     * @param {boolean} hover bool para si se cambia la escala del texto al pasar por encima
     * @param {boolean} hoverChangeColor bool para si se cambia el color del texto al pasar por encima
     * @param {string} hoverColor color al que cambiar el texto en caso de que hoverChangeColor sea true
     */
    constructor(scene, x, y, text,config,baseScale,func,hover = true,hoverChangeColor = false, hoverColor= ''){

        super(scene, x,y, text,config);

        this.setOrigin(0.5 , 0.5)
        this.setScale(baseScale,baseScale);
        this.originalColor = this.style.color;
        this.setInteractive();
        
        this.scene.add.existing(this);

        //al hacer click
        this.on('pointerdown',function(){
            func(this.text);
        })
        //al poner el raton encima
        this.on('pointerover',function(){
            if(hover){
                this.setScale(baseScale+0.03,baseScale+0.03);
            }

            if(hoverChangeColor){
                this.setColor(hoverColor);
            }
        })
        //al quitar el raton
        this.on('pointerout',function(){
            if(hover){
                this.setScale(baseScale,baseScale);
            }
            if(hoverChangeColor){
                this.setColor(this.originalColor);
            }
        })
    }
}