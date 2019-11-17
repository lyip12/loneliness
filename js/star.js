// Star Class
class Star{
	pos = new THREE.Vector3(0,0,0);
	vel = new THREE.Vector3(0,THREE.Math.randFloat(-0.1,0.1),0);
	acc = new THREE.Vector3(0,0,0);
    wandertheta = 0;
    life = 0;
    life2 = 0
    lifetime = 1;
	static maxspeed = 1.2;
	static maxforce = 0.03;

	constructor(_x,_y,_z,_life){
	this.pos.x = _x;
	this.pos.y = _y;
    this.pos.z = _z;
    this.life = _life;
    this.life2 = 2* _life;
    this.lifetime = _life;
	}
    get alpha() {
        return this.life/this.lifetime;
      }

    get remain(){
        return this.life2;
    }
    wander(){
        var wanderR = 2.5;
        var wanderD = 8;
        var change = 0.6;
        //this.wandertheta = THREE.Math.randFloatSpread(change);
    
        this.wandertheta += THREE.Math.randFloat(-change,change);
        var circlepos = this.vel.clone()
        circlepos.normalize();
        circlepos.multiplyScalar(wanderD);
        circlepos.add(this.pos);
    
        var yvel = new THREE.Vector3(0,0,1);
        yvel.cross(this.vel);  //perpendicular to velocity
        yvel.normalize();
        var target = new THREE.Vector3(0,0,0);
        yvel.multiplyScalar(Math.cos(this.wandertheta));
        var xvel = this.vel.clone();
        xvel.multiplyScalar(Math.sin(this.wandertheta));
        target.addVectors(yvel,xvel);
        target.normalize();
        target.multiplyScalar(wanderR);
        target.add(circlepos);

        this.seek(target);
    }

	seek(target){
        var desired = target.clone();
        desired.sub(this.pos);
        desired.normalize();
		desired.multiplyScalar(Star.maxspeed);
		desired.sub(this.vel);
		desired.clampLength(0,Star.maxforce);
		this.applyforce(desired)
	}
    decay(){
        if (this.life > 0 ){
            this.life -= 1;
        }
        if(this.life2 > 0){
            this.life2 -=1;
        }
    }

	applyforce(force){
		this.acc.add(force);
	}
	update(){
        this.vel.add(this.acc);
        this.vel.clampLength(0,Star.maxspeed);
		this.pos.add(this.vel);
        this.acc.multiplyScalar(0);
        this.decay();
	}
}


