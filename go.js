function createGameObject()
{
	var go = 
	{
        transform: createTransform(),
        physics: createPhysics(),
        sprite: undefined,

        visible: function( toggle ) 
		{
			if(toggle)
				app.stage.addChild(this.sprite);
			else
				app.stage.removeChild(this.sprite);
		},

		update: function( delta ) 
		{            
            this.updatePhysics(delta); 
            this.updateSprite();
        },

        updateSprite: function()
        {
            if( this.sprite != undefined )
            {
                this.sprite.x = this.transform.x;
                this.sprite.y = this.transform.y;
                this.sprite.rotation = this.transform.r;
            }            
        },

        updatePhysics: function(delta)
        {
            this.physics.update( delta );
            this.transform.x += this.physics.vx * delta;
            this.transform.y += this.physics.vy * delta;
            this.transform.r += this.physics.vr * delta;
        }
	};
		
	return go;
}

function createGoManager()
{
    var goManager = 
    {
        entries: new Map(),

        register: function( entry )
        {
            this.entries.set( entry.name, entry );
        },
    
        create: function( name )
        {
            let e = this.entries.get(name);
            return e.create();
        },
        
        cache: function( handler )
        {
            let pl = PIXI.loader;
      
            for (let e of this.entries.values())
            {                
                let a = e.cache();
                pl.add(a);
            }
            pl.load(handler);
        }        
    };  
    
    return goManager;
}

var GOM = createGoManager();