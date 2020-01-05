// StarTrail Class
class StarTrail{
    constructor(_x, _y, _z, _minLife, _maxLife, _category=5, _country='US-Lonely', _alternativeColors=null){
        this.numStars = 2 * THREE.Math.randInt(_minLife, _maxLife);
        this.star = new Star(_x,_y,_z,this.numStars / 2, _alternativeColors);
        this.starsPositionBuffer = new Float32Array( this.numStars * 3 );
        this.starsColorBuffer = new Float32Array( this.numStars * 3 );
        this.category = _category;
        this.country = _country;
        this.alternativeColors = _alternativeColors;

        this.useAlternativeColors = false;
        this.starTexture = new THREE.TextureLoader().load( "textures/TEX_Glow.png" );
        this.starMaterial = new THREE.PointsMaterial( 
            {  
              vertexColors: THREE.VertexColors, 
              map:this.starTexture, 
              depthTest: false, 
              size:5,
              blending:THREE.AdditiveBlending,
              depthWrite : false,
              transparent:true,
              opacity:1.0
            } );
        this.starsBufferGeometry = new THREE.BufferGeometry();
        this.starField = null;
        //fading
        this.fadingStage = 0;   // -1 fading out, 0 do not change, 1 fading in
        this.initialization();
    }
    static get startColor() {
        return new THREE.Color(0xff6666);
    }

    static get destColor(){
        return new THREE.Color(0x161c26);
    }

    static get fadingFactor(){
        return 0.1;
    }

    static get minOpacity(){
        return 0.1;
    }
    /* initialize */

    initialization(){
        this.starGeometryInit();
        this.starFieldInit();
    }
    starGeometryInit(){
		for ( var i = 0; i < this.numStars; i ++ ) {
  
			this.starsPositionBuffer[i*3] = this.star.trail[i].x;
			this.starsPositionBuffer[i*3 + 1] = this.star.trail[i].y;
			this.starsPositionBuffer[i*3 + 2] = this.star.trail[i].z;
            this.starsColorBuffer[i*3] = StarTrail.startColor.r;
			this.starsColorBuffer[i*3+1] = StarTrail.startColor.g;
			this.starsColorBuffer[i*3+2] = StarTrail.startColor.b;
		}
		this.starsBufferGeometry.setAttribute( 'position', new THREE.BufferAttribute( this.starsPositionBuffer, 3 ) );
		this.starsBufferGeometry.setAttribute( 'color', new THREE.BufferAttribute( this.starsColorBuffer, 3) );
	}

    starFieldInit(){
		this.starField = new THREE.Points( this.starsBufferGeometry, this.starMaterial);
    }
    
    changeColor(_bool){
        this.useAlternativeColors = _bool;
    }

	fadeOut(){
        this.fadingStage = -1;
    }

    fadeIn(){
        this.fadingStage = 1;
    }

    opacityChange(){
        switch(this.fadingStage){
            case -1:
                if (this.starField.material.opacity > StarTrail.minOpacity){
                    this.starField.material.opacity = THREE.Math.lerp(this.starField.material.opacity, StarTrail.minOpacity, StarTrail.fadingFactor);
                    this.starField.material.needsUpdate = true;}
                else{
                    this.fadingStage = 0;
                }
                break;
            case 1:
                if (this.starField.material.opacity < 1){
                    this.starField.material.opacity = THREE.Math.lerp(this.starField.material.opacity,1, StarTrail.fadingFactor * 0.5);
                    this.starField.material.needsUpdate = true;}
                else{
                    this.fadingStage = 0;
                }
                break;
            default:
                break;      
        }
    }

    /* Update */
    update(_color = null){
        this.star.wander();
        this.star.update();
        this.opacityChange();
        if (_color){
            this.starFieldUpdate(_color);
        }else{        
            this.starFieldUpdate();
        }
    }

    advancedUpdate(_wanderR,_wanderD,_change, _target,_color=null){
        this.star.wander(_wanderR,_wanderD,_change);
        this.star.seek(_target);
        this.star.update();
        this.opacityChange();
        if (_color){
            this.starFieldUpdate(_color);
        }else{        
            this.starFieldUpdate();
        }
    }

    starFieldUpdate(selectColor = null){
		var positions = this.starField.geometry.attributes.position.array;
		var colors = this.starField.geometry.attributes.color.array;
		//var scales = this.starField.geometry.attributes.size.array;
	
		for (var i = 0; i<this.numStars; i++){
           
            //scales[i] = 1;

			positions [i*3] = this.star.trail[i].x;
			positions [i*3 + 1] = this.star.trail[i].y;
			positions [i*3 + 2] = this.star.trail[i].z;
            
            var color;
            if (selectColor){
                color = selectColor;
            }
            else{
                var sequenceInTrail = (i <= this.star.pointer) ? this.star.pointer - i : this.star.pointer + this.star.alllife - i;
                var sequenceInTrailColor  =  Math.max(this.star.colorPointer - sequenceInTrail , 0)
                if (this.useAlternativeColors == true){
                    color = this.star.trailColor2[sequenceInTrailColor];
                }else{
                    color = this.star.trailColor[sequenceInTrailColor];
                }
            }
           
            if (i  == this.star.pointer || (this.star.pointer == this.numStars - 1 && i == 0)|| (i == this.star.pointer + 1 && i < this.numStars)){
                color = new THREE.Color(0xffffff);;
            }           
			colors[i*3] = color.r;
			colors[i*3+1] = color.g;
            colors[i*3+2] = color.b;
		}
		this.starField.geometry.attributes.position.needsUpdate = true;
		this.starField.geometry.attributes.color.needsUpdate = true;
	}

}