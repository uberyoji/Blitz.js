const app = new PIXI.Application({ antialias: true });
document.body.appendChild(app.view);

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

ray = 
{ 
    origin: ColliderCenter,
    distance: new Vector2(512,512),
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

var hitPoints = new PIXI.Graphics();
app.stage.addChild(hitPoints);

var rayRotation = 0;
const rayRotationSpeed = 0.005;

const rectCasterSize = 16;
var rectCaster = new Rect( new Vector2(-rectCasterSize,-rectCasterSize), new Vector2(rectCasterSize,rectCasterSize) );

app.ticker.add(() => {

    // update ray
    rayRotation += rayRotationSpeed;
    ray.distance.x = Math.cos( rayRotation ) * ColliderDistance * 2;
    ray.distance.y = Math.sin( rayRotation ) * ColliderDistance * 2;

    var Results = PS.rectCast( ray.origin, ray.distance, rectCaster, 0xFFFFFFFF );

    let R = rectCaster.clone().offset( ray.origin );

    // draw all colliders
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
        
        gfxColliders.drawRect( R.min.x, R.min.y, R.getWidth(), R.getHeight() );
        
        gfxColliders.endFill();
    }

    // draw ray hits
    {
        hitPoints.clear();
        hitPoints.beginFill(0xFFFF00,1);
        Results.forEach( r => {
            hitPoints.drawRect( r.result.intercept.x- R.getWidth()/2, r.result.intercept.y- R.getHeight()/2, R.getWidth(), R.getHeight() );
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
