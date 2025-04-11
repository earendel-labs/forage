
class MainMenu extends Phaser.Scene { //inherits all the charactersitcs tfrom Phase.Scene
    constructor() {
        super("mainMenu") //identifier for scene
    }

    create ()
    {
        //  Get the current highscore from the registry
   

        this.menubackground = this.add.image(0, 0, 'menu_background');
        this.menubackground.setOrigin(0,0);

  
        const game_title = this.add.bitmapText(config.width/2,-config.height/2,"peaFont", "Pollen Buster", 70).setOrigin(0.5);

        this.tweens.add({
            targets: game_title,
            y: config.height/4,
            duration: 1500,
            ease: 'Bounce'
        });

        const instructions = [
            "Collect as much pure pollen as you can!",
            "Shoot pollen nodes to emit pollen",
            "Beware of toxic pollen, don't touch",
        
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

}