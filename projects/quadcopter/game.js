
/* jshint -W069, -W141, esversion:6 */
export {};

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas"));
const context = canvas.getContext("2d");
const rateSlider = /** @type {HTMLInputElement} */ (document.getElementById("slider1"));
const text1 = /** @type {HTMLInputElement} */ (document.getElementById("text1"));
const timeSlider = /** @type {HTMLInputElement} */ (document.getElementById("slider2"));
const text2 = /** @type {HTMLInputElement} */ (document.getElementById("text2"));
const muteBox = /** @type {HTMLInputElement} */ (document.getElementById("mute"));
const nameBox = /** @type {HTMLInputElement} */ (document.getElementById("name"));


/* Redraw list */
let boxes = [];
let bullets = [];
let asteroids = [];
let particles = [];

/* player and other quadcopters */
let copters = [{"x": canvas.width/2 - 50, "y": canvas.height/4 - 50, "d": 0, "r": 0},
    {"x": canvas.width/4 - 50, "y": canvas.height*3/4 - 50, "d": 0, "r": 0},
    {"x": canvas.width*3/4 - 50, "y": canvas.height*3/4 - 50, "d": 0, "r":0}]
let player = {"x": canvas.width/2, "y": canvas.height/2, "d": 0}
let colorList = ['#fc9700', '#48f702', '#00fbff', '#ff00fb', '#ff0000', '#fff700'];

/* Quadcopter movement variables */
let Movement = 0;
let dMovement = 0;
let r = 0;
let copterSpeed = -5;
let theta = 0.1;

/* Game control variables */
let spaceDown = false;
let start = false;
let hoverStart = false;

/* Time/Syncronization variables */
let then1 = -1;
let then2 = -1;
let then3 = -1;
let time_separation = 750;
let startTime = 30;
let startCountDown = 4;
let time = startTime;
let mute = false;
const second = 1000;

/* Mouse position variables */
let mouseX;
let mouseY;

/* Score Variables */
let score = 0;
let prevScore = -1;
let best = 0;

/* User info */
let username = "Guest" + Math.floor(Math.random() * 100000).toString;

/* Sounds -- found on https://freesound.org/people/InspectorJ/sounds/448226/ */
let pewSound = new sound("/music/pew.wav");
let explodeSound = new sound("/music/explode.wav");
let music = new sound("/music/8-bitSound.mp3");
let titleMusic = new sound("/music/titleMusic.mp3");
let currentMusic = titleMusic;

// Soure for this sound function found on: https://www.w3schools.com/graphics/tryit.asp?filename=trygame_sound
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}

/* HTML ELEMENT FUNCTIONS */
function rateChange() {
    const val = rateSlider.value;
    text1.value = val;
    time_separation = 5/parseInt(val) * 1000;
}
rateSlider.oninput = rateChange;
rateChange();

function timeChange() {
    const val = timeSlider.value;
    text2.value = val;
    time = parseInt(val);
}
timeSlider.oninput = timeChange;
timeChange();

function muteVolume() {
    mute = !mute;
    if(mute){
        currentMusic.stop();
    } else {
        currentMusic.play();
    }
}
muteBox.onchange = muteVolume;

function setUsername(){
    username = nameBox.value;
}
nameBox.onchange = setUsername;

/* MOUSE RELATED FUNCTIONS*/

// when the mouse moves in the canvas, remember where it moves to
canvas.onmousemove = function(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    let box = /** @type {HTMLCanvasElement} */(event.target).getBoundingClientRect();
    mouseX -= box.left;
    mouseY -= box.top;
};
// if the mouse moves outside the canvas, give an outside value
canvas.onmouseleave = function() {
    mouseX = -10;
    mouseY = -10;
};

canvas.onclick = function(){
    if (hoverStart && !start){
        restart();
        start = true;
        if(!mute){
            explodeSound.play();
        }
    }
}


function restart(){
    boxes = [];
    bullets = [];
    asteroids = [];
    particles = [];
    then1 = -1;
    then2 = -1;
    then3 = -1;
    player = {"x": canvas.width/2, "y": canvas.height/2, "d": 0}
    if (score > best && time <= 30 && time_separation >= 555.5){
        best = score;
    }
    prevScore = score;
    score = 0;
    time = startTime;
    startCountDown = 4;
    start = false;
}

/**
 * the animation loop gets a timestamp from requestAnimationFrame
 * 
 * @param {DOMHighResTimeStamp} timestamp 
 */
