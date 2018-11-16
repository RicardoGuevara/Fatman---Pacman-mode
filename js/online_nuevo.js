socket.on('game',(game_data)=>{
    online_cursors = game_data;
    
});

online_game = function(game) {
  this.map = null;
  this.layer = null;

  this.numDots = 0;
  this.TOTAL_DOTS = 0;
  this.score = 0;
  this.scoreText = null;

  this.pacman = null;
  this.clyde = null;
  this.pinky = null;
  this.inky = null;
  this.blinky = null;
  this.isInkyOut = false;
  this.isClydeOut = false;
  this.ghosts = [];

  this.safetile = 14;
  this.gridsize = 16;
  this.threshold = 3;

  this.SPECIAL_TILES = [{
    x: 12,
    y: 11
  }, {
    x: 15,
    y: 11
  }, {
    x: 12,
    y: 23
  }, {
    x: 15,
    y: 23
  }];

  this.TIME_MODES = [{
    mode: "scatter",
    time: 7000
  }, {
    mode: "chase",
    time: 20000
  }, {
    mode: "scatter",
    time: 7000
  }, {
    mode: "chase",
    time: 20000
  }, {
    mode: "scatter",
    time: 5000
  }, {
    mode: "chase",
    time: 20000
  }, {
    mode: "scatter",
    time: 5000
  }, {
    mode: "chase",
    time: -1 // -1 = infinite
  }];
  this.changeModeTimer = 0;
  this.remainingTime = 0;
  this.currentMode = 0;
  this.isPaused = false;
  this.FRIGHTENED_MODE_TIME = 7000;

  this.KEY_COOLING_DOWN_TIME = 100;
  this.lastKeyPressed = 0;

  this.game = game;
};

