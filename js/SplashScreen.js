splashScreen.prototype ={
	Audio:function(){
		//game.load.audio('nombre','ruta');
	},

	Images:function(){
		game.load.image('menu','assets/menu/bg.jpg')
	},
	
	init:function(){
		this.progressBar  = game.make.sprite(game.world.centerX-(387/2), 400, "loading"); 
		this.logo = game.make.sprite(game.world.centerx,200,'logo');
		this.status = game.make.text(game.world.centerX,380,'Loading...',{fill: 'white'});

		this.logo.anchor.setTo(0.5);
		this.status.anchor.setTo(0.5);
	},

	preload:function(){
		game.add.existing(this.logo).scale.setTo(0.5);
	    game.add.existing(this.progressBar);
	    game.add.existing(this.status);
	    //this.load.setPreloadSprite(this.loadingBar);

	    //this.Images()
	    //this.Audio();
	},
	gameStates:function(){
		//game.state.add("menu",menu);
	    game.state.add("ofline",PacmanGame);
	    //game.state.add("gameOver",gameOver);
	    
	},
	/*addMusic: function () {
    music = game.add.audio('music');
    music.loop = true;
    music.play();
  },*/

  create: function() {
    this.status.setText('Go!');
    this.gameStates();
    //this.addMusic();

    setTimeout(function () {

        clave_iden = prompt('Clave única de juego');        
        socket.emit('identifier',clave_iden);

     	game.state.start("ofline");
     	
    }, 1000);
	}
}