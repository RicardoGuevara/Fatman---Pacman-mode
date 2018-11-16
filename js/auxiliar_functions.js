//auxiliar functions

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
} 

function getMessageComponent(message_text)
{
	/*
		<li style="width:100%">
			<div class="msj macro">
				<div class="text text-l">
					<p>message_data.message</p>
					<p><small>date</small></p>
				</div>
			</div>
		</li>
	*/

	//small and paragraph for date
	let small = document.createElement("small")     
	small.appendChild(document.createTextNode(formatAMPM(new Date())))
	let p_small = document.createElement("p")
	p_small.appendChild(small)

	//text paragraph
	let p_text = document.createElement("p")
	p_text.appendChild(document.createTextNode(message_text))

	//divs with css included
	let intern_div = document.createElement("div")
	intern_div.appendChild(p_text)
	intern_div.appendChild(p_small)
	intern_div.className += "text text-l"

	let extern_div = document.createElement("div")
	extern_div.appendChild(intern_div)
	extern_div.className += "msj macro"

	let li = document.createElement("li")
	li.appendChild(extern_div);
	li.style.width='100%';

	return li;
}