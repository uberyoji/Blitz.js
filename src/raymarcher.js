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