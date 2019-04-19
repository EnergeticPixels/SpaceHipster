var SpaceHipster = SpaceHipster || {};

SpaceHipster.GameState = {
    
    //init game
    init: function() {
        this.scale.scaleMode - Phaser.ScaleManager.SHOW_ALL;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.PLAYER_SPEED = 200;
        this.BULLET_SPEED = -1000;

    },

    // load the gaem assets
    preload: function() {
        this.load.image('space', '../../images/space.png');
        this.load.image('player', '../../images/player.png');
        this.load.image('bullet', '../../images/enemyParticle.png');
        this.load.spritesheet('yellowEnemy', '../../images/yellow_enemy.png', 50, 46, 3, 1, 1);
        this.load.spritesheet('redEnemy', '../../images/red_enemy.png', 50, 46, 3, 1, 1);
        this.load.spritesheet('greenEnemy', '../../images/green_enemy.png', 50, 46, 3, 1, 1)
    },

    // execute some stuff
    create: function() {
        this.background = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'space');
        this.background.autoScroll(0, 30);

    },

    // dynamically update
    update: function() {

    }

}