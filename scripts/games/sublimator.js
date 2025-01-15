"use strict";

// Theme: Methods of Destruction to sublimate the ice on Mars' poles
// 

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
    var gridSquareData = {};

}




// CLASSES

if (typeof gridSquareArray === "undefined") {

    var gridSquareArray = [];

    var GridSquare = class {

        constructor() {


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


    if (game.start) {

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

    }


    // Grid Squares Prep
    gridSquareData = {
        width: [][game.size[2]]
    }
}


// Adjust game window size dynamically
window.addEventListener("resize", function() {

    game.size = changeScreen();
    resizeCanvas(game.size[0], game.size[1]);

    game.start = false;
    setup();
});

// Start Game

// Stop Game