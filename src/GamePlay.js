var AMOUNT_DIAMONDS = 30;

class GamePlayScene extends Phaser.Scene {
    constructor() {
        super({ key: "GamePlayScene" });
    }

    preload() {
        this.load.image("background", "assets/images/background.png");
        this.load.spritesheet("horse", "assets/images/horse.png", {
            frameWidth: 84,
            frameHeight: 156,
        });
        this.load.spritesheet("diamonds", "assets/images/diamonds.png", {
            frameWidth: 81,
            frameHeight: 84,
        });
        this.load.spritesheet("explosion", "assets/images/explosion.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
    }

    create() {
        this.add.image(0, 0, "background").setOrigin(0, 0);

        this.horse = this.physics.add.sprite(
            this.sys.game.config.width / 2,
            this.sys.game.config.height / 2,
            "horse"
        );
        this.horse.setOrigin(0.5, 0.5);
        this.horse.setFrame(1);

        this.input.on("pointerdown", this.onTap, this);

        this.diamonds = this.physics.add.group({
            key: "diamonds",
            repeat: AMOUNT_DIAMONDS - 1,
            setXY: { x: 50, y: 50, stepX: 100, stepY: 100 },
        });

        Phaser.Actions.ScaleXY(this.diamonds.getChildren(), -0.5, -0.5);
        Phaser.Actions.Call(
            this.diamonds.getChildren(),
            function(diamond) {
                diamond.setFrame(Phaser.Math.Between(0, 3));
                diamond.setScale(0.3 + Math.random());
            },
            this
        );

        this.explosionGroup = this.physics.add.group({
            defaultKey: "explosion",
            maxSize: 10,
        });

        this.diamonds.getChildren().forEach((diamond) => {
            diamond.setInteractive();
            this.physics.add.overlap(
                this.horse,
                diamond,
                this.collectDiamond,
                null,
                this
            );
        });

        this.currentScore = 0;
        this.scoreText = this.add
            .text(this.sys.game.config.width / 2, 40, "0", {
                font: "bold 30pt Arial",
                fill: "#FFFFFF",
                align: "center",
            })
            .setOrigin(0.5, 0.5);
    }

    update() {
        if (this.flagFirstMouseDown) {
            var pointerX = this.input.x;
            var pointerY = this.input.y;

            var distX = pointerX - this.horse.x;
            var distY = pointerY - this.horse.y;

            if (distX > 0) {
                this.horse.scaleX = 1;
            } else {
                this.horse.scaleX = -1;
            }

            this.horse.x += distX * 0.02;
            this.horse.y += distY * 0.02;
        }
    }

    onTap(pointer) {
        this.flagFirstMouseDown = true;
    }

    collectDiamond(horse, diamond) {
        diamond.disableBody(true, true);
        this.increaseScore();

        var explosion = this.explosionGroup.getFirstDead(false);
        if (explosion) {
            explosion.enableBody(true, diamond.x, diamond.y, true, true);
            explosion.play("explode", true);
            explosion.on("animationcomplete", () => {
                explosion.disableBody(true, true);
            });
        }
    }

    increaseScore() {
        this.currentScore += 100;
        this.scoreText.setText(this.currentScore);
    }
}

var config = {
    type: Phaser.AUTO,
    width: 1136,
    height: 648,
    scene: GamePlayScene,
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
        },
    },
};

var game = new Phaser.Game(config);

// var AMOUNT_DIAMONDS = 30;
// var config = {
//     type: Phaser.AUTO,
//     width: 1136,
//     height: 648,
//     scene: {
//         preload: preload,
//         create: create,
//         update: update,
//     },
// };
// var game = new Phaser.Game(config);

// GamePlayManager = {
//     init: function() {
//         game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
//         game.scale.pageAlignHorizontally = true;
//         game.scale.pageAlignVertically = true;

//         this.flagFirstMouseDown = false;
//     },

//     preload: function() {
//         this.load.image("background", "assets/images/background.png");
//         this.load.spritesheet("horse", "assets/images/horse.png", {
//             frameWidth: 84,
//             frameHeight: 156,
//         });
//         this.load.spritesheet("diamonds", "assets/images/diamonds.png", {
//             frameWidth: 81,
//             frameHeight: 84,
//         });
//         this.load.spritesheet("explosion", "assets/images/explosion.png");
//     },
//     create: function() {
//         this.add.image(0, 0, "background").setOrigin(0, 0);
//         this.horse = this.add.sprite(
//             this.sys.game.config.width / 2,
//             this.sys.game.config.height / 2,
//             "horse"
//         );
//         this.horse.setOrigin(0.5, 0.5);
//         this.horse.setFrame(1);

