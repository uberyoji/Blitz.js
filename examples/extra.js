
// PS DEBUGING

var stage = new PIXI.Container();
stage.interactive = true;
stage.hitArea = new PIXI.Rectangle(0, 0, app.renderer.screen.width, app.renderer.screen.height);

stage.mousedown = function (moveData) 
{	
   // console.log("mousedown:"); 
   
   let mousePosition = app.renderer.plugins.interaction.mouse.global;
   /*
   let rv = getRandom(-8,8);
   PS.emit( { count: 4, x:mousePosition.x, y:mousePosition.y, vel: 512, rvel:rv, gravity:1024, life:5.0, tex:debris } );
   */
};
stage.mousemove = function (moveData) 
{
   // console.log("mousemove"); 
   let mousePosition = app.renderer.plugins.interaction.mouse.global;

   /*
   let dx = mousePosition.x - Ball.sprite.x;
   let dy = mousePosition.y - Ball.sprite.y;
   let f = 0.1;

   Ball.sprite.x += dx * f;
   Ball.sprite.y += dy * f;

   if( Math.random() > 0.1 )
      return;
   */
   /*
   let rx = getRandom(-8,8);
   let ry = getRandom(-8,8);
   let rl = getRandom(0.5,1.0);
   PS.emit( { count: 1, x: Ball.sprite.x+rx, y: Ball.sprite.y+ry, vel: 0, rvel:0, gravity:0,  life:rl, tex:ballTrail } );
   */

   //PS.emit( { count: 1, x: Ball.sprite.x, y: Ball.sprite.y, vel: 0, rvel:10 * Math.sign(dx), gravity:0,  life:1.0, tex:paddleTrail } );
};
stage.mouseup = function (moveDate) 
{
   // console.log("mouseup");
   let mousePosition = app.renderer.plugins.interaction.mouse.global;
   // PS.emit( { count: 4, x:mousePosition.x, y:mousePosition.y, vel: 512, rvel:10.0, gravity:1024,  life:5.0, tex:debris } );
};

app.stage.addChild(stage);

// TODO: ui: score, lives left, messages (start,game over, etc)

// TODO: add hit left counter to blocks and make it invisible only if hit left counter is equal to 0
// TODO: set hit left counter custom per block color
// TODO: play sounds when hitting side, bottom, block, paddle

// TODO: add particles, ball trail, paddle trail, block break

// TODO: add screen shake

// TODO: add end of level condition

// TODO: add power ups: multi ball, small paddle, fast ball, slow ball, etc