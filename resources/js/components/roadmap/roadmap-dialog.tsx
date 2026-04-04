import { useState } from 'react';

type Status = 'now' | 'next' | 'later';

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: (title: string, status: Status) => void;
    initial?: {
        id: number;
        title: string;
        status: Status;
    } | null;
};

export function RoadmapDialog({ open, onClose, onSubmit, initial }: Props) {
    const [title, setTitle] = useState(initial?.title ?? '');
    const [status, setStatus] = useState<Status>(initial?.status ?? 'now');

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-lg font-semibold">
                    {initial ? 'Edit Item' : 'New Item'}
                </h2>

                <input
                    className="mb-3 w-full rounded border p-2"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <select
                    className="mb-4 w-full rounded border p-2"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Status)}
                >
                    <option value="now">Now</option>
                    <option value="next">Next</option>
                    <option value="later">Later</option>
                </select>

                <div className="flex justify-end gap-2">
                    <button onClick={onClose}>Cancel</button>

                    <button
                        onClick={() => {
                            if (!title.trim()) {
                                return;
                            }

                            onSubmit(title, status);
                            onClose();
                        }}
                        className="rounded bg-blue-500 px-4 py-1 text-white"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
