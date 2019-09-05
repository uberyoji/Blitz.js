class RigidBody extends Component
{
    constructor( params ) {
        super("RigidBody");
        
        this.Mass = 1.0;
        this.Force = new Vector2();
        this.Acceleration = new Vector2();
        this.Velocity = new Vector2();

        this.AngularForce = 0;   // torque
        this.AngularVelocity = 0;
        this.AngularAcceleration = 0;
        
        this.Colliders = [];        
    }    

    apply()
    {
        let F = this.Force.clone();
        F.multiply(1.0/this.Mass);
        this.Acceleration = F;
        this.Velocity.add(this.Acceleration);
        this.entity.transform.position.add(this.Velocity);

        let AF = this.AngularForce;
        AF /= this.Mass;
        this.AngularAcceleration = AF;
        this.AngularVelocity += this.AngularAcceleration;
        this.entity.transform.rotation += this.AngularVelocity;
    }
}
