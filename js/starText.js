// StarText Class
class StarText{
    textColor = new THREE.Color(0xff6666);
    textFont = null;
    textOpacity = 0.5;
    textShapes = null;
    companionStar = null
    textString = "";
    textGeometry = null;
    pos = new THREE.Vector3(0,0,-110);

    starText = null;

    texMat = new THREE.MeshBasicMaterial( {
        color: this.textColor,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
    } );


    constructor(_companionStar,_textFont, _textSize, _textString, _z){
        this.companionStar = _companionStar;
        this.textFont = _textFont;
        this.textSize = _textSize;
        this.textString = _textString;
        this.pos.z = _z;
        this.initialization();
    }

    initialization(){
        this.initTextGeometry();
    }
    initTextGeometry(){
        this.textShapes = this.textFont.generateShapes( this.textString, this.textSize);
        this.textGeometry = new THREE.ShapeBufferGeometry( this.textShapes );
        this.textGeometry.computeBoundingBox();
        var xMid = - 0.5 * ( this.textGeometry.boundingBox.max.x - this.textGeometry.boundingBox.min.x);
        this.textGeometry.center();
        this.starText = new THREE.Mesh( this.textGeometry,this.texMat );
        this.starText.position.z = this.pos.z;
       
    }

    update(){
        //this.starText.position.add(this.companionStar.vel);
        this.starText.position.x = this.companionStar.pos.x;
        this.starText.position.y = this.companionStar.pos.y;
    }

}