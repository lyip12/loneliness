function particlevisMain(){

	// get canvas element and set canvas/render size
	var parentContainer = d3.select('#dugy-canvas-container');
	var canvas = document.querySelector('#dugy-c');
	var renderer = new THREE.WebGLRenderer({canvas:canvas, alpha: true, antialias:true,preserveDrawingBuffer: true});
	renderer.autoClearColor = false;   // do not clear buffer for rendering particle trails
	renderer.setSize($('#dugy-c').parent().width(), $('#dugy-c').parent().width()/2, false);
	//var clearFlagColor = new THREE.Color( 0x161c26);
	
	// set camera
	//var camera = new THREE.OrthographicCamera(-1000,1000, 1000, -1000, 1,1000 );  
	var camera = new THREE.PerspectiveCamera(135, 2, 0.1, 1000 );//fov, aspect, near, far
	camera.position.set(0,0,100);
	camera.lookAt( 0, 0, 0 );
	// scene
	var scene = new THREE.Scene();
	
	// colors
	var startColor = new THREE.Color(0xff6666);
	var destColor = new THREE.Color(0x161c26);
	
	
	
	// Draw Particles
	var numStars = 100;
	var starsBufferGeometry = new THREE.BufferGeometry();
	
	// attribute buffers
	var starsPositionBuffer = new Float32Array( numStars * 3 );
	var starsColorBuffer = new Float32Array( numStars * 3 );
	var starsScaleBuffer = new Float32Array( numStars );
	var starsObjects = new Array(numStars);
	
	//var originScale = 1;
	for ( var i = 0; i < numStars; i ++ ) {
		// positions
		var star = new THREE.Vector3();
		star.x = THREE.Math.randFloatSpread( 2000);
		star.y = THREE.Math.randFloatSpread( 2000);
		star.z = -100;
	
		starsPositionBuffer[i*3] = star.x;
		starsPositionBuffer[i*3 + 1] = star.y;
		starsPositionBuffer[i*3 + 2] = star.z;
		starsScaleBuffer[i] = 1;
		
		var life = THREE.Math.randInt(36,720);
		starsObjects[i] = new Star(star.x,star.y,star.z,life);
	
		
		starsColorBuffer[i*3] = startColor.r;
		starsColorBuffer[i*3+1] = startColor.g;
		starsColorBuffer[i*3+2] = startColor.b;
	
	}
	starsBufferGeometry.setAttribute( 'position', new THREE.BufferAttribute( starsPositionBuffer, 3 ) );
	starsBufferGeometry.setAttribute( 'size', new THREE.BufferAttribute( starsScaleBuffer, 1 ) );
	starsBufferGeometry.setAttribute( 'color', new THREE.BufferAttribute( starsColorBuffer, 3) );
	
	
	var starsTexture = new THREE.TextureLoader().load( "textures/TEX_Glow.png" );
	var starsMaterial = new THREE.PointsMaterial( 
		{ vertexColors: THREE.VertexColors , map:starsTexture, blending: THREE.AdditiveBlending, depthTest: true,size:3} );
	
	
	// using Buffer Geometry as particle system
	var starField = new THREE.Points( starsBufferGeometry, starsMaterial );
	
	
	scene.add( starField );
	
	
	function starFieldUpdate(){
		var positions = starField.geometry.attributes.position.array;
		var colors = starField.geometry.attributes.color.array;
		var scales = starField.geometry.attributes.size.array;
	
		for (var i = 0; i<numStars; i++){
			if(starsObjects[i].remain >= 1){
	
				starsObjects[i].wander();
				starsObjects[i].update();
			}
			positions[i*3] = starsObjects[i].pos.x; 
			positions[i*3+1] = starsObjects[i].pos.y; 
			positions[i*3+2] = starsObjects[i].pos.z; 
			
			var color = startColor.clone();
			color.lerp(destColor, 2 * Math.abs( starsObjects[i].alpha - 0.5));
			colors[i*3] = color.r;
			colors[i*3+1] = color.g;
			colors[i*3+2] = color.b;
	
			scales[i] =  2 * Math.abs(0.5 - starsObjects[i].alpha);
		}
		starField.geometry.attributes.position.needsUpdate = true;
		starField.geometry.attributes.color.needsUpdate = true;
		starField.geometry.attributes.size.needsUpdate = true;
	
	
	}
	
	function resizeRendererToDisplaySize(renderer) {
		const pixelRatio = window.devicePixelRatio;
	
		const width = canvas.clientWidth * pixelRatio | 0;
		const height = canvas.clientHeight * pixelRatio | 0;
		const needResize = canvas.width !== width || canvas.height !== height;
		if (needResize) {
		  renderer.setSize(width, height, false);
		}
		return needResize;
	  }
	
	var animate = function (time) {
		time *= 0.001;  // convert milliseconds to seconds
		
		if (resizeRendererToDisplaySize(renderer)) {
			//camera.aspect = canvas.clientWidth / canvas.clientHeight;
			//camera.updateProjectionMatrix();
		}
		requestAnimationFrame( animate );
		
		starFieldUpdate()
		renderer.render( scene, camera );
	}
	animate();
	
	}
	
	particlevisMain();