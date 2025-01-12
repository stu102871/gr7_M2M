"use strict";

/*
To be able to relaunch the game after closing, it will now first check if a global variable has been declared prior before declaring it again to avoid re-declaration errors.
This means all GLOBAL VARIABLES will use var instead of let or const, as to allow their scope to reach outside of said re-declaration checks.

Many variables declared inside functions also use var instead of let or const. This is simply a (bad) habit of mine that stems from using GameMaker.
In GameMaker you use var to declare temporary variables. This is useful to avoid storing unnessesary variables in an object.
Since I added the re-declaration checks much later into development, all those var declarations have already been made and I don't feel like changing all of them at this stage.
I hope I will remember to pay closer mind to which type of declaration to use now that I know the difference between let and var.
*/

/* GLOBAL VARIABLES */

if (typeof game === "undefined") {

    // Meta Objects
    var game = {
        start : false,
        paused: true,
    
        size  : changeScreen(),
    
        player: {
            score   : 0,
            h_score : 0,
            lives   : 3,
            b_broken: 0,
            powerup : 0
        },
    
        level : {
            total  : 4,
            current: undefined,
            sub    : 0,
            mod    : undefined
        },
    
        restart: function() {
        
            this.start = false;
            this.paused = true;
        
            if (this.player.score > this.player.h_score) this.player.h_score = this.player.score;
            this.player.score = 0;
            this.player.lives = 3;
            this.player.b_broken = 0;
            this.player.powerup = 0;
            this.level.sub = 0;
            this.level.current = undefined;
        
            // Bug fix
            keys = {};
        }
    };
    
    var menuBoxData = {};
    var menuBoxes = [];
    
    var keys = {};
    var spaceKeyPressed = false;
    
    // Game Objects
    var paddle = {};
    var ball = {};
    
    // Bricks setup
    var brickData = {};
    var colours = ["red", "blue", "green", "gold", "purple", "orange", "cyan", "silver", "lightblue"];
    
    // Background Stars Setup
    var starData = [];

}
    
    
    
/* CLASSES */

if (typeof bricks === "undefined") {
    
    var bricks = [];

    var Brick = class {

        constructor(id, x_pos, y_pos) {
        
            this.id     = id,
            this.width  = brickData.width*game.level.mod[0],
            this.height = brickData.height*game.level.mod[0],
        
            this.x_pos  = x_pos,
            this.y_pos  = y_pos,
        
            this.colour = colours[rng(colours.length-1, true)],
            this.break  = false
        }

        create() {
        
            fill(this.colour);
            rect(this.x_pos, this.y_pos, this.width, this.height);
        }
    }
}



/* FUNCTIONS */

