//var img;
//var roffset=0.1; var goffset=1;
//var timer; var xoff = 0; var yoff = 5;  var wavyx=300; var wavyy=300;  var timer = 0;
//
//function preload() {
//    img = loadImage('https://image.flaticon.com/icons/png/512/549/549582.png');
//}
//function setup() {
//    var myCanvas = createCanvas(windowWidth/2,900);
//    myCanvas.parent('p5Container');
//    //background("hsla(218, 27%, 12%, 0.5)"); 
//} 
//
//function windowResized(){
//    resizeCanvas(windowWidth/2,900);
//}
//
//function draw() {
//    var rc = noise(roffset);
//    roffset+=0.001;
//    var gc = noise(goffset);
//    goffset+=0.001;
//    noStroke();
//    fill(255);
//    ellipse(rc*500,gc*500,3);
//
//    fill(color("hsla(218, 27%, 12%, 0.1)"));
//    rect(0,0,width, height);
//
//}