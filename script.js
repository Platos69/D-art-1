// Obtendo elementos do DOM
const videoPlayer = document.getElementById('video-player');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const randomButton = document.getElementById('random-button');
const loopButton = document.getElementById('loop-button');
const videoSearchInput = document.getElementById('video-search');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');
const videoNameElement = document.getElementById('video-name');

// Variáveis
let currentVideoIndex = 1;
let randomHistory = [];
let maxVideoIndex = 76;
let isLoopActive = false;
let isRandomActive = false; // Desative a reprodução aleatória por padrão
let videoQueue = [...Array(maxVideoIndex).keys()].map(i => i + 1);

// Função para carregar um vídeo
function loadVideo(index) {
    videoPlayer.src = `videos/video${index}.mp4`;
    videoPlayer.load();
    videoPlayer.play();
    videoNameElement.textContent = `Video ${index}`;
}

// Event Listener para o botão Anterior
prevButton.addEventListener('click', () => {
    if (isRandomActive) {
        if (randomHistory.length > 1) {
            randomHistory.pop(); // Remove o vídeo atual
            currentVideoIndex = randomHistory.pop(); // Obtém o vídeo anterior
            loadVideo(currentVideoIndex);
        }
    } else {
        if (currentVideoIndex > 1) {
            currentVideoIndex--;
            loadVideo(currentVideoIndex);
        }
    }
});

// Event Listener para o botão Próximo
nextButton.addEventListener('click', () => {
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

// Event Listener para o botão Aleatório
randomButton.addEventListener('click', () => {
    isRandomActive = !isRandomActive; // Alterne entre aleatório ativado/desativado

    if (isRandomActive) {
        randomButton.classList.add('active-random');
    } else {
        randomButton.classList.remove('active-random');
    }
});

// Função para obter o próximo vídeo aleatório
function getRandomVideo() {
    if (videoQueue.length === 0) {
        videoQueue = [...Array(maxVideoIndex).keys()].map(i => i + 1);
    }

    const randomIndex = Math.floor(Math.random() * videoQueue.length);
    currentVideoIndex = videoQueue[randomIndex];
    videoQueue.splice(randomIndex, 1);

    // Adiciona o vídeo atual ao histórico
    randomHistory.push(currentVideoIndex);

    loadVideo(currentVideoIndex);
}

// Event Listener para o botão de Loop
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

// Event Listener para a entrada na caixa de pesquisa
videoSearchInput.addEventListener('input', () => {
    searchButton.disabled = videoSearchInput.value === '';
});

// Event Listener para pressionar a tecla Enter na caixa de pesquisa
videoSearchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Evita a submissão do formulário padrão
        performSearch();
    }
});

// Event Listener para o botão de Pesquisa
searchButton.addEventListener('click', () => {
    performSearch();
});

// Função para realizar a pesquisa
function performSearch() {
    const searchNumber = parseInt(videoSearchInput.value);
    if (!isNaN(searchNumber) && searchNumber >= 1 && searchNumber <= maxVideoIndex) {
        loadVideo(searchNumber);
    } else {
        showSearchResults();
        setTimeout(() => {
            hideSearchResults();
        }, 5000);
    }
}

// Função para ocultar os resultados da pesquisa
function hideSearchResults() {
    resultsContainer.style.display = 'none';
}

// Função para exibir os resultados da pesquisa
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

// Event Listener para o término do vídeo
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

// Carregar o vídeo inicial
loadVideo(currentVideoIndex);
