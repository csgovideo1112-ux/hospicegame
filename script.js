const tg = window.Telegram.WebApp;
tg.ready();

function activateFullscreen() {
    if (tg.requestFullscreen) {
        tg.requestFullscreen(); // Метод Mini Apps для скрытия рамок Telegram
    } else if (tg.expand) {
        tg.expand();
    }
    
    if (tg.requestOrientation) {
        tg.requestOrientation('landscape'); // Принудительный горизонтальный режим
    }
}

// Запускаем сразу при инициализации
activateFullscreen();

// Отслеживание ошибок, если полноэкранный режим заблокирован устройством
tg.onEvent('fullscreenFailed', (params) => {
    console.log("Полноэкранный режим не запустился:", params.error);
    tg.expand();
});

// Список картинок для фоновой предзагрузки в кэш (без блокировки экрана)
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

function preloadImagesBackground() {
    imagesToLoad.forEach((src) => {
        const img = new Image();
        // Срезаем жесткий кэш Телеграма на ПК с помощью метки времени
        img.src = src + '?v=' + new Date().getTime();
    });
}

// Вызов при полной загрузке структуры страницы
window.addEventListener('DOMContentLoaded', () => {
    activateFullscreen();
    preloadImagesBackground(); // Тихонько грузим ресурсы в фоне
});
