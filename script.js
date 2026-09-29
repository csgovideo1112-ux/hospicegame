const tg = window.Telegram.WebApp;
tg.ready();

function activateFullscreen() {
    tg.expand();

    if (tg.isVersionAtLeast('8.0')) {
        if (!tg.isFullscreen) tg.requestFullscreen();
        tg.lockOrientation(); // фиксирует текущую ориентацию
    }
    if (tg.isVersionAtLeast('7.7')) {
        tg.disableVerticalSwipes(); // чтобы свайп вниз не закрывал игру
    }
}

activateFullscreen();

tg.onEvent('fullscreenFailed', (params) => {
    console.log("Fullscreen не запустился:", params.error);
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
    preloadImagesBackground(); // Тихонько грузим ресурсы в фоне
});
