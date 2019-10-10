
// Load them google fonts before starting...!
window.WebFontConfig = {
    google: {
        families: ['Press Start 2P'],
    },

    active() {
        () => { /*fixme*/ }
    },
};

// include the web-font loader script
(function() {
    const wf = document.createElement('script');
    wf.src = `${document.location.protocol === 'https:' ? 'https' : 'http'}://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js`;
    wf.type = 'text/javascript';
    wf.async = 'true';
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
}());

const blitz = new Blitz();

class Geometry extends Entity {
    constructor(name,params) {
        super(name,params);
    }

    start() {
        this.transform.position.x = 400;
        this.transform.position.y = 400;
        
        this.components.add( new Think ( { think:this.think } ) );
        this.components.add( new PixiGraphics( { scene: blitz.RootScene } ) );
        this.components.add( new RigidBody() );
        this.components.add( new ColliderCircle() );
    }

    think() {
        this.transform.rotation -= 0.01;
    }
}


class Text extends Entity {
    constructor(name,params) {
        super(name,params);

        this.counter = 0;
    }

    start() {

        this.transform.position.x = 300;
        this.transform.position.y = 300;

        // text
        this.components.add( new PixiText( { scene: blitz.RootScene, font: {  fontFamily: 'Press Start 2P', fontSize: 25, fill: 'white', align: 'center' } } ) );
        this.components.PixiText.setText("Blitz!");
        this.components.PixiText.setColor(0xFF0000);
    }

    think() {
        this.counter += 0.01;        
        this.transform.position = 300 + Math.sin( this.counter );
    }
}

blitz.ES.register( "Text", (name,params) => { return new Text(name,params); } )
blitz.ES.register( "Geometry", (name,params) => { return new Geometry(name,params); } )

const T = blitz.ES.create( "Text", "text", {} );
const GA = blitz.ES.create( "Geometry", "geoa", {} );
const GB = blitz.ES.create( "Geometry", "geob", {} );

document.addEventListener( 'click', (event) => {	    
} ); 

blitz
    .precacheAssets( ['/examples/assets/bananas.png','/examples/assets/lemon.png','/examples/assets/orange.png' ] )
    .loadAssets( () => { 
        blitz.start();
        blitz.pixiApp.ticker.add((delta) => { frame(delta); } );     // Listen for animate update
    } );

function frame(delta)
{
    blitz.update();
}