// this function is used to create the UI
class PixiText extends Component {
    
    constructor( params )
    {
        super( "PixiText" );        
        this.node = new PIXI.Text( "", params.font );        
        params.scene.addChild(this.node);        
    }

    start() {
        this.node.x = this.entity.transform.position.x;
        this.node.y = this.entity.transform.position.y;
    }
    
    setText( text )
    {
        this.node.text = text;
    }

    setColor( color )
    {
        this.node.style.fill = color;
    }

    apply()
    {
        this.node.x = this.entity.transform.position.x;
        this.node.y = this.entity.transform.position.y;
//        this.node.rotation = this.entity.transform.rotation;
    }
}
