particlevisNew();

function particlevisNew(){

    var canvas = document.querySelector('#dugy-c');
    var renderer = new THREE.WebGLRenderer({canvas:canvas, alpha: true, antialias:true,preserveDrawingBuffer: false});
    renderer.autoClearColor = true;
    
    const pixelRatio = window.devicePixelRatio;
	var canvas_width = $('#dugy-c').parent().width();
	var canvas_height =  canvas_width / 2;
	canvas_width = canvas_width * pixelRatio | 0;
	canvas_height =  canvas_height * pixelRatio | 0;

	renderer.setSize(canvas_width, canvas_height, false);

    document.addEventListener('aos:in', e => {
        if(e.detail.id == 'dugy-radial-fadein'){
            renderer.clear();
        }
    });

    // scene
    var particleScene = new THREE.Scene();

    // set camera
	var camera = new THREE.PerspectiveCamera(135, 2, 0.1, 1000 );//fov, aspect, near, far
	camera.position.set(0,0,100);
    camera.lookAt( 0, 0, 0 );
    
    var numStars = 50;
    var stars = [];

    for (var i= 0; i < numStars; i++){
        var x = THREE.Math.randFloatSpread( 2000);
        var y = THREE.Math.randFloatSpread( 1000);
        var z = - i * 0.01 - 100;
        var starTrail = new StarTrail(x,y,z,24,480 );
        particleScene.add(starTrail.starField);
        stars.push(starTrail);
    }
    function starFieldUpdate(){
        for (var i = 0; i< stars.length; i++){
            stars[i].update()
        }
    }

    printed = 20;
    loop = 5;
	var animate = function (time) {
		time *= 0.001;  // convert milliseconds to seconds
		requestAnimationFrame( animate );
		starFieldUpdate();
        renderer.render( particleScene, camera );
  /*       printed -=1;
        if (printed < 0 && loop > 0){
            console.log(stars[5]);
            printed = 20;
            loop -=1;
        } */
	}
	animate();
	
	


}