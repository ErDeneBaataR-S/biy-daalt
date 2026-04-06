import type { ReactNode } from 'react';

export function RoadmapShell({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-1 flex-col bg-[#eef2f7] px-3 py-3 sm:px-4 sm:py-4 lg:px-5 dark:bg-[#0b1220]">
            <div className="mx-auto w-full max-w-7xl rounded-[2rem] border border-white/70 bg-[#f8fafe] p-4 shadow dark:border-slate-700/60 dark:bg-[#111a2b] dark:shadow-[0_30px_80px_-48px_rgba(2,6,23,0.78)]">
                <div className="mb-4">
                    <p className="text-xs text-sky-500">PRODUCT WORKSPACE</p>
                    <h1 className="text-2xl font-bold dark:text-slate-100">
                        Roadmap
                    </h1>
                </div>

                {children}
            </div>
        </div>
    );
}
