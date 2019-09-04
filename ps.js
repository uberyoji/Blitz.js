function createPS( config )
{
	// this is where textures are loaded
	PIXI.Loader.shared
		.add( config.textures )
		.load(doneLoadingPS);

	var PS =
	{
		maxParticleCount: config.maxParticleCount,
		pbuffer: [],
		textures: config.textures,

		init: function()
		{
			for( var i=0;i<this.maxParticleCount;i++)
			{
				this.pbuffer.push( createParticle( this.textures[0] ) );
			}
		},
		
		update: function(delta)
		{
			this.pbuffer.forEach(function(p) {
				p.update(delta);
			}, this);
		},
		
		emit: function( config )
		{
			let c = 0;
			for(var i=0;i<this.pbuffer.length; i++)
			{
				let p = this.pbuffer[i];
				if( p.sprite.visible == false )
				{
					p.init(config);
					
					if( ++c >= config.count)
						break;
				}
			}
		}
	}

	return PS;
}

function doneLoadingPS()
{
	PS.init()
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createParticle( textureName )
{
	var p = 
	{
		x: 0.0, y: 0.0,
		vx: 0.0, vy: 0.0, vr: 0.0,
		ax: 0.0, ay: 0.0,
		life: 50.0,
		sprite: new PIXI.Sprite(PIXI.utils.TextureCache[textureName]),
				
		init: function( config )
		{
			this.sprite.visible = true;
			
			this.x = config.x;
			this.y = config.y;
			this.sprite.x = this.x;
			this.sprite.y = this.y;

			let tex = config.tex[getRandomInt(0, config.tex.length-1)];

			this.sprite.texture = PIXI.utils.TextureCache[tex];

			this.life = config.life;

			this.ax = 0.0;
			this.ay = config.gravity;

			let a = getRandom(0,2*Math.PI);

			this.vx = Math.cos(a) * config.vel;
			this.vy = Math.sin(a) * config.vel;
			this.vr = config.rvel;
		},
		update: function(delta)
		{
			if( this.sprite.visible == false )
				return;
			
			this.life -= delta;

			if( this.life < 0 )
			{	
				this.sprite.visible = false;
				return;
			}			
			
			this.vx += this.ax * delta;
			this.vy += this.ay * delta;
			this.x += this.vx * delta;
			this.y += this.vy * delta;
			this.sprite.x = this.x;
			this.sprite.y = this.y;
			this.sprite.rotation += this.vr * delta;
		}
	};
	p.sprite.anchor.set(0.5);
	p.sprite.visible = false;
	app.stage.addChild(p.sprite);
	
	return p;
}

/*
// TODO z order management

var mapContainer = new PIXI.DisplayObjectContainer(),
    unitsContainer = new PIXI.DisplayObjectContainer(),
    menuContainer = new PIXI.DisplayObjectContainer();

mapContainer.zIndex = 5;
unitsContainer.zIndex = 10;
menuContainer.zIndex = 20;

// adding children, no matter in which order
stage.addChild(mapContainer);
stage.addChild(menuContainer);
stage.addChild(unitsContainer);

// call this function whenever you added a new layer/container
stage.updateLayersOrder = function () {
    stage.children.sort(function(a,b) {
        a.zIndex = a.zIndex || 0;
        b.zIndex = b.zIndex || 0;
        return b.zIndex - a.zIndex
    });
};

stage.updateLayersOrder();
*/