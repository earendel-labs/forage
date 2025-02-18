/// <reference path="./node_modules/phaser/types/phaser.d.ts" />
    var gameSetting = {
        playerSpeed: 200
    }
    
    var config = {
        width: 1280,
        height: 720,
        backgroundColor: 0x000000,
        scene: [Scene1, Scene2],
        physics: {
            default: "arcade",
            arcade: {
                debug: false
            }
        } 
    }   

    var game = new Phaser.Game(config);
