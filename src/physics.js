

class PhysicsSystem
{
	constructor()
	{
		this.Colliders = [];
	}	

	rayCast( rayCaster, mask )
	{
		let Results = [];
		this.Colliders.forEach( collider => {

			if( collider.mask & mask != 0 )
			{
				let R = undefined;
				switch( collider.type )
				{
					case 'rect': R = PhysicsSystem.rayCastRect( rayCaster, collider.rect ); break;
					case 'circle': R = PhysicsSystem.rayCastCircle( rayCaster, collider.circle ); break;
				}
				if( R != undefined && R.hit )
					Results.push( { collider:collider, result:R } );
			}			
		});
		return Results;
	}

	rectCast( rectCaster, mask )
	{
		let Results = [];

		this.Colliders.forEach( collider => {

			if( collider.mask & mask != 0 )
			{
				let R = undefined;
				switch( collider.type )
				{
					case 'rect': R = PhysicsSystem.rectCastRect( rectCaster, collider.rect ); break;
					case 'circle': R = PhysicsSystem.rectCastCircle( rectCaster, collider.circle ); break;
				}
				if( R != undefined && R.hit )
					Results.push( { collider:collider, result:R } );
			}			
		});
		return Results;
	}

	circleCast( circleCaster, mask )
	{
		let Results = [];

		this.Colliders.forEach( collider => {

			if( collider.mask & mask != 0 )
			{
				let R = undefined;
				switch( collider.type )
				{
					case 'rect': R = PhysicsSystem.circleCastRect( circleCaster, collider.rect ); break;
					case 'circle': R = PhysicsSystem.circleCastCircle( circleCaster, collider.circle ); break;
				}
				if( R != undefined && R.hit )
					Results.push( { collider:collider, result:R } );
			}			
		});
		return Results;
	}

	overlapCheck()
	{
		let i,j;
		for( i=0; i<this.Colliders.length-1; i++) {
			for( j=0; j<this.Colliders.length; j++)	{

				// check if we should check overlapp
				if( this.Colliders[i].mask & this.Colliders[j].mask == 0 )
					continue;
				
				// check if we overlap
				if( this.Colliders[i].overlap(this.Colliders[j]) )
				{
					if( typeof this.Colliders[i].onOverlap == "function" )
						this.Colliders[i].onOverlap( this.Colliders[j] );
					if( typeof this.Colliders[j].onOverlap == "function" )
						this.Colliders[j].onOverlap( this.Colliders[i] );
				}
			}
		}
	}
}

// helper: Ray casting Rect
PhysicsSystem.rayCastRect = function( rayCaster, rect )
{
	let origin = rayCaster.origin;
	let distance = rayCaster.distance;

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

		if( intercept.y <= rect.max.y && intercept.y >= rect.min.y )
			return { hit: true, side:{x:(distance.x > 0 ? -1 : (distance.x < 0 ? 1 : 0)), y:0}, intercept:intercept }; 
	}    
	
	// find intercept point on y axis
	intercept.y = (distance.y > 0 ? rect.min.y : (distance.y < 0 ? rect.max.y : end.y));
	if( distance.y > 0 || distance.y < 0 )
	{
		let dy = (intercept.y-origin.y) / distance.y;
		intercept.x = origin.x + distance.x * dy;
	
		if( intercept.x <= rect.max.x && intercept.x >= rect.min.x )
			return { hit: true, side:{ x:0, y:(distance.y > 0 ? -1 : (distance.y < 0 ? 1 : 0))}, intercept:intercept };
	}
	
	return { hit: false, ratio:1, intercept:end };
}

// helper: Circle casting Circle
PhysicsSystem.circleCastCircle = function( circleCaster, circle )
{
	const cdiff = new Circle( circle.position, circle.radius + circleCaster.circle.radius );
	return this.rayCastCircle( circleCaster, cdiff );
}

