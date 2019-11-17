function particlevisMain(){

	// get canvas element and set canvas/render size
	var canvas = document.querySelector('#dugy-c');
	var renderer = new THREE.WebGLRenderer({canvas:canvas, alpha: true, antialias:true,preserveDrawingBuffer: true});
	renderer.autoClearColor = false;
	renderer.setSize($('#dugy-c').parent().width(), $('#dugy-c').parent().height(), false);
	var clearFlagColor = new THREE.Color( 0x161c26);
	
	renderer.setClearColor(clearFlagColor,0);
	// set camera
	var camera = new THREE.OrthographicCamera(-1000,1000, 2000, -2000, 1,1000 );  //fov, aspect, near, far
	camera.position.set(0,0,10);
	camera.lookAt( 0, 0, 0 );
	// scene
	var scene = new THREE.Scene();
	
	
	
	// Geometries
	
	// ** Draw Cuve **
	//  var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	//  var material = new THREE.MeshBasicMaterial( { color: 0xff6666 } );
	//  var cube = new THREE.Mesh( geometry, material );
	//  scene.add( cube );
	
	
	// ** Draw Line **
	
	//create a blue LineBasicMaterial
	// var mat_line = new THREE.LineBasicMaterial( { color: 0x0000ff } );
	
	// var geo_line = new THREE.Geometry();
	// geo_line.vertices.push(new THREE.Vector3( -10, 0, 0) );
	// geo_line.vertices.push(new THREE.Vector3( 0, 10, 0) );
	// geo_line.vertices.push(new THREE.Vector3( 10, 0, 0) );
	
	// var obj_line = new THREE.Line( geo_line, mat_line );
	// scene.add( obj_line );
	
	
	// Draw Particles
	var numStars = 1000;
	var starsGeometry = new THREE.Geometry();
	var starsBufferGeometry = new THREE.BufferGeometry();
	
	// attribute buffers
	var starsPositionBuffer = new Float32Array( numStars * 3 );
	var starsScaleBuffer = new Float32Array( numStars );
	
	for ( var i = 0; i < numStars; i ++ ) {
	
		var star = new THREE.Vector3();
		star.x = THREE.Math.randFloatSpread( 2000);
		star.y = THREE.Math.randFloatSpread( 2000);
		star.z = -500;
		starsGeometry.vertices.push( star );
	
		starsPositionBuffer[i*3] = star.x;
		starsPositionBuffer[i*3 + 1] = star.y;
		starsPositionBuffer[i*3 + 2] = star.z;
		starsScaleBuffer[i] = 1;
	}
	starsBufferGeometry.setAttribute( 'position', new THREE.BufferAttribute( starsPositionBuffer, 3 ) );
	starsBufferGeometry.setAttribute( 'scale', new THREE.BufferAttribute( starsScaleBuffer, 1 ) );
	
	
	var starsTexture = new THREE.TextureLoader().load( "textures/TEX_Glow.png" );
	var starsMaterial = new THREE.PointsMaterial( 
		{ color: 0xff6666, map:starsTexture, blending: THREE.AdditiveBlending, size:1} );
	
	// using Geometry as particle system
	//var starField = new THREE.Points( starsGeometry, starsMaterial );
	
	// using Buffer Geometry as particle system
	var starField = new THREE.Points( starsBufferGeometry, starsMaterial );
	
	
	scene.add( starField );
	
	
	function starFieldUpdate(){
		var positions = starField.geometry.attributes.position.array;
		var scales = starField.geometry.attributes.scale.array;
	
		for (var i = 0; i<numStars; i++){
			positions[i*3] = positions[i*3] + 0.5; 
		}
	
		starField.geometry.attributes.position.needsUpdate = true;
	
	}
	
	
	var animate = function (time) {
		time *= 0.001;  // convert milliseconds to seconds
		requestAnimationFrame( animate );
		
		starFieldUpdate()
		renderer.render( scene, camera );
	}
	animate();
	
	}
	
	particlevisMain();