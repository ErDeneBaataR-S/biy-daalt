export const RELEASES_STORAGE_KEY = 'releases';

export function getDefaultReleases(now = new Date()) {
    return [
        {
            id: now.getTime(),
            version: 'v1.0',
            date: '2026-04-01',
            features: ['Login system', 'Dashboard', 'Feedback module'],
        },
    ];
}

export function loadReleases(storageValue, now = new Date()) {
    if (!storageValue) {
        return getDefaultReleases(now);
    }

    try {
        const parsed = JSON.parse(storageValue);

        return Array.isArray(parsed) ? parsed : getDefaultReleases(now);
    } catch {
        return getDefaultReleases(now);
    }
}

export function createRelease(version, now = new Date()) {
    return {
        id: now.getTime(),
        version: version.trim(),
        date: now.toISOString().split('T')[0],
        features: [],
    };
}
