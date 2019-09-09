const app = new PIXI.Application({ antialias: true });
document.body.appendChild(app.view);

document.addEventListener('dblclick', () => {	    
//    let mousePosition = app.renderer.plugins.interaction.mouse.global; 
    ray.origin.x = mousePosition.x;
    ray.origin.y = mousePosition.y; 
} ); 

document.addEventListener( 'click', () => {	    
//    let mousePosition = app.renderer.plugins.interaction.mouse.global; 
//    updateRay = !updateRay;
} ); 

var mouseDown = false;

document.addEventListener('mousedown', () => {	    
    let mousePosition = app.renderer.plugins.interaction.mouse.global; 
    caster.origin.x = mousePosition.x;
    caster.origin.y = mousePosition.y; 
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
        caster.distance.x = mousePosition.x - ray.origin.x;
        caster.distance.y = mousePosition.y - ray.origin.y;
    }
}, false ); 

var PS = new PhysicsSystem();

const ColliderCount = 8;
const ColliderDistance = 256;
const ColliderCenter = new Vector2( app.screen.width/2, app.screen.height/2 );
for( let i=0;i<ColliderCount; i++)
{
    let x = ColliderCenter.x + Math.cos( 2.0 * Math.PI * i / ColliderCount ) * ColliderDistance;
    let y = ColliderCenter.y + Math.sin( 2.0 * Math.PI * i / ColliderCount ) * ColliderDistance;

    if( i%2 )
        PS.Colliders.push( new ColliderRect( x, y, 50, 50 ) );
    else
        PS.Colliders.push( new ColliderCircle( x, y, 50 ) );
}
const casterSize = 32;
caster = 
{ 
    origin: ColliderCenter,
    distance: new Vector2(512,512),
//    rect: new Rect( new Vector2(-casterSize/2,-casterSize/2), new Vector2(casterSize/2,casterSize/2) ),
//    circle: new Circle( new Vector2(0,0), casterSize ),
    graphics: new PIXI.Graphics(),

    draw: function( color )
    {
        this.graphics.clear();
        this.graphics.lineStyle( 1, color, 1, 0 );
        
        // ray
        this.graphics.moveTo(this.origin.x,this.origin.y);
        this.graphics.lineTo(this.origin.x+this.distance.x, this.origin.y+this.distance.y);
        this.graphics.closePath();

        // origin shape
        this.graphics.beginFill(color,0.1);
        if( this.rect )
            this.graphics.drawRect( this.origin.x+this.rect.min.x, this.origin.y+this.rect.min.y, this.rect.getWidth(), this.rect.getHeight() );
        else if( this.circle )
            this.graphics.drawCircle( this.origin.x, this.origin.y, this.circle.radius );
                
        this.graphics.endFill();
    },
    clear: function()
    {
     this.graphics.clear();
    }
};
app.stage.addChild(caster.graphics);

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

var rayRotation = 0;
const rayRotationSpeed = 0.005;

app.ticker.add(() => {

    // update ray
    rayRotation += rayRotationSpeed;
    caster.distance.x = Math.cos( rayRotation ) * ColliderDistance * 2;
    caster.distance.y = Math.sin( rayRotation ) * ColliderDistance * 2;

    // cast and find hits
    var Results;
    if( caster.rect )  
        Results = PS.rectCast( caster, 0xFFFFFFFF );
    else if( caster.circle )  
        Results = PS.circleCast( caster, 0xFFFFFFFF );
    else
        Results = PS.rayCast( caster, 0xFFFFFFFF );

    // draw all colliders
    drawColliders();

    // draw ray hits
    drawResult( Results );
    
    // draw ray
    caster.draw( Results.length > 0 ? 0xFF0000 : 0x00FF00 );    
});

// results
var gfxResults = new PIXI.Graphics();
app.stage.addChild(gfxResults);

function drawResult( Results )
{
    gfxResults.clear();

    if( caster.rect ) { // rect hit       
        gfxResults.lineStyle( 1, 0xFF0000, 1, 0 );
        gfxResults.beginFill(0xFF0000,0.1);
        Results.forEach( r => {
            gfxResults.drawRect( r.result.intercept.x+caster.rect.min.x, r.result.intercept.y+caster.rect.min.y, caster.rect.getWidth(), caster.rect.getHeight() );
        } );
        gfxResults.closePath();
        gfxResults.endFill();
    }
    else if ( caster.circle ) { // circle hit
        gfxResults.lineStyle( 1, 0xFF0000, 1, 0 );
        gfxResults.beginFill(0xFF0000,0.1);
        Results.forEach( r => {
            gfxResults.drawCircle( r.result.intercept.x, r.result.intercept.y, caster.circle.radius, caster.circle.radius );
        } );
        gfxResults.closePath();
        gfxResults.endFill();
    }
    else { // ray hit
        gfxResults.lineStyle( 1, 0xFF0000, 1, 0 );
        Results.forEach( r => {

            gfxResults.moveTo( r.result.intercept.x-16, r.result.intercept.y);
            gfxResults.lineTo( r.result.intercept.x+16, r.result.intercept.y);
            gfxResults.moveTo( r.result.intercept.x, r.result.intercept.y-16);
            gfxResults.lineTo( r.result.intercept.x, r.result.intercept.y+16);

            gfxResults.drawRect( r.result.intercept.x-4, r.result.intercept.y-4, 8, 8 );
        } );
        gfxResults.closePath();    
    }
    gfxResults.closePath();
    gfxResults.endFill();

    // mark hit colliders with star
    gfxResults.beginFill(0xFF0000,0.1);
    Results.forEach( r => {
        gfxResults.drawStar( r.collider.pivot.x, r.collider.pivot.y, 4, 32, 16, 0 );
    } );
    gfxResults.endFill();
}

// colliders
var gfxColliders = new PIXI.Graphics();
app.stage.addChild(gfxColliders);

function drawColliders()
{
    gfxColliders.clear();
    gfxColliders.lineStyle( 1, 0xFFFFFF, 1, 0 );
    gfxColliders.beginFill( 0xFFFFFF, 0.1);
    PS.Colliders.forEach( c => {
        switch( c.type )
        {
            case 'rect': gfxColliders.drawRect( c.rect.min.x, c.rect.min.y, c.rect.getWidth(), c.rect.getHeight() );  break;
            case 'circle': gfxColliders.drawCircle( c.pivot.x, c.pivot.y, c.radius ); break;
        }            
    } ); 
    gfxColliders.endFill();
}
