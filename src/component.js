class Component {
    constructor( name )
    {
        this.name = name;
        this.entity = null;
        this.active = true;
    }

    start() {

    }
}

class ComponentSystem {
    constructor() {
        this.components = {};
    }

    startComponent( name ) {
        this.components[name].forEach( c => { c.start(); });
    }
    
    applyComponent( name ) {
        this.components[name].forEach( c => { c.apply(); });
    }
}
