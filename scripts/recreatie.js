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
    script: document.getElementById("gameScript"),

    // Display selected game info
    write: function() {

        this.title.innerHTML = `OFES ${games[cGame].title}`;
        this.info.innerHTML  = games[cGame].info;
        this.img.src         = `../images/recreatie/games/${games[cGame].img}`;

        selectBox.index.innerHTML = cGame+1;
    }
};

const popup = {
    element : document.getElementById("gamePopup"),
    content : document.getElementById("popupMain"),
    title   : document.getElementById("popupTitle"),
    closeBtn: document.getElementById("popupClose"),

    loaded  : false,

    load  : function() {

        if (!this.loaded) {

            this.element.style.display = "flex";
            this.title.innerHTML = `OFES ${games[cGame].title}`;

            gameOutput.script.src = `games/${games[cGame].img}`;

            this.loaded = true;
        
        }
    },
    unload: function() {

        if (this.loaded) {

            this.element.style.display = "none";
            this.title.innerHTML = "";
            this.content.innerHTML = "";

            gameOutput.script.src = "";

            this.loaded = false;

        }
    }
};




// Functions

function selector(next) {

    if (!popup.loaded) {

        if (next && cGame > 0) cGame--;
        else if (!next && cGame < games.length-1) cGame++;

        gameOutput.write();

    }
}




// Event Listeners

// Select through games
selectBox.arrow[0].addEventListener("click", () => selector(false));
selectBox.arrow[1].addEventListener("click", () => selector(true));

document.addEventListener("keypress", (event) => {

    if (event.key == "ArrowUp") selector(false);
    else if (event.key == "ArrowDown") selector(true);
});

// Start the game
gameOutput.img.addEventListener("click", () => popup.load());

// Close the game
popup.closeBtn.addEventListener("click", () => popup.unload());



// Display first game
gameOutput.write();