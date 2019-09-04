
export const Type = [ 'Point', 'Rect' ];

export class Collider
{
    constructor()
    {

    }

    Type = null;

    function Overlap( Other )
    {
        return false;
    }
}

export class ColliderPoint extends Collider
{
    constructor()
    {

    }
}