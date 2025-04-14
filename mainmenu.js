
class MainMenu extends Phaser.Scene { //inherits all the charactersitcs tfrom Phase.Scene
    constructor() {
        super("mainMenu") //identifier for scene
    }

    create ()
    {
        //  Get the current highscore from the registry
   

        this.menubackground = this.add.image(0, 0, 'menu_background');
        this.menubackground.setOrigin(0,0);
        this.createBouncingPollen(150, 250, 'green');
        this.createBouncingPollen(300, 250, 'red');
        this.createBouncingPollen(250, 550, 'green');
        this.createBouncingPollen(500, 650, 'red');
        this.createBouncingPollen(950, 550, 'green');
        this.createBouncingPollen(1000, 350, 'red');

  
        const game_title = this.add.bitmapText(config.width/2,-config.height/2,"peaFont", "Pollen Buster", 70).setOrigin(0.5);

        this.tweens.add({
            targets: game_title,
            y: config.height/4,
            duration: 1500,
            ease: 'Bounce'
        });

        const instructions = [
            "Shoot pollen nodes to emit pollen.",
            "Collect green pollen, avoid red pollen!",
            "WASD or Arrow Keys to move",
            "Space Bar to shoot",
        
        ]

         this.add.bitmapText(config.width/2, config.height/2 + 50, "peaFont", instructions).setOrigin(0.5);
         const start_text = this.add.bitmapText(config.width/2, config.height/2 + 800, "peaFont", "Click to start").setOrigin(0.5);
         
         this.tweens.add({
            targets: start_text,
            y: config.height/2 + 200,
            duration: 2500,
            ease: 'Bounce'
        });


        //Click anywhere on screen to start game 
        this.input.once('pointerdown', () => {
            this.scene.start('foragePlayScene');
        });
    }

    createBouncingPollen(x, y, color) {
        const key = color === 'green' ? 'green_pollen' : 'red_pollen';
        const pollen = this.physics.add.image(x, y, key);
        pollen.setScale(0.4);
        pollen.setCollideWorldBounds(true);
        pollen.setBounce(1); // Full bounce
        pollen.setVelocity(
            Phaser.Math.Between(-150, 150),
            Phaser.Math.Between(-150, 150)
        );
        return pollen;
    }
    

}