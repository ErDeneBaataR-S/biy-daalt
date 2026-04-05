import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';

const docs = [
    {
        title: 'Getting Started',
        content: 'Welcome to the system. This is your dashboard overview.',
    },
    {
        title: 'Feedback',
        content: 'You can add, edit, and manage feedback items.',
    },
    {
        title: 'Roadmap',
        content: 'Roadmap shows planned features in timeline format.',
    },
    {
        title: 'Releases',
        content: 'Releases contain version updates and shipped features.',
    },
];

export default function Docs() {
    const [active, setActive] = useState(0);
    const [search, setSearch] = useState('');

    // 🔍 FILTER (title + content)
    const filteredDocs = docs.filter(
        (d) =>
            d.title.toLowerCase().includes(search.toLowerCase()) ||
            d.content.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <AppLayout>
            {' '}
            <div className="flex h-full">
                {/* SIDEBAR */}
                <div className="w-64 space-y-2 border-r bg-white p-4">
                    <h2 className="mb-4 font-bold">📘 Docs</h2>

                    {/* 🔍 SEARCH */}
                    <input
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="mb-3 w-full rounded border p-2"
                    />

                    {/* 🔥 SEARCH RESULT */}
                    {search ? (
                        <div className="space-y-2">
                            {filteredDocs.map((d, i) => (
                                <div
                                    key={i}
                                    onClick={() => {
                                        const realIndex = docs.findIndex(
                                            (doc) => doc.title === d.title,
                                        );
                                        setActive(realIndex);
                                        setSearch('');

                                        setTimeout(() => {
                                            document
                                                .getElementById(d.title)
                                                ?.scrollIntoView({
                                                    behavior: 'smooth',
                                                });
                                        }, 100);
                                    }}
                                    className="cursor-pointer rounded border p-2 hover:bg-gray-100"
                                >
                                    <p className="text-sm font-medium">
                                        {d.title}
                                    </p>
                                    <p className="line-clamp-2 text-xs text-gray-500">
                                        {d.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        docs.map((d, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setActive(i);

                                    setTimeout(() => {
                                        document
                                            .getElementById(d.title)
                                            ?.scrollIntoView({
                                                behavior: 'smooth',
                                            });
                                    }, 100);
                                }}
                                className={`block w-full rounded px-3 py-2 text-left ${
                                    active === i
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'hover:bg-gray-100'
                                }`}
                            >
                                {d.title}
                            </button>
                        ))
                    )}
                </div>

                {/* CONTENT */}
                <div className="flex-1 p-8">
                    <h1
                        id={docs[active].title}
                        className="mb-4 text-2xl font-bold"
                    >
                        {docs[active].title}
                    </h1>

                    <p className="leading-relaxed text-gray-600">
                        {docs[active].content}
                    </p>

                    {/* EXTRA */}
                    <div className="mt-6 rounded bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">
                            💡 Tip: This section explains how this feature
                            works.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
