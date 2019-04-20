var SpaceHipster = SpaceHipster || {};

SpaceHipster.GameState = {
    
    //init game
    init: function(currentLevel) {
        this.scale.scaleMode - Phaser.ScaleManager.SHOW_ALL;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.PLAYER_SPEED = 200;
        this.BULLET_SPEED = -1000;

        // level data
        this.numLevels = 3;  // hardcoded only for dev/troubleshooting
        this.currentLevel = currentLevel ? currentLevel : 1;
        console.log('current level:' + this.currentLevel)

    },

    // load the gaem assets
    preload: function() {
        this.load.image('space', '../../images/space.png');
        this.load.image('player', '../../images/player.png');
        this.load.image('bullet', '../../images/bullet.png');
        this.load.image('enemyParticle', '../../images/enemyParticle.png');
        this.load.spritesheet('yellowEnemy', '../../images/yellow_enemy.png', 50, 46, 3, 1, 1);
        this.load.spritesheet('redEnemy', '../../images/red_enemy.png', 50, 46, 3, 1, 1);
        this.load.spritesheet('greenEnemy', '../../images/green_enemy.png', 50, 46, 3, 1, 1);

    },

    // execute some stuff
    create: function() {
        this.background = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'space');
        this.background.autoScroll(0, 30);

        // player
        this.player = this.add.sprite(this.game.world.centerX, this.game.world.height - 50, 'player');
        this.player.anchor.setTo(0.5);
        this.game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;

        // bullets
        this.initBullets();
        this.shootingTimer = this.game.time.events.loop(Phaser.Timer.SECOND/5, this.createPlayerBullet, this);

        // init the enemies
        this.initEnemies();

        // load level
        this.loadLevel();

    },

    // dynamically update
    update: function() {

        this.game.physics.arcade.overlap(this.playerBullets, this.enemies, this.damageEnemy, null, this);
        this.game.physics.arcade.overlap(this.enemyBullets, this.player, this.killPlayer, null, this);

        // player not moving by default
        this.player.body.velocity.x = 0;

        if(this.game.input.activePointer.isDown) {
            var targetX = this.game.input.activePointer.position.x;
            
            var direction = targetX >= this.game.world.centerX ? 1 : -1;

            this.player.body.velocity.x = direction * this.PLAYER_SPEED;
        }
    },

    initBullets: function() {
        this.playerBullets = this.add.group();
        this.playerBullets.enableBody = true;
    },

    createPlayerBullet: function() {
        //console.info('bullet created');
        var bullet = this.playerBullets.getFirstExists(false);

        if(!bullet) {
            bullet = new SpaceHipster.PlayerBullet(this.game, this.player.x, this.player.top);
            this.playerBullets.add(bullet);
            
        } else {
            // reset position
            bullet.reset(this.player.x, this.player.top);
        };
        // set velocity
        bullet.body.velocity.y = this.BULLET_SPEED;

    },

    initEnemies: function() {
        this.enemies = this.add.group();
        this.enemies.enableBody = true;

        this.enemyBullets = this.add.group();
        this.enemyBullets.enableBody = true;

    },

    damageEnemy: function(bullet, enemy) {
        enemy.damage(1);
        bullet.kill();
    },

    killPlayer: function() {
        this.player.kill();
        this.game.state.start('GameState');
    },

    createEnemy: function(x, y, health, key, scale, speedX, speedY) {
        var enemy = this.enemies.getFirstExists(false);

        if(!enemy) {
            enemy = new SpaceHipster.Enemy(this.game, x, y, key, health, this.enemyBullets);
            this.enemies.add(enemy);
        };

        enemy.reset(x, y, health, key, scale, speedX, speedY);
    },

    loadLevel: function() {
        this.currentEnemyIndex = 0;
        this.levelData = {
            "duration": 5,
            "enemies": [
            {
                "time": 1,
                "x": 0.05,
                "health": 6,
                "speedX": 20, 
                "speedY": 50,
                "key": "greenEnemy",
                "scale": 3
            },
            {
                "time": 2,
                "x": 0.1,
                "health": 3,
                "speedX": 50, 
                "speedY": 50,
                "key": "greenEnemy",
                "scale": 1
            },
            {
                "time": 3,
                "x": 0.1,
                "health": 3,
                "speedX": 50, 
                "speedY": 50,
                "key": "greenEnemy",
                "scale": 1
            },
            {
                "time": 4,
                "x": 0.1,
                "health": 3,
                "speedX": 50, 
                "speedY": 50,
                "key": "greenEnemy",
                "scale": 1
            }]
        };

        // end of level timer
        this.endOfLevelTimer = this.game.time.events.add(this.levelData.duration * 1000, function() {
            console.log('level ended!');

            if(this.currentLevel < this.numLevels){
                this.currentLevel++;
            } else {
                this.currentLevel = 1;
            }
            this.game.state.start('GameState', true, false, this.currentLevel);
        }, this);
        this.scheduleNextEnemy();
    },

    scheduleNextEnemy: function() {
        var nextEnemy = this.levelData.enemies[this.currentEnemyIndex];

        if (nextEnemy) {
            var nextTime = 1000 * (nextEnemy.time - (this.currentEnemyIndex == 0 ? 0 : this.levelData.enemies[this.currentEnemyIndex - 1].time));

            this.nextEnemyTimer = this.game.time.events.add(nextTime, function() {
                this.createEnemy(nextEnemy.x * this.game.world.width, -100, nextEnemy.health, nextEnemy.key, nextEnemy.scale, nextEnemy.speedX, nextEnemy.speedY);
                this.currentEnemyIndex++;
                this.scheduleNextEnemy();
            }, this)
        }
    }


}