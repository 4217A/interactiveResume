'use strict';

//globals
const html = document.querySelector('html');
//canvas
const myCanvas = document.getElementById('myCanvas');
const c = myCanvas.getContext('2d');
// myCanvas.width = html.clientWidth;
// myCanvas.height = html.clientHeight + 4;
// myCanvas.width = document.documentElement.clientWidth;
// myCanvas.height = document.documentElement.clientHeight;
myCanvas.width = html.clientWidth;
myCanvas.height = html.clientHeight;
console.log('width and height html.'); //RR
console.log(myCanvas.width); //RR
console.log(myCanvas.height); //RR
console.log('width and height document.documentElement'); //RR
console.log(document.documentElement.clientWidth); //RR
console.log(document.documentElement.clientHeight); //RR


// const myOldStarsFile = new Image();
// myOldStarsFile.src = "assets/img/stars old.png";


//Objects
class Game {
    constructor() {
        this.count = 0;
        this.done = 0;
    }

    draw() {
        this.count++;

        if (!myPlanets.done) {
            //update
            myBackground.update(this.count, myCanvas.width, myCanvas.height);
            myStars.update(this.count, myCanvas.width, myCanvas.height);
            myPlanets.update(this.count, myCanvas.width, myCanvas.height);
            mySpaceship.update(this.count, myCanvas.width, myCanvas.height);
            myControl.update(this.count, myCanvas.width, myCanvas.height);
            //draw
            c.clearRect(0, 0, myCanvas.width, myCanvas.height);
            myBackground.render();
            myStars.render();
            myPlanets.render();
            mySpaceship.render();
            myControl.render();    
        } else if (!this.done) {
            myfinalText.update(this.count, myCanvas.width, myCanvas.height);

            c.clearRect(0, 0, myCanvas.width, myCanvas.height);
            myBackground.render();
            myStars.render();
            myPlanets.render();
            myfinalText.render();
            this.done = 1;
        }
    }
}

class Background {
    constructor(myfile, speed, thrust, MIN_SPEED, MAX_SPEED) {
        this.fileNum = myfile.length;
        this.fileB = 1;
        this.fileA = 0;
        console.log(this.fileNum); //RR
        this.file = myfile; 
        this.fileW = myfile[0].width;
        this.fileH = myfile[0].height;
        console.log(`${myfile[0]} is ${this.fileH}`); //RR
        console.log(`fileA ${this.fileA}`); //RR
        console.log(`fileB ${this.fileB}`); //RR

        this.period = 1; //frame speed
        this.sX = 0; //sourceX
        this.sY = 7; //sourceY Non Zero to Start
        this.sY2 = 0; //sourceY 2 for second image
        this.sW = 0; //sourceW
        this.sH = 0; //sourceH
        this.sH2 = 0;
        this.dX = 0; //destinationX
        this.dY = 0; //destinationY
        this.dY2 = 0;
        this.dW = 0; //destinationW
        this.dH = 0; //destinationH
        this.dH2 = 0;

        this.altitude = 0;
        this.speed = speed; 
        this.thrust = thrust;
        this.gravity = -0.05;
        this.MIN_SPEED = MIN_SPEED;
        this.MAX_SPEED = MAX_SPEED;

        this.drawOneImage = 1;
        this.done = 0;
    }

    moveup() {
        if (this.speed <= this.MAX_SPEED && !this.done) {
            this.speed = this.speed + this.thrust;
            //console.log('moveup'); //RR
        } else {
            //console.log('max speed reached'); //RR
        }
    }

