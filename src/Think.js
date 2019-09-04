import * from './src/Entity.js';

class Think
{
    constructor( entity, func )
    {
        this.Name = "Think";
        this.Entity = entity;
        this.Execute = func;
    }
    Name = "Think";
    Entity = null;
    Execute = function() {}

    Apply()
    {
        this.Execute.call(this.Entity);
    }
}

RegisteredComponents = [];

export function Add( func )
{
    this.Components.Think = new Think(this, func);

    RegisteredComponents.push(this.Components.Think);
}

export function Remove()
{   
    RegisteredComponents = RegisteredComponents.filter( function(value, index, arr) { return value != this.Components.Think; });
    this.Components.Think = undefined;
}

export function Apply()
{
    RegisteredComponents.array.forEach( c => { c.Apply(); });
}