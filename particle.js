function createParticle( textureName )
{
	var p = 
	{
		vx: 0, vy: 0,
		ax: 0, ay: 0,
		life: 50,
		sprite: new PIXI.Sprite(PIXI.loader.resources[textureName].texture),
		show: function( toggle ) 
		{
			if(toggle)
				app.stage.addChild(this.sprite);
			else
				app.stage.removeChild(this.sprite);
		}
	};		
	return p;
}
