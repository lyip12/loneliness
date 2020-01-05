// Star Class
class Star{
	constructor(_x,_y,_z, _life, _alternativeTrailColors = null){
        this.pos = new THREE.Vector3(0,0,0);
        this.vel = new THREE.Vector3(0,THREE.Math.randFloat(-0.2,0.2),0);
        this.acc = new THREE.Vector3(0,0,0);
        this.pos.x = _x;
        this.pos.y = _y;
        this.pos.z = _z;
        this.life = _life;
        this.life2 = 2 * _life;
        this.lifetime = _life;
        this.alternativeTrailColors = _alternativeTrailColors;
        
        // for records
        this.wandertheta = 0;
        this.trail = [];
        this.trailColor = [];
        this.trailColor2 = []
        this.trailPointer = 0;
        // indicate if finished the first round of trail
        // which means the colors along the trail is fixed
        this.trailColorPointer = 0;

        this.initTrail();
    }
    
    static get maxX(){
        return 1000;
    }

    static get maxY(){
        return 500;
    }

    static get startColor() {
        return new THREE.Color(0xff6666);
    }

    static get destColor(){
        return new THREE.Color(0x161c26);
    }

    static get maxspeed(){
        return 1.2;
    }

    static get maxforce(){
        return 0.03;
    }

    get alpha() {
        return this.life * 1.0/this.lifetime;
      }

    get remain(){
        return this.life2;
    }
    get pointer(){
        //return the current pointer of the trail
        return this.trailPointer;
    }

    get colorPointer(){
        return this.trailColorPointer;
    }
    get alllife(){
        return this.lifetime * 2;
    }
    
    setStats(_pos,_vel,_acc){
        this.pos = _pos;
        this.vel = _vel;
        this.acc = _acc;
    }

    reset(_x,_y,_z,_life){
        this.pos.x = _x;
        this.pos.y = _y;
        this.pos.z = _z;
        this.life = _life;
        this.life2 = 2* _life;
        this.lifetime = _life;
    }
    initTrail(){
        this.trail = [...Array(this.alllife).keys()].map(x => new THREE.Vector3(0,10000,10000));
        this.trailColor = [...Array(this.alllife).keys()].map(x => {
            var color = Star.startColor.clone();
            color.lerp(Star.destColor, 2 * Math.abs( Math.max(this.lifetime - x,0) * 1.0 / this.lifetime - 0.5));
            return color;
        });
        if(this.alternativeTrailColors){
            this.trailColor2 = [...Array(this.alllife).keys()].map(x => {
                var color = this.alternativeTrailColors[0].clone();
                color.lerp(this.alternativeTrailColors[1], x * 1.0 / this.alllife);
                return color;
            });
        }

        this.trail[this.trailPointer] = this.pos.clone(); 
    }
    wander(wanderR = 2.5,wanderD = 8,change = 0.6){    
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
    updatePosInTrail(){
        this.trailPointer += 1;
        // loop again
        if (this.trailPointer >= this.alllife){
            this.trailPointer -= this.alllife;
        }
        this.trail[this.trailPointer] = this.pos.clone(); 

    }

    updateColorPointer(){
        if ( this.trailColorPointer < this.alllife -1){
            this.trailColorPointer += 1; 
        }
    }
    boundaryCheck(){
        if(this.pos.x > Star.maxX && this.vel.x > 0 || this.pos.x < - Star.maxX && this.vel.x < 0){
            this.vel.add(new THREE.Vector3(-2*this.vel.x, 0,0));
        }
        if(this.pos.y > Star.maxY && this.vel.y > 0 || this.pos.y < - Star.maxY && this.vel.y < 0){
            this.vel.add(new THREE.Vector3(0,-2*this.vel.y, 0));
        }
    }

    lessThan(other){
        if (Math.abs(this.pos.x)+ Math.abs(this.pos.y) >= Math.abs(other.pos.x)+ Math.abs(other.pos.y)){
            return false;
        }else{
            return true;
        }

    }

    run(){
        this.vel.add(this.acc);
        this.vel.clampLength(0,Star.maxspeed);
        this.boundaryCheck();
		this.pos.add(this.vel);
        this.acc.multiplyScalar(0);
    }

	applyforce(force){
		this.acc.add(force);
	}
	update(){
        this.updatePosInTrail();
        this.updateColorPointer();
        this.run();
        this.decay();
	}
}


