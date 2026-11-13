// api/academic-stats.js - JMApro.uz Live Academic Metrics Endpoint
// Fetches real-time Google Scholar metrics and aggregates verified IDs

export default async function handler(req, res) {
    // 1. CORS va Caching sarlavhalari (Vercel Edge Kesh: 12 soat, 24 soat stale-while-revalidate)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Cache-Control', 's-maxage=43200, stale-while-revalidate=86400');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const baselineStats = {
        citations: 123,
        citations_recent: 123,
        h_index: 7,
        i10_index: 5,
        source: 'baseline'
    };

    let scholarData = { ...baselineStats };

    try {
        const scholarUrl = 'https://scholar.google.com/citations?user=mwDmf6oAAAAJ&hl=en';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const response = await fetch(scholarUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            },
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
            const html = await response.text();
            const matches = [...html.matchAll(/<td class="gsc_rsb_std">(\d+)<\/td>/g)].map(m => parseInt(m[1], 10));

            if (matches.length >= 6) {
                scholarData = {
                    citations: matches[0],
                    citations_recent: matches[1],
                    h_index: matches[2],
                    i10_index: matches[4],
                    source: 'live'
                };
            }
        }
    } catch (err) {
        // Fallback to baseline on network/timeout errors
        scholarData = { ...baselineStats, source: 'fallback_error' };
    }

    return res.status(200).json({
        ok: true,
        scholar: {
            citations: scholarData.citations,
            citations_recent: scholarData.citations_recent,
            h_index: scholarData.h_index,
            i10_index: scholarData.i10_index,
            source: scholarData.source,
            user_id: 'mwDmf6oAAAAJ',
            profile_url: 'https://scholar.google.com/citations?user=mwDmf6oAAAAJ'
        },
        scopus: {
            author_id: '58744843900',
            profile_url: 'https://www.scopus.com/authid/detail.uri?authorId=58744843900',
            status: 'verified'
        },
        wos: {
            researcher_id: 'KHD-3312-2024',
            profile_url: 'https://www.webofscience.com/wos/author/record/KHD-3312-2024',
            status: 'indexed'
        },
        orcid: {
            id: '0000-0002-2332-2550',
            profile_url: 'https://orcid.org/0000-0002-2332-2550',
            status: 'connected'
        },
        researchgate: {
            profile: 'Jalolidin-Muminov',
            profile_url: 'https://www.researchgate.net/profile/Jalolidin-Muminov',
            status: 'active'
        },
        timestamp: new Date().toISOString()
    });
}
