
const tkeyLemon = 'assets/lemon.png';
const tkeyLemonSliced = 'assets/lemon-sliced.png';

function getAssetsLemon()
{
    return [tkeyLemon,tkeyLemonSliced];
}

function createLemon()
{
	var go = 
	{
        counter: 0,
        go: createGameObject(),

        updateSprite: function()
        {
            this.counter = (++this.counter)%2;

            this.go.sprite.texture = PIXI.TextureCache[getAssetsLemon()[this.counter]];
        },
        
        update: function( delta ) 
		{
            this.go.update( delta );
            
            if( this.go.transform.x < 0 )
            {
                this.go.physics.vx = Math.abs(this.go.physics.vx);
                this.updateSprite();
            }
            else if( this.go.transform.x > app.screen.width )
            {
                this.go.physics.vx = -Math.abs(this.go.physics.vx);
                this.updateSprite();
            }

            if( this.go.transform.y < 0 )
            {
                this.go.physics.vy = Math.abs(this.go.physics.vy);
                this.updateSprite();
            }
            else if( this.go.transform.y > app.screen.height )
            {
                this.go.physics.vy = -Math.abs(this.go.physics.vy);
                this.updateSprite();
            }            
        },
        
        start: function()
        {
            let TextureCache = PIXI.utils.TextureCache;

            // create a new Sprite from an image path
            this.go.sprite = PIXI.Sprite.from(TextureCache[tkeyLemon]);

            // center the sprite's anchor point
            this.go.sprite.anchor.set(0.5);

            // move the sprite to the center of the screen
            this.go.transform.x = app.screen.width / 2;
            this.go.transform.y = app.screen.height / 2;

            this.go.visible(true);

            this.go.physics.vr = 0.1;

            let min = 2;
            let max = 4;
            let s = min + Math.random() * (max-min);
            let a = Math.random() * 2 * Math.PI;

            this.go.physics.vx = Math.cos(a) * s;
            this.go.physics.vy = Math.sin(a) * s;
        }        
    };
	
	return go;
}

GOM.register( { name: "lemon", create: createLemon, cache: getAssetsLemon } );