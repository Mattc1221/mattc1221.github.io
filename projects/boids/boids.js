/**
 * 04-05-01.js - a simple JavaScript file that gets loaded with
 * page 5 of Workbook 4 (CS559).
 *
 * written by Michael Gleicher, January 2019
 * modified January 2020, February 2021
 *
 */

// @ts-check
/* jshint -W069, esversion:6 */

/**
 * If you want to read up on JavaScript classes, 
 * see the tutorial on the class website:
 * 
 * https://graphics.cs.wisc.edu/Courses/559-sp2021/tutorials/oop-in-js-1/
 */
class Boid {
    /**
     * 
     * @param {number} x    - initial X position
     * @param {number} y    - initial Y position
     * @param {number} vx   - initial X velocity
     * @param {number} vy   - initial Y velocity
     */
    constructor(x, y, vx = 1, vy = 0) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.a1 = 0;
        this.a2 = 0;
        this.a3 = 0;
    }
    /**
     * Draw the Boid
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
        
        context.save();
            context.translate(this.x, this.y);
            let theta = Math.atan2(this.vx, this.vy);
            context.rotate(-theta);
            
            context.beginPath();
            context.arc(0, 0, 6, 0, Math.PI*2);
            context.closePath();
            context.save();
                context.strokeStyle = "#FFF";
                context.stroke();
            context.restore();

            if(this.a1 > 0){
                context.beginPath();
                context.arc(0, 0, 6, 0, Math.PI*2);
                context.closePath();
                context.save();
                    context.globalAlpha = this.a1;
                    if(this.a1 > 0){
                        this.a1 -= 0.03;
                    }
                    context.fillStyle = "#32a868";
                    context.fill();
                context.restore();
            }
            if(this.a2 > 0){
                context.beginPath();
                context.arc(0, 0, 6, 0, Math.PI*2);
                context.closePath();
                context.save();
                    context.globalAlpha = this.a2;
                    if(this.a2 > 0){
                        this.a2 -= 0.03;
                    }
                    context.fillStyle = "#f5c840";
                    context.fill();
                context.restore();
            }
            if(this.a3 > 0){
                context.beginPath();
                context.arc(0, 0, 6, 0, Math.PI*2);
                context.closePath();
                context.save();
                    context.globalAlpha = this.a3;
                    if(this.a3 > 0){
                        this.a3 -= 0.03;
                    }
                    context.fillStyle = "#ff6161";
                    context.fill();
                context.restore();
            }
            context.beginPath();
            context.arc(0, 2, 2, 0, Math.PI*2);
            context.closePath();
            context.save();
                context.fillStyle = "#FFF";
                context.fill();
            context.restore();
        context.restore();
    }
    /**
     * Perform the "steering" behavior -
     * This function should update the velocity based on the other
     * members of the flock.
     * It is passed the entire flock (an array of Boids) - that includes
     * "this"!
     * Note: dealing with the boundaries does not need to be handled here
     * (in fact it can't be, since there is no awareness of the canvas)
     * *
     * And remember, (vx,vy) should always be a unit vector!
     * @param {Array<Boid>} flock 
     */
    steer(flock) {
        /*
		// Note - this sample behavior is just to help you understand
		// what a steering function might  do
		// all this one does is have things go in circles, rather than
		// straight lines
		// Something this simple would not count for the bonus points:
		// a "real" steering behavior must consider other boids,
		// or at least obstacles.
		
        // a simple steering behavior: 
        // create a rotation matrix that turns by a small amount
        // 2 degrees per time step
        const angle = 2 * Math.PI / 180;
        const s = Math.sin(angle);
        const c = Math.cos(angle);

        let ovx = this.vx;
        let ovy = this.vy;

        this.vx =  ovx * c + ovy * s;
        this.vy = -ovx * s + ovy * c;
		*/

        let avgVX = 0;
        let avgVY = 0;
        let avgX = 0;
        let avgY = 0
        let avgVec = {x: 0, y: 0};
        let count = 0;
        let thisBoid = this;
        theBoids.forEach((b) => {
            let dist = get_magnitude([thisBoid.x, thisBoid.y], [b.x, b.y]);
            if (b != thisBoid && dist < parseInt(radiusSlider.value)){
                // Alignment info
                avgX += b.x;
                avgY += b.y;
                // Cohesion Info
                avgVX += b.vx;
                avgVY += b.vy;
                // Seperation Info
                avgVec.x -= 1/(b.x - this.x);
                avgVec.y -= 1/(b.y - this.y);
                count++;
            }
        });
        if(count > 0) {
            // Adjust Alignment
            let aMag = get_magnitude([0,0], [this.vx, this.vy]);
            this.vx = (this.vx + ((avgVX/count)/10))/aMag;
            this.vy = (this.vy + ((avgVY/count)/10))/aMag;
            // Adjust Cohesion
            let cVec = {x: avgX/count - this.x, y: avgY/count - this.y};
            let cMag = get_magnitude([0,0], [this.vx, this.vy]);
            this.vx += (cVec.x)/(cMag*100*cMag); 
            this.vy += (cVec.y)/(cMag*100*cMag);
            // Adjust Seperation
            let sMag = get_magnitude([0,0], [avgVec.x, avgVec.y]);
            this.vx += avgVec.x;
            this.vy += avgVec.y;
        }
        // Bounce off obstacles
        obstacles.forEach((o) => {
            let dist = get_magnitude([thisBoid.x, thisBoid.y], [o.x, o.y]);
            if (dist < 7 + o.radius){
                // Seperation Info
                this.vx += (this.x - o.x)/dist
                this.vy += (this.y - o.y)/dist
                this.a3 = 1;
            }
        });
        // // Mouse Flocking Pattern
        // if(mouseX >= 0 && mouseY >= 0){
        //     let mouseMag = get_magnitude([this.x, this.y], [mouseX, mouseY]);
        //     this.vx += (mouseX - this.vx)/mouseMag;
        //     this.vy += (mouseY - this.vy)/mouseMag;
        // }
        normalize(this);

    }
}


