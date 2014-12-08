var Modules = {};

Modules.monitor = {
	start: function () {
		Reveal.addEventListener('slidechanged', function( event ) {
			if ($(event.currentSlide).hasClass('heart')) {
				if (!Modules.monitor.initialized) {
					Modules.monitor.init();
				}
			} else {
				if (Modules.monitor.initialized) {
					clearInterval(Modules.monitor.sendInterval);
					clearInterval(Modules.monitor.canvasInterval);
					Modules.monitor.initialized = false;
				}
			}
		});

		ratchet.on(1, this.callback);
	},

	init: function() {
		var monitor = $('canvas.monitor').get(0);

		var canvasWidth = 600,
		canvasHeight = 400;

		monitor.width = canvasWidth;
		monitor.height = canvasHeight;

		var ctx = monitor.getContext('2d');
		Modules.monitor.ctx = ctx;

		ctx.save();

		var screenWidth = Modules.monitor.screenWidth,
		screenHeight = Modules.monitor.screenHeight,
		screenTop = Modules.monitor.screenTop,
		screenLeft = Modules.monitor.screenLeft;

		ctx.shadowBlur = 0;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		Modules.monitor.screenBackgroundRender ( 1 );

		Modules.monitor.line.posX = screenLeft;
		Modules.monitor.line.posY = screenTop + screenHeight;

		Modules.monitor.line2.posX = screenLeft;
		Modules.monitor.line2.posY = screenTop + screenHeight;

		Modules.monitor.canvasInterval = setInterval(function() {
			ctx.restore();

			if ( Modules.monitor.line.posX == screenLeft) {
				Modules.monitor.screenBackgroundRender(1);
			}
			
			//Line 1
			ctx.beginPath ();

			ctx.moveTo( Modules.monitor.line.posX, Modules.monitor.line.posY );
			Modules.monitor.line.posX = Modules.monitor.line.posX + 1;

			if ( Modules.monitor.line.posX > screenLeft + screenWidth ) {
				Modules.monitor.line.posX = screenLeft;
				ctx.moveTo( Modules.monitor.line.posX, Modules.monitor.line.posY );
			}

			ctx.lineTo( Modules.monitor.line.posX, Modules.monitor.line.posY );
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#33ff33';
			ctx.stroke();
			ctx.closePath();

			//Line 2
			ctx.beginPath ();

			ctx.moveTo( Modules.monitor.line2.posX, Modules.monitor.line2.posY );
			Modules.monitor.line2.posX = Modules.monitor.line2.posX + 1;

			if ( Modules.monitor.line2.posX > screenLeft + screenWidth ) {
				Modules.monitor.line2.posX = screenLeft;
				ctx.moveTo( Modules.monitor.line2.posX, Modules.monitor.line2.posY );
			}

			ctx.lineTo( Modules.monitor.line2.posX, Modules.monitor.line2.posY );
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#ff3333';
			ctx.stroke();
			ctx.closePath();
		}, 6);

		Modules.monitor.sendInterval = setInterval(function() {
			ratchet.emit('ping', {time: new Date().getTime()});
			Modules.monitor.beat1();
		}, 500);

		Modules.monitor.initialized = true;
	},

	canvasInterval: null,
	ctx: null,
	screenWidth: 600,
	screenHeight: 400,
	screenTop: 5,
	screenLeft: 5,
	interval: 10,
	initialized: false,
	latency: 0,

	line: {
		posX: 0,
		posY: 0,
		direction: ''
	},

	line2: {
		posX: 0,
		posY: 0,
		direction: ''
	},

	beat1: function() {
		var screenWidth = Modules.monitor.screenWidth,
		screenHeight = Modules.monitor.screenHeight,
		screenTop = Modules.monitor.screenTop,
		screenLeft = Modules.monitor.screenLeft;

		var total = screenTop + screenHeight - (screenTop + 5);

		if (Modules.monitor.line.direction == '') {

			var interval = setInterval(function() {

				if (Modules.monitor.line.direction == '') {
					Modules.monitor.line.direction = 'up';
				} else if (Modules.monitor.line.direction == 'up') {
					if (Modules.monitor.line.posY > screenTop + 5) {
						Modules.monitor.line.posY = Modules.monitor.line.posY - 2;
					} else {
						Modules.monitor.line.direction = 'down';
					}
				} else if (Modules.monitor.line.direction == 'down') {
					if (Modules.monitor.line.posY < screenTop + screenHeight) {
						Modules.monitor.line.posY = Modules.monitor.line.posY + 2;
					} else {
						Modules.monitor.line.direction = '';
						clearInterval(interval);
					}
				}

			}, 1);

		}
	},

	beat2: function() {
		var screenWidth = Modules.monitor.screenWidth,
		screenHeight = Modules.monitor.screenHeight,
		screenTop = Modules.monitor.screenTop,
		screenLeft = Modules.monitor.screenLeft;

		var total = screenTop + screenHeight - (screenTop + 5);
		var latency = Modules.monitor.latency;

		if (Modules.monitor.line2.direction == '') {

			var interval = setInterval(function() {
				if (Modules.monitor.line2.direction == '') {
					Modules.monitor.line2.direction = 'up';
				} else if (Modules.monitor.line2.direction == 'up') {
					if (Modules.monitor.line2.posY > screenTop + 5) {
						Modules.monitor.line2.posY = Modules.monitor.line2.posY - 2;
					} else {
						Modules.monitor.line2.direction = 'down';
					}
				} else if (Modules.monitor.line2.direction == 'down') {
					if (Modules.monitor.line2.posY < screenTop + screenHeight) {
						Modules.monitor.line2.posY = Modules.monitor.line2.posY + 2;
					} else {
						Modules.monitor.line2.direction = '';
						console.log(interval);
						clearInterval(interval);
					}
				}
			}, 1);

		}
	},

	callback: function(data) {
		if (data.type == 'ping' && Modules.monitor.initialized) {
			var time = new Date().getTime();
			Modules.monitor.latency = time - parseInt(data.time);

			$('.heart.monitor span').html(Modules.monitor.latency);

			Modules.monitor.beat2();

			console.log(data);
		}
	},

	screenBackgroundRender: function(a) {
		var ctx = Modules.monitor.ctx;
		var screenWidth = Modules.monitor.screenWidth,
			screenHeight = Modules.monitor.screenHeight,
			screenTop = Modules.monitor.screenTop,
			screenLeft = Modules.monitor.screenLeft;

		ctx.beginPath();

		ctx.fillStyle = 'rgba( 20, 20, 20, ' + a + ' )';
		ctx.fillRect ( screenLeft, screenTop, screenWidth, screenHeight );
		
		ctx.closePath ();

		ctx.beginPath ();

		for ( var j = 10 + screenTop; j < screenTop + screenHeight; j = j + 10 ) {
			ctx.moveTo( screenLeft, j );
			ctx.lineTo( screenLeft + screenWidth, j );
		}
		
		for ( var i = 10 + screenLeft; i < screenLeft + screenWidth; i = i + 10 ) {
			ctx.moveTo( i, screenTop );
			ctx.lineTo( i, screenTop + screenHeight );
		}
		
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'rgba( 20, 50, 20, ' + a + ' )';
		ctx.stroke();
		ctx.closePath();
	},

	sendInterval: null
}

