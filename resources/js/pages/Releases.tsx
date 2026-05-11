import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

type ReleaseItem = {
    id: number;
    version: string;
    date: string;
    features: string[];
};

export default function Releases() {
    const { items: releases } = usePage<{ items: ReleaseItem[] }>().props;
    const [newVersion, setNewVersion] = useState('');

    const addRelease = () => {
        if (!newVersion.trim()) {
            return;
        }

        router.post(
            '/releases',
            {
                version: newVersion.trim(),
                release_date: new Date().toISOString().split('T')[0],
                features: [],
            },
            {
                preserveScroll: true,
            },
        );

        setNewVersion('');
    };

    const deleteRelease = (id: number) => {
        router.delete(`/releases/${id}`, {
            preserveScroll: true,
        });
    };

    const addFeature = (id: number) => {
        const text = prompt('Feature name?')?.trim();

        if (!text) {
            return;
        }

        const release = releases.find((item) => item.id === id);

        if (!release) {
            return;
        }

        router.patch(
            `/releases/${id}`,
            {
                features: [...release.features, text],
            },
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout>
            <div className="p-6 dark:bg-[#0b1220]">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold dark:text-slate-100">
                        Releases
                    </h1>

                    <div className="flex gap-2">
                        <input
                            value={newVersion}
                            onChange={(e) => setNewVersion(e.target.value)}
                            placeholder="v1.1"
                            className="rounded border p-2 dark:border-slate-700 dark:bg-[#162033] dark:text-slate-100 dark:placeholder:text-slate-400"
                        />

                        <button
                            onClick={addRelease}
                            className="rounded bg-blue-500 px-4 text-white hover:bg-blue-600"
                        >
                            + Add
                        </button>
                    </div>
                </div>

                {releases.length === 0 ? (
                    <div className="mt-20 text-center text-gray-400 dark:text-slate-500">
                        No releases yet
                    </div>
                ) : (
                    <div className="space-y-6">
                        {releases.map((r) => (
                            <div
                                key={r.id}
                                className="rounded-xl bg-white p-5 shadow-sm dark:border dark:border-slate-700/60 dark:bg-[#111827] dark:shadow-[0_22px_45px_-34px_rgba(2,6,23,0.88)]"
                            >
                                <div className="mb-3 flex justify-between">
                                    <h2 className="text-lg font-semibold dark:text-slate-100">
                                        {r.version}
                                    </h2>

                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-400 dark:text-slate-500">
                                            {r.date}
                                        </span>

                                        <button
                                            onClick={() => deleteRelease(r.id)}
                                            className="text-red-500 dark:text-rose-300"
                                            aria-label={`Delete ${r.version}`}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                <ul className="space-y-1 text-sm dark:text-slate-300">
                                    {r.features.length === 0 ? (
                                        <li className="text-gray-400 dark:text-slate-500">
                                            No features yet
                                        </li>
                                    ) : (
                                        r.features.map(
                                            (f: string, i: number) => (
                                                <li key={i}>• {f}</li>
                                            ),
                                        )
                                    )}
                                </ul>

                                <button
                                    onClick={() => addFeature(r.id)}
                                    className="mt-3 rounded bg-blue-100 px-2 py-1 text-xs dark:bg-sky-500/15 dark:text-sky-300"
                                >
                                    + Add feature
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
