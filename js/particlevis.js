function particlevisMain(){

	// get canvas element and set canvas/render size
	var canvas = document.querySelector('#dugy-c');

	var renderer = new THREE.WebGLRenderer({canvas:canvas, alpha: true, antialias:true,preserveDrawingBuffer: false});
	//renderer.autoClearColor = false;   // do not clear buffer for rendering particle trails
	

	// calculate canvas width and heigh using picelRatio to 
	const pixelRatio = window.devicePixelRatio;
	var canvas_width = $('#dugy-c').parent().width();
	var canvas_height =  canvas_width / 2;
	canvas_width = canvas_width * pixelRatio | 0;
	canvas_height =  canvas_height * pixelRatio | 0;

	renderer.setSize(canvas_width, canvas_height, false);	
	

	  

	//$('#dugy-particle-radio').change( function() {
		//console.log('change');
	 //});

	// set cameras
	// this camera faces the particles
	var camera = new THREE.PerspectiveCamera(135, 2, 0.1, 1000 );//fov, aspect, near, far
	camera.aspect = canvas_width/ canvas_height;
	camera.position.set(0,0,10);
	camera.lookAt( 0, 0, -1 );
	
	// this camera faces the screen (mesh plane)
	var monitor = new THREE.OrthographicCamera(-1000,1000,500, -500, 1, 1000) //width / - 2, width / 2, height / 2, height / - 2,  near, far
	monitor.position.set(0,0,2);
	monitor.lookAt( 0, 0, -10);
	monitor.aspect = canvas_width/ canvas_height;

	// set scenes
	// renderTarget cannot be used in the same scene
	var scene = new THREE.Scene();
	var scene2 = new THREE.Scene();

	// colors
	var startColor = new THREE.Color(0xff6666);
	var destColor = new THREE.Color(0x161c26);

	// continue to test on render target and buffers
	// a render target of the same width and height with canvas, holds the scene as a texture
	var screenTarget = new THREE.WebGLRenderTarget(canvas_width, canvas_height);
	var screenGeometry = new THREE.PlaneBufferGeometry(2000, 1000);   // width : Float, height : Float, widthSegments : Integer, heightSegments : Integer
	// textures that hold past and current state
	var texsize = canvas_width * canvas_height

	var past_texdata =  new Uint8Array( 4 * texsize);
	var current_texdata = new Uint8Array( 4 * texsize);
	var current_texture = new THREE.DataTexture( current_texdata, canvas_width, canvas_height, THREE.RGBAFormat );
	var future_texdata =  new Uint8Array( 4 * texsize);

    var screenMaterial = new THREE.MeshBasicMaterial({map:current_texture});

	var screen = new THREE.Mesh(screenGeometry, screenMaterial);
	scene2.add(screen);

	document.addEventListener('aos:in', e => {
		if(e.detail.id == 'dugy-radial-fadein'){
			renderer.clear();
			past_texdata = new Uint8Array( 4 * texsize);
			
		}
	  });
	// Draw Particles
	var numStars = 200;
	var starsBufferGeometry = new THREE.BufferGeometry();
	
	// attribute buffers
	var starsPositionBuffer = new Float32Array( numStars * 3 );
	var starsColorBuffer = new Float32Array( numStars * 3 );
	var starsScaleBuffer = new Float32Array( numStars );
	// star class objs
	var starsObjects = new Array(numStars);
	// star
	var starField;

	function starBufferInit(){
		for ( var i = 0; i < numStars; i ++ ) {
			// positions
			var star = new THREE.Vector3();
			star.x = THREE.Math.randFloatSpread( 2000);
			star.y = THREE.Math.randFloatSpread( 1000);
			star.z = -200;
		
			starsPositionBuffer[i*3] = star.x;
			starsPositionBuffer[i*3 + 1] = star.y;
			starsPositionBuffer[i*3 + 2] = star.z;
			starsScaleBuffer[i] = 5;
			
			var life = THREE.Math.randInt(36,720);
			starsObjects[i] = new Star(star.x,star.y,star.z,life);
		
			starsColorBuffer[i*3] = startColor.r;
			starsColorBuffer[i*3+1] = startColor.g;
			starsColorBuffer[i*3+2] = startColor.b;
		}

		starsBufferGeometry.setAttribute( 'position', new THREE.BufferAttribute( starsPositionBuffer, 3 ) );
		starsBufferGeometry.setAttribute( 'size', new THREE.BufferAttribute( starsScaleBuffer, 1 ) );
		starsBufferGeometry.setAttribute( 'color', new THREE.BufferAttribute( starsColorBuffer, 3) );
	}
	
	starBufferInit();

	function starFieldInit(){
		var starsTexture = new THREE.TextureLoader().load( "textures/TEX_Glow.png" );
		var starsMaterial = new THREE.PointsMaterial( 
			{ vertexColors: THREE.VertexColors , map:starsTexture, blending: THREE.NormalBlending, depthTest: false,size:3} );
		// using Buffer Geometry as particle system
		var field = new THREE.Points( starsBufferGeometry, starsMaterial );
		return field
	}
	
	starField = starFieldInit()
	scene.add(starField);

	
	
	
	function starFieldUpdate(_field, _destColor){
		var positions = _field.geometry.attributes.position.array;
		var colors = _field.geometry.attributes.color.array;
		var scales = _field.geometry.attributes.size.array;
	
		for (var i = 0; i<numStars; i++){
			if(starsObjects[i].remain >= 1){
	
				starsObjects[i].wander();
				starsObjects[i].update();
			}
			else{
					

			var star = new THREE.Vector3();
			star.x = THREE.Math.randFloatSpread( 2000);
			star.y = THREE.Math.randFloatSpread(1000);
			star.z = -200;
			starsObjects[i].reset(star.x, star.y, star.z,starsObjects[i].lifetime);
			starsObjects[i].wander();
			starsObjects[i].update();
			}
			positions[i*3] = starsObjects[i].pos.x; 
			positions[i*3+1] = starsObjects[i].pos.y; 
			positions[i*3+2] = starsObjects[i].pos.z; 
			
			var color = startColor.clone();
			color.lerp(_destColor, 2 * Math.abs( starsObjects[i].alpha - 0.5));
			colors[i*3] = color.r;
			colors[i*3+1] = color.g;
			colors[i*3+2] = color.b;
	
			scales[i] =  100;
		}
		_field.geometry.attributes.position.needsUpdate = true;
		_field.geometry.attributes.color.needsUpdate = true;
		_field.geometry.attributes.size.needsUpdate = true;
	}

	function starFieldReset(_field, _destColor){

		var positions = _field.geometry.attributes.position.array;
		var colors = _field.geometry.attributes.color.array;
		var scales = _field.geometry.attributes.size.array;

			
		for (var i = 0; i<numStars; i++){

			var star = new THREE.Vector3();
			star.x = THREE.Math.randFloatSpread( 2000);
			star.y = THREE.Math.randFloatSpread(1000);
			star.z = -200;
			var life = THREE.Math.randInt(36,720);

			starsObjects[i].reset(star.x, star.y, star.z,life);

			positions[i*3] = starsObjects[i].pos.x; 
			positions[i*3+1] = starsObjects[i].pos.y; 
			positions[i*3+2] = starsObjects[i].pos.z; 
			
			var color = startColor.clone();
			color.lerp(_destColor, 2 * Math.abs( starsObjects[i].alpha - 0.5));
			colors[i*3] = color.r;
			colors[i*3+1] = color.g;
			colors[i*3+2] = color.b;
	
			scales[i] = 100;
		}
		_field.geometry.attributes.position.needsUpdate = true;
		_field.geometry.attributes.color.needsUpdate = true;
		_field.geometry.attributes.size.needsUpdate = true;

	}

	
	function resizeRendererToDisplaySize(renderer) {
		var pixelRatio = window.devicePixelRatio;
	
		var width = canvas.clientWidth * pixelRatio | 0;
		var height = canvas.clientHeight * pixelRatio | 0;
		var needResize = canvas.width !== width || canvas.height !== height;
		if (needResize) {
		  renderer.setSize(width, height, false);
		}
		return needResize;
	  }
	
	
	var updateScreenTexture = function(t){	
		for (var i = 0; i < current_texdata.length; i = i+4){
			
			var srcAlpha =  future_texdata[i+3]  / 255

			
			current_texdata[i] = Math.min(255, Math.floor( future_texdata[i] * srcAlpha +  past_texdata[i]));
			current_texdata[i+1] =Math.min(255, Math.floor( future_texdata[i+1] * srcAlpha +   past_texdata[i+1]));
			current_texdata[i+2] = Math.min(255,Math.floor( future_texdata[i+2] * srcAlpha  +  past_texdata[i+2]));
			//current_texdata[i+3] = Math.min(255,Math.floor( future_texdata[i+3] + (1 - srcAlpha) * past_texdata[i+3]));
			current_texdata[i+3] = Math.min(255, Math.floor(past_texdata[i+3] * (1-srcAlpha) + future_texdata[i+3])* srcAlpha);

		
			// pass current data to past data
			past_texdata[i] = current_texdata[i];
			past_texdata[i+1] = current_texdata[i+1];
			past_texdata[i+2] = current_texdata[i+2];
			past_texdata[i+3] = current_texdata[i+3];
		}

		current_texture = new THREE.DataTexture( current_texdata, canvas_width, canvas_height, THREE.RGBAFormat );

	}

	printed = 0
	var animate = function (time) {
		time *= 0.001;  // convert milliseconds to seconds
		
		//if (resizeRendererToDisplaySize(renderer)) {
			//camera.aspect = canvas.clientWidth / canvas.clientHeight;
			//camera.updateProjectionMatrix();

			//starFieldReset(starField, destColor);

		//}
		requestAnimationFrame( animate );

		starFieldUpdate(starField, destColor);

		renderer.setRenderTarget(screenTarget);
		renderer.render(scene, camera );
		renderer.readRenderTargetPixels( screenTarget, 0, 0, canvas_width, canvas_height, future_texdata);
		updateScreenTexture(0.99);
		screen.material.map.needsUpdate = true;
		renderer.setRenderTarget(null);
		renderer.render(scene2, monitor);
	}



	animate();
	}


particlevisMain();
