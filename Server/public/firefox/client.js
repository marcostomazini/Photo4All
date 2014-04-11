//
// socket.io code
//
var socket = io.connect();
var idConexao = "";
var qtdeSend = 1;

// retorno
socket.on('announcement', function (msg) {
	//$("#msgRetorno").html(msg); // TODO: not implemented
});

socket.on('close', function (msg) {
	location.reload();
});

socket.on('reply ok', function (msg) {
	//console.log(msg + " -> " + qtdeSend); // debug	
	$("#qtdeImg").html(qtdeSend);
	qtdeSend++;	
	$("#destination").prop('disabled', true);
	$("#divMsgRetorno").show();
	$("#msgRetorno").html(msg);	
	setTimeout(function() {
		$('#divMsgRetorno').fadeOut('fast');
	}, 2000);
});

socket.on('error', function (e) {
	console.log('System: ' + e + ' - A unknown error occurred');
});

function rand(length, current){
	current = current ? current : '';
	return length ? rand( --length , "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".charAt( Math.floor( Math.random() * 60 ) ) + current ) : current;
}

function generateId(rand) {
	idConexao = rand;
	console.log(idConexao);
	socket.emit('userid', { to: $('#destination').val(), from: idConexao }, function (set) {
		if (!set) {
			return true;
		}
		idConexao = "";
		generateId(rand(6));
	});	
	return false;
}	

//
// dom manipulation code
//
$(function () {
	// run the code in the markup!	
	$('#imagefile').bind('change', function(e){
		if (idConexao == "")
		{
			generateId(rand(6));
		}
		var data = e.originalEvent.target.files[0];
		var reader = new FileReader();
		reader.onload = function(evt){
			socket.emit('user image', { image: evt.target.result });
		};
		reader.readAsDataURL(data);
	});	
	
	var url = window.location.href;
	var hash = url.substring(url.indexOf('#')+1);  
	if (hash.length > 0) {
		$("#destination").val(hash);		
	}
});

