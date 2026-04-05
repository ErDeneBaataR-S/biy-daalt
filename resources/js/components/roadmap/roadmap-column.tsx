import type { ReactNode } from 'react';

export function RoadmapColumn({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <div className="rounded-xl border bg-white p-4">
            <h2 className="mb-3 font-semibold">{title}</h2>
            <div className="space-y-2">{children}</div>
        </div>
    );
}
