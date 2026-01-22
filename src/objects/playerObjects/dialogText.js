/*
 * Código extraído de https://gamedevacademy.org/create-a-dialog-modal-plugin-in-phaser-3-part-1/
 * Código extraído de https://gamedevacademy.org/create-a-dialog-modal-plugin-in-phaser-3-part-2/ 
 */

/**
 * Esta clase está pensada para crear cuadros de diálogo
 * Las funciones que empiezan por "_" no deberían llamarse nunca desde otras escenas. Pueden romer cosas.
 */
import Button from "../UI/button.js";
export default class DialogText{

	constructor(scene, opts){
		this.scene = scene;
		this.camera = opts.camera
		this.otherCamera = opts.otherCamera
		this.init(opts);
	}

	setDepth(value) {
		if (this.daphnePanel) this.daphnePanel.setDepth(value);
		if (this.percivalPanel) this.percivalPanel.setDepth(value);
		if (this.text) this.text.setDepth(value);
		if (this.closeBtn) this.closeBtn.setDepth(value);
	}

	init(opts) {
		// Mira si hay parámetros que se pasan, en caso de que no, se usan los por defecto
		if (!opts) opts = {};
		
		// set properties from opts object or use defaults
		this.borderThickness = opts.borderThickness || 3;
		this.borderColor = opts.borderColor || 0x907748;
		this.borderAlpha = opts.borderAlpha || 1;
		this.windowAlpha = opts.windowAlpha || 0.6;
		this.windowColor = opts.windowColor || 0x303030;
		this.windowHeight = opts.windowHeight || 125;
		this.padding = opts.padding || 12;
		this.closeBtnColor = opts.closeBtnColor || 'darkgoldenrod';
		this.dialogSpeed = opts.dialogSpeed || 3;
		this.fontSize = opts.fontSize || 15
		this.fontFamily = opts.fontFamily || "upheavtt"
		this.offsetY = opts.offsetY || 280;
		
		//Para cuando usemos el setTextArray
		this.array = [];

		//Ignora la camara de Daphne o de percival
		this.ignorePercival
		this.ignoreDaphne
		
		// se usa para animar el texto
		this.eventCounter = 0;
		
		// si la ventana de diálogo se muestra
		this.visible = true;
		
		// texto que hay en la ventana
		this.text;
		
		// texto que se renderizará en la ventana
		this.dialog;
		this.graphics;
		this.closeBtn;

		//Crea la ventana de dialogo
		this._createWindow();
	}

	// Método que cierra y abre la ventana de diálogo
	toggleWindow() {
		this.visible = !this.visible;
		this.text.setVisible(this.visible)
		this.closeBtn.setVisible(this.visible)
		this.daphnePanel.setVisible(this.visible)
		this.percivalPanel.setVisible(this.visible)
	}

	// con esta función se nos permite añadir texto a la ventana
	// Este método se llamara desde la escena que corresponda
	setText(text, animate) {
		//el parametro animate nos permite saber si el texto sera animado o no
		this.eventCounter = 0;
		
		//se crea un array con cada caracter en la cadena de texto y se 
		// guarda en la propiedad diálogo
		this.dialog = text.split('');

		//se mira si hay otro evento de tiempo corriendo y lo elimina
		if (this.timedEvent) 
			this.timedEvent.remove();

		//esta variable es un string vacio si animate es true, de otra manera es la variable text
		var tempText = animate ? '' : text;
		
		//llama al metodo que calcula la pos del texto y lo crea
		this._setText(tempText); 

		if (animate) {
			//se crea un evento temporizado
			this.timedEvent = this.scene.time.addEvent({
				//delay indica el tiempo en ms hasta que se empieza el evento      
				delay: 150 - (this.dialogSpeed * 30),
				//se llama a la funcion de animar el texto
				//Cada vez que se llama a la funcion de animar se aumenta el eventCounter
				callback: this._animateText,
				//especifica en qué scope se muestra el texto
				callbackScope: this,
				//el evento se repite
				loop: true
			});
		}
	}

	setTextArray(textArray, animate){
		this.array = textArray;
		this.showNext(animate)
	}

	showNext(animate = true) {
    if (this.array.length === 0) {
        this.toggleWindow(); // ocultar cuando se acabe todo
        return;
    }

	const [id, text] = this.array.shift(); // Divide en el número y el texto

	//Reinicia valores
    this.ignorePercival = false;
    this.ignoreDaphne = false;

    if (id === 1) {
		this.ignoreDaphne = true;	// Solo Daphne ignora
	}
    if (id === 2) {
		this.ignorePercival = true;	// Solo Percival ignora
	} 

    this.setText(text, animate);
    this.visible = true;
}

	// Consigue el ancho del juego (en funcion del tamaño en la escena) 
	_getGameWidth() {
		return this.scene.sys.game.config.width / 2;
	}

	// Consigue el alto del juego (en funcion del tamaño de la escena) 
	_getGameHeight() {
		return this.scene.sys.game.config.height / 2;
	}

	// Calcula las dimensiones y pos de la ventana en funcion del tamaño de la pantalla de juego
	_calculateWindowDimensions(width, height) {
		var x = this.padding;
		var y = height - this.windowHeight - this.padding;
		var rectWidth = width - (this.padding * 2);
		var rectHeight = this.windowHeight;
		return {
			x,
			y,
			rectWidth,
			rectHeight
		};
	}

