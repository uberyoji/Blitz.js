function lerpRGB(a, b, amount) { 

    var ah = a;
		ar = ah >> 16 & 0xff, ag = ah >> 8 & 0xff, ab = ah & 0xff,
		bh = b;
		br = bh >> 16 & 0xff, bg = bh >> 8 & 0xff, bb = bh & 0xff,
		rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);

    return ((rr << 16) + (rg << 8) + rb | 0);
}

class Color {

	constructor( r,g,b,a ) {	// in range 0, 1

		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
		this.rgb = ((r << 16) + (g << 8) + b | 0);
		this.rgba = ((a << 24) + (r << 16) + (g << 8) + b | 0);
	}

	lerp() {
		let ah = a, 
		ar = ah >> 16 & 0xff, ag = ah >> 8 & 0xff, ab = ah & 0xff,
		bh = b;
		br = bh >> 16 & 0xff, bg = bh >> 8 & 0xff, bb = bh & 0xff,
		rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);

    	return ((rr << 16) + (rg << 8) + rb | 0);
	}
}


/*
 var timer = {
    time: 0,
    start: function() {
      var timerTick = this.tick.bind(this);
      window.setInterval(function() {
        timerTick();
      }, 1000);
    },
    tick: function() {
      this.time += 1;
      console.log(this.time);
    }
  };

  timer.start();
*/

class ParticleSystem
{	
	constructor( config, scene )
	{
		// this is where textures are loaded
		var onLoadDone = this.init.bind(this);

		PIXI.Loader.shared
		.add( config.textures )
		.load( function() { onLoadDone() } );

		this.maxParticleCount = config.maxParticleCount;
		this.pbuffer = [];
		this.textures = config.textures;
		this.scene = scene;
	}

	init()
	{
		for( var i=0;i<this.maxParticleCount;i++)
		{
			this.pbuffer.push( new Particle( this.textures[0], this.scene ) );
		}
	}
	
	update(delta)
	{
		this.pbuffer.forEach(function(p) {
			p.update(delta);
		}, this);
	}
	
	emit( config )
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

ParticleSystem.prototype.init = function() {
	for( var i=0;i<this.maxParticleCount;i++)
	{
		this.pbuffer.push( new Particle( this.textures[0], this.scene ) );
	}
}

function getRandomRange(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomRangeInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



class Particle
{
	constructor( textureName, scene )
	{
		this.x=0.0; this.y=0.0;
		this.vx=0.0; this.vy=0.0; this.vr=0.0;
		this.ax=0.0; this.ay=0.0;
		this.sx0=1.0; this.sx1=1.0;
		this.sy0=1.0; this.sy1=1.0;
		this.c0=0xFFFFFFF; this.c1=0xFFFFFF;
		this.a0=1; this.a1=1;
		this.life=50.0;
		this.lifeRatio=0.0; 
		this.lifeTime=0.0;
		this.deathTime=0.0;
		this.sprite=new PIXI.Sprite(PIXI.utils.TextureCache[textureName]);
		this.sprite.anchor.set(0.5);
		this.sprite.visible = false;
		scene.addChild(this.sprite);
	}

	init( config )
	{
		this.sprite.visible = true;
		
		this.x = config.x;
		this.y = config.y;
		this.sprite.x = this.x;
		this.sprite.y = this.y;

		this.sx0 = config.scaleBirthX || 1.0;
		this.sx1 = config.scaleDeathX || 1.0;
		this.sy0 = config.scaleBirthY || 1.0;
		this.sy1 = config.scaleDeathY || 1.0;

		this.c0 = config.colorBirth != undefined ? config.colorBirth : 0xFFFFFF;
		this.c1 = config.colorDeath != undefined ? config.colorDeath : 0xFFFFFF;

		this.a0 = config.alphaBirth != undefined ? config.alphaBirth : 1;
		this.a1 = config.alphaDeath != undefined ? config.alphaDeath : 1;

		let tex = config.tex[getRandomRangeInt(0, config.tex.length-1)];

		this.sprite.texture = PIXI.utils.TextureCache[tex];

		this.life = config.life;
		this.lifeTime = 0;
		this.deathTime = this.life;

		this.ax = 0.0;
		this.ay = config.gravity;

		let a = getRandomRange(0,2*Math.PI);

		this.vx = Math.cos(a) * config.vel;
		this.vy = Math.sin(a) * config.vel;
		this.vr = config.rvel;
	}
	update(delta)
	{
		if( this.sprite.visible == false )
			return;

		this.lifeTime += delta;
		this.lifeRatio = this.lifeTime / this.life;

		if( this.lifeTime >= this.deathTime  )
		{	
			this.sprite.visible = false;
			return;
		}

		let sx = this.sx0 + (this.sx1-this.sx0)*this.lifeRatio;
		let sy = this.sy0 + (this.sy1-this.sy0)*this.lifeRatio;

		let c = lerpRGB(this.c0, this.c1, this.lifeRatio);
		let a = this.a0 + (this.a1-this.a0)*this.lifeRatio;

		this.sprite.tint = c;
		this.sprite.alpha = a;

		this.sprite.scale.x = sx;
		this.sprite.scale.y = sy;
		
		this.vx += this.ax * delta;
		this.vy += this.ay * delta;
		this.x += this.vx * delta;
		this.y += this.vy * delta;
		this.sprite.x = this.x;
		this.sprite.y = this.y;
		this.sprite.rotation += this.vr * delta;
	}
}
