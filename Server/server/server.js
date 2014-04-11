var fs = require('fs'), path = require('path'), sio = require('socket.io'), static = require('node-static');

var app = require('http').createServer(handler);
var port = process.env.PORT || 5000; // Use the port that Heroku provides or default to 5000
app.listen(port);
console.log("listening on port %d", app.address().port);

var file = new static.Server(path.join(__dirname, '..', 'public'));

function handler(req, res) {
	file.serve(req, res);
}

var io = sio.listen(app), nicknames = {}, ligacoes = [];

// assuming io is the Socket.IO server object -- HEROKU
io.configure(function () { 
	io.set("transports", ["xhr-polling"]); 
	io.set("polling duration", 10); 
});

io.sockets.on('connection', function (socket) {

	socket.on('user image', function (data) {
		var idGeral = { complex: socket.id }; // de,para		
		var objetoFromTo = io.sockets[idGeral];
			
		if (objetoFromTo == null) {
			socket.broadcast.emit('announcement', 'nao existe destino');
		} else {
			io.sockets.socket(objetoFromTo.to).emit('user image', objetoFromTo.from, { image: data.image });
		}
	});

	socket.on('userid_teste', function (data) {
		if (nicknames[data.from]) {
			
		} else {			
			nicknames[data.from] = socket.userid = data.from;				
			io.sockets[data.from] = socket.id;			
			io.sockets.emit('nicknames', nicknames);
			
			var idDest = io.sockets[data.to];	
			if (idDest !== undefined) // adiciona o destino
			{
				var idLocal = io.sockets[data.from];
				var idGeral = { complex: idLocal }; // de,para
				io.sockets[idGeral] = { from: idLocal, to: idDest };
			}
		}
	});
	
	socket.on('userid', function (data, fn) {
		if (nicknames[data.from]) {
			fn(true);				
		} else {			
			fn(false);
			nicknames[data.from] = socket.userid = data.from;				
			io.sockets[data.from] = socket.id;			
			io.sockets.emit('nicknames', nicknames);
			
			var idDest = io.sockets[data.to];	
			if (idDest !== undefined) // adiciona o destino
			{
				var idLocal = io.sockets[data.from];
				var idGeral = { complex: idLocal }; // de,para
				io.sockets[idGeral] = { from: idLocal, to: idDest };
			}
		}
	});	
	
	socket.on('reply ok', function (from) {
		io.sockets.socket(from).emit('reply ok', 'Enviada Com Sucesso');
	});

	socket.on('disconnect', function () {
		if (!socket.userid) {
			return;
		}
		
		var idGeral = { complex: socket.id }; // de,para		
		var objetoFromTo = io.sockets[idGeral];
		if (objetoFromTo != null) {
			if ((socket.id === objetoFromTo.to) || (socket.id === objetoFromTo.from)) {
				io.sockets.socket(objetoFromTo.from).emit('close', nicknames + ' // ' + nicknames[socket.userid] + ' // ' + objetoFromTo.from +' // ' +objetoFromTo.to + ' // ' +socket.id + ' // ' +socket.userid );
				io.sockets.socket(objetoFromTo.to).emit('close', nicknames + ' // ' + nicknames[socket.userid] + ' // ' + objetoFromTo.from +' // ' +objetoFromTo.to + ' // ' +socket.id + ' // ' +socket.userid );
			}
		}

		delete nicknames[socket.userid];		
		socket.broadcast.emit('nicknames', nicknames);
	});

});
