//definicion de las colas de espera
class colaJuegos {
  constructor() {
    this.queue = [];
  }

  agregar(juego) {
    this.queue.push(juego);
    console.log("\x1b[32m%s\x1b[0m",'--> new game added: ',juego)
    console.log(this.queue);
    return this.queue;
  }

  buscarClave(clave){
  	for (var i = 0; i < this.queue.length; i++) 
  	{
  		if (this.queue[i].clave == clave)
  		{
  			return this.queue[i];
  		}
  	}

  	console.log("\x1b[31m%s\x1b[0m","juego no encontrado --> "+clave);
  	console.log(this.queue);
  	return null;
  }

  buscarjugador(py){
  	for (var i = 0; i < this.queue.length; i++) 
  	{
  		if (this.queue[i].py1 == py || this.queue[i].py2 == py)
  		{
  			return this.queue[i];
  		}
  	}

  	return null;
  }

  borrar(clave){
  	let new_queue;
  	for (var i = 0; i < this.queue.length; i++) 
  	{
  		if (this.queue[i].clave != clave)
  		{
  			new_queue.push(this.queue[i]);
  		}
  	}
  	this.queue = new_queue;
  	console.log("\x1b[31m%s\x1b[0m","juego detenido --> "+clave);
  }

  dequeue() {
    return this.queue.shift();
  }

  peek() {
    return this.queue[0];
  }

  size() {
    return this.queue.length;
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  print() {
    return this.queue;
  }
}

//server code
const express	= require("express")
const socket 	= require('socket.io')
var app = express();

var server = app.listen(4000,function(){
	console.log('');
	console.log("\x1b[36m%s\x1b[0m","FatMan32 game server started - press ctrl+c for stop_________________________")
  	console.log("\x1b[32m%s\x1b[0m",'-------> listening  on port 4000')
});

app.use(express.static('.'))//change for 'html_server_test' to start on chat test page

var io= socket(server);
var	salas_de_juego 	= new colaJuegos();

io.on('connection',function(s){
  console.log("\x1b[33m%s\x1b[0m",'new client conected -->	',s.id);

  s.on('identifier',(clave_id)=>{
  	let identifier= {
  		clave:		clave_id,	//clave de sala
  		server_id:	s.id,		//id de la sesión (socket)
  		connection:	0,			//estado de conexion (disponibilidad de sala)
  		py:			0,			//jugador aún no definido
  	}
  	let juego = salas_de_juego.buscarClave(clave_id)
  	if (juego == null) {
  		
  		juego = {
  			clave:	clave_id,
  			py1:	s.id,
  			py2:	'waiting for connection',
  			state:	0,	//sala en espera del jugador 2
  		}
  		salas_de_juego.agregar(juego)
  		identifier.pj_numb = 1
      identifier.py = 1
  	}
  	else if (juego.state == 0) {
  		juego.py2	= s.id	//agregar el jugador 2 a la sala
  		juego.state = 1		//cambiar el estado del juego a sala llena
  		identifier.pj_numb = 2
      identifier.py = 2
  		console.log("\x1b[32m%s\x1b[0m",'--> new player added to: ',juego.clave)
    	console.log(salas_de_juego.queue);
  	}
  	else if (juego.state == 1) {
  		console.log("\x1b[31m%s\x1b[0m","--> sala llena: "+juego.clave);
  		identifier.connection = 1;	//la conexión no fué posible
  	}
  	s.emit('identifier',identifier);
  })

  s.on('chat',(message_data)=>{
  	io.sockets.emit('chat',message_data);
  	console.log("\x1b[36m%s\x1b[0m","--> global chat message by: ",s.id)
  })

  s.on('game',(game_data)=>{
  	let game = salas_de_juego.buscarjugador(game_data.py)
    try{
      if(game != null)
      {
        if (game_data.py == game.py1 && game.py2!='waiting for connection') {
          io.sockets.connected[game.py2].emit('game',game_data)
        }
        else if (game_data.py == game.py2) {
          io.sockets.connected[game.py1].emit('game',game_data)
        }
      }
    }catch(error){
      console.log("\x1b[31m%s\x1b[0m","--> error X: ");
    }
  	

  })

});



