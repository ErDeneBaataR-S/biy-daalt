import type { ReactNode } from 'react';

export function RoadmapShell({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-1 flex-col bg-[#eef2f7] px-3 py-3 sm:px-4 sm:py-4 lg:px-5">
            <div className="mx-auto w-full max-w-7xl rounded-[2rem] border border-white/70 bg-[#f8fafe] p-4 shadow">
                <div className="mb-4">
                    <p className="text-xs text-sky-500">PRODUCT WORKSPACE</p>
                    <h1 className="text-2xl font-bold">Roadmap</h1>
                </div>

                {children}
            </div>
        </div>
    );
}