online_game.prototype = {

  init: function() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.physics.startSystem(Phaser.Physics.ARCADE);
  },

  preload: function() {
    this.load.image('dot', 'assets/dot.png');
    this.load.image("pill", "assets/pill16.png");
    this.load.image('tiles', 'assets/pacman-tiles.png');
    this.load.spritesheet('pacman', 'assets/pacman.png', 32, 32);
    this.load.spritesheet("ghosts", "assets/ghosts32.png", 32, 32);
    this.load.tilemap('map', 'assets/pacman-map.json', null, Phaser.Tilemap.TILED_JSON);

  },

  create: function() {
    this.map = this.add.tilemap('map');
    this.map.addTilesetImage('pacman-tiles', 'tiles');

    this.layer = this.map.createLayer('Pacman');

    this.dots = this.add.physicsGroup();
    this.numDots = this.map.createFromTiles(7, this.safetile, 'dot', this.layer, this.dots);
    this.TOTAL_DOTS = this.numDots;

    this.pills = this.add.physicsGroup();
    this.numPills = this.map.createFromTiles(40, this.safetile, "pill", this.layer, this.pills);

    this.dots.setAll('x', 6, false, false, 1);
    this.dots.setAll('y', 6, false, false, 1);

    this.map.setCollisionByExclusion([this.safetile], true, this.layer);

    this.pacman = new Pacman(this, "pacman");
    this.pacman2 = new Pacman(this, "pacman");


    this.cursors = this.input.keyboard.createCursorKeys();
    this.cursors["d"] = this.input.keyboard.addKey(Phaser.Keyboard.D);
    this.cursors["b"] = this.input.keyboard.addKey(Phaser.Keyboard.B);

    this.changeModeTimer = this.time.time + this.TIME_MODES[this.currentMode].time;

    // Ghosts
    this.blinky = new Ghost(this, "ghosts", "blinky", {
      x: 13,
      y: 11
    }, Phaser.RIGHT);
    this.pinky = new Ghost(this, "ghosts", "pinky", {
      x: 15,
      y: 14
    }, Phaser.LEFT);
    this.inky = new Ghost(this, "ghosts", "inky", {
      x: 14,
      y: 14
    }, Phaser.RIGHT);
    this.clyde = new Ghost(this, "ghosts", "clyde", {
      x: 17,
      y: 14
    }, Phaser.LEFT);
    this.ghosts.push(this.clyde, this.pinky, this.inky, this.blinky);

    this.sendExitOrder(this.pinky);

  },

  checkKeys: function() {

    this.pacman.checkKeys(this.cursors);


    if (this.lastKeyPressed < this.time.time) {
      if (this.cursors.d.isDown) {
        this.DEBUG_ON = (this.DEBUG_ON) ? false : true;
        this.lastKeyPressed = this.time.time + this.KEY_COOLING_DOWN_TIME;
      }
      if (this.cursors.b.isDown) {
        this.ORIGINAL_OVERFLOW_ERROR_ON = this.ORIGINAL_OVERFLOW_ERROR_ON ? false : true;
        this.pinky.ORIGINAL_OVERFLOW_ERROR_ON = this.ORIGINAL_OVERFLOW_ERROR_ON;
      }
    }
  },

  checkonlinekeys: function() {
    let key_order = {
            cursors:this.cursors,
            py:     my_identifier.server_id,
            pj_numb:    my_identifier.server_id,
        };

    socket.emit('game',key_order); 


    if (this.lastKeyPressed < this.time.time) {
      if (this.cursors.d.isDown) {
        this.DEBUG_ON = (this.DEBUG_ON) ? false : true;
        this.lastKeyPressed = this.time.time + this.KEY_COOLING_DOWN_TIME;
      }
      if (this.cursors.b.isDown) {
        this.ORIGINAL_OVERFLOW_ERROR_ON = this.ORIGINAL_OVERFLOW_ERROR_ON ? false : true;
        this.pinky.ORIGINAL_OVERFLOW_ERROR_ON = this.ORIGINAL_OVERFLOW_ERROR_ON;
      }
    }

    this.pacman2.checkKeys(online_cursors.cursors);
    
  },

  checkMouse: function() {
    if (this.input.mousePointer.isDown) {
      var x = this.game.math.snapToFloor(Math.floor(this.input.x), this.gridsize) / this.gridsize;
      var y = this.game.math.snapToFloor(Math.floor(this.input.y), this.gridsize) / this.gridsize;
      this.debugPosition = new Phaser.Point(x * this.gridsize, y * this.gridsize);
    }
  },

  dogEatsDog: function(pacman, ghost) {
    if (this.isPaused) {
      this[ghost.name].mode = this[ghost.name].RETURNING_HOME;
      this[ghost.name].ghostDestination = new Phaser.Point(14 * this.gridsize, 14 * this.gridsize);
      this[ghost.name].resetSafeTiles();
      this.score += 10;
    } else {
      this.killPacman();
    }
  },

  dogEatsDog2: function(pacman, ghost) {
    if (this.isPaused) {
      this[ghost.name].mode = this[ghost.name].RETURNING_HOME;
      this[ghost.name].ghostDestination = new Phaser.Point(14 * this.gridsize, 14 * this.gridsize);
      this[ghost.name].resetSafeTiles();
      this.score += 10;
    } else {
      this.killPacman2();
    }
  },

  getCurrentMode: function() {
    if (!this.isPaused) {
      if (this.TIME_MODES[this.currentMode].mode === "scatter") {
        return "scatter";
      } else {
        return "chase";
      }
    } else {
      return "random";
    }
  },

  gimeMeExitOrder: function(ghost) {
    this.game.time.events.add(Math.random() * 3000, this.sendExitOrder, this, ghost);
  },

  killPacman: function() {
    this.pacman.isDead = true;
    //this.stopGhosts();
    setTimeout(function () {

        alert("Haz fallado, fatman ha muerto de gordura :(");
        clave_iden = prompt('Nombre de la sala');        
        socket.emit('identifier',clave_iden);

        
        game.state.add('on',online_game);
        game.state.start('on');
      
      }, 1000);
  },

  killPacman2: function() {
    this.pacman2.isDead = true;
    //this.stopGhosts();
    setTimeout(function () {

        alert("Han fallado, tu amigo ha muerto de gordura :(");
        clave_iden = prompt('Nombre de la sala');        
        socket.emit('identifier',clave_iden);

        
        game.state.add('on',online_game);
        game.state.start('on');
      
      }, 1000);
  },

  stopGhosts: function() {
    for (var i = 0; i < this.ghosts.length; i++) {
      this.ghosts[i].mode = this.ghosts[i].STOP;
    }
  },

  update: function() {
    //this.scoreText.text = "Score: " + this.score;
    
    if (!this.pacman.isDead) {
      for (var i = 0; i < this.ghosts.length; i++) {
        if (this.ghosts[i].mode !== this.ghosts[i].RETURNING_HOME) {
          this.physics.arcade.overlap(this.pacman.sprite, this.ghosts[i].ghost, this.dogEatsDog, null, this);

          this.physics.arcade.overlap(this.pacman2.sprite, this.ghosts[i].ghost, this.dogEatsDog2, null, this);
        }
      }

      if (this.TOTAL_DOTS - this.numDots > 30 && !this.isInkyOut) {
        this.isInkyOut = true;
        this.sendExitOrder(this.inky);
      }

      if (this.numDots < this.TOTAL_DOTS / 3 && !this.isClydeOut) {
        this.isClydeOut = true;
        this.sendExitOrder(this.clyde);
      }

      if (this.changeModeTimer !== -1 && !this.isPaused && this.changeModeTimer < this.time.time) {
        this.currentMode++;
        this.changeModeTimer = this.time.time + this.TIME_MODES[this.currentMode].time;
        if (this.TIME_MODES[this.currentMode].mode === "chase") {
          this.sendAttackOrder();
        } else {
          this.sendScatterOrder();
        }
      }
      if (this.isPaused && this.changeModeTimer < this.time.time) {
        this.changeModeTimer = this.time.time + this.remainingTime;
        this.isPaused = false;
        if (this.TIME_MODES[this.currentMode].mode === "chase") {
          this.sendAttackOrder();
        } else {
          this.sendScatterOrder();
        }
      }
    }

    this.pacman.update();
    this.pacman2.update();
    this.updateGhosts();

    this.checkKeys();
    //this.checkonlinekeys();
    this.checkMouse();
  },

  enterFrightenedMode: function() {
    for (var i = 0; i < this.ghosts.length; i++) {
      this.ghosts[i].enterFrightenedMode();
    }
    if (!this.isPaused) {
      this.remainingTime = this.changeModeTimer - this.time.time;
    }
    this.changeModeTimer = this.time.time + this.FRIGHTENED_MODE_TIME;
    this.isPaused = true;
  },

  isSpecialTile: function(tile) {
    for (var q = 0; q < this.SPECIAL_TILES.length; q++) {
      if (tile.x === this.SPECIAL_TILES[q].x && tile.y === this.SPECIAL_TILES[q].y) {
        return true;
      }
    }
    return false;
  },

  updateGhosts: function() {
    for (var i = 0; i < this.ghosts.length; i++) {
      this.ghosts[i].update();
    }
  },

  render: function() {
    if (this.DEBUG_ON) {
      for (var i = 0; i < this.ghosts.length; i++) {
        var color = "rgba(0, 255, 255, 0.6)";
        switch (this.ghosts[i].name) {
          case "blinky":
            color = "rgba(255, 0, 0, 0.6";
            break;
          case "pinky":
            color = "rgba(255, 105, 180, 0.6";
            break;
          case "clyde":
            color = "rgba(255, 165, 0, 0.6";
            break;
        }
        if (this.ghosts[i].ghostDestination) {
          var x = this.game.math.snapToFloor(Math.floor(this.ghosts[i].ghostDestination.x), this.gridsize);
          var y = this.game.math.snapToFloor(Math.floor(this.ghosts[i].ghostDestination.y), this.gridsize);
          this.game.debug.geom(new Phaser.Rectangle(x, y, 16, 16), color);
        }
      }
      if (this.debugPosition) {
        this.game.debug.geom(new Phaser.Rectangle(this.debugPosition.x, this.debugPosition.y, 16, 16), "#00ff00");
      }
    } else {
      this.game.debug.reset();
    }
  },

  sendAttackOrder: function() {
    for (var i = 0; i < this.ghosts.length; i++) {
      this.ghosts[i].attack();
    }
  },

  sendExitOrder: function(ghost) {
    ghost.mode = this.clyde.EXIT_HOME;
  },

  sendScatterOrder: function() {
    for (var i = 0; i < this.ghosts.length; i++) {
      this.ghosts[i].scatter();
    }
  }
};

game.state.add('on', online_game);