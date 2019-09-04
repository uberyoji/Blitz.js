// this function is used to create the UI
function createUI( x, y )
{
    var object =
    {
        score: 0,
        message: new PIXI.Text("Score", {
            fontFamily: 'Press Start 2P',
            fontSize: 25,
            fill: 'white',
            align: 'left',
        }),

        addScore: function( pts )
        {
            // update message
            this.score += pts;
            this.message.text = "Score: " + this.score;
        },
        setColor: function( color )
        {
            this.message.style.fill = color;
        }
    }
    object.message.x = x;
    object.message.y = y;
    Scene.addChild(object.message);
    return object;
}

// Load them google fonts before starting...!
window.WebFontConfig = {
    google: {
        families: ['Press Start 2P'],
    },

    active() {
        doneLoadingFont();
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

function doneLoadingFont()
{
	// create UI
    UI = createUI( 16, 32 );    
}