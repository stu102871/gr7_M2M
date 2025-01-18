"use strict";

// Theme: Methods of Destruction to sublimate the ice on Mars' poles


// GLOBAL VARIABLES

game = {
    start : false,

    size  : changeScreen(),

    player: {
        score     : 0,
        h_score   : h_scores.sublimator,
        merges    : 0,
        sublimated: 0
    },

    restart: function() {
    
        this.start = false;
    
        if (this.player.score > this.player.h_score) this.player.h_score = this.player.score;
        h_scores.sublimator = this.player.h_score;

        this.player.score = 0;
        this.player.merges = 0;
        this.player.sublimated = 0;
    
        // Bug fix
        keys = {};
    }
};

if (typeof starData === "undefined") {

    var starData = [];
    var poleData = [];

    var gridSquareData = {};

    var bombs = {
        image: [],
        name : ["Gunpowder", "Molotov", "Grenade", "C4", "Dynamite", "TNT", "Nuclear Bomb", "Thermonuclear Bomb"],
        value: [1, 4, 5, 10, 15, 50, 250, 1000]
    };

}




// CLASSES

if (typeof gridSquareArray === "undefined") {

    var gridSquareArray = [];

    var GridSquare = class {

        constructor(x_pos, y_pos) {

            this.x_pos  = x_pos;
            this.y_pos  = y_pos;

            this.edges  = {
                left  : x_pos,
                right : x_pos + gridSquareData.size,
                top   : y_pos,
                bottom: y_pos + gridSquareData.size
            }

            this.bomb = {
                filled: false,
                bombID: undefined
            }
        }

        bombChange(change, bombID) {

            switch (change) {
                case "add":
                    this.bomb.filled = true;
                    this.bomb.bombID = bombID;
                    break;
                case "merge":
                    this.bomb.filled = true;
                    this.bomb.bombID = bombID++;
                    break;
                case "remove":
                    this.bomb.filled = false;
                    this.bomb.bombID = undefined;
                    break;
                default:
                    break;
            }

            if (this.bomb.filled) undefined // Display Image
        }
    }

}




// FUNCTIONS

function setup() {

    // Create canvas
    let canvas = createCanvas(game.size[0], game.size[1]);
    canvas.parent("popupMain");
    background(0);
    
    noStroke();
    frameRate(75);


    // Reset Setup Arrays
    gridSquareArray = [];
    

    if (game.start) {// Grid Squares Prep

        gridSquareData = {
            size  : [40, 80][game.size[2]],
            sx_pos: undefined,
            sy_pos: undefined
        }
        gridSquareData.sx_pos = width/4 - gridSquareData.size/2;

    } else {

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

        // Background Mars Setup
        fill(255, 60, 0);
        circle(width*2, width*2, width/2, height-50);


        // Background Pole Setup
        poleData = [];

    }
}

function draw() {

    // Draw the background
    background(0);

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

    if (game.start) {

    }


    // Display Title
    fill('white');
    textSize([25, 50][game.size[2]]);
    textAlign(CENTER, CENTER);
    text("OFES Sublimator", width/2, [50, 100][game.size[2]]);
}




// EVENT LISTENERS

// Adjust game window size dynamically
window.addEventListener("resize", function() {

    game.size = changeScreen();
    resizeCanvas(game.size[0], game.size[1]);

    game.start = false;
    setup();
});




// Start Game
setup();