//import Phaser from 'phaser';


class Scene2 extends Phaser.Scene { //inherits all the charactersitcs tfrom Phase.Scene
    constructor() {
        super("playGame") //identifier for scene
    }
    create() {
        this.background = this.add.tileSprite(0,0,config.width,config.height,"background"); //need to use repeating pattern to make this work
        this.background.setOrigin(0,0);

        this.pollen = this.add.sprite(config.width/2 -300 ,config.height/2, "pollen");   //image
        this.nectar = this.add.sprite(config.width/2  ,config.height/2, "nectar");      //sprite
        this.sap = this.add.sprite(config.width/2 + 300 ,config.height/2,"sap");        //sprite 
        this.nodep = this.add.sprite(config.width/2 + 300 ,config.height/2,"pollen_node");        //sprite 

        this.sap.setScale(0.2);
        this.nectar.setScale(0.2);
        this.pollen.setScale(0.2);
    


       
        //create powerups group 
        this.powerUps = this.physics.add.group();

        var maxObjects = 4;

        for(var i =0; i<maxObjects; i++){
            var powerUp = this.physics.add.sprite(256,256,"pollen_sprite");
            powerUp.setScale(0.2);
            this.powerUps.add(powerUp);
            powerUp.setRandomPosition(0,0,config.width, config.height);

            if(Math.random()>0.5){
                powerUp.play("powerup_anim1");
            } else {
                powerUp.play("powerup_anim2");
            }

            powerUp.setVelocity(100,100); // set the velocity of the power objects we created
            powerUp.setCollideWorldBounds(true); // powerups will colllide with edge of world 
            powerUp.setBounce(1);
        }

        //play animation 
        this.nectar.play("nectar_anim");
        this.sap.play("sap_anim");
        this.pollen.play("pollen_anim");
        this.nodep.play("pollen_node_anim");
       


        //make elements interactive 
        this.sap.setInteractive();
        this.nectar.setInteractive(); 
        this.pollen.setInteractive();

        //Not entirely sure but on click destory ship 
        this.input.on('gameobjectdown',this.destroyShip,this);
    
        this.add.text(20, 20, "Playing game", { font: "25px Arial", fill: "yellow" });

        //add playable character -----------------
        this.player = this.physics.add.sprite(config.width/2 -8, config.height/2 -164, "player");
        this.player.play("bee_anim");

        //gets the input from the keyboard
        this.cursorKeys = this.input.keyboard.createCursorKeys(); 
        //set player to not leave bound 
        this.player.setCollideWorldBounds(true);
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    

    }
    
    moveResource(resource, speed){
        resource.y += speed;
        if (resource.y > config.height){
            this.resetResourcePos(resource);
        }
    }

    resetResourcePos(resource){     //Resets the y axis to 0 and gives random starting for x for reset
        resource.y = 0;
        var randomX = Phaser.Math.Between(0,config.width);
        resource.x = randomX;
    }

    destroyShip(pointer,gameObject) {
        gameObject.setTexture("explosion"); //change object from resrouce to explosion sprite
        gameObject.setScale(2);
        gameObject.play("explode"); // play explosion sprite 
    }

    shootBeam(){
        var beam = new Beam(this);
    }

    update(){
        this.moveResource(this.pollen,1);
        this.moveResource(this.nectar,2);
        this.moveResource(this.sap,3);


        //function to mave playable character - polls keyboard 
        this.movePlayerManager();
        this.background.tilePositionY -= 0
    }


    // function to control the movement of player with left and right 
    movePlayerManager() {
        
        //X axis movement 
        if(this.cursorKeys.left.isDown){
            this.player.setVelocityX(-gameSetting.playerSpeed);
        } else if(this.cursorKeys.right.isDown) {
            this.player.setVelocityX(gameSetting.playerSpeed);
        } else {
            // Reset X velocity if no keys are pressed
            this.player.setVelocityX(0);
        }
        //Y axis movement 
        if(this.cursorKeys.up.isDown){
            this.player.setVelocityY(-gameSetting.playerSpeed);
        } else if(this.cursorKeys.down.isDown) {
            this.player.setVelocityY(gameSetting.playerSpeed);
        }  else {
            // Reset X velocity if no keys are pressed
            this.player.setVelocityY(0);
        }

        // Fire weapon 
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)){
            this.shootBeam();
            console.log("fire")
        }

    }
        
}