    update(count, canvasW, canvasH) {
        if (count % this.period == 0 && !this.done) {
            //check for reaching transition period
            if (this.sY > 0) {
                //console.log(`one image sY ${this.sY}`); //RR
                this.drawOneImage = 0;
                //console.log(`this.fileW ${this.fileW}`); //RR
                this.sX = Math.floor(this.fileW - canvasW - (this.fileW - canvasW)/2);
                this.sY = Math.floor(this.fileH - canvasH - (this.altitude));
                this.sY2 = this.fileH + this.sY;
                this.sW = canvasW;
                this.sH = canvasH;
                this.sH2 = canvasH;
                //this.dY = 0;
                //this.dY2 = 0;
                this.dW = canvasW;
                this.dH = canvasH;
                this.dH2 = canvasH;
            } else if (this.sY <= 0) {
                //console.log(`transition ${this.sY}`); //RR

                //B image
                this.sY2 = Math.floor(this.fileH - (canvasH - (this.fileH - this.altitude)));
                this.sH2 = Math.floor(this.fileH - (canvasH - (this.fileH - this.altitude)));
                this.dY2 = 0;
                this.dH2 = Math.floor(this.fileH - (canvasH - (this.fileH - this.altitude)));

                //A image
                this.sY = 0;
                this.sH = canvasH;
                this.dY = Math.floor(-1 * (this.fileH - this.altitude - canvasH));
                this.dH = canvasH;
            }

            //check for reaching end of file
            if (this.altitude > this.fileH && this.fileB < this.fileNum - 1) { 
                //console.log('3'); //RR
                //reset altitude and go to next file
                this.altitude = 1;
                this.fileA = this.fileB;
                this.fileB++;
                this.drawOneImage = 1;
                //reset
                this.sY = Math.floor(this.fileH - canvasH - (this.altitude));
                this.sY2 = this.fileH + this.sY;
                this.sW = canvasW;
                this.sH = canvasH;
                this.sH2 = canvasH;
                this.dY = 0;
                this.dY2 = 0;
                this.dW = canvasW;
                this.dH = canvasH;
                this.dH2 = canvasH;
            } else if (this.altitude > this.fileH && this.fileB == this.fileNum - 1) {
                //end
                console.log(this); //RR
                console.log(this.fileB); //RR
                console.log(this.fileNum); //RR
                console.log('you have reached the end'); //RR
                this.done = 1;
                this.speed = 0;
            }

            //calc new altitude, only add gravity if speed is greater than MIN SPEED
            if (this.speed > this.MIN_SPEED) {
                this.altitude = this.altitude + this.speed;
                this.speed = this.speed + this.gravity;
            } else {
                this.altitude = this.altitude + this.speed;
            } 
        }

    }

    render() {
        //imgB
        c.drawImage(this.file[this.fileB], this.sX, this.sY2, this.sW, this.sH2, this.dX, this.dY2, this.dW, this.dH2);
        //imgA    
        c.drawImage(this.file[this.fileA], this.sX, this.sY, this.sW, this.sH, this.dX, this.dY, this.dW, this.dH);    
    }
}

class Spaceship {
    constructor(myfile) {
        console.log(myfile); //RR
        console.log(myfile.height); //RR
        this.file = myfile; 
        this.fileW = myfile.width;
        this.fileH = myfile.height;

        this.period = 1; //frame speed
        this.sX = 0; //sourceX
        this.sY = 0; //sourceY
        this.sW = this.fileW; //sourceW
        this.sH = this.fileH; //sourceH
        this.dX = 0; //destinationX
        this.dY = 0; //destinationY
        this.dW = this.fileW; //destinationW
        this.dH = this.fileH; //destinationH
    }

    update(count, canvasW, canvasH) {
        if (count % this.period == 0) { //update
            this.dX = Math.floor((canvasW/2) - (this.fileW/2));
            this.dY = Math.floor(canvasH - this.fileH - (0.0 * this.fileH));
        }        
    }

    render() {
        c.drawImage(
            this.file, 
            this.sX, 
            this.sY, 
            this.fileW, 
            this.fileH, 
            this.dX, 
            this.dY, 
            this.dW, 
            this.dH);
    }
}

class Control {
    constructor(r) {
        this.r = r;
        this.x = 0;
        this.y = 0;
        this.startAngl = 0;
        this.endAngl = Math.floor(2 * Math.PI);

        this.period = 1; //frame speed
        this.ANIMATE = 10;
        this.ANIMATE_SIZE = 0.95;
        this.animateCount = 0;
        this.regR = this.r;
        this.animateR = Math.floor(this.r * this.ANIMATE_SIZE); 
    }

    checkClick(clickX, clickY) {

        if (this.animateCount == 0) {
            if ((clickX >= this.x - this.r && clickX <= this.x + this.r && this.animateCount == 0) 
            &&
            (clickY >= this.y - Math.sqrt(Math.pow(this.r, 2) - Math.pow(clickX-this.x,2)) 
            && clickY <= this.y + Math.sqrt(Math.pow(this.r, 2) - Math.pow(clickX-this.x,2)))
            ) {

            //console.log('*******'); //RR
            //console.log('in x and y'); //RR
            myBackground.moveup();
            myStars.moveup();
            myPlanets.moveup();
            this.animateCount = 1;
            }
        }
    }

