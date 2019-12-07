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

    // toggle layer
    // using buttons
	$('#dugy-particle-category').click( function() {
        selectedCategory = parseInt(document.querySelector('input[name="dugy-category-options"]:checked').value);
        updateSelection();
    });
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
    var sliderLength = 600;
    var maxLonelyTime = 540;
    var cubeDepth = -25;
    var cubeArray = [];
    var dragMinLife = 0;
    var dragMaxLife = maxLonelyTime;
    var dragTexts = [];

    function initLegend(){
        legendStar = [];
        legendScene = new THREE.Scene();
        var starTrail = new StarTrail(-10000,0,0,maxLonelyTime,maxLonelyTime,5,'All-Lonely');
        starTrail.starField.material.size = 10;
        starTrail.starField.material.needsUpdate = true;
        starTrail.star.setStats(new THREE.Vector3(-sliderLength,0,cubeDepth), new THREE.Vector3(0.0,-0.2,0), new THREE.Vector3(0,0,0))
        legendScene.add(starTrail.starField);
        legendStarObj.push(starTrail.starField);
        legendStar.push(starTrail);
        initDrag();
    }

    function legendUpdate(){
        for (var i = 0; i< legendStar.length; i++){
            //use array so that when its empty(not loaded), this won't excute
            if (legendStar[i].star.remain > 0 && legendStar[i].star.pos.x < sliderLength){
                legendStar[i].advancedUpdate(1.2, 4, 0.4, new THREE.Vector3(sliderLength,0,cubeDepth));
            }
        }
    }

    function moveDrag(_minLife,_maxLife){
        var left = ( cubeArray[0].position.x <= cubeArray[1].position.x)? 0:1;
        var cubeleft = cubeArray[left];
        var cuberight = cubeArray[1-left];

        var x1 = THREE.Math.lerp(-sliderLength, sliderLength, _minLife * 1.0 / maxLonelyTime)
        var x2 = THREE.Math.lerp(-sliderLength, sliderLength, _maxLife * 1.0 / maxLonelyTime)

        cubeleft.position.set(x1,0,cubeDepth);
        cuberight.position.set(x2,0,cubeDepth);

    }


    // Drag ------------------------------------------------------------------------------------

    function initDrag(){
        cubeArray = [];
        dragTexts = [];
        var geometry = new THREE.BoxGeometry( 10, 60, 0.1 );
        var material = new THREE.MeshBasicMaterial( {color: 0xff6666} );
        var cubeleft = new THREE.Mesh(geometry, material );
        var cuberight = new THREE.Mesh(geometry, material);
        cubeleft.position.set(-sliderLength,0, cubeDepth);
        cuberight.position.set(sliderLength,0,cubeDepth)
        legendScene.add(cubeleft );
        legendScene.add(cuberight);
        cubeArray.push(cubeleft);
        cubeArray.push(cuberight);

        var star = new Star(0,0,0,10); // a temporary star   
        var starlabel = new StarText(star,textFont,5,'Try Drag!', 0,5,'All-Lonely',new THREE.Vector3(0,10,0))
        starlabel.setOpacity(0);
        legendScene.add(starlabel.starText);
        dragTexts.push(starlabel);
        var starlabel2 = new StarText(star,textFont,5,'Dragging', 0,5,'All-Lonely',new THREE.Vector3(0,10,0))
        starlabel2.setOpacity(0);
        legendScene.add(starlabel2.starText);
        dragTexts.push(starlabel2);

        dragControls = new DragControls( cubeArray, legendCamera, legendCanvas );
         // add event listener to highlight dragged objects
         dragControls.addEventListener( 'dragstart', function ( event ) {
            event.object.material.color.set( 0xffffff );
            dragTexts[0].fadeOut();  // Try Drag
            dragTexts[1].fadeIn();  // Dragging
        } );
        dragControls.addEventListener( 'dragend', function ( event ) {
            dragTexts[0].fadeOut();  // Try Drag
            dragTexts[1].fadeOut();  // Dragging

            event.object.material.color.set( 0xff6666 );
            if(event.object.position.x > sliderLength){
                event.object.position.x = sliderLength;
            }
            if(event.object.position.y > 0){
                event.object.position.y = 0;
            }
            if(event.object.position.x <- sliderLength){
                event.object.position.x = -sliderLength;
            }
            if(event.object.position.y < 0){
                event.object.position.y = 0;
            }
        });
            // using drag
        dragControls.addEventListener( 'drag', function ( event ) {
            dragTexts[0].fadeOut();  // Try Drag
            dragTexts[1].fadeIn();  // Dragging

            

            var left = (cubeArray[0].position.x <= cubeArray[1].position.x)? 0:1;
            var cubeleft = cubeArray[left];
            var cuberight = cubeArray[1-left];

            dragMinLife = Math.floor((cubeleft.position.x + sliderLength)/ (2 * sliderLength) * maxLonelyTime);
            dragMaxLife = Math.ceil((cuberight.position.x + sliderLength)/ (2 * sliderLength) * maxLonelyTime);

            updateSelectionDragging();
        })
        dragControls.addEventListener( 'hoveron', function ( event ) {
            dragTexts[0].fadeIn();  // Try Drag
            dragTexts[1].fadeOut();  // Dragging
        })
        dragControls.addEventListener( 'hoveroff', function ( event ) {
            dragTexts[0].fadeOut();  // Try Drag
            dragTexts[1].fadeOut();  // Dragging
        })
    
    }
   
   
    function updateSelectionDragging(){
        for (var i = 0; i< stars.length; i++){
            if ((selectedCountry == 'All-Lonely' || stars[i].category == selectedCountry ) 
            && stars[i].star.lifetime >= dragMinLife 
            && stars[i].star.lifetime <= dragMaxLife){
                stars[i].fadeIn();
            }else{
                stars[i].fadeOut();
            }
        }
        Object.keys(labelDict).forEach((k) => {
            var v = labelDict[k];
            starLabels[v].fadeOut();
        });
    }


    // particle vis
    var categories = [];
    var countries = [];
    var howLongLonely = [];
    var lonelyTime = [1,24,48,96,240,480,maxLonelyTime];
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
        initLegend();
        updateSelection();
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
        var minLife = 1000;
        var maxLife = 0;
        if (selectedCategory == totalindex){
            // store 7 different stars for different categories
            candidateStars = [...Array(totalindex).keys()].map(x => null);
            for (var i = 0; i< stars.length; i++){
                if (selectedCountry == 'All-Lonely' || stars[i].country == selectedCountry){
                    stars[i].fadeIn();
                    if (stars[i].star.lifetime < minLife){
                        minLife = stars[i].star.lifetime
                    }else if(stars[i].star.lifetime > maxLife){
                        maxLife = stars[i].star.lifetime
                    }
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
                    if (stars[i].star.lifetime < minLife){
                        minLife = stars[i].star.lifetime
                    }else if(stars[i].star.lifetime > maxLife){
                        maxLife = stars[i].star.lifetime
                    }
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
        dragMinLife = minLife;
        dragMaxLife = maxLife;
        moveDrag(dragMinLife,dragMaxLife);
    }


    function starFieldUpdate(){
        for (var i = 0 ; i < stars.length; i++){
                stars[i].update();
        }
        for (var i= 0; i < starLabels.length; i++){
            starLabels[i].update();
        }
        for (var i= 0; i < dragTexts.length; i++){
            dragTexts[i].opacityChange();
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