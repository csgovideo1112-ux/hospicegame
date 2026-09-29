const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

if (tg.requestOrientation) {
    tg.requestOrientation('landscape');
}

const imagesToLoad = [
    'assets/bg/loading.webp',
    'assets/bg/lobby-bg.webp',
    'assets/sprites/player/p-cut1.webp',
    'assets/sprites/player/p-default.webp',
    'assets/sprites/player/p-short.webp',
    'assets/ui/bg-ui.webp',
    'assets/ui/clothes-active.webp',
    'assets/ui/clothes.webp'
];

let loadedCount = 0;
const progressText = document.getElementById('progress');
const preloader = document.getElementById('preloader');
const lobby = document.getElementById('lobby');

function preloadImages() {
    if (imagesToLoad.length === 0) {
        showLobby();
        return;
    }

    imagesToLoad.forEach((src) => {
        const img = new Image();
        img.src = src;
        
        img.onload = imageLoaded;
        img.onerror = imageLoaded;
    });
}

function imageLoaded() {
    loadedCount++;
    const percentage = Math.floor((loadedCount / imagesToLoad.length) * 100);
    progressText.innerText = `${percentage}%`;

    if (loadedCount === imagesToLoad.length) {
        setTimeout(() => {
            showLobby();
        }, 600); 
    }
}

function showLobby() {
    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';
        lobby.classList.remove('hidden');
        lobby.style.opacity = '1';
    }, 500);
}

window.addEventListener('DOMContentLoaded', preloadImages);
