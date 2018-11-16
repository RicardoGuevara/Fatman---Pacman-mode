mainState.prototype = {
    preload: function() {
        game.load.image('loading','assets/img/ProgressBar.png');
        game.load.image('marca','assets/img/logo.png')
    },

    create: function() {
        game.state.add('SplashScreen',PacmanGame);
        game.state.start('SplashScreen');
    },

}


game.state.add('main', mainState);
game.state.start('main');

