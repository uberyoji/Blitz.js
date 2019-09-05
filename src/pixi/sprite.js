class PixiSprite extends Component
{
    constructor( params ) {
        super("PixiSprite");
        let TextureCache = PIXI.utils.TextureCache; 
        this.node = new PIXI.Sprite(TextureCache[params.filename]),
        params.scene.addChild(this.node);        
    }

    start() {        
        this.node.x = this.entity.transform.position.x;
        this.node.y = this.entity.transform.position.y;
        this.node.anchor.set(0.5); // FIXME: set anchor to center
    }

    apply() {
        this.node.x = this.entity.transform.position.x;
        this.node.y = this.entity.transform.position.y;
        this.node.rotation = this.entity.transform.rotation;
    }
}
