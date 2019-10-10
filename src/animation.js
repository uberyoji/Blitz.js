

class Keyframe
{
    constructor( v,t )  { 
        this.value = v;
        this.time = t;

    }
}

class Track {
    constructor() {
        this.keys = [];
    }

    setKeys( keys ) {
        this.keys = keys;
    }

    addKey( k ) {
        this.keys.push(k);
    }

    findKeyIndex( t ) {
        for( var i=0;i<this.keys.length;i++)
        {
            if( this.keys[i].time > t )
                return i;            
        }
        return this.keys.length-1;
    }

    evaluate( t ) {
        var i = this.findKeyIndex( t );
        if( i == 0 )
            return this.keys[i].value;

        var keyA = this.keys[i-1];
        var keyB = this.keys[i];

        var timeRatio = (t - keyA.time) / (keyB.time - keyA.time);
                
        return keyA.value + timeRatio * (keyB.value-keyA.value);
    }
}

class BAnimation {
    constructor( ) {
        this.tracks = {
            position: { x: new Track(), y:new Track() },
            rotation: new Track()
        };
    }    
}

class Animator extends Component {
    constructor( params ) {
        super("Animator");

        this.time = 0.0;
        this.animation = params.animation;
    }

    apply() {
        // fixme
        
        this.time += 0.015;
        if(this.time>6.0)
            this.time = 0;

        this.entity.transform.position.x = this.animation.tracks.position.x.evaluate( this.time );
        this.entity.transform.position.y = this.animation.tracks.position.y.evaluate( this.time );
        this.entity.transform.rotation = this.animation.tracks.rotation.evaluate( this.time );
    }
}