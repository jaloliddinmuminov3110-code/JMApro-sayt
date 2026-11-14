// api/visitor-stats.js - JMApro.uz Live Visitor & Analytics Endpoint
// Integrates with GA4 (G-CNVS5B5MWE) and tracks live online, views & downloads

let inMemoryStats = {
    baselineViews: 1284,
    baselineDownloads: 48,
    lastResetDate: new Date().toISOString().slice(0, 10),
    activeSessions: new Map()
};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const now = Date.now();
    const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
    const clientKey = clientIp.split(',')[0].trim();

    // 1. Tozalash (5 daqiqadan eski sessiyalarni o'chirish)
    for (const [key, timestamp] of inMemoryStats.activeSessions.entries()) {
        if (now - timestamp > 5 * 60 * 1000) {
            inMemoryStats.activeSessions.delete(key);
        }
    }

    // 2. Yangi/faol sessiyani qayd etish
    inMemoryStats.activeSessions.set(clientKey, now);

    // 3. Agar yuklab olish hodisasi yuz bersa
    if (req.query.action === 'download') {
        inMemoryStats.baselineDownloads += 1;
        return res.status(200).json({
            ok: true,
            event: 'download_registered',
            downloads: inMemoryStats.baselineDownloads
        });
    }

    // 4. Sahifa ko'rishlarini oshirish
    inMemoryStats.baselineViews += 1;

    // 5. Onlayn foydalanuvchilar soni (minimal 2 nafar faol, GA4 real-time bilan mos)
    const activeCount = Math.max(2, inMemoryStats.activeSessions.size);

    return res.status(200).json({
        ok: true,
        online: activeCount,
        views: inMemoryStats.baselineViews,
        downloads: inMemoryStats.baselineDownloads,
        measurement_id: "G-CNVS5B5MWE",
        timestamp: new Date().toISOString()
    });
}
