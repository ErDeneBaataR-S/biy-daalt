export const FEEDBACK_STORAGE_KEY = 'feedbacks';

export const feedbackStatusOptions = ['Open', 'In Review', 'Closed'];
export const feedbackPriorityOptions = ['Low', 'Medium', 'High'];

export function loadFeedbacks(storageValue) {
    if (!storageValue) {
        return [];
    }

    try {
        const parsed = JSON.parse(storageValue);

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function createDefaultFeedback(now = new Date()) {
    return {
        id: now.getTime(),
        title: 'Login issue',
        description: 'User cannot login properly',
        status: 'Open',
        priority: 'Medium',
        deadline: now.toISOString().split('T')[0],
    };
}

export function isDeadlineOverdue(value, now = new Date()) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const today = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0'),
    ].join('-');

    return value < today;
}

export function getFeedbackPriorityColor(priority) {
    if (priority === 'Low') {
        return 'bg-gray-100 text-gray-600';
    }

    if (priority === 'Medium') {
        return 'bg-yellow-100 text-yellow-600';
    }

    if (priority === 'High') {
        return 'bg-red-100 text-red-600';
    }

    return '';
}
