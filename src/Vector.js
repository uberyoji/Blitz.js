
class Vector2 {
	constructor(x,y) {
		this.x = x||0;
		this.y = y||0;
	}

	clone() {
		return new Vector2( this.x, this.y );
	}

	getPerpendicular() {
		return new Vector2(-this.y, this.x);
	}

	getProjection( to ) {
		return to.clone().scale( this.dotProduct(to) / to.lengthSquare() );
	}

	add( v ) {
		this.x += v.x;
		this.y += v.y;
		return this;
	}

	subtract( v ) {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}

	negate() {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	}

	multiply( s ) {
		this.x *= s;
		this.y *= s;
	}

	rotate(a) {
		let cosa = Math.cos(a);
		let sina = Math.sin(a);

		let tx = this.x;
		this.x = this.x * cosa - this.y * sina;
		this.y =  tx * sina + this.y * cosa;

		return this;
	}

	length() {
		return( Math.sqrt( this.x**2+this.y**2) );
	}

	lengthSquare() {
		return( this.x**2+this.y**2 );
	}

	normalize() {
		return this.scale( 1.0 / this.length() );
	}

	dotProduct( v )
	{
		return(this.x*v.x + this.y*v.y);
	}
	crossProduct() {
		return(this.x*v.y - this.y*v.x);
	}

	angleBetween( v ) {
		return  Math.atan2( this.crossProduct(v), this.dotProduct(v) );
	}	
}