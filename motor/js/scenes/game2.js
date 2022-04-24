//Accedo a la configuración de las opciones
this.options_data = {cards:2, dificulty:"hard"}
var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"hard"}';
options_data = JSON.parse(json);


class GameScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
		this.cards = null;
		this.firstClick = null;
		this.seconClick = null;
		this.vida = 100;
		this.puntuacion = 0
		this.correct = 0;

		this.tiempoGiro = 60;
		this.tiempoMostrarIn = 60;
		this.penalizacion = 20;
		this.girar = false;
		
		this.dibujarTapa = true;
		
		this.arraycards = [];
		this.vidaHUD;
		
    }

    preload (){	
		this.load.image('back', '../resources/back.png');
		this.load.image('cb', '../resources/cb.png');
		this.load.image('co', '../resources/co.png');
		this.load.image('sb', '../resources/sb.png');
		this.load.image('so', '../resources/so.png');
		this.load.image('tb', '../resources/tb.png');
		this.load.image('to', '../resources/to.png');
		this.vidaHUD = this.add.text(16,16, 'Vida: ' + this.vida,{fontSize:'32px',fill: '#000'})
		this.NivellHUD = this.add.text(600,16, 'Nivell: ' + this.puntuacion,{fontSize:'32px',fill: '#000'})
		
	}
	
	crearTapas(arraycards)
	{
		this.cards = this.physics.add.staticGroup();		
		//dibuja las cartas encima tapada
		for(let j = 0; j < arraycards.length; j++)
		{			
			if(j < 4)		
				this.cards.create(250 + 100 * j,300, 'back');
			else
				this.cards.create(250 + 100 * (j-4),450, 'back');
		}
		let i = 0;
		this.cards.children.iterate((card)=>{
			card.card_id = arraycards[i];
			i++;
			card.setInteractive();
			card.on('pointerup', () => {
				if(this.girar) return; //Ya dos cartas diferentes giradas
				card.disableBody(true,true);
				if (this.firstClick){ //click 2
					if (this.firstClick.card_id !== card.card_id){
						this.vida -= this.penalizacion;
						//Actualizo HUD
						this.vidaHUD.setText('Vida:' + this.vida);
						//Activa un bool para que se giren las cartas d'aqui 2 segundos
						this.seconClick = card;
						this.girar = true
					
						if (this.vida <= 0){
							alert("Game Over, NIVELL " + this.puntuacion);
							loadpage("../");
						}
					}
					else{
						this.correct++;
						this.firstClick = null;
						if (this.correct >= options_data.cards){
							this.puntuacion++;
							this.NivellHUD.setText('Nivell:' + this.puntuacion);
							this.create()
						}
					}
					
				}
				else{ //Click 1
					this.firstClick = card;
				}
			}, card);
		});
	}

    create (){	
		this.arraycards = []
		this.dibujarTapa = true
		this.correct = 0;

		//Dificultad
		var incr = 0;
		var tempMin = 0;
		switch(options_data.dificulty)
		{
			case("easy"):
				tempMin = 25
				incr = 2;
				break;
			case("normal"):
				tempMin = 15
				incr = 10;
			break;
			case("hard"):	
				tempMin = 10		
				incr = 15;
			break;
		}

		

		//Dificultad		
		this.tiempoGiro = 50 - this.puntuacion * incr;
		this.tiempoMostrarIn = 150 - this.puntuacion * incr;
		this.penalizacion = 10;

		if(this.tiempoGiro < 10) this.tiempoGiro = incr;
		if(this.tiempoMostrarIn < 3) this.tiempoMostrarIn = tempMin;
			
		

		this.cameras.main.setBackgroundColor(0xBFFCFF); //Color Fondo
		
		let tiposCarta = ['cb','co','sb','so','tb','to']

	
		//Escoje las cartas de manera aleatoria  //TO DO: terminar de hacerlo aleatorio.
		for(let j = 0; j < options_data.cards;j++)
		{
			let aux = Math.floor(Math.random()*tiposCarta.length);// devuleve un num aleatoria [0:nCartes-1]
			let tipoCarta = tiposCarta[aux]; 
			this.arraycards.push(tipoCarta);
			this.arraycards.push(tipoCarta);
			console.log(aux)
			tiposCarta.splice(aux,1)			
		}
		
		//Mezclar
		for(let j = 0; j < options_data.cards; j++)
		{
			let x = Math.floor(Math.random()*this.arraycards.length);
			let y = Math.floor(Math.random()*this.arraycards.length);
		
			let aux = this.arraycards[x];
			this.arraycards[x] = this.arraycards[y];
			this.arraycards[y] = aux;
		}

		//Dibuja las cartas destapadas
		for(let j = 0; j < this.arraycards.length; j++)
		{
			
			if(j < 4)
			{
				this.add.image(250 + 100 * j,300,this.arraycards[j]);

			}
			else
			{
				this.add.image(250 + 100 * (j-4),450,this.arraycards[j]);

			}
		}		
	}
	
	update (){

		//Mostrar cartas x tiempo al inicio
		if(this.dibujarTapa)
		{
			if(this.tiempoMostrarIn < 0)
			{
				this.crearTapas(this.arraycards)
				this.dibujarTapa = false
			}
			this.tiempoMostrarIn -= 1;
		}
		
		

		if(this.girar)
		{
			if(this.tiempoGiro < 0)
			{
				this.firstClick.enableBody(false, 0, 0, true, true);
				this.seconClick.enableBody(false, 0, 0, true, true);
				this.girar = false
				this.firstClick = null;
				this.tiempoGiro = 60;
			}
			this.tiempoGiro--;
		}
			
			
		

	}


}

