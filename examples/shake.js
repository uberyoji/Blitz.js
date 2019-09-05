class NoiseDecayWaveform
{
	constructor( duration, frequency )
	{
		
		this.duration = duration;
		this.frequency = frequency;
		this.sampleCount = (duration/1000) * frequency;
		this.samples = [];
		this.startTime = null;
		this.t = null;
		this.isShaking = false;
	}
	init()
	{
		for(var i = 0; i < this.sampleCount; i++) {
			this.samples.push(Math.random() * 2 - 1);
		}		
	}
	
	start()
	{
		this.startTime = new Date().getTime();
		this.t = 0;
		this.isShaking = true;
	}
	
	update()
	{
		this.t = new Date().getTime() - this.startTime;
		if(this.t > this.duration) this.isShaking = false;
	}
	
	amplitude(t)
	{
		// Check if optional param was passed
		if(t == undefined) {
			// return zero if we are done shaking
			if(!this.isShaking) return 0;
			t = this.t;
		}
		
		// Get the previous and next sample
		var s = t / 1000 * this.frequency;
		var s0 = Math.floor(s);
		var s1 = s0 + 1;
		
		// Get the current decay
		var k = this.decay(t);
		
		// Return the current amplitude 
		return (this.noise(s0) + (s - s0)*(this.noise(s1) - this.noise(s0))) * k;
	}
	
	noise(s)
	{
		// Retrieve the randomized value from the samples
		if(s >= this.samples.length) return 0;
		return this.samples[s];
	}

	decay(t)
	{
		// Linear decay
		if(t >= this.duration) return 0;
		return (this.duration - t) / this.duration;
	}
}

class CameraShake
{
	constructor( duration, frequency, amplitude, container )
	{
		this.container = container; // PIXI js container
		this.amplitude = amplitude;
		this.xShake = new NoiseDecayWaveform(duration, frequency); this.xShake.init();
		this.yShake = new NoiseDecayWaveform(duration, frequency); this.yShake.init();
		this.reset = false;
	}

	start()
	{
		this.xShake.start();
		this.yShake.start();
		this.reset = false;	//remember to reset position when shaking is done
	}

	update()
	{
		this.xShake.update();
		this.yShake.update();

		if(this.xShake.isShaking || this.yShake.isShaking) 
		{
			var x = this.xShake.amplitude() * this.amplitude;
			var y = this.yShake.amplitude() * this.amplitude;

			this.container.x = x;				
			this.container.y = y;				
		}
		else
		{
			if( this.reset )
			{
				this.container.x = 0;				
				this.container.y = 0;
				this.reset = false;
			}
		}
	}
}
