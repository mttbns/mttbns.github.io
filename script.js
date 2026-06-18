function estraiYouTubeID(url) {
      try {
        const patterns = [
          /(?:v=|\/embed\/|\/v\/|youtu\.be\/)([A-Za-z0-9_-]{11})/,
          /[?&]v=([A-Za-z0-9_-]{11})/
        ];
        for (const re of patterns) {
          const m = url.match(re);
          if (m) return m[1];
        }
        const u = new URL(url);
        const v = u.searchParams.get('v');
        if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;
      } catch (e) {}
      return null;
    }

    const input = document.getElementById('ytUrl');
    const btn = document.getElementById('loadBtn');
    const iframe = document.getElementById('player');
    const msg = document.getElementById('msg');

    function setMessage(text, isError = false) {
      msg.textContent = text;
      msg.className = isError ? 'error' : 'info';
    }

    btn.addEventListener('click', () => {
      const id = estraiYouTubeID(input.value.trim());
      if (id) {
        iframe.src = `https://www.youtube.com/embed/${id}`;
        setMessage('');
      } else {
        setMessage('ID video non trovato. Controlla il link.', true);
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') btn.click();
    });