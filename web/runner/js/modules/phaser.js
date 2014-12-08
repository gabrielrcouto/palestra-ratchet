/**
 * PHASER
 */

var game;

Modules.phaser = {
	start: function() {
		game = new Phaser.Game(this.gameWidth, this.gameHeight, Phaser.CANVAS, 'phaser-canvas', { 
			preload: Levels.main.preload, 
			create: Levels.main.create, 
			update: Levels.main.update, 
			render: Levels.main.render 
		}, false, false);
	},

	gameHeight: 480,

	gameWidth: 320,

	gameAspectRatio: 320 / 480
}