const videoPlayer = document.getElementById('video-player');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const randomButton = document.getElementById('random-button');
const loopButton = document.getElementById('loop-button');
const videoSearchInput = document.getElementById('video-search');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');
const videoNameElement = document.getElementById('video-name');
let currentVideoIndex = 1;
let maxVideoIndex = 76;
let isLoopActive = false;
let isRandomActive = false; // Desative a reprodução aleatória por padrão
let videoQueue = [...Array(maxVideoIndex).keys()].map(i => i + 1);

function loadVideo(index) {
    videoPlayer.src = `videos/video${index}.mp4`;
    videoPlayer.load();
    videoPlayer.play();
}

prevButton.addEventListener('click', () => {
    if (currentVideoIndex > 1) {
        currentVideoIndex--;
        loadVideo(currentVideoIndex);
    }
});

nextButton.addEventListener('click', () => {
    if (currentVideoIndex < maxVideoIndex) {
        currentVideoIndex++;
        loadVideo(currentVideoIndex);
    }
});

randomButton.addEventListener('click', () => {
    isRandomActive = !isRandomActive; // Alterne entre aleatório ativado/desativado

    if (isRandomActive) {
        randomButton.classList.add('active-random');
    } else {
        randomButton.classList.remove('active-random');
    }
});

function getRandomVideo() {
    if (videoQueue.length === 0) {
        videoQueue = [...Array(maxVideoIndex).keys()].map(i => i + 1);
    }

    const randomIndex = Math.floor(Math.random() * videoQueue.length);
    currentVideoIndex = videoQueue[randomIndex];
    videoQueue.splice(randomIndex, 1);
    loadVideo(currentVideoIndex);
}

loopButton.addEventListener('click', () => {
    isLoopActive = !isLoopActive;

    if (isLoopActive) {
        videoPlayer.loop = true;
        loopButton.classList.add('active-loop');
    } else {
        videoPlayer.loop = false;
        loopButton.classList.remove('active-loop');
    }
});

videoSearchInput.addEventListener('input', () => {
    searchButton.disabled = videoSearchInput.value === '';
});

searchButton.addEventListener('click', () => {
    const searchNumber = parseInt(videoSearchInput.value);
    if (!isNaN(searchNumber) && searchNumber >= 1 && searchNumber <= maxVideoIndex) {
        loadVideo(searchNumber);
    } else {
        showSearchResults();
        setTimeout(() => {
            hideSearchResults();
        }, 5000);
    }
});

function hideSearchResults() {
    resultsContainer.style.display = 'none';
}

function showSearchResults() {
    resultsContainer.style.display = 'block';
    const searchNumber = parseInt(videoSearchInput.value);
    const results = [];

    if (!isNaN(searchNumber) && searchNumber >= 1 && searchNumber <= maxVideoIndex) {
        results.push(searchNumber);
    } else {
        resultsContainer.innerHTML = '<p>No result found</p>';
        return;
    }

    const resultsList = document.createElement('ul');
    results.forEach((result) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Vídeo ${result}`;
        resultsList.appendChild(listItem);
    });

    resultsContainer.innerHTML = '';
    resultsContainer.appendChild(resultsList);
}

videoPlayer.addEventListener('ended', () => {
    if (isRandomActive) {
        getRandomVideo();
    } else {
        if (currentVideoIndex < maxVideoIndex) {
            currentVideoIndex++;
            loadVideo(currentVideoIndex);
        } else {
            // Se atingir o último vídeo, retorne ao primeiro
            currentVideoIndex = 1;
            loadVideo(currentVideoIndex);
        }
    }
});

loadVideo(currentVideoIndex);