//         this.input.on("pointerdown", onTap, this);

//         this.diamonds = [];
//         for (var i = 0; i < AMOUNT_DIAMONDS; i++) {
//             var diamond = this.add.sprite(100, 100, "diamonds");
//             diamond.setFrame(Phaser.Math.Between(0, 3));
//             diamond.setScale(0.3 + Math.random());
//             diamond.setOrigin(0.5, 0.5);
//             diamond.setPosition(
//                 Phaser.Math.Between(50, 1050),
//                 Phaser.Math.Between(50, 600)
//             );

//             this.diamonds[i] = diamond;
//         }

//         this.explosionGroup = this.add.group({
//             defaultKey: "explosion",
//             maxSize: 10,
//         });

//         for (var i = 0; i < 10; i++) {
//             var explosion = this.explosionGroup.get();
//             explosion.setActive(false);
//             explosion.setVisible(false);
//             explosion.setOrigin(0.5, 0.5);
//         }

//         this.currentScore = 0;
//         this.scoreText = this.add
//             .text(this.sys.game.config.width / 2, 40, "0", {
//                 font: "bold 30pt Arial",
//                 fill: "#FFFFFF",
//                 align: "center",
//             })
//             .setOrigin(0.5, 0.5);
//     },
//     increseScore: function() {
//         this.currentScore += 100;
//         this.scoreText.text = this.currentScore;
//     },
//     onTap: function() {
//         this.flagFirstMouseDown = true;
//     },
//     getBoundsDiamond: function(currentDiamond) {
//         return new Phaser.Rectangle(
//             currentDiamond.left,
//             currentDiamond.top,
//             currentDiamond.width,
//             currentDiamond.height
//         );
//     },
//     isReactanglesOverlapping: function(rect1, rect2) {
//         if (rect1.x > rect2.x + rect2.width || rect2.x > rect1.x + rect1.width) {
//             return false;
//         }
//         if (rect1.y > rect2.y + rect2.height || rect2.y > rect1.y + rect1.height) {
//             return false;
//         }
//         return true;
//     },
//     isOverlapingOtherDiamond: function(index, rect2) {
//         for (var i = 0; i < index; i++) {
//             var rect1 = this.getBoundsDiamond(this.diamonds[i]);
//             if (this.isReactanglesOverlapping(rect1, rect2)) {
//                 return true;
//             }
//         }
//     },
//     getBoundsHorse: function() {
//         var x0 = this.horse.x - Math.abs(this.horse.width) / 4;
//         var width = Math.abs(this.horse.width) / 2;
//         var y0 = this.horse.y - this.horse.height / 2;
//         var height = this.horse.height;
//         return new Phaser.Rectangle(x0, y0, width, height);
//     },
//     update: function() {
//         if (this.flagFirstMouseDown) {
//             var pointerX = game.input.x;
//             var pointerY = game.input.y;

//             var distX = pointerX - this.horse.x;
//             var distY = pointerY - this.horse.y;

//             if (distX > 0) {
//                 this.horse.scale.setTo(1, 1);
//             } else {
//                 this.horse.scale.setTo(-1, 1);
//             }

//             //Velocidad del caballo
//             this.horse.x += distX * 0.02;
//             this.horse.y += distY * 0.02;

//             for (var i = 0; i < AMOUNT_DIAMONDS; i++) {
//                 var rectHorse = this.getBoundsHorse();
//                 var rectDiamond = this.getBoundsDiamond(this.diamonds[i]);

//                 if (
//                     this.diamonds[i].visible &&
//                     this.isReactanglesOverlapping(rectHorse, rectDiamond)
//                 ) {
//                     this.increseScore();
//                     this.diamonds[i].visible = false;

//                     var explosion = this.explosionGroup.getFirstDead();
//                     if (explosion != null) {
//                         explosion.reset(this.diamonds[i].x, this.diamonds[i].y);
//                         explosion.tweenScale.start();
//                         explosion.tweenAlpha.start();

//                         explosion.tweenAlpha.onComplete.add(function(
//                                 currentTarget,
//                                 currentTween
//                             ) {
//                                 currentTarget.kill();
//                             },
//                             this);
//                     }
//                 }
//             }
//         }
//     },
// };

// // var game = new Phaser.Game(1136, 648, Phaser.AUTO);
// var game = new Phaser.Game(1136, 648, Phaser.CANVAS);

// game.state.add("gameplay", GamePlayManager);
// game.state.start("gameplay");