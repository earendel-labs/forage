
class MapScene extends Phaser.Scene {
    constructor() {
        super("worldMapScene"); // Scene key
    }

        
        create ()
        {
            //  Set the camera and physics bounds to be the size of 4x4 bg images
            this.cameras.main.setBounds(0, 0, 4800, 3000);
            this.physics.world.setBounds(0, 0, 4800, 3000);
    
            //  Mash 4 images together to create our background
            this.add.image(0, 0, 'worldMap').setOrigin(0);
           // this.add.image(1920, 0, 'worldMap').setOrigin(0).setFlipX(true);
           // this.add.image(0, 1080, 'worldMap').setOrigin(0).setFlipY(true);
           // this.add.image(1920, 1080, 'worldMap').setOrigin(0).setFlipX(true).setFlipY(true);
    
            this.cursors = this.input.keyboard.createCursorKeys();
    
            this.player = this.physics.add.image(256, 256, 'player');
            // Enable physics for the sprite
           // this.physics.add.existing(sprite);

            // Set a circular physics body
            this.player.body.setCircle(50); // radius
            
            
            this.player.setCollideWorldBounds(true);
    
            this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
            this.cameras.main.setZoom(0.7);
    
           // this.text = this.add.text(10, 10, 'Cursors to move', { font: '16px Courier', fill: '#00ff00' }).setScrollFactor(0);
        }
    
        update ()
        {
            this.player.setVelocity(0);
    
            if (this.cursors.left.isDown)
            {
                this.player.setVelocityX(-gameSetting.mapSpeed);
            }
            else if (this.cursors.right.isDown)
            {
                this.player.setVelocityX(gameSetting.mapSpeed);
            }
    
            if (this.cursors.up.isDown)
            {
                this.player.setVelocityY(-gameSetting.mapSpeed);
            }
            else if (this.cursors.down.isDown)
            {
                this.player.setVelocityY(gameSetting.mapSpeed);
            }
    
            /*
            this.text.setText([
                `screen x: ${this.input.x}`,
                `screen y: ${this.input.y}`,
                `world x: ${this.input.mousePointer.worldX}`,
                `world y: ${this.input.mousePointer.worldY}`
            ]);
            */

            //if anywhere on the screen is clicked go to the forage menu 
            this.input.once('pointerdown', () => {



                this.scene.start('mainMenu');
    
            });
        }
    }
    