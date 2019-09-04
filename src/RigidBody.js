class RigidBody
{
    constructor()
    {
        
    }
    Name = "RigidBody";
    Entity = null;
    
    Mass = 1.0;
    Force = new Vector();
    Acceleration = new Vector();
    Velocity = new Vector();

    AngularForce = 0;   // torque
    AngularVelocity = 0;
    AngularAcceleration = 0;
    
    Colliders = [];

    Apply()
    {
        let F = this.Force.clone();
        F.divide(this.Mass);
        this.Acceleration = F;
        this.Velocity.Add(this.Acceleration);
        this.Entity.Transform.Position.Add(this.Velocity);

        let F = this.AngularForce.clone();
        F.divide(this.Mass);
        this.AngularAcceleration = F;
        this.AngularVelocity.Add(this.AngularAcceleration);
        this.Entity.Transform.Angle.Add(this.AngularVelocity);
    }
}

RegisteredComponents = [];

export function Add( func )
{
    this.Components.RigidBody = new RigidBody(this, func);
    RegisteredComponents.push(this.Components.RigidBody);
}

export function Remove()
{   
    RegisteredComponents = RegisteredComponents.filter( function(value, index, arr) { return value != this.Components.RigidBody; });
    this.Components.RigidBody = undefined;
}

export function Apply()
{
    RegisteredComponents.array.forEach( c => { c.Apply(); });
}