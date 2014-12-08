/**
 * SOCKET
 */

Modules.socket = {
	start: function() {
		this.connect();
	},

	connect: function() {
		console.log('WebSocket conectando...');

		if (!Modules.socket.connecting && (Modules.socket.connection == null || (Modules.socket.connecting.readyState !== 0 && Modules.socket.connecting.readyState !== 1))) {
			Modules.socket.connection = new WebSocket('ws://' + url + '/runner');
			Modules.socket.connection.onopen = Modules.socket.onOpen;
			Modules.socket.connection.onmessage = Modules.socket.onMessage;
			Modules.socket.connection.onclose = Modules.socket.onClose;
			Modules.socket.connection.onerror = Modules.socket.onError;
			Modules.socket.connecting = true;
		}
	},

	connection: null,

	connecting: false,

	connected: false,

	onOpen: function(e) {
		console.log('WebSocket conectado!');

		Modules.socket.connected = true;
	},

	onMessage: function(e) {
		var jsonMessage = e.data;
		var message = $.parseJSON(jsonMessage);

		console.log(message);

		if (message.type == 'move') {
			//move the ghost!
			Modules.ghost.move(message);
		} else if (message.type == 'me') {
			if (Levels.main.playerName != null) {
				Levels.main.playerName.text = message.nickname;
			}
			
			Levels.main.nickname = message.nickname;
			Modules.score.best = message.time;
		} else if (message.type == 'score-table') {
			console.log(message);
			Modules.score.refreshTable(message.table);
		}
	},

	onClose: function(e) {
		Modules.socket.connecting = false;
		
		setTimeout(function() {
			Modules.socket.connect();	
		}, 5000);
	},

	onError: function(e) {
		Modules.socket.connecting = false;

		setTimeout(function() {
			Modules.socket.connect();	
		}, 5000);
	},

	sender: {
		move: function(x, y) {
			if (Modules.socket.connected) {
				if (Modules.socket.sender.moveLastTime == null || Modules.socket.sender.moveLastTime < (new Date()).getTime() - 10) {
					x = Math.ceil(x);
					y = Math.ceil(y);

					if (x != Modules.socket.sender.moveLastX || y != Modules.socket.sender.moveLastY) {
						Modules.socket.connection.send(JSON.stringify({
				            type: 'move',
				            x: x,
				            y: y
				        }));

				        Modules.socket.sender.moveLastTime = (new Date()).getTime();
				        Modules.socket.sender.moveLastX = x;
				        Modules.socket.sender.moveLastY = y;
				    }
				}
			}
		},

		moveLastTime: null,
		moveLastX: -1,
		moveLastY: -1,

		score: function(time) {
			if (Modules.socket.connected) {
				Modules.socket.connection.send(JSON.stringify({
		            type: 'score',
		            time: time
		        }));
			}
		},
	}
}