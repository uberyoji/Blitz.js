import * from './src/Entity.js';

import * from './src/Think.js';
import * from './src/RigidBody.js';

export class Blitz
{
    ES = new EntitySystem();

    Update()
    {
        Think.Update();
        RigidBody.Update();
        
    }
}