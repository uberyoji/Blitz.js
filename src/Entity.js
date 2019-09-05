class Entity {
    constructor( name, params ) {
        this.name = name;
        this.transform = new Transform();
        this.components = { entity: this, 
                            add: function( component ) {        
                                    component.entity = this.entity;                 // bind to entity
                                    this[component.name] = component;               // register component in entity.components

                                    // check if registry for this type exists
                                    if( Blitz.CS.components[component.name] == undefined )    
                                        Blitz.CS.components[component.name] = [];

                                    Blitz.CS.components[component.name].push( component );    // add component to registry
                            }                            
                            /* FIXME need a todo at some point to remove components
                            remove: function( name )
                            {   
                                Blitz.CS.components[name].remove( this[name] );
                                this[name] = null; // ideally remove completely
                            } */ 
                           };
    }
    
    start() {

    }
}

class EntitySystem
{
    constructor() {
        this.entities = [];
        this.entityMaker = {}
    }

    register( classname, maker )
    {
        this.entityMaker[classname] = maker;
    }

    create(classname, name, params )
    {
        let maker = this.entityMaker[classname];

        if( maker )
        {
            var entity = maker( name, params );
            this.entities.push(entity);
            return entity;
        }
    }    
}