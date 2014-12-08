/**
 * MAIN LEVEL
 */

Levels.main = {

    map: null,
    
    tileset: null,
    
    layer: null,
    
    player: null,
    
    facing: 'left',
    
    jumpTimer: 0,
    
    cursors: null,
    
    jumpButton: null,

    jumpLocked: false,

    bg: null,

    finished: false,

    playerName: null,

    started: false,

    restartButton: null,

    nickname: 'Bob',

    frames: 0,

    start: function() {

    },

    preload: function() {
        game.load.tilemap('level1', 'images/level1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles-1', 'images/tiles-1.png');
        game.load.image('tiles-2', 'images/tiles-2.png');
        game.load.spritesheet('dude', 'images/dude.png', 32, 48);
        game.load.spritesheet('droid', 'images/droid.png', 32, 32);
        game.load.image('starSmall', 'images/star.png');
        game.load.image('starBig', 'images/star2.png');
        game.load.image('background', 'images/background2.png');
        game.load.spritesheet('button', 'images/retry.png', 150, 47);

        //No multitouch
        game.input.maxPointers = 1;

        //Center the game
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        game.scale.forceOrientation(true, false);

        game.scale.width = window.innerWidth;
        game.scale.height = window.innerWidth / Modules.phaser.gameAspectRatio;

        if (game.scale.height > window.innerHeight) {
            game.scale.height = window.innerHeight;
            game.scale.width = window.innerHeight * Modules.phaser.gameAspectRatio;
        }

        $(window).resize(function() {
            game.scale.width = window.innerWidth;
            game.scale.height = window.innerWidth / Modules.phaser.gameAspectRatio;

            if (game.scale.height > window.innerHeight) {
                game.scale.height = window.innerHeight;
                game.scale.width = window.innerHeight * Modules.phaser.gameAspectRatio;
            }

            game.scale.setSize();
        });

        game.scale.setSize();
    },

    create: function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.stage.backgroundColor = '#000000';

        Levels.main.bg = game.add.tileSprite(0, 0, 800, 600, 'background');

        Levels.main.bg.fixedToCamera = true;

        Levels.main.map = game.add.tilemap('level1');

        Levels.main.map.addTilesetImage('tiles-1');
        Levels.main.map.addTilesetImage('tiles-2');

        Levels.main.map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51, 69, 70, 71, 72 ]);

        Levels.main.layer = Levels.main.map.createLayer('Tile Layer 1');

        Levels.main.map.setTileIndexCallback([ 69, 70, 71, 72 ], Levels.main.flagCallback, this, 'Tile Layer 1');

        //  Un-comment this on to see the collision tiles
        // layer.debug = true;

        Levels.main.layer.resizeWorld();

        game.physics.arcade.gravity.y = 1000;

        Levels.main.player = game.add.sprite(32, 32, 'dude');
        game.physics.enable(Levels.main.player, Phaser.Physics.ARCADE);

        Levels.main.player.body.bounce.y = 0.2;
        Levels.main.player.body.collideWorldBounds = true;
        Levels.main.player.body.setSize(20, 32, 5, 16);

        Levels.main.player.animations.add('left', [0, 1, 2, 3], 10, true);
        Levels.main.player.animations.add('turn', [4], 20, true);
        Levels.main.player.animations.add('right', [5, 6, 7, 8], 10, true);

        game.camera.follow(Levels.main.player, Phaser.Camera.FOLLOW_PLATFORMER);

        Levels.main.cursors = game.input.keyboard.createCursorKeys();
        Levels.main.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        //Start the score
        Modules.score.init();
        $(window).trigger('updateLoop');

        //Start the player name text
        Levels.main.playerName = game.add.text(Levels.main.player.x + (Levels.main.player.width / 2), Levels.main.player.y, Levels.main.nickname, {
            font: "10 px Arial",
            fill: "#ffffff",
            align: "center"
        });

        Levels.main.playerName.anchor.setTo(0.5, 1);

        //Button
        Levels.main.restartButton = game.add.button((Modules.phaser.gameWidth / 2) - (150 /2), 400, 'button', Levels.main.restart, this, 2, 1, 0);
        Levels.main.restartButton.fixedToCamera = true;
        Levels.main.restartButton.visible = false;

        Levels.main.started = true;

        game.time.events.loop(10, Levels.main.updateLoop, this);

        //Last thing - Positioning the player
        Levels.main.player.x = 0;
        Levels.main.player.y = 300;

        //game.physics.arcade.setBoundsToWorld();
        game.physics.arcade.setBounds(0, 0, 1000, 450);

        //game.physics.arcade.collide(Levels.main.player, Levels.main.layer);
    },

    updateLoop: function() {
        if (Levels.main.frames >= 1) {
            Levels.main.playerName.x = Levels.main.player.x + (Levels.main.player.width / 2);
            Levels.main.playerName.y = Levels.main.player.y;

            if (!Levels.main.finished) {
                Levels.main.player.body.velocity.x = 150;

                if (Levels.main.facing != 'right')
                {
                    Levels.main.player.animations.play('right');
                    Levels.main.facing = 'right';
                }

                //Send the moves to server
                Modules.socket.sender.move(Levels.main.player.x, Levels.main.player.y);

                if ((Levels.main.jumpButton.isDown || game.input.mousePointer.isDown || game.input.pointer1.isDown)) {
                    if (!jumpLocked && Levels.main.player.body.onFloor()) {
                        jumpLocked = true;
                        Levels.main.player.body.velocity.y = -270;
                    }
                } else {
                    jumpLocked = false;
                }
            } else {
                Levels.main.restartButton.visible = true;
            }

            $(window).trigger('updateLoop');
        }
    },

    update: function() {
        game.physics.arcade.collide(Levels.main.player, Levels.main.layer);

        Levels.main.frames++;
    },

    render: function() {
        //game.debug.text(game.time.physicsElapsed, 32, 32);
        //game.debug.body(Levels.main.player);
        //game.debug.bodyInfo(Levels.main.player, 16, 24);
    },

    //Player collided with the flag
    flagCallback: function() {
        if (Levels.main.player.x > 0) {
            Levels.main.finish();
        }
    },

    finish: function() {
        Levels.main.finished = true;

        Modules.score.stopTimer();
        Modules.score.showTable();

        Levels.main.player.animations.stop();
        Levels.main.player.frame = 5;  
        Levels.main.facing = 'idle';
        Levels.main.player.body.velocity.x = 0;

        Levels.main.map.setTileIndexCallback([ 69, 70, 71, 72 ], function() {}, this, 'Tile Layer 1');
    }, 

    restart: function() {
        Levels.main.finished = false;

        Modules.score.hideTable();

        Modules.score.startTimer();

        Levels.main.map.setTileIndexCallback([ 69, 70, 71, 72 ], Levels.main.flagCallback, this, 'Tile Layer 1');

        Levels.main.restartButton.visible = false;

        //Last thing - Positioning the player
        Levels.main.player.x = 0;
        Levels.main.player.y = 300;

        Levels.main.frames = 0;
    }
}
