/**
 * GHOST
 */

Modules.ghost = {
	start: function() {

	},

	ghosts: [],

	add: function(message) {
		if (Levels.main.started) {
			this.ghosts[message.nickname] = {};

			//The sprite
			this.ghosts[message.nickname].sprite = game.add.sprite(32, 32, 'dude');
			this.ghosts[message.nickname].sprite.animations.add('right', [5, 6, 7, 8], 10, true);
			this.ghosts[message.nickname].sprite.animations.play('right');
			this.ghosts[message.nickname].sprite.alpha = 0.5;

			//The text
			this.ghosts[message.nickname].text = game.add.text(this.ghosts[message.nickname].sprite.x + (this.ghosts[message.nickname].sprite.width / 2), this.ghosts[message.nickname].sprite.y, message.nickname, {
	            font: "10 px Arial",
	            fill: "#ffffff",
	            align: "center"
	        });

	        this.ghosts[message.nickname].text.anchor.setTo(0.5, 1);
		}
	},

	move: function(message) {
		if (this.ghosts[message.nickname] == undefined) {
			this.add(message);
		}

		if (this.ghosts[message.nickname] != undefined) {
			this.ghosts[message.nickname].sprite.x = message.x;
			this.ghosts[message.nickname].sprite.y = message.y;

			this.ghosts[message.nickname].text.x = this.ghosts[message.nickname].sprite.x + (this.ghosts[message.nickname].sprite.width / 2);
        	this.ghosts[message.nickname].text.y = this.ghosts[message.nickname].sprite.y;
		}
	}
}