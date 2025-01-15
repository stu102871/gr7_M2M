const seriesTrailers = {

};

const gameImgs = document.querySelectorAll('.photoBox img');
const gamePopup = document.getElementById('gamePopup');
const closeButton = document.querySelector('.close-button');
const popupMain = document.getElementById('popupMain');

gameImgs.forEach((img) => {
    img.addEventListener('click', () => {
        const imgTitle = img.alt;
        const musicFile = musicTracks[imgTitle];

        gamePopup.style.display = 'flex';

        const titleElement = document.createElement('h2');
        titleElement.innerText = imgTitle;
        titleElement.style.color = '#fff';

        const popupImage = document.createElement('img');
        popupImage.src = img.src;
        popupImage.alt = img.alt;
        popupImage.style.maxWidth = '500px';
        popupImage.style.marginBottom = '20px';
        popupImage.style.borderRadius = '10px';

        popupMain.innerHTML = '';
        popupMain.appendChild(popupImage);
        popupMain.appendChild(titleElement);

        if (musicFile) {
            const audioElement = document.createElement('audio');
            audioElement.src = musicFile;
            audioElement.controls = true;
            audioElement.style.width = '90%';
            audioElement.style.marginTop = '20px';
            popupMain.appendChild(audioElement);
        } else {
            const noMusicMessage = document.createElement('p');
            noMusicMessage.innerText = "Geen muziek beschikbaar voor " + imgTitle + ".";
            noMusicMessage.style.color = 'red';
            noMusicMessage.style.fontWeight = 'bold';
            popupMain.appendChild(noMusicMessage);
        }
    });
});

closeButton.addEventListener('click', () => {
    gamePopup.style.display = 'none';
});

gamePopup.addEventListener('click', (event) => {
    if (event.target.id === 'gamePopup') {
        gamePopup.style.display = 'none';
    }
});
