class Think extends Component
{
    constructor( params ) {
        super("Think");
        this.think = params.think;
    }

    apply()
    {
        this.think.call(this.entity);
    }
}