// p5 Canvas
function setup() {

    // Create canvas
    let canvas = createCanvas(game.size[0], game.size[1]);
    canvas.parent("popupMain");
    background(0);
    
    noStroke();
    frameRate(75);


    // Reset setup arrays
    menuBoxes = [];
    bricks = [];
    

    if (game.start) {

        // Level prep
        var level;
        if (game.level.current == 3) level = game.level.sub;
        else level = game.level.current;

        switch (level) {
            case 0: game.level.mod = [1, 1]; break;
            case 1: game.level.mod = [0.8, 1.4]; break;
            case 2: game.level.mod = [0.6, 1.8]; break;
            default: break;
        }


        // Background stars setup
        starData = [];
        for (let i = 0; i < 500; i++) {

            starData.push({
                size   : [rng(2, false)+1, rng(4, false)+2][game.size[2]],
                x_pos  : rng(width, false),
                y_pos  : rng(height, false),
                colour : color(rng(100, true)+150, rng(100, true)+150, rng(100, true)+150),
                opacity: rng(50, true) 
            });
        }


        // Assign paddle attributes
        paddle = {
            width : [80, 160][game.size[2]]*game.level.mod[0],
            height: [10, 20][game.size[2]],

            x_pos : width/2,
            y_pos : [height-30, height-60][game.size[2]],

            speed : [5, 10][game.size[2]]
        };

    
        // Assign ball attributes
        ball = {
            size : [10, 20][game.size[2]],

            sx_pos: width/2,
            sy_pos: paddle.y_pos - paddle.height/2 - 1,

            edge: {
                top   : undefined,
                bottom: undefined,
                left  : undefined,
                right : undefined
            },

            s_speed  : [2, 4][game.size[2]],
            m_speed  : [4, 8][game.size[2]] * game.level.mod[1],


            edges: function() {

                this.edge.top    = this.y_pos - this.size/2;
                this.edge.bottom = this.y_pos + this.size/2;
                this.edge.left   = this.x_pos - this.size/2;
                this.edge.right  = this.x_pos + this.size/2
            },

            bounce: function(type) {

                if (type == "hor") this.direction = PI - this.direction;
                else if (type == "vert") this.direction *= -1;
            },

            speedup: function() {

                if (game.level.current == 3) this.speed += [0.05, 0.1][game.size[2]];
                else {
                    this.speed += [0.1, 0.2][game.size[2]];
                    if (this.speed > this.m_speed) this.speed = this.m_speed;
                }
            },

            reset: function() {

                this.speed = this.s_speed;
                this.direction = degreesToRadians(225 + rng(90, false), false);
                this.x_pos = this.sx_pos;
                this.y_pos = this.sy_pos;
            }
        };

        ball.reset();


        // Making Bricks

        // Setup

        brickData = {
            width : [40, 80][game.size[2]],
            height: [12.5, 25][game.size[2]],
            gap   : [5, 10][game.size[2]],
            colums: [[5, 6, 7, 7, 6], [6, 7, 8, 10, 10, 9, 8, 8], [7, 8, 10, 10, 12, 12, 14, 14, 13, 12, 11, 10, 11, 12]][level],

            start_y: ball.size*2.5
        };
        
        // Create brick objects
        var max_width = [];
        for (let i=0; i < brickData.colums.length; i++) {

            // Determine the width off all bricks in the row
            max_width.push(((brickData.colums[i]) * (brickData.width*game.level.mod[0] + brickData.gap*game.level.mod[0])) - brickData.gap*game.level.mod[0]);


            // Actually create brick objects
            for (let hor_i = 0; hor_i < brickData.colums[i]; hor_i++) {

                bricks.push(new Brick(
                    `${i}${hor_i}`,
                    (width - max_width[i])/2 + (brickData.width*game.level.mod[0] + brickData.gap*game.level.mod[0])*hor_i,
                    brickData.start_y + (brickData.height*game.level.mod[0] + brickData.gap*game.level.mod[0])*i
                ));
            }
        }

    }
    else {

        // Start Menu Prep
        textAlign(CENTER, CENTER);

        menuBoxData = {
            size : [width*0.5, [40, 80][game.size[2]]],
            x_pos: undefined,
            y_pos: [100, 200][game.size[2]]
        }
        menuBoxData.x_pos = width/2 - menuBoxData.size[0]/2;

        for (let i=0; i < game.level.total; i++) {

            var label;
            if (i == game.level.total-1) label = "Oneindig";
            else label = `Level ${i+1}`;

            menuBoxes.push({
                size : menuBoxData.size,
                x_pos: menuBoxData.x_pos,
                y_pos: menuBoxData.y_pos,
                label: label
            });
            menuBoxData.y_pos += menuBoxData.size[1];
        }

    }
}

