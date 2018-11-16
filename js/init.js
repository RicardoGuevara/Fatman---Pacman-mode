mainState.prototype = {
    preload: function() {
        game.load.image('loading','assets/img/ProgressBar.png');
        game.load.image('marca','assets/img/logo.png')
    },

    create: function() {
        game.state.add('Menu',Menu);
        game.state.start('Menu');
    },

}


game.state.add('main', mainState);
game.state.start('main');

