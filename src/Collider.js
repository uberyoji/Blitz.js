class Collider {
	constructor( x,y ) {
		this.pivot = new Vector2(x,y);
		this.mask = 0xFFFFFFFF;
		this.type = 'point';
	}

	overlap( collider )
	{
		switch( collider.type )
		{
			case 'rect': return collider.rect.overlapPoint(this.pivot);
			case 'circle': return collider.circle.overlapPoint(this.pivot);
		}
		return false;
	}

	getDistance( point )
	{
		return this.pivot.clone().subtract(point).length();
	}
}


// TODO: create a rect class (methods: overlaps, offset, etc)
class Rect {

	constructor( min, max) {
		this.min = min;
		this.max = max;
	}

	getWidth() {
		return this.max.x-this.min.x;
	}
	
	getHeight() {
		return this.max.y-this.min.y;
	}

	clone()
	{
		return new Rect( this.min.clone(), this.max.clone() );
	}

	offset( v )
	{
		this.min.add(v);
		this.max.add(v);
		return this;
	}

	difference( r )
	{
		this.min.subtract( r.max );
		this.max.subtract( r.min );
		return this;
	}

	overlapRect( rect ) {
		if( this.min.x > rect.max.x || this.max.x < rect.min.x )  // not overlapping on x axis
			return false;
		if( this.min.y > rect.max.y || this.max.y < rect.min.y ) // not overlapping on y axis
			return false;
		return true;
	}

	overlapPoint( point ) {
		if( this.min.x > point.x || this.max.x < point.x )  // not overlapping on x axis
			return false;
		if( this.min.y > point.y || this.max.y < point.y ) // not overlapping on y axis
			return false;
		return true;
	}

	overlapCircle() {
		return false; //FIXME: missing
    }
    
    getDistance( point )
	{
		let p = point;

		let d = new Vector2( Math.abs(p.x)-this.getWidth()/2, Math.abs(p.y)-this.getHeight()/2);
		let ma = new Vector2( Math.max(d.x, 0), Math.max(d.y,0) );
		let mi = Math.min( Math.max(d.x, d.y), 0 );

		return ma.length() + mi;
	}
}

class ColliderRect extends Collider {
	constructor( x,y,w,h ) {
		super(x,y);
		this.localRect = new Rect( new Vector2( -w/2, -h/2 ),	//FIXME assuming center
								new Vector2( w/2, h/2 ) );
		this.rect = this.localRect.clone();
		this.rect.offset( this.pivot );
		this.type = 'rect';
	}

	overlap( collider )
	{
		switch( collider.type )
		{
			case 'point': return this.rect.overlapPoint( collider.pivot );
			case 'rect': return this.rect.overlapRect( collider.rect );
			case 'circle': return this.rect.overlapCircle( collider.circle );
		}
		return false;
	}

	getDistance( point )
	{
		let p = point.clone().subtract(this.pivot);	//fixme: assuming center with half size.

		let d = new Vector2( Math.abs(p.x)-this.rect.getWidth()/2, Math.abs(p.y)-this.rect.getHeight()/2);
		let ma = new Vector2( Math.max(d.x, 0), Math.max(d.y,0) );
		let mi = Math.min( Math.max(d.x, d.y), 0 );

		return ma.length() + mi;

//		return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);
	}
}

class Circle
{
	constructor( pos, radius ) {
		this.position = pos;
		this.radius = radius;
	}
	overlapRect( rect ) {		
		return false;	//TODO: 
	}
	overlapPoint( point ) {
		return (point.clone().subtract(this.pivot).lengthSquared() < this.radius**2);
	}
	overlapCircle( circle ) {
		return (circle.pivot.clone().subtract(this.pivot).lengthSquared() < (this.radius+circle.radius)**2);
	}
}

class ColliderCircle extends Collider {
	constructor( x,y,r ) {
		super(x,y);
		this.radius = r;
		this.type = 'circle';
		this.circle = new Circle( this.pivot, this.radius );
	}
	overlap( collider )
	{
		switch( collider.type )
		{
			case 'point': return this.circle.overlapPoint( collider.pivot );
			case 'rect': return this.circle.overlapRect( collider.rect );
			case 'circle': return this.circle.overlapCircle( collider.circle );
		}
		return false;
	}

	getDistance( point )
	{
		return point.clone().subtract(this.pivot).length() - this.radius;
	}
}