function draw() {

    // Draw the background
    background(0);

    if (game.start) {

        // Draw background stars
        for (let i=0; i < starData.length; i++) {

            // Low opacity
            starData[i].colour.setAlpha(starData[i].opacity/2);
            fill(starData[i].colour);
            circle(starData[i].x_pos, starData[i].y_pos, starData[i].size*2);

            // Medium opacity
            starData[i].colour.setAlpha(starData[i].opacity);
            fill(starData[i].colour);
            circle(starData[i].x_pos, starData[i].y_pos, starData[i].size*1);

            // Full opacity
            starData[i].colour.setAlpha(255);
            fill(starData[i].colour);
            circle(starData[i].x_pos, starData[i].y_pos, starData[i].size*0.5);
        }



        // Pause functionality
        if (keys[" "] && !spaceKeyPressed) {
            game.paused = !game.paused;
            spaceKeyPressed = true;
        }
        if (!keys[" "]) spaceKeyPressed = false;


        // Escape functionality
        if (keys["Escape"]) {

            game.restart();
            setup();
            return;

        }



        // Draw paddle
        fill(200, 200, 200);
        rect(paddle.x_pos - paddle.width/2, paddle.y_pos, paddle.width, paddle.height, 10);

        // Move paddle based on key states
        if (!game.paused) {
            if ((keys["ArrowLeft"] || keys["a"]) && paddle.x_pos > paddle.width/2) paddle.x_pos -= paddle.speed;
            else if ((keys["ArrowRight"] || keys["d"]) && paddle.x_pos < width-paddle.width/2) paddle.x_pos += paddle.speed;
        }
        

        
        // Draw ball
        fill(255, 60, 0);
        circle(ball.x_pos, ball.y_pos, ball.size);

        // Move ball
        if (!game.paused) {

            ball.x_pos += cos(ball.direction) * ball.speed;
            ball.y_pos += sin(ball.direction) * ball.speed;

            // Update Ball Edges Info
            ball.edges();

            // Bounce ball off walls (and reposition to prevent clipping)
            if (ball.edge.left <= 0) { // Left wall
                ball.bounce("hor");
                ball.x_pos = ball.size/2;
            }
            if (ball.edge.right >= width) { // Right wall
                ball.bounce("hor");
                ball.x_pos = width - ball.size/2;
            }
            if (ball.edge.top <= 0) { // Ceiling
                ball.bounce("vert");
                ball.y_pos = ball.size/2;
            }

            // Castration
            if (ball.edge.top > height) {

                game.player.lives--;
                if (game.player.lives <= 0) {

                    game.restart();
                    setup();
                    return;

                }
                else {

                    game.paused = true;
                    ball.reset();
                    paddle.x_pos = width/2;

                }
                
            }

            // Bounce ball off paddle
            if (ball.x_pos >= paddle.x_pos - paddle.width/2 && 
                ball.x_pos <= paddle.x_pos + paddle.width/2 && 
                ball.y_pos >= paddle.y_pos - ball.size/2 &&
                ball.y_pos <= paddle.y_pos + ball.size/2
            )
            {

                var base_angle = 270;
                var max_offset = 75;

                var colCalc = (ball.x_pos - paddle.x_pos) / (paddle.width / 2);

                ball.direction = degreesToRadians(base_angle + (max_offset * colCalc), false);

            }

        }



        // Draw bricks
        var colOnFrame = false;
        var b_broken = 0;
        bricks.forEach(item => {

            // Create the brick if it hasn't been broken yet
            if (!item.break) {

                item.create();


                // Detect collision
                if (
                    !colOnFrame && !game.paused &&
                    ball.edge.right >= item.x_pos &&
                    ball.edge.left <= item.x_pos + item.width &&
                    ball.edge.bottom >= item.y_pos &&
                    ball.edge.top <= item.y_pos + item.height
                ) {
                    
                    // Calculate penetration depths
                    var penX = Math.min(
                        ball.edge.right - item.x_pos,            // Left
                        item.x_pos + item.width - ball.edge.left // Right
                    )
                    var penY = Math.min(
                        ball.edge.bottom - item.y_pos,           // Top
                        item.y_pos + item.height - ball.edge.top // Bottom
                    );

                    // Determine Collision type
                    var colType;
                    if (penX > penY) colType = "vert";
                    else if (penX < penY) colType = "hor";

                    // Execute collision
                    ball.bounce(colType);
                    ball.speedup();
                    item.break = true;
                    colOnFrame = true;
                    game.player.score += 10;

                }

            }
            else if (item.break) b_broken++;
        });

        // Move on to next level if all bricks are broken (not working)
        if (b_broken == bricks.length) {

            game.player.score += 1000;
            if (game.level.current != 3) game.paused = true;

            if (game.level.current < 3) game.level.current++;
            else if (game.level.current >= 3 && game.level.sub < 3) game.level.sub++;

            setup();
            return;
            
        }


        // Draw Text
        fill('white');
        textAlign(RIGHT);

        if (game.level.current == 3) text("Oneindig", width-[10, 20][game.size[2]], [10, 20][game.size[2]]);
        else text(`Level: ${game.level.current+1}`, width-[10, 20][game.size[2]], [10, 20][game.size[2]]);

        text(`Score: ${game.player.score}`, width-[10, 20][game.size[2]], [25, 50][game.size[2]]);
        text(`Lives: ${game.player.lives}`, width-[10, 20][game.size[2]], [40, 80][game.size[2]]);

        if (game.paused) {
            text("Gepauzeerd", width-[10, 20][game.size[2]], height-[10, 20][game.size[2]]);
        }

    }
    else {

        // START MENU
        textAlign(CENTER);
        fill('white');

        // Title & Subtitle
        textSize([25, 50][game.size[2]]);
        text("OFES Breakout", width/2, [50, 100][game.size[2]]);
        
        textSize([10, 20][game.size[2]]);
        text("Selecteer het level dat je wilt spelen.", width/2, [75, 150][game.size[2]]);

        // Level Options
        textSize([12, 24][game.size[2]]);
        strokeWeight(1);
        stroke("white");

        menuBoxes.forEach(box => {

            // Determine colour

            if (
                mouseX >= box.x_pos && mouseX <= box.x_pos + box.size[0] &&  // Mouse between horizontal edges
                mouseY >= box.y_pos && mouseY <= box.y_pos + box.size[1]     // Mouse between vertical edges
            ) {
                fill(50);
            } else {
                fill(0);
            }

            // Draw box
            rect(box.x_pos, box.y_pos, box.size[0], box.size[1]);

            // Write Text
            fill("white");
            text(box.label, box.x_pos + box.size[0]/2, box.y_pos + box.size[1]/2);
        });

        noStroke();

        // Display high score
        textAlign(RIGHT);
        text(`High Score: ${game.player.h_score}`, width-[10, 20][game.size[2]], [15, 30][game.size[2]]);
    }
}


