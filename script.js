const tg = window.Telegram.WebApp;
tg.ready();

function activateFullscreen() {
    if (tg.requestFullscreen) {
        tg.requestFullscreen(); // Метод Mini Apps 2.0 для скрытия всех рамок Telegram
    } else if (tg.expand) {
        tg.expand();
    }
    
    if (tg.requestOrientation) {
        tg.requestOrientation('landscape'); // Принудительный горизонтальный режим
    }
}

// Запускаем сразу при инициализации
activateFullscreen();


// На всякий случай дублируем при полной загрузке DOM
window.addEventListener('DOMContentLoaded', () => {
    initFullscreenGame();
    preloadImages(); // Ваша функция загрузки картинок, которая была в прошлом скрипте
});

// Добавляем отслеживание ошибок, если полноэкранный режим заблокирован устройством
tg.onEvent('fullscreenFailed', (params) => {
    console.log("Полноэкранный режим не запустился:", params.error);
    // В случае неудачи всё равно пробуем просто растянуть приложение
    tg.expand();
});


// --- Дальше идет ваш остальной неизмененный код (список картинок и логика прелоадера) ---
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
        setTimeout(() => { showLobby(); }, 600);
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
