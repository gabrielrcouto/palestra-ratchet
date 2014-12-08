/**
 * SCORE
 */

Modules.score = {
	start: function() {
		
	},

	init: function() {
		this.timerText = game.add.text(Modules.phaser.gameWidth / 2, 0, '0', {
	        font: "65px Arial",
	        fill: "#ffffff",
	        align: "center"
	    });

		this.timerText.fixedToCamera = true;

	    this.timerText.anchor.setTo(0.5, 0);

	    this.startTimer();
	},

	timerCount: 0,

	timerText: null,

	timerInterval: null,

	timerStart: null,

	best: null,

	startTimer: function() {
		Modules.score.timerStart = null;

		this.timerCount = 0;
	    this.timerText.text = this.timerCount;

	    $(window).on('updateLoop', Modules.score.updateTimer);
	},

	updateTimer: function(event) {
		if (Modules.score.timerStart == null) {
			Modules.score.timerStart = (new Date()).getTime();
			Modules.score.timerCount = 0;
		} else {
			Modules.score.timerCount = (new Date()).getTime() - Modules.score.timerStart;	
		}
		
    	Modules.score.timerText.text = (Modules.score.timerCount / 1000).toFixed(3);
	},

	stopTimer: function() {
		$(window).off('updateLoop', Modules.score.updateTimer);

		if (Modules.score.best == null || Modules.score.best > Modules.score.timerCount) {
			Modules.score.best = Modules.score.timerCount;
		}

		//Send the score
		Modules.socket.sender.score(Modules.score.best);
	},

	showTable: function() {
		$('#scores').show();
	},

	hideTable: function() {
		$('#scores').hide();
	},

	refreshTable: function(table) {
		$('#scores table').html('');

		$.each(table, function(index, row) {
			$('#scores table').append('<tr><td>' + index + '</td><td>' + row.nickname + '</td><td>' + (row.time / 1000).toFixed(3) + '</td></tr>');
		});
	}
}