// Change game screen size based on window size
function changeScreen() {

    if (window.innerWidth > 920) return [800, 600, 1];
    else return [400, 300, 0];
}

// Conditional Random Number Generator
function rng(range, rounded) {

    let number = Math.random() * range;
    if (rounded) number = Math.round(number);

    return number;
}

// Direction Logic Converter
function degreesToRadians(input, invert) {

    if (!invert) return input * (Math.PI / 180);
    else return input * (180 / Math.PI);
}



/* EVENT LISTENERS */

// Activate game when user clicks on canvas
function mousePressed() {

    if (!game.start) {

        for(let i=0; i < menuBoxes.length; i++) {

            if (
                mouseX >= menuBoxes[i].x_pos && mouseX <= menuBoxes[i].x_pos + menuBoxes[i].size[0] &&  // Mouse between horizontal edges
                mouseY >= menuBoxes[i].y_pos && mouseY <= menuBoxes[i].y_pos + menuBoxes[i].size[1]     // Mouse between vertical edges
            ) {
                game.level.current = i;
                game.start = true;
                setup();
            }
        }
    
    }
    else if (game.start && game.paused) game.paused = false;
}


// Adjust game window size dynamically
window.addEventListener("resize", function() {

    game.size = changeScreen();
    resizeCanvas(game.size[0], game.size[1]);

    game.start = false;
    game.paused = true;
    setup();
});


// Update key states on keydown and keyup
document.addEventListener("keydown", (event) => {
    if (game.start) keys[event.key] = true;
});

document.addEventListener("keyup", (event) => {
    if (game.start) keys[event.key] = false;
});



// Start the Game
setup();