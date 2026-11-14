// assets/js/visitor-tracker.js - Live Visitor Stats and Download Tracker
(function() {
    function updateStats() {
        fetch('/api/visitor-stats')
            .then(res => res.json())
            .then(data => {
                if (!data || !data.ok) return;
                const onlineEl = document.getElementById('liveOnlineCount');
                const viewsEl = document.getElementById('totalViewsCount');
                const downloadsEl = document.getElementById('totalDownloadsCount');

                if (onlineEl) onlineEl.innerText = data.online;
                if (viewsEl) viewsEl.innerText = Number(data.views).toLocaleString();
                if (downloadsEl) downloadsEl.innerText = Number(data.downloads).toLocaleString();
            })
            .catch(() => {});
    }

    // Dastlabki yuklash
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateStats);
    } else {
        updateStats();
    }

    // Har 45 soniyada yangilab turish (tinch rejimda)
    setInterval(updateStats, 45000);

    // Yuklab olish tugmalarini avtomatik kuzatish
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a, button');
        if (!target) return;

        const href = target.getAttribute('href') || '';
        const isDownload = target.hasAttribute('download') || 
            /\.(exe|zip|rar|pdf|docx?|xlsx?)$/i.test(href) ||
            target.classList.contains('download-trigger');

        if (isDownload) {
            fetch('/api/visitor-stats?action=download')
                .then(res => res.json())
                .then(data => {
                    if (data && data.downloads) {
                        const dlEl = document.getElementById('totalDownloadsCount');
                        if (dlEl) dlEl.innerText = Number(data.downloads).toLocaleString();
                    }
                })
                .catch(() => {});
        }
    });
})();
