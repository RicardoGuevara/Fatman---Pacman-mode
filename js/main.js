var server_ip = "localhost:4000";//es necesario cambiar la ip cada que se cambia de equipo
var socket = io.connect(server_ip);

var clave_iden;

var ofline_keys = {
    right:  false,
    left:   false,
    up:     false,
    down:   false,
};

var my_identifier = {
        clave:      clave_iden, //clave de sala
        server_id:  'waiting',       //id de la sesión (socket)
        connection: 0,          //estado de conexion (disponibilidad de sala)
        py:         0,          //jugador aún no definido
        pj_numb:	0,
    };

socket.on('identifier',(identifier)=>{
    my_identifier = identifier;
    if (my_identifier.connection == 1)
    {
        clave_iden = prompt('Esta sala está llena, por favor ingrese a una distinta');
        socket.emit('identifier',clave_iden);
    }
});

var gameProperties = {
  screenWidth: document.getElementById("kill_me_pls").style.pixelWidth,
  screenHeight: document.getElementById("kill_me_pls").style.pixelHeight,
  playerSpeed: 20.0,
};

var game = new Phaser.Game(448, 496, Phaser.AUTO, "kill_me_pls");
//var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'kill_me_pls');
var mainState = function(game) {};
var online = function(game) {};
var splashScreen = function(game){};
var Init = function(game){};
var PacmanGame;


var SOUND_VOLUME = 0.1;

var graphicAssets = {
	sprites:    'assets/img/pj5.png',
    sprites2:   'assets/img/pj6.png',
    map1:       'assets/maps/catastrophi_level2.csv', 
    map1_img:   'assets/maps/catastrophi_tiles_16.png',
};
var soundAssets = {

};
var fontAssets = {

}

