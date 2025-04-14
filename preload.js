

class Load extends Phaser.Scene { //inherits all the charactersitcs tfrom Phase.Scene

    constructor() {
        super("bootGame"); //identifier for scene
    }

    //Preload any images, animations and sounds here 
    preload() {
        this.load.image("menu_background", "assets/background-menu.jpg");
        this.load.image("scene_background", "assets/background-sprite.png");
        this.load.image('worldMap', 'assets/world-map.jpg'); // Load the world map
        this.load.image("destroyed_node", "assets/destroyed_node.png");
       
        this.load.spritesheet("player", "assets/ship.png", {  //Load Bee
            frameWidth: 256,
            frameHeight: 256
        });
        this.load.spritesheet("pollen_node", "assets/pollen_node.png", {    //Load pollen node
            frameWidth: 256,
            frameHeight: 256
        });
        this.load.spritesheet("green_pollen", "assets/green_pollen.png", {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.spritesheet("red_pollen", "assets/red_pollen.png", {
            frameWidth: 128,
            frameHeight: 128
        });
        this.load.spritesheet("beam", "assets/beam.png", {
            frameWidth: 100,
            frameHeight: 50
        });
        this.load.spritesheet("explosion", "assets/explosion.png", {
            frameWidth: 130,
            frameHeight: 130
        });
        this.load.spritesheet("explosion2", "assets/explosion2.png", {
            frameWidth: 128,
            frameHeight: 128
        });

        //load sounds 
        this.load.audio("collect","sounds/misc_menu_4.wav");
        this.load.audio("hurt","sounds/negative_2.wav");
        this.load.audio("fly","sounds/fly.mp3");
        this.load.audio("laser","sounds/laser.mp3");
        this.load.audio("explosion","sounds/explosion.mp3");
        this.load.audio("hurt_man","sounds/hurt_man.mp3");
        this.load.audio("boom","sounds/pop.mp3");
        this.load.audio("break","sounds/boom2.mp3");
        
        //load font
        this.load.bitmapFont("peaFont","fonts/GoldPeaberry.png","fonts/GoldPeaberry.xml" );
        
    }


    create() {
             // Create animations - functions that can called 
        this.anims.create({    
            key: "character_anim",
            frames: this.anims.generateFrameNumbers("player"),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "pollen_node_anim",
            frames: this.anims.generateFrameNumbers("pollen_node"),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: "green_pollen_anim",
            frames: this.anims.generateFrameNumbers("green_pollen"),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: "red_pollen_anim",
            frames: this.anims.generateFrameNumbers("red_pollen"),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: "beam_anim",
            frames: this.anims.generateFrameNumbers("beam"),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "explosion_anim",
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate: 30,
            repeat: 0
        });
        this.anims.create({
            key: "explosion2_anim",
            frames: this.anims.generateFrameNumbers("explosion2"),
            frameRate: 45,
            repeat: 0
        });

        this.add.text(20, 20, "Loading game..."); //text on first loading screen
        this.scene.start("mainMenu");
        
    }
}