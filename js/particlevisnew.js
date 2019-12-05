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
	$('#dugy-particle-category').change( function() {
        selectedCategory = parseInt(document.querySelector('input[name="dugy-category-options"]:checked').value);
        
        updateSelection();
    });
    $('#dugy-particle-country').change( function() {
        selectedCountry = document.querySelector('input[name="dugy-country-options"]:checked').value;
        updateSelection();
    });

    var stars = [];
    var categories = [];
    var countries = [];
    var howLongLonely = [];
    var lonelyTime = [1,24,48,96,240,480,600];
    var selectedCountry = 'Japan-Lonely'; 
    var selectedCategory = 7;   // ALL

    queue()
    .defer(d3.csv, "data/HowLongLonely.csv")
    .await(createParticleVis);

    function createParticleVis(error, howLongLonelyData){

        countries = howLongLonelyData.columns.slice(1,);
        howLongLonely = howLongLonelyData.slice();
        howLongLonely.forEach((d,i) => {
            categories.push(d.Category)
            for (const property in d){
                if (property != 'Category'){
                    d[property] = + d[property] 
                    if (Number.isNaN(d[property])){
                        d[property] = 0;  
                    }
                }
            }
        });
    

        for ( var i = 0; i < howLongLonely.length - 1; i++){
            for (var k = 0; k < countries.length - 1; k++){
                var country = countries[k];
                for (var j = 0; j < howLongLonely[i][country]; j++){
                    var x = THREE.Math.randFloatSpread( 2000);
                    var y = THREE.Math.randFloatSpread( 1000);
                    var z = - i * 0.01 - 100;
                    var starTrail = null;
                    if (i == howLongLonely.length - 2){// 'not sure' category
                        starTrail = new StarTrail(x,y,z,lonelyTime[0],lonelyTime[i],i,country);
                    }else{// other categories
                        starTrail = new StarTrail(x,y,z,lonelyTime[i],lonelyTime[i+1],i,country);
                    }
                    particleScene.add(starTrail.starField);
                    stars.push(starTrail);
                } 
            } 
        }

        updateSelection();
    }


    function updateSelection(){
        console.log(selectedCountry);
        console.log(selectedCategory);
        for (var i = 0; i< stars.length; i++){
            if (selectedCategory == 7 || stars[i].category == selectedCategory){
                if (selectedCountry == 'All-Lonely' || stars[i].country == selectedCountry){
                    stars[i].fadeIn();
                    continue;
                }
            }
            stars[i].fadeOut();
        }

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
        // Debugging
        /*  printed -=1;
        if (printed < 0 && loop > 0){
            console.log(stars[5]);
            printed = 20;
            loop -=1;
        }  */
	}
	animate();

}