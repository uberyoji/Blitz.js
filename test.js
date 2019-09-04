const app = new PIXI.Application({ antialias: true });
document.body.appendChild(app.view);

document.addEventListener('dblclick', () => {	    
    
//    let mousePosition = app.renderer.plugins.interaction.mouse.global; 
//    ray.origin.x = mousePosition.x;
//    ray.origin.y = mousePosition.y; 
 } ); 

 document.addEventListener( 'click', () => {	    
    
//    let mousePosition = app.renderer.plugins.interaction.mouse.global; 
//    updateRay = !updateRay;
 } ); 

 var mouseDown = false;

 document.addEventListener('mousedown', () => {	    
    
    let mousePosition = app.renderer.plugins.interaction.mouse.global; 
    ray.origin.x = mousePosition.x;
    ray.origin.y = mousePosition.y; 

    mouseDown = true;

 }, false ); 

 document.addEventListener('mouseup', () => {	    
    
    let mousePosition = app.renderer.plugins.interaction.mouse.global; 
    
    mouseDown = false;
    
 }, false ); 

 document.addEventListener( 'mousemove', () => {	    
    
    let mousePosition = app.renderer.plugins.interaction.mouse.global; 
    let button = app.renderer.plugins.interaction.mouse.button;

    if( mouseDown )
    {
        ray.distance.x = mousePosition.x - ray.origin.x;
        ray.distance.y = mousePosition.y - ray.origin.y;
    }    
    
 }, false ); 

 var PS = new PhysicsSystem();

PS.Colliders.push( new ColliderRect( 100, 100, 50, 50 ) );
PS.Colliders.push( new ColliderRect( 300, 100, 50, 50 ) );
PS.Colliders.push( new ColliderRect( 100, 300, 50, 50 ) );
//PS.Colliders.push( new ColliderRect( 300, 300, 50, 50 ) );

PS.Colliders.push( new ColliderCircle( 300, 300, 50 ) );
// PS.Colliders.push( new ColliderCircle( 100, 300, 50 ) );
// PS.Colliders.push( new ColliderCircle( 300, 100, 50 ) );

ray = 
{ 
    origin: new Vector2(0,0),
    distance: new Vector2(0,0),
    graphics: new PIXI.Graphics(),

    draw: function( color )
    {
        this.graphics.clear();
        this.graphics.lineStyle( 1, color, 1, 0 );
        this.graphics.moveTo(this.origin.x,this.origin.y);
        this.graphics.lineTo(this.origin.x+this.distance.x, this.origin.y+this.distance.y);
        this.graphics.closePath();
    },
    clear: function()
    {
     this.graphics.clear();
    }
};
app.stage.addChild(ray.graphics);

function classify( hit )
{
    if( hit.sideX < 0 )
        return "left";
    else if( hit.sideX > 0 )
        return "right";

    if( hit.sideY < 0 )
        return "top";
    else if( hit.sideY > 0 )
        return "bottom";

    return "no side";
}

ray.origin.x = 300;
ray.origin.y = 300;

var updateRay = false;

var hitPoints = new PIXI.Graphics();
app.stage.addChild(hitPoints);

var gfxColliders = new PIXI.Graphics();
app.stage.addChild(gfxColliders);

app.ticker.add(() => {

    if( updateRay )
    {
        let mousePosition = app.renderer.plugins.interaction.mouse.global;
        ray.distance.x = mousePosition.x - ray.origin.x;
        ray.distance.y = mousePosition.y - ray.origin.y;
    }    

    var Results = PS.rayCast( ray.origin, ray.distance, 0xFFFFFFFF );

    // draw all colliders
    {
        gfxColliders.clear();
        gfxColliders.lineStyle( 1, 0xFFFFFF, 1, 0 );
        gfxColliders.beginFill( 0xFFFFFF, 0.1);
        PS.Colliders.forEach( c => {
            switch( c.type )
            {
                case 'rect': gfxColliders.drawRect( c.min.x, c.min.y, c.getWidth(), c.getHeight() );  break;
                case 'circle': gfxColliders.drawCircle( c.pivot.x, c.pivot.y, c.radius ); break;
            }            
        } );        
        gfxColliders.endFill();
    }

    // draw ray hits
    {
        hitPoints.clear();
        hitPoints.beginFill(0xFFFF00,1);
        Results.forEach( r => {
            hitPoints.drawRect( r.result.intercept.x-2, r.result.intercept.y-2, 4, 4 );
        } );
        hitPoints.endFill();     
        hitPoints.beginFill(0xFF0000,1);
        Results.forEach( r => {
            hitPoints.drawRect( r.collider.pivot.x-8, r.collider.pivot.y-8, 16, 16 );
        } );
        hitPoints.endFill();
    }
    
    // draw ray
    ray.draw( Results.length > 0 ? 0xFF0000 : 0x00FF00 );    
});