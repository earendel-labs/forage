/// <reference path="./node_modules/phaser/types/phaser.d.ts" />

var gameSetting = {
    playerSpeed: 400,
    mapSpeed: 600, //map speed for the world map 
    backgroundSpeed: 4 //controls scroll on map for pollen buster 
    
}

var config = {
    width: 1280,
    height: 720,
    backgroundColor: 0x000000,
    scene: [Load, MainMenu,PlayScene,MapScene],
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    } 
}   

var game = new Phaser.Game(config);
