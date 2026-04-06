import type { ReactNode } from 'react';

type DashboardPanelProps = {
    title: string;
    description: string;
    action?: ReactNode;
    children: ReactNode;
};

export function DashboardPanel({
    title,
    description,
    action,
    children,
}: DashboardPanelProps) {
    return (
        <section className="rounded-[1.35rem] border border-slate-200/80 bg-white p-4 shadow-[0_18px_50px_-42px_rgba(15,23,42,0.55)] sm:p-5 dark:border-slate-700/60 dark:bg-[#111827] dark:shadow-[0_22px_55px_-40px_rgba(2,6,23,0.85)]">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        {title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {description}
                    </p>
                </div>
                {action}
            </div>
            <div className="mt-4">{children}</div>
        </section>
    );
}
