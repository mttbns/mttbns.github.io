const pasteBtn = document.getElementById('pasteBtn');
const loadBtn = document.getElementById('loadBtn');
const clearBtn = document.getElementById('clearBtn');

const urlInput = document.getElementById('urlInput');
const statusEl = document.getElementById('status');
const player = document.getElementById('player');
const videoBox = document.getElementById('videoBox');

function setStatus(msg, isError=false){
    statusEl.innerHTML = isError
    ? `<strong class="error">Error:</strong> ${msg}`
    : `<strong>Info:</strong> ${msg}`;
}

function normalizeYoutubeUrl(url) {
    try { return new URL(url.trim()); } catch { return null; }
}

// Returns { embedUrl, isShort } or null
function youtubeToEmbed(inputUrl) {
    const u = normalizeYoutubeUrl(inputUrl);
    if (!u) return null;

    const host = u.hostname.replace(/^www\./, '');
    const isYouTube =
    host === 'youtube.com' ||
    host === 'm.youtube.com' ||
    host === 'youtube-nocookie.com' ||
    host === 'youtu.be';

    if (!isYouTube) return null;

    if (host === 'youtu.be') {
    const id = u.pathname.split('/').filter(Boolean)[0];
    if (!id) return null;
    return { embedUrl: `https://www.youtube-nocookie.com/embed/${id}`, isShort: false };
    }

    if (u.pathname === '/watch') {
    const id = u.searchParams.get('v');
    if (!id) return null;
    return { embedUrl: `https://www.youtube-nocookie.com/embed/${id}`, isShort: false };
    }

    if (u.pathname.startsWith('/shorts/')) {
    const parts = u.pathname.split('/').filter(Boolean); // ['shorts','<id>']
    const id = parts[1];
    if (!id) return null;
    return { embedUrl: `https://www.youtube-nocookie.com/embed/${id}`, isShort: true };
    }

    // Generic fallback for /embed/<id>
    const embedMatch = u.pathname.match(/\/embed\/([^/?#]+)/);
    if (embedMatch?.[1]) {
    return {
        embedUrl: `https://www.youtube-nocookie.com/embed/${embedMatch[1]}`,
        isShort: u.pathname.includes('/shorts/')
    };
    }

    return null;
}

async function getClipboardText() {
    if (!navigator.clipboard?.readText) throw new Error('Clipboard not supported by this browser.');
    return await navigator.clipboard.readText();
}

function loadFromUrl(raw) {
    const result = youtubeToEmbed(raw);
    if (!result) {
    setStatus('Link not recognized as a YouTube URL.', true);
    return;
    }
    videoBox.classList.toggle('is-short', !!result.isShort);
    // No autoplay params => tap-to-play is used by the browser UI.
    player.src = result.embedUrl;
    setStatus('Loaded. Tap the video to play.');
}

loadBtn.addEventListener('click', () => {
    const raw = urlInput.value;
    if (!raw || !raw.trim()) {
    setStatus('Please enter a YouTube URL.', true);
    return;
    }
    loadFromUrl(raw);
});

clearBtn.addEventListener('click', () => {
    urlInput.value = '';
    videoBox.classList.remove('is-short');
    player.src = 'about:blank';
    setStatus('Cleared.');
});

pasteBtn.addEventListener('click', async () => {
    try {
    setStatus('Reading clipboard...');
    const text = await getClipboardText();
    if (!text) throw new Error('Clipboard is empty.');
    urlInput.value = text;
    loadFromUrl(text);
    } catch (err) {
    console.error(err);
    setStatus(err?.message || 'Could not read clipboard or load the link.', true);
    }
});

// Optional: press Enter to load
urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') loadBtn.click();
});
