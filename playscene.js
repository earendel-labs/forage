
class PlayScene extends Phaser.Scene {
    constructor() {
        super("foragePlayScene"); // Scene key
    }

    create(){
       
        //Load sounds 
        this.collect_sound = this.sound.add("collect");
        this.fly_sound = this.sound.add("fly");
        this.laser_sound = this.sound.add("laser");
        this.hurt_sound = this.sound.add("hurt");

        //Load Background to game and set origin 
        this.background = this.add.tileSprite(0,0,config.width,config.height,"scene_background");
        this.background.setOrigin(0,0);

        //Load playable chacter with tween + alpha 
        this.player = this.physics.add.sprite(config.width/2 , config.height*1.2 , "player");
        this.player.body.setSize(100, 100);
        this.player.play("character_anim");
        this.player.alpha = 0.5;
        this.player.setScale(0.8);
        
        //set player to not leave bound 
        this.player.setCollideWorldBounds(true);
        this.maxHealth = 100;
        this.currentHealth = this.maxHealth;
        // Health bar background
        this.healthBarBackground = this.add.rectangle(config.width - 160, 25, 120, 20, 0x555555);
        this.healthBarBackground.setOrigin(0, 0.5);

        // Health bar fill
        this.healthBarFill = this.add.rectangle(config.width - 160, 25, 120, 20, 0xff0000);
        this.healthBarFill.setOrigin(0, 0.5);

      

        //create listener that polls the spacebar 
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        //gets the input from the keyboard
        this.cursorKeys = this.input.keyboard.createCursorKeys(); 
        

        this.tweens.add({
            targets: this.player,
            y: config.height/2,
            ease: "Linear",
            duration: 250,
            repeat: 0,
            onComplete: function(){
                this.player.alpha = 1;
            },
            callbackScope: this
        });

        //Create interactive elements for game 

        //Create groups for game objects
        this.projectiles = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            runChildUpdate: true
        });

        //create groups for spawning resources 
        this.resources = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            runChildUpdate: true
        });
        this.time.addEvent({
            delay: 1000, // spawn every 2 seconds
            callback: this.spawnResource,
            callbackScope: this,
            loop: true
        });
        //add overlap for projectiles and resources
        this.physics.add.overlap(this.projectiles, this.resources, this.hitResource, null, this);


        //pollen spawning 
        this.greenPollenChance = 1.0; // 100% chance for green at the start
        this.greenPollenGroup = this.physics.add.group();
        this.yellowPollenGroup = this.physics.add.group();
        this.physics.add.overlap(this.player, this.greenPollenGroup, this.collectGreenPollen, null, this);
        this.physics.add.overlap(this.player, this.yellowPollenGroup, this.collectYellowPollen, null, this);

        this.time.addEvent({
            delay: 3000, // every 10 seconds
            callback: () => {
                this.greenPollenChance = Math.max(0.25, this.greenPollenChance - 0.1); // decrease by 10%, down to 0%
                console.log("Green Pollen Chance:", this.greenPollenChance);
            },
            loop: true
        });
        



        //Load Pollen node 
        //this.pollen_node = this.add.sprite(config.width/2 -300 ,config.height/2, "pollen_node");   //image
        //this.pollen_node.play("pollen_node_anim");


        // Add black bar for the top to highlight score
        var graphics = this.add.graphics();
        graphics.fillStyle(0x000000,1);
        graphics.beginPath();
        graphics.moveTo(0,0);
        graphics.lineTo(config.width/5,0);
        graphics.lineTo(config.width/5,50);
        graphics.lineTo(0,50);
        graphics.lineTo(0,0);
        graphics.closePath();
        graphics.fillPath();
        //Score label 
        this.scoreLabel = this.add.bitmapText(10,5,"peaFont", "SCORE", 30);
        this.score = 0;
        this.scoreLabel.text = "SCORE   " + this.score;


    }

    update(){

        //Move player character 
        this.movePlayerManager();

        
        //Shoot beam 
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)){
            if(this.player.active){
                this.shootBeam();
                console.log("shoot");
            }
            
        }
        
        //delete bullest once they leave the screen 
        this.projectiles.children.iterate((bullet) => {
            if (bullet && bullet.active && bullet.y < -50) {
                bullet.setActive(false);
                bullet.setVisible(false);
                bullet.body.stop(); // Stop movement
            }
        });

        this.resources.children.iterate((res) => {
            if (res && res.active && res.y > config.height + 50) {
                res.setActive(false);
                res.setVisible(false);
                res.body.stop();
            }
        });
        
        

        //make background scroll
        this.background.tilePositionY -= gameSetting.backgroundSpeed;
    }
    
        // function to control the movement of player with left and right 
    movePlayerManager() {
        /*
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
        */
        this.player.setVelocity(0);
        let isMoving = false;

        if (this.cursorKeys.left.isDown || this.input.keyboard.addKey('A').isDown) {
            this.player.setVelocityX(-gameSetting.playerSpeed);
            isMoving = true;
        } else if (this.cursorKeys.right.isDown || this.input.keyboard.addKey('D').isDown) {
            this.player.setVelocityX(gameSetting.playerSpeed);
            isMoving = true;
        }

        if (this.cursorKeys.up.isDown || this.input.keyboard.addKey('W').isDown) {
            this.player.setVelocityY(-gameSetting.playerSpeed);
            isMoving = true;
        } else if (this.cursorKeys.down.isDown || this.input.keyboard.addKey('S').isDown) {
            this.player.setVelocityY(gameSetting.playerSpeed);
            isMoving = true;
        }

             // Thruster sound
        if (isMoving && !this.fly_sound.isPlaying) {
            this.fly_sound.play();
        } else if (!isMoving && this.fly_sound.isPlaying) {
            this.fly_sound.stop();
        }

    
    }

    shootBeam(){
        let bullet = this.projectiles.get(this.player.x, this.player.y - 80, "beam");

        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.body.allowGravity = false;
            bullet.setVelocityY(-400);
            bullet.setScale(0.65);
            bullet.play("beam_anim");
            this.laser_sound.play();
        }

    }
    spawnResource() {
        console.log("spawn")
        const x = Phaser.Math.Between(200, config.width - 200);
    
        // Create brand new sprite each time
        const resource = this.physics.add.sprite(x, -50, 'pollen_node');
        this.resources.add(resource); 
        
        // Configure the new resource
        resource.setFrame(0)
        resource.setScale(0.5)
        resource.setVelocityY(gameSetting.backgroundSpeed*60)
        //Size(resource.width * 0.8, resource.height * 0.8) // Match scaled size
        resource.play('pollen_node_anim');
        
        // Add to tracking group (optional)
       // this.resources.add(resource); 
      
    }
    

    hitResource(bullet, resource) { //hit resource with bullets
        //bullet.setActive(false);
        //bullet.setVisible(false);
       // bullet.body.stop();
        bullet.destroy();
    
        resource.destroy();
    
        // Optional: play animation or sound
        
        
        const explosion = this.physics.add.sprite(resource.x, resource.y, 'explosion_anim');
        explosion.setVelocityY(gameSetting.backgroundSpeed*60);
        explosion.play('explosion_anim');
        explosion.on('animationcomplete', () => {
            explosion.destroy();
        });
        
        this.spawnPollen(resource.x, resource.y); //pollen function to collect
       
    }
    spawnPollen(x, y) {
        for (let i = 0; i < 4; i++) {
            const isGreen = Math.random() < this.greenPollenChance;
            const pollenType = isGreen ? 'green_pollen' : 'yellow_pollen';
            const group = isGreen ? this.greenPollenGroup : this.yellowPollenGroup;
    
            const pollen = group.create(x, y, pollenType);
            pollen.setScale(0.4);
            pollen.setVelocity(
                Phaser.Math.Between(-100, 100),
                Phaser.Math.Between(-150, -250)
            );
            pollen.setGravityY(300); // so it falls back down
            pollen.setBounce(1);
            //pollen.setCollideWorldBounds(true);
            pollen.setData('type', isGreen ? 'green' : 'yellow');
        }
    }

    collectGreenPollen(player, pollen) {
        pollen.destroy();
        this.score += 10;
        this.scoreLabel.text = "SCORE   " + this.score;
        // Optional: Add a sound or sparkle effect
        this.collect_sound.play();
    }
    
    collectYellowPollen(player, pollen) {
        pollen.destroy();
        // Decrease player health
        if (pollen.texture.key === 'yellow_pollen') {
            this.currentHealth -= 20;
            this.updateHealthBar();
        }
        // Optional: Flash red or play sound
        this.hurt_sound.play();
    }

    updateHealthBar() {
        const percentage = this.currentHealth / this.maxHealth;
        this.healthBarFill.width = 120 * percentage;
    
        if (this.currentHealth <= 0) {
            this.gameOver();
        }
    }
    gameOver() {
        this.scene.pause(); // Stop game updates
    
        // Display "GAME OVER"
        this.add.text(config.width / 2, config.height / 2 - 50, 'GAME OVER', {
            fontSize: '48px',
            color: '#ffffff',
            fontFamily: 'Arial',
            align: 'center'
        }).setOrigin(0.5);
    
        // Display final score
        this.add.text(config.width / 2, config.height / 2, `Final Score: ${this.score}`, {
            fontSize: '32px',
            color: '#ffff00',
            fontFamily: 'Arial',
            align: 'center'
        }).setOrigin(0.5);
    
        // Display "Click to Restart"
        const restartText = this.add.text(config.width / 2, config.height / 2 + 60, 'Click to Restart', {
            fontSize: '24px',
            color: '#ffffff',
            fontFamily: 'Arial',
            align: 'center'
        }).setOrigin(0.5);
    
        // Make the restart text interactive
        restartText.setInteractive({ useHandCursor: true });
        restartText.on('pointerdown', () => {
            this.scene.restart(); // Restarts the current scene
        });
    
    }
    
    
    
        
}