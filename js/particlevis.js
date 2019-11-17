function particlevisMain(){

// get canvas element and set canvas/render size
var canvas = document.querySelector('#dugy-c');
var renderer = new THREE.WebGLRenderer({canvas:canvas, alpha: true});
renderer.setSize($('#dugy-c').parent().width(), $('#dugy-c').parent().width() / 3, false);
var clearFlagColor = new THREE.Color( 0x161c26);

renderer.setClearColor(clearFlagColor,0);
// set camera
var camera = new THREE.PerspectiveCamera( 105,2, 0.1, 1000 );  //fov, aspect, near, far
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

var starsGeometry = new THREE.Geometry();

for ( var i = 0; i < 1000; i ++ ) {

	var star = new THREE.Vector3();
	star.x = THREE.Math.randFloatSpread( 2000);
	star.y = THREE.Math.randFloatSpread( 2000);
	star.z = THREE.Math.randFloatSpread( 2000);

	starsGeometry.vertices.push( star );

}
var starsTexture = new THREE.TextureLoader().load( "textures/TEX_Glow.png" );
var starsMaterial = new THREE.PointsMaterial( 
    { color: 0xffffff, map:starsTexture, blending: THREE.AdditiveBlending, size:5} );

var starField = new THREE.Points( starsGeometry, starsMaterial );

scene.add( starField );



var animate = function (time) {
    time *= 0.001;  // convert milliseconds to seconds
    requestAnimationFrame( animate );
    starField.rotation.x = 0.1 * time;
    starField.rotation.y = 0.1 * time;
	renderer.render( scene, camera );
}
animate();
}

particlevisMain();