function loop(timestamp) {
    // Clear and draw background
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
        context.fillStyle = "#171717"
        context.fillRect(0,0,canvas.width,canvas.height);
    context.restore();

    if (start && startCountDown <= 0){
        if(!mute){
            currentMusic = music;
            currentMusic.play();
        }
        if (time == 0){
            currentMusic.stop();
            restart();
        }
        if (timestamp - then1 > time_separation){
            then1 = timestamp;
            genAsteroid();
        }
        if (timestamp - then2 > second){
            then2 = timestamp;
            time -= 1;
        }

        shoot();
        asteroid();
        explode();

        if(!(player["x"] >= 0 && player["x"] <= canvas.width && 
            player["y"] >= 0 && player["y"] <= canvas.height)){
            player["d"] += Math.PI;
            boxes.push({"a": 1});
        }
        player["x"] -= (Movement) * Math.sin(player["d"]);
        player["y"] += (Movement) * Math.cos(player["d"]);
        player["d"] += dMovement;
        body(context, [player["x"], player["y"], player["d"]], r, .75);
        r += 1;
        outOfBounds();
        printScore();
    } else if (!start){
        if(!mute){
            currentMusic = titleMusic;
            currentMusic.play();
        }
        startScreen();
    } else {
        currentMusic.stop();
        if (timestamp - then3 > second){
            then3 = timestamp;
            startCountDown -= 1;
        }
        countDown();
    }

    window.requestAnimationFrame(loop);
};

function countDown(){
    context.save();
        context.fillStyle = "#FFF";
        context.font = "80px serif";
        context.fillText( startCountDown.toString(), canvas.width/2 - 10, canvas.height/2);
    context.save();
}

function startScreen(){
    // width and height of start button
    let w = 100;
    let h = 50;
    let x = canvas.width/2 - w/2;
    let y = canvas.height/2 - h/2;
    if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h){
        hoverStart = true;
    } else {
        hoverStart = false;
    }
    context.save();
        context.fillStyle = hoverStart ? "#f2d0d0" : "#FFF";
        context.fillRect(x, y, w, h);
        context.font = "40px serif";
        context.fillStyle = "#FFF";
        context.fillText( "Let's Play Quadcopters", x - 140, canvas.height/2 - 50);
        context.fillStyle = "#000";
        context.font = "40px serif";
        context.fillText( "start", x + 15, canvas.height/2 + 9);
        context.font = "20px serif";
        context.fillStyle = "#FFF";
        context.fillText( "High Score: " + Math.floor(best).toString(), canvas.width/2 - 57, canvas.height/2 + 50);
        if( prevScore != -1){
            context.font = "20px serif";
            context.fillStyle = "#b3b3b3";
            context.fillText( "Your Score: " + Math.floor(prevScore).toString(), canvas.width/2 - 57, canvas.height/2 + 80);
        }
    context.save();
    copters.forEach(c => {
        c["x"] -= copterSpeed * Math.sin(c["d"]);
        c["y"] += copterSpeed * Math.cos(c["d"]);
        c["d"] += theta;
        body(context, [c["x"] , c["y"], c["d"]], r, 0.5);
    });
    r += 1;
}

function printScore(){
    context.save();
        context.font = "40px serif";
        context.fillStyle = "#FFF";
        context.fillText( "Score: " + Math.floor(score).toString(), 30, 50)
    context.restore();
    context.save();
        context.font = "20px serif";
        context.fillStyle = "#FFF";
        context.fillText( "Best: " + Math.floor(best).toString(), 40, 80)
    context.restore();
    context.save();
        context.font = "30px serif";
        context.fillStyle = "#FFF";
        context.fillText( "Time Remaining: " + Math.floor(time).toString(), canvas.height - 260, 50)
    context.restore();
}

/* EXPLOSION FUNCTIONS */

function addParticles(px, py, pcolor){
    for (var i = 0; i < 30; i++){
        let randX = 0;
        let randY = 0;
        while( randX == 0 || randY == 0){
            randX = (Math.random() * 5);
            randY = (Math.random() * 5);
        }
        randX = Math.round(Math.random()) ? randX : -randX;
        randY = Math.round(Math.random()) ? randY : -randY;
        particles.push({"x": px, "y": py, "vx": randX, "vy": randY, "a": 1.0, "g": 0.09,
            "color": pcolor});
    }
}

