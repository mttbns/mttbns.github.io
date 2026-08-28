function detectDarkMode() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const body = document.body;

    if (prefersDark) {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
    } else {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
    }
}

function extractYouTubeId(url) {
    // Gestisce: youtube.com, youtu.be, shorts
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/ // Solo l'ID
    ];

    for (let pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            return match[1];
        }
    }

    return null;
}

function loadVideo() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    const wrapper = document.getElementById('videoWrapper');
    const info = document.getElementById('info');

    if (!query) {
        info.innerHTML = '<p>Aggiungi <strong>?q=URL_VIDEO</strong> per caricare un video YouTube</p>';
        return;
    }

    // Decodifica l'URL se necessario
    let videoUrl = decodeURIComponent(query);

    const videoId = extractYouTubeId(videoUrl);

    if (!videoId) {
        wrapper.innerHTML = '<div class="error">URL YouTube non valido. Prova con:<br>• https://youtube.com/watch?v=ID<br>• https://youtu.be/ID<br>• https://youtube.com/shorts/ID<br>• Solo l\'ID video</div>';
        return;
    }

    // Usa youtube-nocookie.com per privacy
    const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;

    wrapper.innerHTML = `
        <iframe
            src="${embedUrl}"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen>
        </iframe>
    `;

    info.innerHTML = `<p>ID Video: <code>${videoId}</code></p>`;
}

// Ascolta i cambiamenti del tema del sistema
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', detectDarkMode);

// Carica il tema all'avvio
detectDarkMode();

// Carica il video quando la pagina è pronta
document.addEventListener('DOMContentLoaded', loadVideo);
