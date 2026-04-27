import assert from 'node:assert/strict';
import test from 'node:test';
import {
    createDefaultFeedback,
    isDeadlineOverdue,
    loadFeedbacks,
} from '../../resources/js/pages/feedback-state.js';

test('loadFeedbacks returns parsed items when storage contains an array', () => {
    const feedbacks = loadFeedbacks(
        JSON.stringify([{ id: 1, title: 'Bug', status: 'Open' }]),
    );

    assert.equal(feedbacks.length, 1);
    assert.equal(feedbacks[0].title, 'Bug');
});

test('loadFeedbacks falls back to an empty array for malformed storage data', () => {
    const feedbacks = loadFeedbacks('{invalid-json');

    assert.deepEqual(feedbacks, []);
});

test('isDeadlineOverdue compares dates at day precision', () => {
    const now = new Date(2026, 3, 5, 12, 0, 0);

    assert.equal(isDeadlineOverdue('2026-04-05', now), false);
    assert.equal(isDeadlineOverdue('2026-04-04', now), true);
});

test('createDefaultFeedback uses the provided date for stable defaults', () => {
    const feedback = createDefaultFeedback(new Date('2026-04-05T08:00:00.000Z'));

    assert.equal(feedback.status, 'Open');
    assert.equal(feedback.priority, 'Medium');
    assert.equal(feedback.deadline, '2026-04-05');
});
