'use strict';

//globals
const html = document.querySelector('html');
//canvas
const myCanvas = document.getElementById('myCanvas');
const c = myCanvas.getContext('2d');
myCanvas.width = html.clientWidth;
myCanvas.height = html.clientHeight + 4;
//sprites
const myBackgroundFile = new Image();
myBackgroundFile.src = "assets/img/back.png";
const mySpaceshipFile = new Image();
mySpaceshipFile.src = "assets/img/spaceship.png";
const myBoostFile = new Image();
myBoostFile.src = "assets/img/boost.png";

class Game {

    draw() {
        myCanvas.width = html.clientWidth;
        myCanvas.height = html.clientHeight + 4;
        //console.log(`canvas W ${myCanvas.width}`); //RR
        myBackground.render(myBackgroundFile, myCanvas.width, myCanvas.height);
        mySpaceship.render(mySpaceshipFile, myCanvas.width, myCanvas.height);
        myControl.render(40, myCanvas.width, myCanvas.height);
    }
}

class Background {
    constructor() {
        this.altitude = 1;
        this.speed = 1; 
        this.thrust = 3;
        this.gravity = -0.05;
        this.MIN_SPEED = 2;
        this.MAX_SPEED = 8;
    }

    moveup() {
        if (this.speed <= this.MAX_SPEED) {
            this.speed = this.speed + this.thrust;
            console.log('moveup'); //RR
        } else {
            console.log('max speed reached'); //RR
        }
    }

    render(myfile, canvasW, canvasH) {
        //receives:
        //file
        //canvasW, canvasH

        c.drawImage(
            myfile, 
            myfile.width - canvasW - (myfile.width - canvasW)/2, 
            myfile.height - canvasH - (this.altitude), 
            canvasW, 
            canvasH, 
            0, 
            0, 
            canvasW, 
            canvasH);
        //calc new altitude, only add gravity if speed is greater than MIN SPEED
        console.log(this.speed) //RR
        if (this.speed > this.MIN_SPEED) {
            this.altitude = this.altitude + this.speed;
            this.speed = this.speed + this.gravity;
        } else {
            this.altitude = this.altitude + this.speed;
        }
        // //if speed goes negative then set back to original
        // if (this.speed > 0) {
        //     this.speed = this.speed + this.gravity;
        // } else {
        //     this.speed = this.MIN_SPEED;
        // }
    }
}

class Spaceship {

    render(myfile, canvasW, canvasH) {
        //receives:
        //file
        //canvasW, canvasH

        c.drawImage(
            myfile, 
            myfile.width - canvasW - (myfile.width - canvasW)/2, 
            myfile.height - canvasH, 
            canvasW, 
            canvasH, 
            0, 
            0, 
            canvasW, 
            canvasH);
    }
}

class Control {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.r = 0;

        this.ANIMATE = 10;
        this.ANIMATE_SIZE = 0.95;
        this.animateCount = 0;
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
            this.animateCount = 1;
            }
        }
    }

    render(r, canvasW, canvasH) {
        this.r = r;
        this.x = canvasW/2;
        this.y = canvasH - (2.5 * r);

        if (this.animateCount == 0) {
            c.fillStyle = '#231d2a';
            c.beginPath();
            c.arc(
                this.x, 
                this.y, 
                this.r, 
                0, 
                2 * Math.PI);
            c.fill();    
        } else {
            myBoost.render(myBoostFile, myCanvas.width, myCanvas.height);

            c.fillStyle = '#231d2a';
            c.beginPath();
            c.arc(
                this.x, 
                this.y, 
                this.r * this.ANIMATE_SIZE, 
                0, 
                2 * Math.PI);
            c.fill();            
            
            //  && myBackground.speed + myBackground.thrust < myBackground.MAX_SPEED [add back in]
            if (this.animateCount >= this.ANIMATE) {
                this.animateCount = 0;
            } else {
                this.animateCount++;
            }
            //console.log(this.animateCount); //RR
        }
    }
}

//function to animate
function loop() {
    myGame.draw();
    requestAnimationFrame(loop);
}

//start
const myGame = new Game();
const myBackground = new Background();
const mySpaceship = new Spaceship();
const myBoost = new Spaceship();
const myControl = new Control();
//listen for click
myCanvas.addEventListener('click', (e) => {
    myControl.checkClick(e.clientX, e.clientY);
})    

myBackgroundFile.onload = function() {
    console.log('loaded'); //RR
    loop();
}
