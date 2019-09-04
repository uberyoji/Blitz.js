class Collider {
	constructor( x,y ) {
		this.pivot = new Vector2(x,y);
		this.mask = 0xFFFFFFFF;
		this.type = 'point';
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

}

class ColliderRect extends Collider {
	constructor( x,y,w,h ) {
		super(x,y);
		this.rect = new Rect( new Vector2( this.pivot.x-w/2, this.pivot.y-h/2 ),	//FIXME assuming center
								new Vector2( this.pivot.x+w/2, this.pivot.y+h/2 ) );
		this.type = 'rect';
	}
}

class ColliderCircle extends Collider {
	constructor( x,y,r ) {
		super(x,y);
		this.radius = r;
		this.type = 'circle';
	}
}

class PhysicsSystem
{
	constructor()
	{
		this.Colliders = [];
	}	

	rayCast( origin, distance, mask )
	{
		let Results = [];
		this.Colliders.forEach( collider => {

			if( collider.mask & mask != 0 )
			{
				let R = undefined;
				switch( collider.type )
				{
					case 'rect': R = this.rayCastRect( origin, distance, collider ); break;
					case 'circle': R = this.rayCastCircle( origin, distance, collider ); break;
				}
				if( R != undefined & R.hit )
					Results.push( { collider:collider, result:R } );
			}			
		});
		return Results;
	}

	rayCastRect( origin, distance, rect )
	{
		let end = origin.clone().add(distance);

		let raymin = { x: Math.min(origin.x,end.x), y: Math.min(origin.y,end.y) };
		let raymax = { x: Math.max(origin.x,end.x), y: Math.max(origin.y,end.y) };

		if( raymin.x > rect.max.x || raymax.x < rect.min.x )  // not overlapping on x axis
			return { hit: false, ratio:1, intercept:end };

		if( raymin.y > rect.max.y || raymax.y < rect.min.y ) // not overlapping on y axis
			return { hit: false, ratio:1, intercept:end };

		let intercept = end.clone();

		// find intercept point on x axis
		intercept.x = (distance.x > 0 ? rect.min.x : (distance.x < 0 ? rect.max.x : end.x));
		if( distance.x > 0 || distance.x < 0 )
		{
			let dx = (intercept.x-origin.x) / distance.x;
			intercept.y = origin.y + distance.y * dx;

			if( intercept.y < rect.max.y && intercept.y > rect.min.y )
				return { hit: true, side:{x:(distance.x > 0 ? -1 : (distance.x < 0 ? 1 : 0)), y:0}, intercept:intercept }; 
		}    
		
		// find intercept point on y axis
		intercept.y = (distance.y > 0 ? rect.min.y : (distance.y < 0 ? rect.max.y : end.y));
		if( distance.y > 0 || distance.y < 0 )
		{
			let dy = (intercept.y-origin.y) / distance.y;
			intercept.x = origin.x + distance.x * dy;
		
			if( intercept.x < rect.max.x && intercept.x > rect.min.x )
				return { hit: true, side:{ x:0, y:(distance.y > 0 ? -1 : (distance.y < 0 ? 1 : 0))}, intercept:intercept };
		}
		
		return { hit: false, ratio:1, intercept:end };
	}

	rectCast( rectA, distance, rectB )
	{
		let sx = rectA.max.x - rectA.min.x;
		let sy = rectA.max.y - rectA.min.y;

		let origin = new Vector2( rectA.min.x, rectA.min.y );
		let rect = new Rect ( new Vector2(rectB.min.x-sx, rectB.min.y-sy), new Vector2(rectB.max.x,  rectB.max.y ) );

		return rayCastRect( origin, distance, rect );
	}

	rayCastCircle( origin, distance, circle )
	{
		// A: origin B: end C: circle.pivot
		const end = origin.clone().add(distance);

		// compute the triangle area times 2 (area = area2/2)
		let area2 = Math.abs( (end.x-origin.x)*(circle.pivot.y-origin.y) - (circle.pivot.x-origin.x)*(end.y-origin.y) );

		// compute the AB segment length
		let LAB = distance.length(); // Math.sqrt( (Bx-Ax)**2 + (By-Ay)**2 );

		// compute the triangle height
		let h = area2/LAB;

		// if the line intersects the circle
		if( h < circle.radius )
		{
			// TODO
			// compute the line AB direction vector components
			let Dx = (end.x-origin.x)/LAB;
			let Dy = (end.y-origin.y)/LAB;

			// compute the distance from A toward B of closest point to C
			let t = Dx*(circle.pivot.x-origin.x) + Dy*(circle.pivot.y-origin.y);
			// t should be equal to sqrt( (Cx-Ax)² + (Cy-Ay)² - h² )

			// compute the intersection point distance from t
			let dt = Math.sqrt( circle.radius**2 - h**2 );

			// check if intersection is beyond end of ray
			let fidt = t-dt;
			if( fidt > LAB || fidt < 0 )
				return { hit: false, intercept: end };

			// compute first intersection point coordinate
			let Ex = origin.x + (fidt)*Dx;
			let Ey = origin.y + (fidt)*Dy;

			// compute second intersection point coordinate
			/*
			let sidt = t+dt;
			let Fx = Ax + (t+dt)*Dx;
			let Fy = Ay + (t+dt)*Dy;
			*/

			return { hit: true, ratio:fidt/LAB, intercept: { x: Ex, y:Ey } };
		}

		return { hit: false, ratio:1, intercept: end };
	}
}