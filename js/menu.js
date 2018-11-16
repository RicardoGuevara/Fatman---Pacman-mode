var menutxt;
var style;


  
Menu.prototype = {
  init: function () {
    this.titleText = game.make.text(350, 100, "Menu", {
      
      fill: '#FDFFB5',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);
    this.optionCount = 1;
    
  },

  preload:function(){
    //this.load.image('bg', 'assets/img/bg.jpg');
    game.state.add('on',online_game);
  },
  create: function () {

    /*if (music.name !== "dangerous" && playMusic) {
      music.stop();
      music = game.add.audio('dangerous');
      music.loop = true;
      music.play();
    }*/
    game.stage.disableVisibilityChange = true;
    //game.add.sprite(0, 0, 'bg');
   //imagen.scale.setTo(0.5,0.5);
    game.add.existing(this.titleText);

    this.addMenuOption('offline',300, function () {
      game.state.start("Game");
    });
    this.addMenuOption('online',400, function () {
        clave_iden = prompt('Nombre de la sala');        
        socket.emit('identifier',clave_iden);

        
        game.state.add('on',online_game);
        game.state.start('on');
    });
    
    
  },
  addMenuOption: function(text,y, callback, className,) {
    menutxt = this.add.text(300, y, text, { fontSize: '32px', fill: '#fff' });
    menutxt.inputEnabled = true;
    menutxt.events.onInputUp.add(callback);
    
  }

};

