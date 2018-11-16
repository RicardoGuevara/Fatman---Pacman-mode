var upKey,
    downKey,
    leftKey,
    rightKey;
var e1,e2,e3,e4,e5,e6;
var enemies;
var layer,
    tileset,
    capaMundo,
    player,
    map;

var online_keys = {
    right:  false,
    left:   false,
    up:     false,
    down:   false,
};

socket.on('game',(game_data)=>{
    online_keys.right   = game_data.right
    online_keys.left    = game_data.left
    online_keys.up      = game_data.up
    online_keys.down    = game_data.down
    
});

online.prototype = {
    preload: function() {
        game.load.spritesheet("pj",graphicAssets.sprites,65,65,65);
        game.load.spritesheet("pj2",graphicAssets.sprites2,65,65,65);
        //game.load.spritesheet("enemy1",graphicAssets.enemy1,65,65,65);
        //game.load.spritesheet("enemy2",graphicAssets.enemy2,65,65,65);
        game.load.tilemap('map',graphicAssets.map1, null, Phaser.Tilemap.CSV);
        game.load.image('tiles', graphicAssets.map1_img);
    },

    create: function() {


        map = game.add.tilemap('map', 16, 16);

        map.addTilesetImage('tiles');
        layer = map.createLayer(0);
        layer.resizeWorld();
        //this.generate_enemies();
        map.setCollisionBetween(54, 83);


        //alert('sala: '+my_identifier.clave+'\nplayer: '+my_identifier.py);

        this.create_characters(); // crea los 2 personajes;

        upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

        //físicas de juego;
        //game.physics.enable(this.pj, Phaser.Physics.ARCADE);
        //game.physics.enable(this.pj2, Phaser.Physics.ARCADE);

        //this.pj.body.setSize(10, 14, 2, 1);
        
        if (my_identifier.pj_numb == 1) {
            game.camera.follow(this.pj);
        }
        else if (my_identifier.pj_numb == 2) {        
            game.camera.follow(this.pj2);
        }
        
        game.physics.enable(this.pj, Phaser.Physics.ARCADE);

        this.pj.body.setSize(65, 65, 2, 1);

    },

    update: function() {

        game.physics.arcade.collide(this.pj, layer);


        this.online_key_update();
        this.ofline_key_update();
        if (my_identifier.pj_numb == 1) {
            evaluate_move(this.pj,ofline_keys);
            evaluate_move(this.pj2,online_keys);
        }
        else if (my_identifier.pj_numb == 2) {
            evaluate_move(this.pj,online_keys);
            evaluate_move(this.pj2,ofline_keys);
        }

        game.physics.arcade.collide(player, layer);

    },

    online_key_update: function(){
        
        let key_order = {
            right:  rightKey.isDown,
            left:   leftKey.isDown,
            up:     upKey.isDown,
            down:   downKey.isDown,
            py:     my_identifier.server_id,
            pj_numb:    my_identifier.server_id,
        };

        socket.emit('game',key_order);       
    },

    ofline_key_update: function(){
        
        ofline_keys.right=  rightKey.isDown
        ofline_keys.left=   leftKey.isDown
        ofline_keys.up=     upKey.isDown
        ofline_keys.down=   downKey.isDown
    },


    //auxiliar functions (just for keep in order UwUr)

    
    create_characters: function() {
        //add pj1
        this.pj = game.add.sprite(15, 10, "pj");
        this.pj.idleFrame = 16; 
        this.pj.frame = 16;
        var walkup      = this.pj.animations.add("wup",[0,1,2,3,4,5,6,7],4,true);
        var walkleft    = this.pj.animations.add("wleft",[8,9,10,11,12,13,14,15],4,true);
        var walkright   = this.pj.animations.add("wright",[24,25,26,27,28,29,30,31],4,true);
        var walkdown    = this.pj.animations.add("wdown",[16,17,18,19,20,21,22,23],4,true);
        this.pj.moveRight   = false;
        this.pj.moveLeft    = false;
        this.pj.moveUp      = false;
        this.pj.moveDown    = false;
        
        //add pj2
        this.pj2 = game.add.sprite(45, 10, "pj2");
        this.pj2.idleFrame = 16; 
        this.pj2.frame = 16;
        var walkup2     = this.pj2.animations.add("wup",[0,1,2,3,4,5,6,7],4,true);
        var walkleft2   = this.pj2.animations.add("wleft",[8,9,10,11,12,13,14,15],4,true);
        var walkright2  = this.pj2.animations.add("wright",[24,25,26,27,28,29,30,31],4,true);
        var walkdown2   = this.pj2.animations.add("wdown",[16,17,18,19,20,21,22,23],4,true);
        this.pj2.moveRight   = false;
        this.pj2.moveLeft    = false;
        this.pj2.moveUp      = false;
        this.pj2.moveDown    = false;
    },

    generate_enemies: function() {
        enemies = this.game.add.group();
        for (var y = 0; y < 4; y++) {
            
            var enemy = enemies.create(300,300,'enemy1');
            
        }
        
        
        enemies.forEach(function(e){
            enemies.animations.add("eup",[0,1,2,3,4,5,6,7],4,true);
            enemies.animations.add("eleft",[8,9,10,11,12,13,14,15],4,true);
            enemies.animations.add("eright",[24,25,26,27,28,29,30,31],4,true);
            enemies.animations.add("edown",[16,17,18,19,20,21,22,23],4,true);

        });
        enemies.x = 100;
        enemies.y = 50;

        enemies.setAll('anchor.x', 0.5);
        enemies.setAll('anchor.y', 0.5);
        enemies.setAll('frame', 0);

        var tween = game.add.tween(enemies).to({x:200},2000,Phaser.Easing.Linear.None,true,0,1000,true);

        tween.onLoop.add(move,this);

       
    },

    move:function(){
        enemies.x++;
    }


}