	// Crea la ventana interior, donde se muestra el texto 
	_createInnerWindow(x, y, rectWidth, rectHeight) {
		//rellena con el color y alpha especificados en las propiedades
		this.graphics.fillStyle(this.windowColor, this.windowAlpha);
		
		//Se crea el rectangulo pasandole las propiedades de posicion y dimensiones
		this.graphics.fillRect(x + 1, y + 1, rectWidth - 1, rectHeight - 1);
	}


	// Método que crea la ventana de diálogo
	_createWindow() {
		//Obtenemos las dimensiones del juego
		var gameHeight = this._getGameHeight();
		var gameWidth = this._getGameWidth();

		//Se calcula la dimension de la ventana de diálogo
		var dimensions = this._calculateWindowDimensions(gameWidth, gameHeight);
		this.daphnePanel = this.scene.add.image(gameWidth/2,gameHeight*2 - gameHeight/3, "daphneDialoguePanel").setOrigin(0.5,0.5);
		this.percivalPanel = this.scene.add.image(gameWidth/2,gameHeight*2 -gameHeight/3, "percivalDialoguePanel").setOrigin(0.5,0.5);
		this.camera.ignore(this.daphnePanel);
		this.scene.cameras.main.ignore(this.percivalPanel);

		
		this._createCloseModalButton(); //se muestra el boton de cerrar en la ventana
		this._createCloseModalButtonBorder(); // se muestra el borde del boton de cerrar
		
		this.daphnePanel.setScale(0.5).setScrollFactor(0);
		this.percivalPanel.setScale(0.5).setScrollFactor(0);
	}

	// Con el siguiente código se crea el boton de cerrar la ventana de diálogo
	_createCloseModalButton() {
		var self = this;
		const gameHeight = this._getGameHeight();
		const gameWidth = this._getGameWidth();
		this.closeBtn = new Button(this.scene,gameWidth - 150, gameHeight*2 -gameHeight/4,'Continue',{ fontSize: '18px', fill: this.closeBtnColor, fontFamily: 'upheavtt'},1,()=>{
			// elimina el game object con el texto y borra el evento
			if (self.timedEvent) 
				self.timedEvent.remove();
			if (self.text) 
				self.text.destroy();
			
			self.showNext();
		},true,true,'rgb(255, 255, 143)');
		this.closeBtn.setScrollFactor(0);
		
		// this.closeBtn.setInteractive(); //hace interactuable el boton de cierre
		// this.closeBtn.on('pointerover', function () {
		// 	this.setTint(0xff0000); //cuando el cursor se encuentra encima se cambia de color
		// });
		// this.closeBtn.on('pointerout', function () {
		// 	this.clearTint(); //vuelve al color original al quitar el cursor
		// });
		// this.closeBtn.on('pointerdown', function () {
		// 	// elimina el game object con el texto y borra el evento
		// 	if (self.timedEvent) 
		// 		self.timedEvent.remove();
		// 	if (self.text) 
		// 		self.text.destroy();
			
		// 	self.showNext();
		// });

		this.closeBtn.setScrollFactor(0);
	}

	// Se crea el borde del botón
	_createCloseModalButtonBorder() {
		var x = this._getGameWidth() - this.padding - 20;
		var y = this._getGameHeight() - this.windowHeight - this.padding + this.offsetY;
		
	}

	// Hace aparecer al texto lentamente en pantalla
	_animateText() {
		this.eventCounter++;
		
		//se va actualizando el texto de nuestro game object llamando a setText
		this.text.setText(this.text.text + this.dialog[this.eventCounter - 1]);
		
		//Cuando eventCounter sea igual a la longitud del texto, se detiene el evento
		if (this.eventCounter === this.dialog.length) {
			this.timedEvent.remove();
			if(this.closeBtn) this.closeBtn.setVisible(true);
		}
	}

	// Calcula la pos del texto en la ventana
	_setText(text) {
		var self = this;
		const gameHeight = this._getGameHeight();
		const gameWidth = this._getGameWidth();
		var x = this.padding + 150;
		var y = this._getGameHeight() - this.windowHeight  + this.offsetY;
		// Resetea el game object del texto si ya estaba seteada la propiedad del texto del plugin
		if (this.text) 
			this.text.destroy();
		if(this.closeBtn)this.closeBtn.destroy();
			
		this.closeBtn = new Button(this.scene,gameWidth - 100, gameHeight*2 -gameHeight/6,'Continue',{ fontSize: '18px', fill: this.closeBtnColor, fontFamily: 'upheavtt'},1,()=>{
			// elimina el game object con el texto y borra el evento
			if (self.timedEvent) 
				self.timedEvent.remove();
			if (self.text) 
				self.text.destroy();
			
			self.showNext();
		},true,true,'rgb(255, 255, 143)');
		this.closeBtn.setScrollFactor(0);
		this.closeBtn.setDepth(10);
		this.closeBtn.setVisible(false);
		//Crea un game object que sea texto
		this.text = this.scene.make.text({
			x,
			y,
			text,
			style: {
				//se obliga al texto a permanecer dentro de unos limites determinados
				wordWrap: { width: this._getGameWidth() - (this.padding * 2) - 220 },
				fontSize: this.fontSize,
				fontFamily: this.fontFamily,
				letterSpacing: 1
			}
		});

		this.text.setScrollFactor(0);
		this.text.setDepth(10);
		if (this.ignorePercival){
			this.camera.ignore(this.text);
			this.camera.ignore(this.closeBtn);
		}
		else if (this.ignoreDaphne){
			this.otherCamera.ignore(this.text);
			this.otherCamera.ignore(this.closeBtn);
		}
	}
};