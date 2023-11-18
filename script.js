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
const musicButton = document.getElementById('music-button');
const loopMusicButton = document.getElementById('loop-music-button');

//Mutáveis
let maxVideoIndex = 76;
let currentVideoIndex = 1;
const maxMusicIndex = 25;

// Variáveis
let randomHistory = [];
const audioPlayer = new Audio();
let currentMusicIndex = getRandomIndex(1, maxMusicIndex);
let isMusicLoopActive = false; // Flag para controlar o loop da música
audioPlayer.volume = 0.15; // Defina o volume inicial para 15%
let shuffledMusicQueue = [];
let isLoopActive = false;
let isRandomActive = false; // Desative a reprodução aleatória por padrão
let videoQueue = [...Array(maxVideoIndex).keys()].map(i => i + 1);

// Função para gerar um índice aleatório entre min e max
function getRandomIndex(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Função para embaralhar o array de músicas
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Função para carregar e reproduzir a próxima música
function playNextMusic() {
    if (shuffledMusicQueue.length === 0) {
        // Se a fila estiver vazia, reembaralhe
        shuffledMusicQueue = [...Array(maxMusicIndex).keys()].map(i => i + 1);
        shuffleArray(shuffledMusicQueue);
    }

    const nextMusicIndex = shuffledMusicQueue.pop();
    currentMusicIndex = nextMusicIndex;

    audioPlayer.src = `musicas/musica${currentMusicIndex}.mp3`;
    audioPlayer.load();
    audioPlayer.play();

    audioPlayer.addEventListener('ended', () => {
        // Ao terminar uma música, verifica se o loop está ativado
        if (isMusicLoopActive) {
            // Se o loop estiver ativado, reinicia a mesma música
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        } else {
            // Se não, passa para a próxima música na sequência
            playNextMusic();
        }
    });
}

musicButton.addEventListener('click', () => {
    if (audioPlayer.paused) {
        // Se a música estiver pausada, inicie a reprodução
        if (!currentMusicIndex) {
            // Gere um índice aleatório se ainda não existir um
            currentMusicIndex = getRandomIndex(1, maxMusicIndex);
        }
        playNextMusic();
        musicButton.classList.add('active-loop'); // Adicione a classe para mudar a cor
    } else {
        // Se a música estiver tocando, pause
        audioPlayer.pause();
        musicButton.classList.remove('active-loop'); // Remova a classe para voltar à cor padrão
    }
});

// Event Listener para o botão de loop da música
loopMusicButton.addEventListener('click', () => {
    isMusicLoopActive = !isMusicLoopActive; // Alterna entre loop ativado/desativado

    if (isMusicLoopActive) {
        loopMusicButton.classList.add('active-loop'); // Adicione a classe para mudar a cor
    } else {
        loopMusicButton.classList.remove('active-loop'); // Remova a classe para voltar à cor padrão
    }
});


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

// Carregar musica inicial
playNextMusic();