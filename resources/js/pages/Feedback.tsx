import { router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    createDefaultFeedback,
    feedbackPriorityOptions,
    feedbackStatusOptions,
    getFeedbackPriorityColor,
    isDeadlineOverdue,
} from '@/pages/feedback-state';
import type { Auth } from '@/types';

type FeedbackItem = {
    id: number;
    submittedBy?: {
        id: number;
        name: string;
        email: string;
    } | null;
    title: string;
    description: string;
    status: string;
    priority: string;
    deadline: string;
    approvedAt?: string | null;
};

export default function Feedback() {
    const { auth, items: feedbacks } = usePage<{
        auth: Auth;
        items: FeedbackItem[];
    }>().props;
    const canManage =
        auth.user.role === 'admin' || auth.user.role === 'manager';

    const addFeedback = () => {
        router.post(
            '/feedback',
            {
                ...createDefaultFeedback(),
                title:
                    auth.user.role === 'employee'
                        ? 'New improvement idea'
                        : 'New feedback',
                status: auth.user.role === 'employee' ? 'Open' : 'Open',
            },
            {
                preserveScroll: true,
            },
        );
    };

    const deleteFeedback = (id: number) => {
        router.delete(`/feedback/${id}`, {
            preserveScroll: true,
        });
    };

    const updateFeedback = (
        id: number,
        updated: Partial<Pick<FeedbackItem, 'status' | 'priority'>>,
    ) => {
        router.patch(`/feedback/${id}`, updated, {
            preserveScroll: true,
        });
    };

    const columns = feedbackStatusOptions.map((status) => ({
        status,
        items: feedbacks.filter((feedback) => feedback.status === status),
    }));

    return (
        <AppLayout>
            <div className="p-6 dark:bg-[#0b1220]">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold dark:text-slate-100">
                        {auth.user.role === 'employee'
                            ? 'Improvement Ideas'
                            : 'Feedback'}
                    </h1>
                    <button
                        onClick={addFeedback}
                        className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    >
                        {auth.user.role === 'employee' ? '+ Add idea' : '+ Add'}
                    </button>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {columns.map((column) => (
                        <div
                            key={column.status}
                            className="rounded-xl bg-white p-4 shadow-sm dark:border dark:border-slate-700/60 dark:bg-[#111827] dark:shadow-[0_22px_45px_-34px_rgba(2,6,23,0.88)]"
                        >
                            <h2 className="mb-3 font-semibold dark:text-slate-100">
                                {column.status} ({column.items.length})
                            </h2>

                            {column.items.map((feedback) => (
                                <div
                                    key={feedback.id}
                                    className="mb-3 rounded-lg border p-3 dark:border-slate-700/60 dark:bg-[#0f1728]"
                                >
                                    <h3 className="font-medium dark:text-slate-100">
                                        {feedback.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-slate-400">
                                        {feedback.submittedBy?.name
                                            ? `Submitted by ${feedback.submittedBy.name}`
                                            : feedback.description}
                                    </p>

                                    <span
                                        className={`rounded px-2 py-1 text-xs ${getFeedbackPriorityColor(feedback.priority)}`}
                                    >
                                        {feedback.priority}
                                    </span>

                                    <p
                                        className={`mt-1 text-xs ${isDeadlineOverdue(feedback.deadline) ? 'font-semibold text-red-500' : 'text-gray-400'}`}
                                    >
                                        Deadline: {feedback.deadline}
                                    </p>

                                    {canManage ? (
                                        <div className="mt-2 flex flex-wrap justify-end gap-2">
                                            <select
                                                value={feedback.status}
                                                onChange={(e) =>
                                                    updateFeedback(
                                                        feedback.id,
                                                        {
                                                            status: e.target
                                                                .value,
                                                        },
                                                    )
                                                }
                                                className="rounded border px-2 py-1 text-sm dark:border-slate-700 dark:bg-[#162033] dark:text-slate-100"
                                            >
                                                {feedbackStatusOptions.map(
                                                    (status) => (
                                                        <option key={status}>
                                                            {status}
                                                        </option>
                                                    ),
                                                )}
                                            </select>

                                            <select
                                                value={feedback.priority}
                                                onChange={(e) =>
                                                    updateFeedback(
                                                        feedback.id,
                                                        {
                                                            priority:
                                                                e.target.value,
                                                        },
                                                    )
                                                }
                                                className="rounded border px-2 py-1 text-sm dark:border-slate-700 dark:bg-[#162033] dark:text-slate-100"
                                            >
                                                {feedbackPriorityOptions.map(
                                                    (priority) => (
                                                        <option key={priority}>
                                                            {priority}
                                                        </option>
                                                    ),
                                                )}
                                            </select>

                                            {!feedback.approvedAt &&
                                            feedback.submittedBy ? (
                                                <button
                                                    onClick={() =>
                                                        router.patch(
                                                            `/feedback/${feedback.id}/approve`,
                                                            {},
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
                                                    }
                                                    className="text-emerald-600 dark:text-emerald-300"
                                                >
                                                    Approve to todo
                                                </button>
                                            ) : null}

                                            <button
                                                onClick={() =>
                                                    deleteFeedback(feedback.id)
                                                }
                                                className="text-red-500 dark:text-rose-300"
                                                aria-label={`Delete ${feedback.title}`}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