function explode(){
    particles = particles.filter(
        dot => ((dot.y>0)&&(dot.x>0)&&(dot.x<canvas.width)&&(dot.y<canvas.height)&&(dot.a > 0))
        );

    // draw all of the particles
    particles.forEach(function(p){
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.g;
        context.beginPath();
        context.arc(p.x, p.y, 2, 0, Math.PI * 2);
        context.closePath();
        context.save();
            context.globalAlpha = p.a;
            context.fillStyle = p.color;
            context.fill();
        context.restore();
        p.a -= 0.02;
        
    });
}

/* ASTEROID FUNCTIONS */

function genAsteroid(){
    let aSpeed = 3;
    let axis = Math.random()<.5 ? 0 : 1;
    let x=0, y=0, vy=0, vx=0;
    // Determine starting position and speed
    if (axis){
        // comes from sides
        x = Math.random()<.5 ? 0 : canvas.width;
        y = Math.random() * canvas.height;
        if (x){
            vx = Math.random() * -aSpeed;
        } else {
            vx = Math.random() * aSpeed;
        }
        let vdir = Math.random()<.5 ? -1 : 1;
        vy = Math.random() * aSpeed * vdir;
    } else {
        // comes from top or bottom
        y = Math.random()<.5 ? 0 : canvas.height;
        x = Math.random() * canvas.width;
        if (y){
            vy = Math.random() * aSpeed;
        } else {
            vy = Math.random() * -aSpeed;
        }
        let vdir = Math.random()<.5 ? -1 : 1;
        vx = Math.random() * aSpeed * vdir;
    }
    let radius = (Math.random() * .8 + .2) * 50;
    let rSmall = Math.random() * (radius * .5);
    let xdir = Math.random()<.5 ? -1 : 1;
    let ydir = Math.random()<.5 ? -1 : 1;
    let subX = (Math.random() * (radius - rSmall * 1.2)) * xdir;
    let subY = (Math.random() * (radius - rSmall * 1.2)) * ydir;

    asteroids.push({"x": x, "y": y, "radius": radius, "vx": vx, "vy": vy,
        "subx": subX, "suby": subY, "rSmall": rSmall, "exist": true});
}

function asteroid(){
    asteroids = asteroids.filter(
        dot => (dot["x"] >= -dot["radius"]*2 && dot["x"] <= canvas.width + dot["radius"]*2 && 
        dot["y"] >= -dot["radius"]*2 && dot["y"] <= canvas.height + dot["radius"]*2 && dot["exist"])
    );

    asteroids.forEach( a=> {
        a["x"] += a["vx"];
        a["y"] -= a["vy"];
        context.beginPath();
        context.arc(a["x"], a["y"], a["radius"], 0, Math.PI *2);
        context.closePath();
        context.save();
            context.fillStyle = "#ebebeb";
            context.fill();
            context.stroke();
        context.restore();

        for(var i = 0; i < 2; i++){
            context.beginPath();
            let xdir =i ? -1 : 1;
            let ydir = i ? -1 : 1;
            context.arc(a["x"] + a["subx"]*xdir, a["y"] + a["suby"]*ydir, a["rSmall"], 0, Math.PI *2);
            context.closePath();
            context.save();
                context.strokeStyle = "#9e9e9e"
                context.fillStyle = "#c2c2c2";
                context.fill();
                context.stroke();
            context.restore();
        }
        bullets.forEach( b =>{
            let dist = Math.sqrt(Math.pow(a["x"]-b["x"], 2) + Math.pow(a["y"]-b["y"], 2))
            if (dist <= a["radius"]){
                a["exist"] = false;
                b["exist"] = false;
                addParticles(b["x"], b["y"], colorList[Math.floor(Math.random() * colorList.length)]);
                score += 100/a["radius"];
                if(!mute){
                    explodeSound.play();
                }
            }
        })
    })
}

/* OUT OF BOUNDS FUNCTION */

function outOfBounds(){
    boxes = boxes.filter(
        dot => (dot["a"]>0)
    );

    boxes.forEach(b => {
        context.beginPath();
        context.rect(0, 0, canvas.width, canvas.height);
        context.closePath();
        context.save();
            context.globalAlpha = b["a"];
            context.strokeStyle = "#F00";
            context.lineWidth = 5;
            context.stroke();
        context.restore();
        b["a"] -= 0.05;
    });
}

/* QUADCOPTER FUNCTIONS */

