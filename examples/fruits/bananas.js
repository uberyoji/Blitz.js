
const tkeyBananas = 'assets/bananas.png';

function getAssetsBananas()
{
    return [tkeyBananas];
}

function createBananas()
{
	var go = 
	{
        go: createGameObject(),
        
        update: function( delta ) 
		{
            this.go.update( delta );
            
            if( this.go.transform.x < 0 )
                this.go.physics.vx = Math.abs(this.go.physics.vx);
            else if( this.go.transform.x > app.screen.width )
                this.go.physics.vx = -Math.abs(this.go.physics.vx);

            if( this.go.transform.y < 0 )
                this.go.physics.vy = Math.abs(this.go.physics.vy);
            else if( this.go.transform.y > app.screen.height )
                this.go.physics.vy = -Math.abs(this.go.physics.vy);
            
        },
        
        start: function()
        {
            let TextureCache = PIXI.utils.TextureCache;

            // create a new Sprite from an image path
            this.go.sprite = PIXI.Sprite.from(TextureCache[tkeyBananas]);

            // center the sprite's anchor point
            this.go.sprite.anchor.set(0.5);

            // move the sprite to the center of the screen
            this.go.transform.x = app.screen.width / 2;
            this.go.transform.y = app.screen.height / 2;

            this.go.visible(true);

            this.go.physics.vr = 0.1;

            this.go.physics.vx = 1;
            this.go.physics.vy = 2;
        }        
    };
	
	return go;
}

GOM.register( { name: "bananas", create: createBananas, cache: getAssetsBananas } );