Modules.nickname = {
	start: function() {
		$('.nickname .button').on('tap', function(event) {
			event.preventDefault();

			Modules.sound.horn();

			var nickname = $('.nickname input[type="text"]').val();

			if (nickname != '') {
				$('.nickname .ajax').show();
				$('.nickname .button').hide();

				$.post('/nickname', {nickname: nickname}, function(data) {
					$('.nickname .ajax').hide();
					$('.nickname .message').html(data.message);

					if (data.success) {
						setTimeout(function() {
							$('.nickname').hide();
						}, 3000);

						if (ratchet.connected) {
							ratchet.connection.close();
						}
					} else {
						$('.nickname .button').show();
					}
				}, 'json');
			}
		});
	},
}

Modules.questions = {
	start: function () {
		Reveal.addEventListener('slidechanged', function( event ) {
			if ($(event.currentSlide).hasClass('questions-slide')) {
				if (!Modules.questions.initialized) {
					Modules.questions.init();
				}
			} else {
				if (Modules.questions.initialized) {
					Modules.questions.initialized = false;
					$('div.questions').hide();
				}
			}
		});

		$('div.questions .button').on('tap', function(event) {
			event.preventDefault();

			var question = $('div.questions input[type="text"]').val();

			if (question != '') {
				ratchet.emit('question', {question: question});
				$('div.questions input[type="text"]').val('');
				Modules.sound.horn();
			}
		});

		ratchet.on(1, this.callback);
	},

	callback: function(data) {
		if (data.type == 'question') {
			if ($('div.questions .messages').length > 0) {
				$('div.questions .messages').prepend('<div class="message"><p><strong>' + data.nickname + '</strong>: ' + data.question + '</p></div>');
			}
		}
	},

	initialized: false,

	init: function() {
		$('div.questions').show();
		Modules.questions.initialized = true;
	}
}

Modules.sound = {
	start: function() {
		 createjs.Sound.alternateExtensions = ['mp3'];
		 createjs.Sound.registerSound('sounds/horn.ogg', 'horn');
	},

	horn: function() {
		var instance = createjs.Sound.play('horn');  // play using id.  Could also use full sourcepath or event.src.
	    instance.volume = 0.5;
	}
}

Modules.horn = {
	start: function() {
		//Listener do botão
		$('.horn.button').on('tap', function(event) {
			event.preventDefault();

			Modules.sound.horn();

			ratchet.emit('horn', {});
			Modules.horn.countMe++;
			Modules.horn.renderCounter();
		});

		$('.horn.button span').on('tap', function(event) {
			event.preventDefault();
		});

		//Listener do socket
		ratchet.on(1, this.callback);
	},

	countMe: 0,

	countOthers: 0,

	callback: function(data) {
		if (data.type == 'horn') {
			Modules.sound.horn();
			Modules.horn.countOthers++;
			Modules.horn.renderCounter();
		}
	},

	renderCounter: function() {
		$('.horn.counter').html(Modules.horn.countMe + '/' + Modules.horn.countOthers);
	}
}

Modules.poll = {
	start: function() {
		//Listener dos botões
		$('.poll .button-level').on('tap', function(event) {
			event.preventDefault();

			var poll = $(this).closest('.poll');

			if (!$(poll).hasClass('votado')) {
				ratchet.emit('poll', {number: $(poll).attr('data-number'), value: $(this).attr('data-value')});
				$(poll).addClass('votado');
			}
		});

		$('.poll .button-level span').on('tap', function(event) {
			event.preventDefault();
		});

		//Listener do socket
		ratchet.on(1, this.callback);
	},

	callback: function(data) {
		if (data.type == 'poll-result') {
			var poll = $('.poll[data-number="' + data.number + '"]');

			$.each(data.votes, function(index, quantity) {
				poll.find('.button-level[data-value="' + index + '"]').find('span b').html(quantity);
			});

			$.each(data.percentages, function(index, quantity) {
				poll.find('.button-level[data-value="' + index + '"]').find('.level').height(quantity + '%');
			});
		}
	},
}

//Inicia todos os módulos
for(var propertyName in Modules) {
   Modules[propertyName].start();
}
