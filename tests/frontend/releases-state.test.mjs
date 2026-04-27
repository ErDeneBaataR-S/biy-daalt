import assert from 'node:assert/strict';
import test from 'node:test';
import {
    createRelease,
    getDefaultReleases,
    loadReleases,
} from '../../resources/js/pages/releases-state.js';

test('loadReleases returns stored releases when storage contains an array', () => {
    const releases = loadReleases(
        JSON.stringify([{ id: 1, version: 'v2.0', date: '2026-04-05' }]),
    );

    assert.equal(releases.length, 1);
    assert.equal(releases[0].version, 'v2.0');
});

test('loadReleases falls back to defaults for malformed storage data', () => {
    const releases = loadReleases('{invalid-json', new Date('2026-04-05T00:00:00.000Z'));

    assert.deepEqual(releases, getDefaultReleases(new Date('2026-04-05T00:00:00.000Z')));
});

test('createRelease trims the version string before storing it', () => {
    const release = createRelease('  v1.1  ', new Date('2026-04-05T00:00:00.000Z'));

    assert.equal(release.version, 'v1.1');
    assert.equal(release.date, '2026-04-05');
    assert.deepEqual(release.features, []);
});
