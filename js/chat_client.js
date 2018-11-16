
var message_tb 	= document.getElementById('chat_message_tb'),	//message text_box
	send_btn 	= document.getElementById('chat_send_btn'),		//message send comand
	output		= document.getElementById("msj");

//message_sending
send_btn.addEventListener('click',()=>{
	enviar();
});

message_tb.addEventListener('keydown',(evt)=>{
	if(evt.key == "Enter"){
		enviar();
	}
});

function enviar(){
	if (message_tb.value != "")
	{
		socket.emit('chat',{
			message: 	message_tb.value,
		});
		message_tb.value = "";	
	}
}

//message_listening
socket.on('chat',(message_data)=>{
	//output.innerHTML += '<li style="width:100%">'+'<div class="msj macro">'+'<div class="text text-l">'+ '<p>'+message_data.message+'</p>'+'<p><small>'+date+'</small></p>'+'</div>'+'</div>'+'</li>';
	output.appendChild(getMessageComponent(message_data.message));
});
window.setInterval(function() {
  output.scrollTop = output.scrollHeight;
}, 1000)