/** the actual main program
 * this used to be inside of a function definition that window.onload
 * was set to - however, now we use defer for loading
 */

 /** @type Array<Boid> */
let theBoids = [];
let obstacles = [];

let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("flock"));
let context = canvas.getContext("2d");

let speedSlider = /** @type {HTMLInputElement} */ (document.getElementById("speed"));
let radiusSlider = /** @type {HTMLInputElement} */ (document.getElementById("radius"));

let repositioning = 2;
let padding = 6;
let mouseX = -10;
let mouseY = -10;

// when the mouse moves in the canvas, remember where it moves to
canvas.onmousemove = function(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
};
// if the mouse moves outside the canvas, give an outside value
canvas.onmouseleave = function() {
    mouseX = -10;
    mouseY = -10;
};

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
        context.fillStyle = "#666";
        context.fillRect(0,0,canvas.width,canvas.height);
    context.restore();
    drawObstacles();
    theBoids.forEach(boid => boid.draw(context));
}

function drawObstacles(){
    obstacles.forEach((o) => {
        context.save();
            context.translate(o.x, o.y);
            if(parseInt(speedSlider.value)/12 * o.v + o.x < 0 || parseInt(speedSlider.value)/2 * o.v + o.x > canvas.width){
                o.v *= -1;
            }
            o.x += parseInt(speedSlider.value)/2 * o.v;
            context.beginPath();
            context.arc(0, 0, o.radius, 0, Math.PI*2);
            context.closePath();
            context.lineWidth = 3;
            context.strokeStyle = "#FFF";
            context.stroke();
        context.restore();
    });
}


/**
 * Create some initial boids
 * STUDENT: may want to replace this
 */

theBoids.push(new Boid(Math.random() * (canvas.width-200) + 100, Math.random() * (canvas.height-200) + 100, 0, 1));
theBoids.push(new Boid(Math.random() * (canvas.width-200) + 100, Math.random() * (canvas.height-200) + 100, 0, 1));
theBoids.push(new Boid(Math.random() * (canvas.width-200) + 100, Math.random() * (canvas.height-200) + 100, 0, 1));
theBoids.push(new Boid(Math.random() * (canvas.width-200) + 100, Math.random() * (canvas.height-200) + 100, 0, 1));
let obstacleRad = 25
for(var i = 0; i < 12; i++){
    if(i%2 == 1){
        obstacles.push({x: i*obstacleRad*2, y: i*obstacleRad*2, radius: obstacleRad, v: 1});
        obstacles.push({x: canvas.width-i*obstacleRad*2, y: i*obstacleRad*2, radius: obstacleRad, v: -1});
    }
}

/**
 * Handle the buttons
 */
document.getElementById("add").onclick = function () {
    // Students Fill This In
    for(var i= 0; i < 10; i++){
        let b = new Boid(Math.random() * canvas.width, Math.random() * canvas.height, 0, 1);
        theBoids.push(b);
    }
};
document.getElementById("clear").onclick = function () {
    // Student Fill This In
    theBoids = [];
};

let lastTime; // will be undefined by default
/**
 * The Actual Execution
 */
function loop(timestamp) {
    // time step - convert to 1/60th of a second frames
    // 1000ms / 60fps
    const delta = (lastTime ? timestamp-lastTime : 0) * 1000.0/60.0;

    // change directions
    theBoids.forEach(boid => boid.steer(theBoids));
    // move forward
    let speed = Number(speedSlider.value);

    theBoids.forEach(function (boid) {
        boid.x += boid.vx * speed;
        boid.y += boid.vy * speed;
        theBoids.some( function (b){
            var dist = get_magnitude([boid.x, boid.y],[b.x, b.y])
            if(b != boid && dist < 12){
                // swap velocities of boids
                boid.a2 = 1;
                // var hold = boid.vx;
                // boid.vx = b.vx;
                // b.vx = hold;
                // hold = boid.vy;
                // boid.vy = b.vy;
                // b.vy = hold;
            }
        });
    });

    // make sure that we stay on the screen
    theBoids.forEach(function (boid) {
        /**
         * Students should replace this with collision code
         */
        if(boid.x < 0 + padding){
            if(boid.vx < 0){
                boid.vx *= -1;
            } else if (boid.vx == 0){
                boid.vx += repositioning;
                normalize(boid);
            }
            boid.a1 = 1;
        }
        if(boid.y < 0 + padding){
            if(boid.vy < 0){
                boid.vy *= -1;
            } else if (boid.vy == 0){
                boid.vy += repositioning;
                normalize(boid);
            }
            boid.a1 = 1;
        }
        if(boid.x > canvas.width - padding){
            if(boid.vx > 0){
                boid.vx *= -1;
            } else if (boid.vx == 0){
                boid.vx -= repositioning;
                normalize(boid);
            }
            boid.a1 = 1;
        }
        if(boid.y > canvas.height - padding){
            if(boid.vy > 0){
                boid.vy *= -1;
            } else if (boid.vy == 0){
                boid.vy -= repositioning;
                normalize(boid);
            }
            boid.a1 = 1;
        }
    });
    // now we can draw
    draw();
    // and loop
    window.requestAnimationFrame(loop);

}

function get_magnitude(a, b){
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}

function normalize(boid){
    let mag = get_magnitude([0,0], [boid.vx, boid.vy]);
    boid.vx /= mag;
    boid.vy /= mag;
}


// start the loop with the first iteration
window.requestAnimationFrame(loop);


