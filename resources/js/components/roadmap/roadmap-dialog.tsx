import { useState, useEffect } from 'react';

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: (title: string, status: 'now' | 'next' | 'later') => void;
    initial?: {
        id: number;
        title: string;
        status: 'now' | 'next' | 'later';
    } | null;
};

export function RoadmapDialog({ open, onClose, onSubmit, initial }: Props) {
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState<'now' | 'next' | 'later'>('now');

    useEffect(() => {
        if (initial) {
            setTitle(initial.title);
            setStatus(initial.status);
        } else {
            setTitle('');
            setStatus('now');
        }
    }, [initial, open]);

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
                    onChange={(e) =>
                        setStatus(e.target.value as 'now' | 'next' | 'later')
                    }
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

                            onSubmit(
                                title,
                                status || initial?.status || 'now'
                            );
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