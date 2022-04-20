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
		this.score = 100;
		this.correct = 0;

		this.tiempoGiro = 60;
		this.girar = false;
    }

    preload (){	
		this.load.image('back', '../resources/back.png');
		this.load.image('cb', '../resources/cb.png');
		this.load.image('co', '../resources/co.png');
		this.load.image('sb', '../resources/sb.png');
		this.load.image('so', '../resources/so.png');
		this.load.image('tb', '../resources/tb.png');
		this.load.image('to', '../resources/to.png');

		
	}
	
    create (){	
		this.cameras.main.setBackgroundColor(0xBFFCFF); //Color Fondo
		
		let tiposCarta = ['cb','co','sb','so','tb','to']

		let arraycards = [];
		//Escoje las cartas de manera aleatoria  //TO DO: terminar de hacerlo aleatorio.
		for(let j = 0; j < options_data.cards;j++)
		{
			let aux = Math.floor(Math.random()*tiposCarta.length);// devuleve un num aleatoria [0:nCartes-1]
			let tipoCarta = tiposCarta[aux]; 
			arraycards.push(tipoCarta);
			arraycards.push(tipoCarta);
			console.log(aux)
			tiposCarta.splice(aux,1)			
		}
		

		//Dibuja las cartas destapadas
		for(let j = 0; j < arraycards.length; j++)
		{
			this.add.image(250 + 100 * j,300,arraycards[j])
		}
	
		
		this.cards = this.physics.add.staticGroup();
		
		//dibuja las cartas encima tapada
		for(let j = 0; j < arraycards.length; j++)
		{			
			this.cards.create(250 + 100 * j,300, 'back');
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
						this.score -= 20;
						//Activa un bool para que se giren las cartas d'aqui 2 segundos
						this.seconClick = card;
						this.girar = true
					
						if (this.score <= 0){
							alert("Game Over");
							loadpage("../");
						}
					}
					else{
						this.correct++;
						this.firstClick = null;
						if (this.correct >= 2){
							alert("You Win with " + this.score + " points.");
							loadpage("../");
						}
					}
					
				}
				else{ //Click 1
					this.firstClick = card;
				}
			}, card);
		});
	}
	
	update (){
		
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

