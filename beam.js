// Creating a class to control our beam objects, inheriting fom sprits 
class Beam extends Phaser.GameObjects.Sprite{
    constructor(scene) {

        var x = scene.player.x;
        var y = scene.player.y;

        super(scene, x, y, "beam"); 
        scene.add.existing(this);

        this.play("beam_anim");
        this.setScale(0.2);
        scene.physics.world.enableBody(this);
        this.body.velocity.y = -250;

    }

    update() {
        if(this.y<32){
            this.destroy();
        }
    }
}