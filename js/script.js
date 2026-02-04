document.addEventListener("DOMContentLoaded", () => {

    const wrapper = document.querySelector('.img-quinta6');
    const thumb = wrapper.querySelector('.video-thumb');
    const video = wrapper.querySelector('video');
    const playPause = wrapper.querySelector('.play-pause');
    const progress = wrapper.querySelector('.progress');
    const progressBar = wrapper.querySelector('.progress-bar');
    const volume = wrapper.querySelector('.volume');
    const fullscreen = wrapper.querySelector('.fullscreen');
    const controls = wrapper.querySelector('.custom-controls');
    const videoText = document.querySelector('.video-text');

    let hideTimeout;
    let cursorTimeout;

    // --- Imposta icone Noto Emoji ---
    playPause.innerHTML = '<span style="font-family:Noto Emoji">▶</span>';

    const rewind = wrapper.querySelector('.rewind');
    const forward = wrapper.querySelector('.forward');
    rewind.innerHTML = '<span style="font-family:Noto Emoji">⏪</span>';
    forward.innerHTML = '<span style="font-family:Noto Emoji">⏩</span>';

    // --- Tempo ---
    const timeDisplay = wrapper.querySelector('.time');
    timeDisplay.textContent = '0:00 / 0:00';

    const formatTime = (time) => {
        const m = Math.floor(time / 60);
        const s = Math.floor(time % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // --- Mostra controlli ---
    const showControls = () => {
        controls.style.opacity = '1';
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            controls.style.opacity = '0';
        }, 2000);
    };

    // --- Risoluzione ---
    const resButton = wrapper.querySelector('.res-button');
    const resMenu = wrapper.querySelector('.res-menu');
    const resOptions = wrapper.querySelectorAll('.res-option');

    resButton.addEventListener('click', (e) => {
        resMenu.classList.toggle('hidden');
        e.stopPropagation();
    });

    document.addEventListener('click', () => {
        resMenu.classList.add('hidden');
    });

    resOptions.forEach(option => {
        option.addEventListener('click', () => {
            const currentTime = video.currentTime;
            const isPaused = video.paused;
            const newSrc = option.dataset.src;

            video.src = newSrc;
            video.load();
            video.currentTime = currentTime;
            if (!isPaused) video.play();

            resMenu.classList.add('hidden');
        });
    });

    // --- Click copertina ---
    thumb.addEventListener('click', () => {
        thumb.style.display = 'none';
        video.play();
        playPause.innerHTML = '<span style="font-family:Noto Emoji">⏸</span>';
        showControls();
    });

    // --- Play / Pause ---
    playPause.addEventListener('click', () => {
        if (thumb.style.display !== 'none') thumb.style.display = 'none';

        if (video.paused) {
            video.play();
            playPause.innerHTML = '<span style="font-family:Noto Emoji">⏸</span>';
        } else {
            video.pause();
            playPause.innerHTML = '<span style="font-family:Noto Emoji">▶</span>';
        }
        showControls();
    });

    // --- Avanti / Indietro ---
    rewind.addEventListener('click', () => {
        video.currentTime -= 5;
        showControls();
    });

    forward.addEventListener('click', () => {
        video.currentTime += 5;
        showControls();
    });

    // --- Progresso ---
    video.addEventListener('timeupdate', () => {
        progress.style.width = (video.currentTime / video.duration) * 100 + '%';
        timeDisplay.textContent =
            `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    });

    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        video.currentTime =
            ((e.clientX - rect.left) / rect.width) * video.duration;
        showControls();
    });

    // --- Volume ---
    volume.addEventListener('input', () => {
        video.volume = volume.value;
        showControls();
    });

    // --- Fullscreen ---
    fullscreen.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            wrapper.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });

    // --- Gestione fullscreen ---
    document.addEventListener('fullscreenchange', () => {

        if (document.fullscreenElement === wrapper) {

            wrapper.style.position = 'fixed';
            wrapper.style.top = '0';
            wrapper.style.right = '10';
            wrapper.style.width = '70vw';
            wrapper.style.height = '70vh';
            wrapper.style.padding = '0';
            wrapper.style.borderRadius = '0';

            video.style.width = '91vw';
            video.style.height = '92vh';
            video.style.transform = 'scale(1.1)';
			video.style.position = 'relative';
            video.style.right = '-4vw';
			video.style.marginTop = '4vh';

            thumb.style.width = '96vw';
            thumb.style.height = '96vh';
            thumb.style.transform = 'scale(1.1)';

            videoText.style.display = 'none';

            document.body.style.cursor = 'default';
            wrapper.addEventListener('mousemove', resetCursorTimer);
            startCursorTimer();

        } else {

            wrapper.style.position = 'absolute';
            wrapper.style.top = '13700px';
            wrapper.style.right = '69px';
            wrapper.style.width = '889px';
            wrapper.style.height = '460px';
            wrapper.style.padding = '10px';
            wrapper.style.borderRadius = '15px';

            video.style.width = '889px';
            video.style.height = '460px';
            video.style.transform = 'scale(1)';
			 video.style.right = '-0vw';
			video.style.marginTop = '0vh';

            thumb.style.width = '889px';
            thumb.style.height = '460px';
            thumb.style.transform = 'scale(1)';

            videoText.style.display = 'block';

            document.body.style.cursor = 'default';
            clearTimeout(cursorTimeout);
            wrapper.removeEventListener('mousemove', resetCursorTimer);
        }
    });

    // --- Mouse ---
    wrapper.addEventListener('mousemove', showControls);

    // --- Tastiera ---
    document.addEventListener('keydown', (e) => {
        if (document.fullscreenElement === wrapper) {
            if (e.key === 'p' || e.key === 'P') playPause.click();
            if (e.key === 'ArrowLeft') video.currentTime -= 5;
            if (e.key === 'ArrowRight') video.currentTime += 5;
        }
    });

    showControls();

    // --- Cursor ---
    function startCursorTimer() {
        clearTimeout(cursorTimeout);
        cursorTimeout = setTimeout(() => {
            document.body.style.cursor = 'none';
        }, 2000);
    }

    function resetCursorTimer() {
        document.body.style.cursor = 'default';
        startCursorTimer();
    }
});
