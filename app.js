const app = new PIXI.Application({ backgroundColor: 0x00000000 });
document.body.appendChild(app.view);

var renderer = new PIXI.autoDetectRenderer();
const interactionManager = new PIXI.interaction.InteractionManager(renderer);
interactionManager
    .on('mousedown', _onMouseDown)
    .on('mouseup', _onMouseUp)
    .on('mouseupoutside', _onMouseUp);

function _onMouseDown()
{

}

function _onMouseUp()
{
    /*
    let mousePosition = app.renderer.plugins.interaction.mouse.global;

    var b = createFruit();
    b.onLoad();
    b.go.transform.x = mousePosition.x;
    b.go.transform.y = mousePosition.y;
    GOs.bananas.push(b);
    */
   let mousePosition = app.renderer.plugins.interaction.mouse.global;

    var b = GOM.create("fruit");
    b.start();
    b.go.transform.x = mousePosition.x;
    b.go.transform.y = mousePosition.y;
    GOs.push(b);
}

/*
PIXI.loader
  .add(getAssetsLemon())
  .add(getAssetsBananas())
  .add(getAssetsFruit())
  .load(loadDoneHandler);

GOs = { bananas: [ createBananas() ] };
*/

function loadDoneHandler()
{
    GOs.forEach( b => { b.start(); } );
   
    app.ticker.add((delta) => { frame(delta); } );     // Listen for animate update
}

function frame(delta)
{
    GOs.forEach( b => { b.update(delta); } ); 
}

GOM.cache(loadDoneHandler);

GOs = [ GOM.create("bananas") ];
