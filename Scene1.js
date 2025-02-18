

class Scene1 extends Phaser.Scene { //inherits all the charactersitcs tfrom Phase.Scene

    constructor() {
        super("bootGame"); //identifier for scene
    }
    preload() {
        this.load.image("background", "assets/background-sprite.png");
        this.load.spritesheet("sap", "assets/r1-sprite.png", {
            frameWidth: 512,
            frameHeight: 512

        });
        this.load.spritesheet("nectar", "assets/r2-sprite.png", {
            frameWidth: 512,
            frameHeight: 512
        });

        this.load.spritesheet("pollen", "assets/r3-sprite.png", {
            frameWidth: 512, 
            frameHeight: 512
        });

        this.load.spritesheet("explosion", "assets/explosion.png", {
            frameWidth: 130,
            frameHeight: 130
        });
        this.load.spritesheet("pollen_sprite", "assets/pollen_sprite.png", {
            frameWidth: 256,
            frameHeight: 256
        });
        this.load.spritesheet("player", "assets/bee.png", {
            frameWidth: 256,
            frameHeight: 256
        });
        this.load.spritesheet("beam", "assets/bullet_sprite.png", {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.spritesheet("pollen_node", "assets/pollen_node.png", {
            frameWidth: 256,
            frameHeight: 256
        });
        
    }


    create() {
             // Create animations - functions that can called 
        this.anims.create({
            key: "nectar_anim",
            frames: this.anims.generateFrameNumbers("nectar"),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "sap_anim",
            frames: this.anims.generateFrameNumbers("sap"),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "pollen_anim",
            frames: this.anims.generateFrameNumbers("pollen"),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
        });
        this.anims.create({
            key: "powerup_anim1",
            frames: this.anims.generateFrameNumbers("pollen_sprite",{
                start: 0,
                end: 1
            }),
            frameRate: 5,
            repeat: -1,
        });
        this.anims.create({
            key: "powerup_anim2",
            frames: this.anims.generateFrameNumbers("pollen_sprite",{
                start: 2,
                end: 3
            }),
            frameRate: 5,
            repeat: -1,
        });
        this.anims.create({
            key: "bee_anim",
            frames: this.anims.generateFrameNumbers("player"),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "beam_anim",
            frames: this.anims.generateFrameNumbers("beam"),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "pollen_node_anim",
            frames: this.anims.generateFrameNumbers("pollen_node"),
            frameRate: 5,
            repeat: -1
        });



        this.add.text(20, 20, "Loading game..."); //text on first loading screen
        this.scene.start("playGame");
        
    }
}