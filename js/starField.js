// StarTrail Class
class StarTrail{
    static startColor = new THREE.Color(0xff6666);
    static destColor = new THREE.Color(0x161c26);
    starTexture = new THREE.TextureLoader().load( "textures/TEX_Glow.png" );
    starMaterial = new THREE.PointsMaterial( 
        {  
          vertexColors: THREE.VertexColors, 
          map:this.starTexture, 
          depthTest: false, 
          size:5,
          blending:THREE.AdditiveBlending
          /* blending: THREE.CustomBlending,
          blendEquation: THREE.AddEquation,
          blendSrc:  THREE.SrcAlphaFactor,
          blendDst:  THREE.OneFactor, 
          blendSrcAlpha: THREE.SrcAlphaFactor,
          blendDstAlpha: THREE.OneMinusSrcAlphaFactor */
        } );

    star = null;

    starsBufferGeometry = new THREE.BufferGeometry();
    starsPositionBuffer = null;
    starsColorBuffer = null;
    starsScaleBuffer = null;
    
    numStars = 10;
    starField = null;

    constructor(_x, _y, _z, _minLife, _maxLife){
        this.numStars = 2 * THREE.Math.randInt(_minLife, _maxLife);
        this.star = new Star(_x,_y,_z,this.numStars / 2);
        this.starsPositionBuffer = new Float32Array( this.numStars * 3 );
        this.starsColorBuffer = new Float32Array( this.numStars * 3 );
        this.starsScaleBuffer = new Float32Array( this.numStars );
        this.initialization();
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
			this.starsScaleBuffer[i] = 1;
			this.starsColorBuffer[i*3] = StarTrail.startColor.r;
			this.starsColorBuffer[i*3+1] = StarTrail.startColor.g;
			this.starsColorBuffer[i*3+2] = StarTrail.startColor.b;
		}
		this.starsBufferGeometry.setAttribute( 'position', new THREE.BufferAttribute( this.starsPositionBuffer, 3 ) );
		this.starsBufferGeometry.setAttribute( 'size', new THREE.BufferAttribute( this.starsScaleBuffer, 1 ) );
		this.starsBufferGeometry.setAttribute( 'color', new THREE.BufferAttribute( this.starsColorBuffer, 3) );
	}

    starFieldInit(){
		this.starField = new THREE.Points( this.starsBufferGeometry, this.starMaterial);
	}

	
    /* Update */
    update(){
        this.star.wander();
        this.star.update();
        this.starFieldUpdate();
    }

    starFieldUpdate(selectColor = null){
		var positions = this.starField.geometry.attributes.position.array;
		var colors = this.starField.geometry.attributes.color.array;
		var scales = this.starField.geometry.attributes.size.array;
	
		for (var i = 0; i<this.numStars; i++){
           
            scales[i] = 1;

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
                color = this.star.trailColor[sequenceInTrailColor];
            }
           
			colors[i*3] = color.r;
			colors[i*3+1] = color.g;
            colors[i*3+2] = color.b;
		}
		this.starField.geometry.attributes.position.needsUpdate = true;
		this.starField.geometry.attributes.color.needsUpdate = true;
		this.starField.geometry.attributes.size.needsUpdate = true;
	}

}