particlevisNew();

function particlevisNew(){


    var canvas = document.querySelector('#dugy-c');
    var renderer = new THREE.WebGLRenderer({canvas:canvas, alpha: true, antialias:true,preserveDrawingBuffer: false});
    renderer.autoClearColor = true;
    
    //const pixelRatio = window.devicePixelRatio;
	var canvas_width = $('#dugy-c').parent().width();
    var canvas_height =  canvas_width / 2 | 0;
    renderer.setSize(canvas_width, canvas_height, false);
    renderer.setPixelRatio(window.devicePixelRatio);    
    var loaded = false;

    document.addEventListener('aos:in', e => {
        if(e.detail.id == 'dugy-radial-fadein' && loaded == true){
            resetStarFields();
        }
    });
     
    // scene
    var particleScene = new THREE.Scene();

    // set camera
	var camera = new THREE.PerspectiveCamera(135, 2, 0.1, 1000 );//fov, aspect, near, far
	camera.position.set(0,0,100);
    camera.lookAt( 0, 0, 0 );
    
    /*// layer control
    for (var i = 0; i < 8; i++){
        camera.layers.enable( i ); 
    } */

    // toggle layer
	$('#dugy-particle-category').change( function() {
        selectedCategory = parseInt(document.querySelector('input[name="dugy-category-options"]:checked').value);
        
        updateSelection();
    });
    $('#dugy-particle-country').change( function() {
        selectedCountry = document.querySelector('input[name="dugy-country-options"]:checked').value;
        updateSelection();
    });


    // Add Legend --------------------------------------------------------------------------------
    var legendCanvas = document.querySelector('#dugy-c-legend');
    var legendRenderer = new THREE.WebGLRenderer({canvas:legendCanvas, alpha: true, antialias:true,preserveDrawingBuffer: false});
    legendRenderer.autoClearColor = true;
    var legendWidth = $('#dugy-c-legend').parent().width();
    var legendHeight =  legendWidth / 10;  
    legendRenderer.setSize(legendWidth , legendHeight, false);
    legendRenderer.setPixelRatio(window.devicePixelRatio);
    // Legend Scene
    var legendScene = new THREE.Scene();
    // set legend camera
	var legendCamera = new THREE.PerspectiveCamera(135, 10, 0.1, 1000 );//fov, aspect, near, far
	legendCamera.position.set(0,0,10);
    legendCamera.lookAt( 0, 0, 0 );
    var legendStar = [];
    legendStarObj = [];
    var dragControls;
    var sliderLength = 650;

    function initLegend(){
        legendStar = [];
        legendScene = new THREE.Scene();
        var starTrail = new StarTrail(-10000,0,0,720,721,5,'All-Lonely');
        starTrail.starField.material.size = 10;
        starTrail.starField.material.needsUpdate = true;
        starTrail.star.setStats(new THREE.Vector3(-sliderLength,0,-25), new THREE.Vector3(0.0,-0.2,0), new THREE.Vector3(0,0,0))
        legendScene.add(starTrail.starField);
        legendStarObj.push(starTrail.starField);
        legendStar.push(starTrail);
        initDrag();
    }

    function legendUpdate(){
        for (var i = 0; i< legendStar.length; i++){
            //legendStar[i].update();
            if (legendStar[i].star.remain > 0 && legendStar[i].star.pos.x < 650){
                legendStar[i].advancedUpdate(1.2, 4, 0.4, new THREE.Vector3(650,0,-25));
            }
        }
    }


    // Drag ------------------------------------------------------------------------------------

    function initDrag(){
        var geometry = new THREE.BoxGeometry( 5, 50, 0.1 );
        var material = new THREE.MeshBasicMaterial( {color: 0xff6666} );
        var cube = new THREE.Mesh(geometry, material );
        var cube2 = new THREE.Mesh(geometry, material);
        cube.position.set(-sliderLength,0,-25);
        cube2.position.set(sliderLength,0,-25)
        legendScene.add(cube );
        legendScene.add(cube2);
        var cubeArray = [];
        cubeArray.push(cube);
        cubeArray.push(cube2);

        dragControls = new DragControls( cubeArray, legendCamera, legendCanvas );
        // add event listener to highlight dragged objects
        dragControls.addEventListener( 'dragstart', function ( event ) {
            event.object.material.color.set( 0xffffff );
        } );
        dragControls.addEventListener( 'dragend', function ( event ) {
            event.object.material.color.set( 0xff6666 );
            if(event.object.position.x > 650){
                event.object.position.x = 650;
            }
            if(event.object.position.y > 0){
                event.object.position.y = 0;
            }
            if(event.object.position.x <- 650){
                event.object.position.x = -650;
            }

            if(event.object.position.y < 0){
                event.object.position.y = 0;
            }
        });

    }
   
   



    // particle vis
    var categories = [];
    var countries = [];
    var howLongLonely = [];
    var lonelyTime = [1,24,48,96,240,480,600];
    var countryNames = {
        'US-Lonely':'United States',
        'UK-Lonely': 'United Kingdom',
        'Japan-Lonely': 'Japan',
        'All-Lonely':'United States, United Kingdom and Japan'
    }; 
    var selectedCountry = 'All-Lonely'; 
    var selectedCategory = 5;   // More Than 10 years
    var stars = [];
    var starLabels = [];
    var font = null;
    var textFont = null;
    var textSize = 20;
    var labelDict = {};

    queue()
    .defer(d3.csv, "data/HowLongLonely.csv")
    .defer(d3.json, "fonts/helvetiker_regular.typeface.json")
    .await(createParticleVis);

    function createParticleVis(error, howLongLonelyData, fontData){
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
        font = fontData;
        textFont = new THREE.Font(font);
        resetStarFields(); 
        loaded = true;      
    }


    function resetStarFields(){
        stars = [];   // clear objects 
        particleScene = new THREE.Scene();  // clear scene;
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
        initText();
        updateSelection();
        initLegend();
    }


    function initText(){
        starLabels = [];
        for(var i = 0; i< howLongLonely.length-1; i++){
            for(var k = 0; k < countries.length; k++){
                var message = generateMessage(i, countries[k]);       
                var star = new Star(10000,0,0,10); // a temporary star   
                var starlabel = new StarText(star,textFont,textSize,message, -150,i,countries[k])
                particleScene.add(starlabel.starText);
                starLabels.push(starlabel);
            }
        }
        generateLabelDict();
        
    }

    function generateLabelDict(){
        labelDict = {}
        for (var i=0; i < starLabels.length; i++){
            labelDict[starLabels[i].category.toString() + ' '+starLabels[i].country] = i;
        }
    }


    function generateMessage(_category, _country){
        var percentage = howLongLonely[_category][_country];
        if (_country == 'All-Lonely'){
            percentage = parseInt(percentage * 100 /  howLongLonely[categories.length-1][_country] );
        }
        var countryName = countryNames[_country];
        var message = null;
        if (_category != howLongLonely.length-2){
           message = 'In '+ countryName + ', \nabout' + ' ' + percentage.toString() + '% of people reporting loneliness/isolation say \nthey have been lonely for ' + howLongLonely[_category].Category + ' .'; 
        }else{
           message = 'In '+ countryName + ', \nabout' + ' ' + percentage.toString() + '% of people reporting loneliness/isolation \nare not sure/declined to answer how long they have been lonely.'; 
        }
        return message;
    }

    function updateSelection(){
        var candidateStars = [];
        var totalindex = howLongLonely.length - 1;
        if (selectedCategory == totalindex){
            // store 7 different stars for different categories
            candidateStars = [...Array(totalindex).keys()].map(x => null);
            for (var i = 0; i< stars.length; i++){
                if (selectedCountry == 'All-Lonely' || stars[i].country == selectedCountry){
                    stars[i].fadeIn();
                    var type = stars[i].category
                    // decide if replace the current candidates in list
                    if (candidateStars[type] == null){
                        candidateStars[type] = stars[i].star
                    }else{
                        if (stars[i].star.lessThan(candidateStars[type])){
                            candidateStars[type] = stars[i].star;
                        }
                    }
                    continue;
                }
                stars[i].fadeOut();
            }
            // fade out those not needed, fade in needed
            Object.keys(labelDict).forEach((k) => {
                var key = k.split(' ');
                var v = labelDict[k];
                if (key[1] == selectedCountry){
                    var category = parseInt(key[0])
                    starLabels[v].fadeIn();
                    starLabels[v].resetCompanionStar(candidateStars[category]);
                }else{
                    starLabels[v].fadeOut();
                }
            });
        }else{
            // only one candidate is needed
            candidateStars.push(null);

            for (var i = 0; i< stars.length; i++){
                
                if ((selectedCountry == 'All-Lonely' || stars[i].country == selectedCountry) && 
                selectedCategory == stars[i].category){
                    stars[i].fadeIn();
                    // compare with canditates
                    if (candidateStars[0] == null){
                        candidateStars[0] = stars[i].star
                    }else{
                        if (stars[i].star.lessThan(candidateStars[0])){
                            candidateStars[0] = stars[i].star;
                        }
                    }
                    continue;
                }
                stars[i].fadeOut();
            }

            // since only one starlabl is gonna shown, fade out all others and
            Object.keys(labelDict).forEach((k) => {
                var v = labelDict[k];
                starLabels[v].fadeOut();
            });
            // fadein only the needed one
            var v = labelDict[selectedCategory.toString() + ' ' + selectedCountry]
            starLabels[v].fadeIn();
            starLabels[v].resetCompanionStar(candidateStars[0]);

        }
    }


    function starFieldUpdate(){
        for (var i = 0 ; i < stars.length; i++){
                stars[i].update();
        }
        for (var i= 0; i < starLabels.length; i++){
            starLabels[i].update();
        }
    }

    printed = 20;
    loop = 1;

	var animate = function (time) {
		time *= 0.001;  // convert milliseconds to seconds
		requestAnimationFrame( animate );
		starFieldUpdate();
        renderer.render( particleScene, camera );
        legendUpdate();
        legendRenderer.render(legendScene,legendCamera);
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