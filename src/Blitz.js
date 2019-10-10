

class Blitz
{
    constructor() {
        
        console.log( "blitz.js - booting ecs..." );
        this.ES = new EntitySystem();
        this.CS = new ComponentSystem();

        // booting pixi js
        console.log( "blitz.js - booting pixi js..." );
        this.pixiApp = new PIXI.Application({ antialias: true });
        document.body.appendChild(this.pixiApp.view);

        this.RootScene = new PIXI.Container();
        this.RootScene.sortableChildren = true;
        this.pixiApp.stage.addChild(this.RootScene);
    }

    precacheAssets( array )
    {
        console.log( "blitz.js - precaching assets..." );
        PIXI.Loader.shared.add(array);
        return this;
    }

    loadAssets( onAssetsLoaded )
    {
        console.log( "blitz.js - loading assets..." );
		PIXI.Loader.shared.load( onAssetsLoaded );
    }

    start() {
        Blitz.CS = this.CS;
        Blitz.ES = this.ES;
        Blitz.Pixi = this.pixiApp;
        Blitz.RootScene = this.RootScene;

        // fixme precreate components
        this.CS.components.Think = [];
        this.CS.components.Animator = [];
        this.CS.components.RigidBody = [];
        this.CS.components.PixiText = [];
        this.CS.components.PixiSprite = [];
        this.CS.components.PixiGraphics = [];

        // let entities create their components
        this.ES.entities.forEach( e => { e.start(); } );    // call start on each entity

        // create their components
        for( var cr in this.CS.components ) 
        { 
            this.CS.components[cr].forEach( c => { c.start(); } );
        }    // call start on each components
    }

    update()
    {
        this.CS.components.Think.forEach( c => { c.apply() });        
        this.CS.components.Animator.forEach( c => { c.apply() });
        this.CS.components.RigidBody.forEach( c => { c.apply() });
        this.CS.components.PixiText.forEach( c => { c.apply() });
        this.CS.components.PixiSprite.forEach( c => { c.apply() });
        this.CS.components.PixiGraphics.forEach( c => { c.apply() });
    }
}
