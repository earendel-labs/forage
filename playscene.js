
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
        this.explosion_sound = this.sound.add("explosion");
        this.hurtman_sound = this.sound.add("hurt_man");
        this.boom_sound = this.sound.add("boom");
        this.break_sound = this.sound.add("break");

        //Load Background to game and set origin 
        this.background = this.add.tileSprite(0,0,config.width,config.height,"scene_background");
        this.background.setOrigin(0,0);

        //Load playable chacter with tween + alpha 
        this.player = this.physics.add.sprite(config.width/2 , config.height*1.2 , "player").setDepth(3);
        this.player.body.setSize(85, 85);
        this.player.play("character_anim");
        this.player.alpha = 0.5;
        this.player.setScale(0.5);
        
        //set player to not leave bound 
        this.player.setCollideWorldBounds(true);
        this.maxHealth = 100;
        this.currentHealth = this.maxHealth;
        // Health bar background
        this.healthBarBackground = this.add.rectangle(config.width - 220, 60, 190, 20, 0x555555);
        this.healthBarBackground.setOrigin(0, 0.5);

        // Health bar fill
        this.healthBarFill = this.add.rectangle(config.width - 220, 60, 190, 20, 0x4CBB17);
        this.healthBarFill.setOrigin(0, 0.5);

      

        //create listener that polls the spacebar 
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        //gets the input from the keyboard
        this.cursorKeys = this.input.keyboard.createCursorKeys(); 
        

        this.tweens.add({
            targets: this.player,
            y: config.height/2+200,
            ease: "Linear",
            duration: 500,
            repeat: 0,
            onComplete: function(){
                this.player.alpha = 1;
                this.startResourceSpawnRamp();
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
     
        //add overlap for projectiles and resources
        this.physics.add.overlap(this.projectiles, this.resources, this.hitResource, null, this);
        //overlap for player and resources 
        this.physics.add.overlap(this.player, this.resources, this.playerHitByResource, null, this);



        //pollen spawning 
        this.greenPollenChance = 1.0; // 100% chance for green at the start
        this.greenPollenGroup = this.physics.add.group();
        this.redPollenGroup = this.physics.add.group();
        this.physics.add.overlap(this.player, this.greenPollenGroup, this.collectGreenPollen, null, this);
        this.physics.add.overlap(this.player, this.redPollenGroup, this.collectredPollen, null, this);

        
        this.time.addEvent({
            delay: 4000, 
            callback: () => {
                this.greenPollenChance = Math.max(0.5, this.greenPollenChance - 0.1); // decrease by 10%, down to 0%
                console.log("Green Pollen Chance:", this.greenPollenChance);
            },
            loop: true
        });
        

        // Add black bar for the top to highlight score
        /*
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
        */
        //Score label 
        this.scoreLabel = this.add.bitmapText(10,5,"peaFont", "Score", 30);
        this.score = 0;
        this.scoreLabel.text = "SCORE   " + this.score;

         //Score label 
        this.healthLabel = this.add.bitmapText(config.width -220,5,"peaFont", "Health", 30);
        this.healthLabel.text = "Health   " + this.currentHealth;


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
            if (bullet && bullet.active && bullet.y < -0) {
                bullet.destroy();
            
            }
        });

        this.resources.children.iterate((res) => {
            if (res && res.active && res.y > config.height + 50) {
                res.destroy();
            }
        });
        
        

        //make background scroll
        this.background.tilePositionY -= gameSetting.backgroundSpeed;
    }
    
        // function to control the movement of player with left and right 
    movePlayerManager() {
        
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

        if (this.player.isInvulnerable) return;
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
       // console.log("spawn")
        const x = Phaser.Math.Between(200, config.width - 200);
    
        // Create brand new sprite each time
        const resource = this.physics.add.sprite(x, -50, 'pollen_node');
        this.resources.add(resource); 
        
        // Configure the new resource
        resource.setFrame(0)
        resource.setDepth(1);
        resource.setScale(0.55)
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

        //resource.setTexture("destroyed_node");
        const destroyed_node_image = this.physics.add.image(resource.x, resource.y,"destroyed_node").setScale(0.55);
        destroyed_node_image.setVelocityY(gameSetting.backgroundSpeed*60);
        this.time.delayedCall(3000, () => {
            destroyed_node_image.destroy();
        });
        
        // Optional: play animation or sound
        
        
        const explosion = this.physics.add.sprite(resource.x, resource.y, 'explosion_anim');
        explosion.setVelocityY(gameSetting.backgroundSpeed*60);
        explosion.play('explosion_anim');
        explosion.on('animationcomplete', () => {
            explosion.destroy();
        });
        
        this.spawnPollen(resource.x, resource.y); //pollen function to collect
        this.boom_sound.play();
       
    }
    spawnPollen(x, y) {
        for (let i = 0; i < 4; i++) {
            const isGreen = Math.random() < this.greenPollenChance;
            const pollenType = isGreen ? 'green_pollen' : 'red_pollen';
            const group = isGreen ? this.greenPollenGroup : this.redPollenGroup;
    
            const pollen = group.create(x, y, pollenType);
            pollen.setScale(0.4);
            pollen.setVelocity(
                Phaser.Math.Between(-150, 150),
                Phaser.Math.Between(-150, -250)
            );
            pollen.setGravityY(300); // so it falls back down
            pollen.setBounce(1);
            //pollen.setCollideWorldBounds(true);
            pollen.setData('type', isGreen ? 'green' : 'red');
        }
    }

    collectGreenPollen(player, pollen) {
        pollen.destroy();
        this.score += 10;
        this.scoreLabel.text = "SCORE   " + this.score;
        // Optional: Add a sound or sparkle effect
        this.collect_sound.play();
    }
    
    collectredPollen(player, pollen) {

        const explosion = this.add.sprite(pollen.x, pollen.y, 'explosion2_anim');
        explosion.play('explosion2_anim');
        explosion.on('animationcomplete', () => {
            explosion.destroy();
        });
        pollen.destroy();
        // Decrease player health
        if (pollen.texture.key === 'red_pollen') {
            this.currentHealth = Math.max(0, this.currentHealth - 20);
            this.updateHealthBar();
        }
        // Optional: Flash red or play sound
        
        this.break_sound.play();
    }

    updateHealthBar() {
        this.healthLabel.text = "Health   " + this.currentHealth;
        const percentage = this.currentHealth / this.maxHealth;
        this.healthBarFill.width = 190 * percentage;
    
        if (this.currentHealth <= 0) {
            this.gameOver();
        }
    }

    playerHitByResource(player, resource) {
        // Destroy the resource
        resource.destroy();
    
        // Only proceed if player is not already in a hit state (optional debounce)
        if (this.player.isInvulnerable) return;
    
        // Play explosion animation
        const explosion = this.add.sprite(player.x, player.y, 'explosion_anim');
        explosion.play('explosion_anim');
        explosion.on('animationcomplete', () => {
            explosion.destroy();
        });
    
        // Deduct health
        this.currentHealth = Math.max(0, this.currentHealth - 40);
        this.updateHealthBar();
    
        // Check for game over
        if (this.currentHealth <= 0) {
            this.gameOver();
            return;
        }
    
        // Hide player and make invulnerable
        this.player.setAlpha(0);
        this.player.isInvulnerable = true;
    
        // Move player off screen
        this.player.setPosition(config.width / 2, config.height);
        
        this.explosion_sound.play();
    
        // Add delay before tweening the player back in
        this.time.delayedCall(1000, () => {
            this.tweens.add({
                targets: this.player,
                y: config.height / 2+200,
                alpha: 1,
                ease: "Linear",
                duration: 500,
                onComplete: () => {
                    this.player.isInvulnerable = false;
                    
                }
            });
        }, [], this);
    }
    
    startResourceSpawnRamp() {
        this.resourceSpawnDelay = 1500;       // Start with 1.5 seconds delay
        this.minSpawnDelay = 500;             // Stop decreasing at 0.5 seconds
        this.spawnDelayDecrement = 100;       // Decrease delay by 100ms every step
        this.delayRampInterval = 4000;       // Every 10 seconds, decrease the delay
    
        // Resource spawn event (initial)
        this.resourceSpawnEvent = this.time.addEvent({
            delay: this.resourceSpawnDelay,
            callback: this.spawnResource,
            callbackScope: this,
            loop: true
        });
    
        // Timer to gradually reduce the delay
        this.time.addEvent({
            delay: this.delayRampInterval,
            callback: () => {
                if (this.resourceSpawnDelay > this.minSpawnDelay) {
                    this.resourceSpawnDelay -= this.spawnDelayDecrement;
    
                    // Restart the spawn event with new delay
                    this.resourceSpawnEvent.remove(); // remove old
                    this.resourceSpawnEvent = this.time.addEvent({
                        delay: this.resourceSpawnDelay,
                        callback: this.spawnResource,
                        callbackScope: this,
                        loop: true
                    });
    
                    console.log("New spawn delay:", this.resourceSpawnDelay);
                }
            },
            loop: true
        });
    }
    



    gameOver() {
       
        this.explosion_sound.play();
        this.player.isInvulnerable = true;
        // Display "GAME OVER"
        this.add.bitmapText(config.width/2, config.height/2 - 70, "peaFont", "GAME OVER",80).setOrigin(0.5).setDepth(3);
        this.add.bitmapText(config.width / 2, config.height / 2, "peaFont", `Final Score: ${this.score}`,40).setOrigin(0.5).setDepth(3);
    
        // Display "Click to Restart"
        const restartText = this.add.text(config.width / 2, config.height / 2 + 60, 'Click to Restart', {
            fontFamily: 'VeraHumana',
            fontSize: '32px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setDepth(3);

        this.player.disableBody();
        this.player.setVisible(false);

       
    
        // Listen for click anywhere
        this.input.once('pointerdown', () => {
            this.scene.restart();
        });
        
      //  this.scene.pause(); // Stop game updates
    }
    
    
    
        
}