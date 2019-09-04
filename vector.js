
class Vector2 {
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}

	clone() {
		v = new Vector2();
		v.x = this.x;
		v.y = this.y;
		return v;
	}	
}