    update(count, canvasW, canvasH) {
        if (count % this.period == 0) { //update
            this.x = Math.floor(canvasW/2);
            this.y = Math.floor(canvasH - (3.0 * this.regR));  

            if (this.animateCount == 0) {
                //regular
                this.r = this.regR;
            } else {
                //boost
                //console.log('boost'); //RR
                myBoost.update(myGame.count, myCanvas.width, myCanvas.height);
                myBoost1.update(myGame.count, myCanvas.width, myCanvas.height);
                myBoost2.update(myGame.count, myCanvas.width, myCanvas.height);
                myBoost3.update(myGame.count, myCanvas.width, myCanvas.height);
                myBoost4.update(myGame.count, myCanvas.width, myCanvas.height);
                myBoost5.update(myGame.count, myCanvas.width, myCanvas.height);
                this.r = this.animateR;
                //count animate time
                if (this.animateCount >= this.ANIMATE) {
                    this.animateCount = 0;
                } else {
                    this.animateCount++;
                }
            }            
        }
    }

    render() {
        //render boost if boosted
        if (this.animateCount != 0) {
            if (this.animateCount <= 2) {
                myBoost1.render();
            } else if (this.animateCount <= 4) {
                myBoost2.render();
            } else if (this.animateCount <= 6) {
                myBoost3.render();
            } else if (this.animateCount <= 8) {
                myBoost4.render();
            } else {
                myBoost5.render();
            }
        }
        //render control on top
        c.fillStyle = '#2f3995'; //#231d2a 7b28a4
        c.beginPath();
        c.arc(this.x, this.y, this.r, this.startAngl, this.endAngl);
        c.fill();    
        c.closePath();
    }
}

//function to animate
function loop() {
    if (!myGame.done) {
        myGame.draw();
        window.requestAnimationFrame(loop);    
    }
}

//start
//image array
const imageLocation = [
 'assets/img/stars.png', 
 'assets/img/planet1.png', 
 'assets/img/planet2.png',
 'assets/img/planet3.png',
 'assets/img/planet4.png',
 'assets/img/planet5.png',
 'assets/img/planet6.png',
 'assets/img/planet7.png',
 'assets/img/planet8.png',
 'assets/img/planet9.png',
 'assets/img/planet10.png',
 'assets/img/planet11.png',
 'assets/img/back.png',
 'assets/img/text.png',
 'assets/img/spaceship.png',
 'assets/img/boost.png',
 'assets/img/back1.png',
 'assets/img/back2.png',
 'assets/img/back3.png',
 'assets/img/back4.png',
 'assets/img/finaltext.png',
 'assets/img/boost1.png',
 'assets/img/boost2.png',
 'assets/img/boost3.png',
 'assets/img/boost4.png',
 'assets/img/boost5.png'
]
const images = [];
let imageCount = 0;
//game objects
let myGame;
let myStars;
// let myText;
let myPlanets;
let myBackground;
let mySpaceship;
let myBoost;
let myBoost1;
let myBoost2;
let myBoost3;
let myBoost4;
let myBoost5;
let myfinalText;
const myControl = new Control(30);

//create objects when images are loaded
function imagesLoaded() {
    console.log('all loaded, build and start loop'); //RR
    console.log(images); //RR
    //create images
    myGame = new Game();
    myStars = new Background(
        [images[0], 
        images[0], 
        images[0], 
        images[0], 
        images[0], 
        images[0], 
        images[0], 
        images[0], 
        images[0], 
        images[0], 
        images[0]], 1, 1.2, 1, 2);
    myPlanets = new Background(
        [images[1], 
        images[2], 
        images[3], 
        images[4], 
        images[5], 
        images[6], 
        images[7], 
        images[8], 
        images[9], 
        images[10], 
        images[11]], 2, 4, 2, 5);  //speed, thrust, min, max
    myBackground = new Background([images[12], images[12], images[12], images[12]], 1, 3, 2, 8);
    // myText = new Background([images[13], images[13]], 2, 3, 2, 8);
    mySpaceship = new Spaceship(images[14]);
    myBoost = new Spaceship(images[15]);
    myBoost1 = new Spaceship(images[21]);
    myBoost2 = new Spaceship(images[22]);
    myBoost3 = new Spaceship(images[23]);
    myBoost4 = new Spaceship(images[24]);
    myBoost5 = new Spaceship(images[25]);
    myfinalText = new Spaceship(images[20]);
    //listen for click
    myCanvas.addEventListener('click', (e) => {
        myControl.checkClick(e.clientX, e.clientY);
    });
    //start game loop
    loop();
}

//load all images first
imageLocation.forEach( src => {
    const image = new Image();
    image.src = src;
    images.push(image);
    image.onload = () => {
        console.log(`${src} image loaded`); //RR
        imageCount++; 
        if (imageCount == imageLocation.length) {
            //all images are loaded
            console.log('all images are loaded now'); //RR
            imagesLoaded();
        }
    }
});