function shoot(){
    bullets = bullets.filter(
        dot => (dot["x"] >= 0 && dot["x"] <= canvas.width && 
        dot["y"] >= 0 && dot["y"] <= canvas.height && dot["exist"])
    );

    bullets.forEach( b=> {
        let bulletSpeed = 10;
        b["x"] += (bulletSpeed) * Math.sin(b["d"]);
        b["y"] -= (bulletSpeed) * Math.cos(b["d"]);
        context.beginPath();
        context.arc(b["x"], b["y"], 2, 0, Math.PI *2);
        context.closePath();
        context.save();
            context.fillStyle = "#6cd446";
            context.fill();
        context.restore();
    })
}

function blade(context, points, r){
    context.save();
        let bladeLength = 15;
        let bladeWidth = 2;
        context.translate(points[0], points[1]);
        context.rotate(r);
        context.beginPath();
        context.moveTo(-bladeLength, -bladeWidth);
        context.lineTo(-bladeLength, bladeWidth);
        context.lineTo(bladeLength, bladeWidth);
        context.lineTo(bladeLength, -bladeWidth);
        context.closePath();
        context.save();
            context.fillStyle = "#3a6e48";
            context.fill();
        context.restore();
    context.restore();
}

function body( context, points, bladeR, scale){
    let width = 25;
    let height = 50;
    context.save();
        context.translate(points[0], points[1]);
        context.rotate(points[2]);
        context.scale(scale, scale);
        // draw body
        context.beginPath();
        context.moveTo(-width/2, -height/2);
        context.lineTo(width/2, -height/2);
        context.lineTo(width/2, height/2);
        context.lineTo(-width/2, height/2);
        context.closePath();
        context.save();
            context.fillStyle = "#7a9180";
            context.fill();
        context.restore();
        // draw head
        context.beginPath();
        context.arc(0, -height/2, width/2, 0, Math.PI * 2);
        context.closePath();
        context.save();
            context.fillStyle = "#7a9180";
            context.fill();
        context.restore();
        // draw arms
        context.save();
            let armWidth = 2;
            let armLength = 75;
            // context.translate(width/2, height/2);
            context.rotate(Math.PI/4);
            context.beginPath();
            context.moveTo(-armLength, -armWidth);
            context.lineTo(-armLength, armWidth);
            context.lineTo(armLength, armWidth);
            context.lineTo(armLength, -armWidth);
            context.closePath();
            context.save();
                context.fillStyle = "#3a6e48";
                context.fill();
            context.restore();
            context.beginPath();
            context.moveTo(-armWidth, -armLength);
            context.lineTo(armWidth, -armLength);
            context.lineTo(armWidth, armLength);
            context.lineTo(-armWidth, armLength);
            context.closePath();
            context.save();
                context.fillStyle = "#3a6e48";
                context.fill();
            context.restore();
            // draw blades
            blade(context, [-armLength, 0], bladeR/4);
            blade(context, [armLength, 0], bladeR/3);
            blade(context, [0, -armLength], bladeR/2);
            blade(context, [0, armLength], bladeR);
        context.restore();
    context.restore();
}

/* KEYBOARD EVENTS */

function doKeyDown(evt){
    switch (evt.keyCode) {
        case 87:  /* Up arrow was pressed */
            Movement = -5;
        break;
        case 83:  /* Down arrow was pressed */
            Movement = 5;
        break;
        case 65:  /* Left arrow was pressed */
            dMovement = -0.1;
            break;
        case 68:  /* Right arrow was pressed */
            dMovement = 0.1;
            break;
        case 80:
            if( !spaceDown){
                if(!mute){
                    pewSound.play();
                }
                bullets.push({"x": player["x"], "y": player['y'], "d": player["d"], "exist": true});
            }
            spaceDown = true;
            break;

    }
}
function doKeyUp(evt){
    switch (evt.keyCode) {
        case 87:  /* Up arrow was pressed */
            Movement = 0;
            break;
        case 83:  /* Down arrow was pressed */
            Movement = 0;
            break;
        case 65:  /* Left arrow was pressed */
            dMovement = 0;
            break;
        case 68:  /* Right arrow was pressed */
            dMovement = 0;
            break;
        case 80:
            spaceDown = false;
            break;
    }
}
window.addEventListener('keydown',doKeyDown,true);
window.addEventListener('keyup',doKeyUp,true);

// and then you would start the loop with:
window.requestAnimationFrame(loop);