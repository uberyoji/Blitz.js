const blitz = new Blitz();


var animation = new BAnimation();
animation.tracks.position.x.setKeys( [ new Keyframe( 30,0 ), new Keyframe(330,2), new Keyframe(180, 4), new Keyframe(30, 6) ] );
animation.tracks.position.y.setKeys( [ new Keyframe( 300,0 ), new Keyframe(300,2), new Keyframe(200, 4), new Keyframe(300, 6) ] );
animation.tracks.rotation.setKeys( [ new Keyframe( 0,0 ), new Keyframe( 3.14159*2, 6 ) ] );

class Banana extends Entity {
    constructor(name,params) {
        super(name,params);
    }

    start() {

        this.transform.position.x = 200;
        this.transform.position.y = 200;

        this.components.add( new PixiSprite( { scene: blitz.RootScene, filename:'assets/bananas.png' } ) );

        // rigidbody
        this.components.add( new Animator( {} ) );
        this.components.Animator.animation = animation;
    }
}

blitz.ES.register( "Banana", (name,params) => { return new Banana(name,params); } )

const B = blitz.ES.create( "Banana", "banana", {} );

document.addEventListener( 'click', (event) => {	    
    B.transform.position.x = event.clientX;
    B.transform.position.y = event.clientY;
} ); 

blitz
    .precacheAssets( ['assets/bananas.png','assets/lemon.png','assets/orange.png' ] )
    .loadAssets( () => { 
        blitz.start();
        blitz.pixiApp.ticker.add((delta) => { frame(delta); } );     // Listen for animate update
    } );

function frame(delta)
{
    blitz.update();
}