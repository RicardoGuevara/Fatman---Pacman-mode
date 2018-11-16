Init.prototype = {
	preload: function(){
		game.load.image('loading','assets/img/ProgressBar.png');
		game.load.image('marca','assets/img/logo.png')
		game.load.script('splashScreen','SplashScreen.js');
	},
	create: function(){
		game.state.add('SplashScreen',splashScreen);
		game.state.start('SplashScreen');
	}
};
game.state.add('Init',Init);
game.state.start('Init');