// helper: Ray casting Circle
PhysicsSystem.rayCastCircle = function( rayCaster, circle )
{
	const origin = rayCaster.origin;
	const distance = rayCaster.distance;

	// A: origin B: end C: circle.pivot
	const end = origin.clone().add(distance);

	// compute the triangle area times 2 (area = area2/2)
	let area2 = Math.abs( (end.x-origin.x)*(circle.position.y-origin.y) - (circle.position.x-origin.x)*(end.y-origin.y) );

	// compute the AB segment length
	let LAB = distance.length(); // Math.sqrt( (Bx-Ax)**2 + (By-Ay)**2 );

	// compute the triangle height
	let h = area2/LAB;

	// if the line intersects the circle
	if( h <= circle.radius )
	{
		// TODO
		// compute the line AB direction vector components
		let Dx = (end.x-origin.x)/LAB;
		let Dy = (end.y-origin.y)/LAB;

		// compute the distance from A toward B of closest point to C
		let t = Dx*(circle.position.x-origin.x) + Dy*(circle.position.y-origin.y);
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

// helper: Rect casting Rect
PhysicsSystem.rectCastRect = function( rectCaster, rect )
{
	let diffRect = rect.clone().difference( rectCaster.rect );		
	return this.rayCastRect( rectCaster, diffRect );
}

// helper: Rect casting Circle
PhysicsSystem.rectCastCircle = function( rayCaster, circle )
{
	return { hit: false };
}

PhysicsSystem.circleCastRect = function(circleCaster, orect )
{
	let origin = circleCaster.origin;
	let distance = circleCaster.distance;
	let rect = orect.clone();
	rect.min.x -= circleCaster.circle.radius;
	rect.min.y -= circleCaster.circle.radius;
	rect.max.x += circleCaster.circle.radius;
	rect.max.y += circleCaster.circle.radius;

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

		if( intercept.y <= rect.max.y && intercept.y >= rect.min.y )
			return { hit: true, side:{x:(distance.x > 0 ? -1 : (distance.x < 0 ? 1 : 0)), y:0}, intercept:intercept }; 
	}    
	
	// find intercept point on y axis
	intercept.y = (distance.y > 0 ? rect.min.y : (distance.y < 0 ? rect.max.y : end.y));
	if( distance.y > 0 || distance.y < 0 )
	{
		let dy = (intercept.y-origin.y) / distance.y;
		intercept.x = origin.x + distance.x * dy;
	
		if( intercept.x <= rect.max.x && intercept.x >= rect.min.x )
			return { hit: true, side:{ x:0, y:(distance.y > 0 ? -1 : (distance.y < 0 ? 1 : 0))}, intercept:intercept };
	}
	
	return { hit: false, ratio:1, intercept:end };
}



class RayMarcher
{
    constructor( ps ) {
        this.ps = ps;
        this.MAX_MARCHING_STEPS = 64;
        this.EPSILON = 0.1; //0.01;
    }
    
    rayMarch( rayCaster, mask )
    {
        let Results = [];
		this.ps.Colliders.forEach( collider => {

			if( collider.mask & mask != 0 )
			{
				let R = this.rayMarchCollider( rayCaster, collider );
				if( R != undefined && R.hit )
					Results.push( { collider:collider, result:R } );
			}			
		});
		return Results;
	}
	circleMarch( circleCaster, mask )
    {
        let Results = [];
		this.ps.Colliders.forEach( collider => {

			if( collider.mask & mask != 0 )
			{
				let R = this.circleMarchCollider( circleCaster, collider );
				if( R != undefined && R.hit )
					Results.push( { collider:collider, result:R } );
			}			
		});
		return Results;
	}
	rectMarch( rectCaster, mask )
    {
        let Results = [];
		this.ps.Colliders.forEach( collider => {

			if( collider.mask & mask != 0 )
			{
				let R = this.rectMarchCollider( rectCaster, collider );
				if( R != undefined && R.hit )
					Results.push( { collider:collider, result:R } );
			}			
		});
		return Results;
    }

    rayMarchCollider( rayCaster, collider )
    {
        var depth = 0;
		var dist = 0;
		const end = rayCaster.distance.length();
        const dir = rayCaster.distance.clone().normalize();

        var intercept;
        
        for (var i = 0; i < this.MAX_MARCHING_STEPS; i++) {
            intercept = rayCaster.origin.clone().ma( dir, depth );
            dist = collider.getDistance( intercept );
            if (dist < this.EPSILON) {
				// We're inside the scene surface!
				console.log( `circleMarch: hit after ${i} iterations.` );
                return { hit: true, intercept:intercept, depth:depth };
            }
            // Move along the view ray
            depth += dist;

            if (depth >= end) {
                // Gone too far; give up
            }
		}
		console.log( `circleMarch: ran out of iterations iterations (${i}).` );
        return { hit:false, depth:end} ;
	}
	
	circleMarchCollider( circleCaster, collider )
    {
        var depth = 0;
		var dist = 0;
		const end = circleCaster.distance.length();
        const dir = circleCaster.distance.clone().normalize();

        var intercept;
        
        for (var i = 0; i < this.MAX_MARCHING_STEPS; i++) {
            intercept = circleCaster.origin.clone().ma( dir, depth );
            dist = collider.getDistance( intercept ) - circleCaster.circle.radius;
            if (dist < this.EPSILON) {
				// We're inside the scene surface!
				console.log( `circleMarch: hit after ${i} iterations.` );
                return { hit: true, intercept:intercept, depth:depth };
            }
            // Move along the view ray
            depth += dist;

            if (depth >= end) {
				// Gone too far; give up
                return { hit:false, intercept:intercept, depth:end };
            }
		}
		console.log( `circleMarch: ran out of iterations iterations (${i}).` );
        return { hit:false, depth:end} ;
	}
	
	rectMarchCollider( rectCaster, collider )
    {
        var depth = 0;
		var dist = 0;
		const end = rectCaster.distance.length();
		const dir = rectCaster.distance.clone().normalize();
		const zero = new Vector2(0,0);

        var intercept;
        
        for (var i = 0; i < this.MAX_MARCHING_STEPS; i++) {
            intercept = rectCaster.origin.clone().ma( dir, depth );
            dist = collider.getDistance( intercept ) + rectCaster.rect.getDistance(zero);
            if (dist < this.EPSILON) {
				// We're inside the scene surface!				
				console.log( `circleMarch: hit after ${i} iterations.` );
                return { hit: true, intercept:intercept, depth:depth };
            }
            // Move along the view ray
            depth += dist;

            if (depth >= end) {
				// Gone too far; give up
                return { hit:false, intercept:intercept, depth:end };
            }
		}
		console.log( `circleMarch: ran out of iterations iterations (${i}).` );
        return { hit:false, depth:end} ;
    }
}