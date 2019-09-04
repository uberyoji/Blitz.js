
import * from '.src/Transform.js'

export default class Entity
{
    constructor()
    {

    }

    Transform = new Transform();
    Components = {}
}

export default class EntitySystem
{
    constructor()
    {

    }

    Entities = [];
    Creators = {}

    Register( classname, creator )
    {
        this.Creators[classname] = creator;
    }

    Create(classname)
    {
        let creator = this.Creators[classname];

        if( creator )
        {
            let entity = creator.Create();
            this.Entities.push(entity);
            return entity;
        }
    }

    Find(name)
    {
        
    }
}

