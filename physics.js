class Collider {
	constructor( x,y ) {
		this.pivot = new Vector2(x,y);
		this.mask = 0xFFFFFFFF;
		this.type = 'point';
	}
}

class ColliderRect extends Collider {
	constructor( x,y,w,h ) {
		super(x,y);
		this.minX = this.pivot.x-w/2;
		this.maxX = this.pivot.x+w/2;
		this.minY = this.pivot.y-h/2;
		this.maxY = this.pivot.y+h/2;
		this.type = 'rect';
	}

	getWidth() {
		return this.maxX-this.minX;
	}
	
	getHeight() {
		return this.maxY-this.minY;
	}

	overlapRect( rect ) {
		if( this.minX > rect.maxX || this.maxX < rect.minX )  // not overlapping on x axis
			return false;
		if( this.minY > rect.maxY || this.maxY < rect.minY ) // not overlapping on y axis
			return false;
		return true;
	}

	overlapPoint( point ) {
		if( this.minX > point.x || this.maxX < point.x )  // not overlapping on x axis
			return false;
		if( this.minY > point.y || this.maxY < point.y ) // not overlapping on y axis
			return false;
		return true;
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
		let endX = origin.x + distance.x;
		let endY = origin.y + distance.y;

		let rayMinX = Math.min(origin.x,endX);
		let rayMinY = Math.min(origin.y,endY);
		let rayMaxX = Math.max(origin.x,endX);
		let rayMaxY = Math.max(origin.y,endY);

		if( rayMinX > rect.maxX || rayMaxX < rect.minX )  // not overlapping on x axis
			return { hit: false, ratio:1, interceptX:endX, interceptY:endY };

		if( rayMinY > rect.maxY || rayMaxY < rect.minY ) // not overlapping on y axis
			return { hit: false, ratio:1, interceptX:endX, interceptY:endY };

		let interceptX = endX;
		let interceptY = endY;

		// find intercept point on x axis
		interceptX = (distance.x > 0 ? rect.minX : (distance.x < 0 ? rect.maxX : endX));
		if( distance.x > 0 || distance.x < 0 )
		{
			let dx = (interceptX-origin.x) / distance.x;
			interceptY = origin.y + distance.y * dx;

			if( interceptY < rect.maxY && interceptY > rect.minY )
				return { hit: true, sideX:(distance.x > 0 ? -1 : (distance.x < 0 ? 1 : 0)), sideY:0, interceptX:interceptX, interceptY:interceptY }; 
		}    
		
		// find intercept point on y axis
		interceptY = (distance.y > 0 ? rect.minY : (distance.y < 0 ? rect.maxY : endY));
		if( distance.y > 0 || distance.y < 0 )
		{
			let dy = (interceptY-origin.y) / distance.y;
			interceptX = origin.x + distance.x * dy;
		
			if( interceptX < rect.maxX && interceptX > rect.minX )
				return { hit: true, sideX:0, sideY:(distance.y > 0 ? -1 : (distance.y < 0 ? 1 : 0)), interceptX:interceptX, interceptY:interceptY };
		}
		
		return { hit: false, ratio:1, interceptX:endX, interceptY:endY };
	}

	rectCast( rectA, distance, rectB )
	{
		let sx = rectA.maxX - rectA.minX;
		let sy = rectA.maxY - rectA.minY;

		let origin = { x:rectA.minX, y:rectA.minY };
		let rect = { minX: rectB.minX-sx, maxX:rectB.maxX, minY:rectB.minY-sy, maxY:rectB.maxY };

		return rayCastRect( origin, distance, rect );
	}

	rayCastCircle( origin, distance, circle )
	{
		let Ax = origin.x;
		let Ay = origin.y;

		let Bx = origin.x+distance.x;
		let By = origin.y+distance.y;

		let endX = Bx;
		let endY = By;

		let Cx = circle.pivot.x;
		let Cy = circle.pivot.y;
		let R = circle.radius;

		// compute the triangle area times 2 (area = area2/2)
		let area2 = Math.abs( (Bx-Ax)*(Cy-Ay) - (Cx-Ax)*(By-Ay) );

		// compute the AB segment length
		let LAB = Math.sqrt( (Bx-Ax)**2 + (By-Ay)**2 );

		// compute the triangle height
		let h = area2/LAB;

		// if the line intersects the circle
		if( h < R )
		{
			// TODO
			// compute the line AB direction vector components
			let Dx = (Bx-Ax)/LAB;
			let Dy = (By-Ay)/LAB;

			// compute the distance from A toward B of closest point to C
			let t = Dx*(Cx-Ax) + Dy*(Cy-Ay);

			// t should be equal to sqrt( (Cx-Ax)² + (Cy-Ay)² - h² )

			// compute the intersection point distance from t
			let dt = Math.sqrt( R**2 - h**2 );

			// check if intersection is beyond end of ray
			let fidt = t-dt;
			if( fidt > LAB || fidt < 0 )
				return { hit: false, interceptX:endX, interceptY:endY };

			// compute first intersection point coordinate
			let Ex = Ax + (fidt)*Dx;
			let Ey = Ay + (fidt)*Dy;

			// compute second intersection point coordinate
			/*
			let sidt = t+dt;
			let Fx = Ax + (t+dt)*Dx;
			let Fy = Ay + (t+dt)*Dy;
			*/

			return { hit: true, ratio:fidt/LAB, interceptX:Ex, interceptY:Ey };
		}

		return { hit: false, ratio:1, interceptX:endX, interceptY:endY };
	}
}