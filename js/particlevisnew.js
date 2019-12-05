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
    
    // layer control
    for (var i = 0; i < 8; i++){
        camera.layers.enable( i ); 
    }

    // toggle layer
	$('#dugy-particle-radio').change( function() {
        var selected = parseInt(document.querySelector('input[name="dugy-radio-options"]:checked').value);
        if(selected !=0){
            for (var i = 0; i< stars.length; i++){
                if ( stars[i].category != selected)
                {stars[i].fadeOut();}
            }
        }
        else{
            for (var i = 0; i< stars.length; i++){
                stars[i].fadeIn();
            }
        }

        /* if(selected != 0){
            camera.layers.disableAll();
            camera.layers.enable(selected);
        }
        else{
            camera.layers.enableAll(); 
        } */
    });
    

    var numStars = 100;
    var stars = [];
    var categories = [];
    var countries = [];
    var howLongLonely = [];
    var howLongLonelyDisplay = [];

    queue()
    .defer(d3.csv, "data/HowLongLonely.csv")
    .await(createParticleVis);

    function createParticleVis(error, howLongLonelyData){

        console.log(howLongLonelyData);
        countries = howLongLonelyData.columns.slice(1,);
        howLongLonely = howLongLonelyData.slice();
        howLongLonely.forEach(e => {categories.push(e.Category)});
        console.log(categories);
        
        
    }



    for (var i= 0; i < numStars; i++){
        var x = THREE.Math.randFloatSpread( 2000);
        var y = THREE.Math.randFloatSpread( 1000);
        var z = - i * 0.01 - 100;

        var starTrail = new StarTrail(x,y,z,36,720,i%2);

        particleScene.add(starTrail.starField);
        stars.push(starTrail);
    }
    function starFieldUpdate(){
        for (var i = 0; i< stars.length; i++){
            stars[i].update();
        }
    }

    printed = 20;
    loop = 1;
	var animate = function (time) {
		time *= 0.001;  // convert milliseconds to seconds
		requestAnimationFrame( animate );
		starFieldUpdate();
        renderer.render( particleScene, camera );
 /*        printed -=1;
        if (printed < 0 && loop > 0){
            console.log(stars[5]);
            printed = 20;
            loop -=1;
        }  */
	}
	animate();
	
	


}