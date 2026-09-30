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
// Логика панели одежды
const clothesBtn = document.getElementById('clothesBtn');
const appearancePanel = document.getElementById('appearancePanel');
const appearanceClose = document.getElementById('appearanceClose');
const playerChar = document.querySelector('.player-char');
const options = document.querySelectorAll('.appearance-option');

clothesBtn.addEventListener('click', () => {
    appearancePanel.classList.toggle('open');
});

appearanceClose.addEventListener('click', () => {
    appearancePanel.classList.remove('open');
});

options.forEach(option => {
    option.addEventListener('click', () => {
        // Меняем спрайт игрока
        playerChar.src = option.dataset.sprite;
        // Снимаем active со всех и ставим на выбранный
        options.forEach(o => o.classList.remove('active'));
        option.classList.add('active');
    });
});

const SOUND_PATH = 'assets/sounds/';

const sfx = {
    click: new Audio(SOUND_PATH + 'btn-click.mp3'),
    paper: new Audio(SOUND_PATH + 'ui-paper.mp3')
};
Object.values(sfx).forEach(a => a.preload = 'auto');

const music = new Audio(SOUND_PATH + 'lobby-music.mp3');
music.loop = true;
music.volume = 0.4; // громкость музыки от 0 до 1

// Звук эффекта (клон, чтобы быстрые нажатия не обрывали друг друга)
function playSfx(name) {
    const s = sfx[name].cloneNode();
    s.volume = 0.8;
    s.play().catch(() => {});
}

// Музыка: браузеры и Telegram запрещают автозапуск звука без действия игрока,
// поэтому пробуем сразу, а если не вышло, запускаем по первому касанию
function startMusic() {
    music.play().then(() => {
        document.removeEventListener('pointerdown', startMusic);
    }).catch(() => {});
}
startMusic();
document.addEventListener('pointerdown', startMusic);

// Звук на все кнопки: у кнопки одежды свой звук листка, у остальных обычный клик
document.addEventListener('click', (e) => {
    const btn = e.target.closest('button, .appearance-option');
    if (!btn) return;
    playSfx(btn.id === 'clothesBtn' ? 'paper' : 'click');
});

// Пауза музыки, когда игра свёрнута или ушла в фон
document.addEventListener('visibilitychange', () => {
    if (document.hidden) music.pause();
    else music.play().catch(() => {});
});
