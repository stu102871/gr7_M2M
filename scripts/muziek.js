const musicTracks = {
    "Boef": "../../media/music/Littekens.mp3",
    "Lady gaga": "../../media/music/Lady Gaga - Bloody Mary (Official Audio).mp3",
    "Katy Eerry": "../../media/music/Katy Perry - I Kissed A Girl (Official Music Video).mp3",
    "Billie Eilish": "../../media/music/Billie Eilish, Khalid - lovely.mp3",
    "Kendrick Lamar": "../../media/music/Kendrick Lamar - Not Like Us.mp3",
    "Shakira": "../../media/music/Shakira - Hips Don't Lie (Official 4K Video) ft. Wyclef Jean.mp3",
    "Beyonce": "../../media/music/Beyoncé - Halo.mp3",
    "Rihanna": "../../media/music/Rihanna - Umbrella (Orange Version) (Official Music Video) ft. JAY-Z.mp3",
    "The Weekend": "../../media/music/The Weeknd - Blinding Lights (Official Video).mp3",
    "Ariana Grande": "../../media/music/Ariana Grande - 7 rings (Official Video).mp3"
};

// Haal de elementen op
const gameImgs = document.querySelectorAll('.photoBox img'); // Alle afbeeldingen in de grid
const gamePopup = document.getElementById('gamePopup');
const closeButton = document.querySelector('.close-button');
const popupMain = document.getElementById('popupMain');

// Voeg een event listener toe aan elke afbeelding
gameImgs.forEach((img) => {
    img.addEventListener('click', () => {
        // Haal de alt-tekst van de afbeelding op
        const imgTitle = img.alt;

        // Vind het juiste muziekbestand
        const musicFile = musicTracks[imgTitle];

        // Toon de pop-up
        gamePopup.style.display = 'flex';

        // Maak een dynamisch HTML-element voor de inhoud
        const titleElement = document.createElement('h2');
        titleElement.innerText = imgTitle; // De titel van de afbeelding

        const descriptionElement = document.createElement('p');
        descriptionElement.innerText = "Hier is muziek van " + imgTitle + ".";

        // Maak een dynamisch HTML-element voor de afbeelding die je wilt tonen in de pop-up
        const popupImage = document.createElement('img');
        popupImage.src = img.src; // Hetzelfde src als de afbeelding waarop is geklikt
        popupImage.alt = img.alt; // Dezelfde alt-tekst voor beschrijvingen
        popupImage.style.maxWidth = '500px'; // Pas de grootte van de afbeelding in de pop-up aan
        popupImage.style.marginBottom = '20px'; // Voeg wat marge toe onder de afbeelding

        // Controleer of er een muziekbestand beschikbaar is
        popupMain.innerHTML = ''; // Leeg de pop-up voor nieuwe inhoud
        popupMain.appendChild(popupImage); // Voeg de afbeelding toe
        popupMain.appendChild(titleElement); // Voeg de titel toe
        popupMain.appendChild(descriptionElement); // Voeg de beschrijving toe

        if (musicFile) {
            // Voeg een <audio>-element toe met een muziekcontroller
            const audioElement = document.createElement('audio');
            audioElement.src = musicFile; // Dynamisch muziekbestand laden
            audioElement.controls = true; // Zorg voor een muziekbalk
            audioElement.style.marginTop = '20px'; // Voeg wat marge toe boven de audio-element
            audioElement.style.width = '100%'; // Zorg dat de audio-element goed uitlijnt in de pop-up
            popupMain.appendChild(audioElement); // Voeg de audio-element toe
        } else {
            // Toon een melding als er geen muziek beschikbaar is
            const noMusicMessage = document.createElement('p');
            noMusicMessage.innerText = "Geen muziek beschikbaar voor " + imgTitle + ".";
            noMusicMessage.style.color = 'red';
            popupMain.appendChild(noMusicMessage);
        }
    });
});

// Sluit de pop-up wanneer de sluitknop wordt geklikt
closeButton.addEventListener('click', () => {
    gamePopup.style.display = 'none';
});

// Sluit de pop-up wanneer je buiten de inhoud van de pop-up klikt
gamePopup.addEventListener('click', (event) => {
    if (event.target === gamePopup) {
        gamePopup.style.display = 'none';
    }
});
