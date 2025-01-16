"use strict";


// Variable Prep

const games = 
[
    {
        id    : 1,
        title : "Breakout",
        info  : 
            `Dit is onze eigen variatie op het iconische retro-spel Breakout! <br/>
            In dit spel bestuur je een paddle waarmee je een bal richting breekbare blokken slaat. Het doel is simpel: Breek alle blokken om te winnen! <br/>
            Het spel heeft 3 levels. Elk level wordt net iets moeilijker om te voltooien. Kan jij alle levels verslaan? <br/>
            Als je een grotere uitdaging wilt, probeer dan de oneindig-modus waar je zo lang mogelijk door de levels kan blijven gaan totdat je 3 levens op zijn. Het zal steeds moeilijker worden om deze bal onder controle te houden door het gebrek aan een snelheidslimiet. <br/><br/>
            
            Het originele Breakout werd ontwikkeld door Atari, met medewerking van Steve Wozniak en Steve Jobs, en verscheen voor het eerst op arcade-machines op 13 mei, 1976. <br/>
            Het spel werd al snel een klassieker en inspireerde talloze varianten op verschillende platforms. Met eenvoudige maar verslavende gameplay werd Breakout een mijlpaal in de geschiedenis van videogames en blijft het tot op de dag van vandaag een absolute klassieker!`,
        img   : "breakout" // Moet nog worden toegevoegd
    },
    {
        id   : 2,
        title: "Sublimator",
        info : "Merge Game",
        img  : "sublimator"
    }
];
document.getElementById("gTotal").innerHTML = games.length;
let cGame = 0;

const selectBox = {
    index: document.getElementById("gIndex"),
    arrow: [document.getElementById("arrowUp"), document.getElementById("arrowDown")]
};

const gameOutput = {
    title : document.getElementById("gameTitle"),
    info  : document.getElementById("gameInfo"),
    img   : document.getElementById("gameImg"),
    script: undefined,

    // Display selected game info
    write : function() {

        this.title.innerHTML = `OFES ${games[cGame].title}`;
        this.info.innerHTML  = games[cGame].info;
        this.img.src         = `../media/images/recreatie/games/${games[cGame].img}.png`;

        selectBox.index.innerHTML = games[cGame].id;
    },
    
    loadScript  : function() {

        this.script = document.createElement("script");
        this.script.src = `../scripts/games/${games[cGame].img}.js`;
        this.script.type = 'text/javascript';
        this.script.async = true;

        document.body.appendChild(this.script);
    },
    unloadScript: function() {

        // Reset the game that is being terminated (the variables of the game remain active because they're cluttering up the global scope. This would be too time consuming to fix properly, so now I use it as an excuse to save high scores between play sessions)
        if (typeof game !== undefined) game.restart();

        this.script.remove();
        this.script = undefined;
    }
};

const popup = {
    element : document.getElementById("gamePopup"),
    content : document.getElementById("popupMain"),
    closeBtn: document.getElementById("popupClose"),

    controls: {
        arrows    : document.getElementsByClassName("popupArrows"),

        activate  : function(type) {

            type.forEach(item => {
                
                switch (item) {

                    case "arrows": this.arrows.forEach(arrow => arrow.style.display = "unset"); break;
                    default      : break;
                }
            });
        },
        deactivate: function() {

            this.arrows.forEach(arrow => arrow.style.display = "none");
        }
    },

    script  : undefined,
    loaded  : false,

    load    : function() {

        if (!this.loaded) {

            this.element.style.display = "flex";

            gameOutput.loadScript();
            this.loaded = true;
        
        }
    },
    unload  : function() {

        if (this.loaded) {

            this.element.style.display = "none";
            this.content.innerHTML = "";

            gameOutput.unloadScript();
            this.loaded = false;

        }
    }
};

// Prepare global Game Objects
let game = {};

let h_scores = {
    breakout  : 0,
    sublimator: 0
}




// Functions

function selector(next) {

    if (!popup.loaded) {

        if (next && cGame > 0) cGame--;
        else if (!next && cGame < games.length-1) cGame++;

        gameOutput.write();

    }
}

// Prepare p5 functions for future use
function setup() {}
function draw() {}

// Change game screen size based on window size
function changeScreen() {

    // Ternary Operator
    return (window.innerWidth > 920) ? [800, 600, 1] : [400, 300, 0]; 

    // Standard IF Statement Notation
    // if (window.innerWidth > 920) return [800, 600, 1];
    // else return [400, 300, 0];
}

// Conditional Random Number Generator
function rng(range, rounded) {

    let number = Math.random() * range;
    if (rounded) number = Math.round(number);

    return number;
}

// Direction Logic Converter
function degreesToRadians(input, invert) {

    // Ternary Operator
    return (!invert) ? input * (Math.PI / 180) : input * (180 / Math.PI);

    // Standard IF Statement Notation
    // if (!invert) return input * (Math.PI / 180);
    // else return input * (180 / Math.PI);
}




// Event Listeners

// Select through games
selectBox.arrow[0].addEventListener("click", () => selector(true));
selectBox.arrow[1].addEventListener("click", () => selector(false));

document.addEventListener("keydown", (event) => {

    if (event.key == "ArrowUp") selector(true);
    else if (event.key == "ArrowDown") selector(false);
});

// Start the game
gameOutput.img.addEventListener("click", () => popup.load());

// Close the game
popup.closeBtn.addEventListener("click", () => popup.unload());
popup.element.addEventListener("click", (event) => {

    if (event.target === popup.element) popup.unload();
})


      

// Display first game
gameOutput.write();