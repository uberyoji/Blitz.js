class PixiGraphics extends Component
{
    constructor( params ) {
        super("PixiGraphics");        
        this.node = new PIXI.Graphics();
        params.scene.addChild(this.node);
    }

    start() {
        const size = 32;

        this.node.clear();
        this.node.lineStyle( 1, 0xFFFFFF, 1, 0 );
        this.node.beginFill( 0xFFFFFF, 0.1);
        this.node.drawRect( -size/2, -size/2, size, size );
        this.node.endFill();

        this.node.beginFill( 0xFFFFFF, 0.1);
        this.node.moveTo( size/2, -size/4);
        this.node.lineTo( size, 0);
        this.node.lineTo( size/2, size/4);
        this.node.closePath();
        this.node.endFill();
    }

    apply()
    {
        this.node.x = this.entity.transform.position.x;
        this.node.y = this.entity.transform.position.y;
        this.node.rotation = this.entity.transform.rotation;
    }
}
