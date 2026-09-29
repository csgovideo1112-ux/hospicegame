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

// Добавляем отслеживание ошибок, если полноэкранный режим заблокирован устройством
tg.onEvent('fullscreenFailed', (params) => {
    console.log("Полноэкранный режим не запустился:", params.error);
    tg.expand();
});

// Список картинок для предзагрузки
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

function preloadImages() {
    const progressText = document.getElementById('progress');
    
    if (imagesToLoad.length === 0) {
        showLobby();
        return;
    }
    
    imagesToLoad.forEach((src) => {
        const img = new Image();
        
        img.onload = () => {
            imageLoaded(progressText);
        };
        
        img.onerror = () => {
            console.warn(`Файл не найден на GitHub Pages: ${src}`);
            imageLoaded(progressText); // Пропускаем ошибку, чтобы игра не висла на 0%
        };
        
        // Срезаем жесткий кэш Телеграма на ПК с помощью метки времени
        img.src = src + '?v=' + new Date().getTime();
    });
}

function imageLoaded(progressText) {
    loadedCount++;
    const percentage = Math.floor((loadedCount / imagesToLoad.length) * 100);
    
    if (progressText) {
        progressText.innerText = `${percentage}%`;
    }
    
    if (loadedCount === imagesToLoad.length) {
        setTimeout(() => { 
            showLobby(); 
        }, 600);
    }
}

function showLobby() {
    const preloader = document.getElementById('preloader');
    const lobby = document.getElementById('lobby');
    
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
            if (lobby) {
                lobby.classList.remove('hidden');
                lobby.style.opacity = '1';
            }
        }, 500);
    }
}

// Корректный вызов при полной загрузке структуры страницы
window.addEventListener('DOMContentLoaded', () => {
    activateFullscreen(); // Исправлено название функции!
    preloadImages();
});
