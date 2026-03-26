import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type DashboardMetricCardProps = {
    label: string;
    value: string;
    helper: string;
    tone: 'blue' | 'sky' | 'rose' | 'slate';
    trend: string;
    icon?: ReactNode;
};

const toneStyles = {
    blue: {
        icon: 'bg-sky-50 text-sky-500',
        line: 'stroke-sky-400',
        area: 'fill-sky-100',
    },
    sky: {
        icon: 'bg-blue-50 text-blue-500',
        line: 'stroke-blue-400',
        area: 'fill-blue-100',
    },
    rose: {
        icon: 'bg-rose-50 text-rose-400',
        line: 'stroke-rose-300',
        area: 'fill-rose-100',
    },
    slate: {
        icon: 'bg-slate-100 text-slate-500',
        line: 'stroke-slate-300',
        area: 'fill-slate-200',
    },
} as const;

export function DashboardMetricCard({
    label,
    value,
    helper,
    tone,
    trend,
    icon,
}: DashboardMetricCardProps) {
    const style = toneStyles[tone];

    return (
        <div className="rounded-[1.2rem] border border-slate-200/80 bg-white px-4 py-3 shadow-[0_16px_40px_-36px_rgba(15,23,42,0.8)]">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[0.72rem] font-medium text-slate-500">
                        {label}
                    </p>
                    <p className="mt-1 text-[1.9rem] font-semibold tracking-[-0.04em] text-slate-900">
                        {value}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{helper}</p>
                </div>
                <div
                    className={cn(
                        'flex size-8 items-center justify-center rounded-lg',
                        style.icon,
                    )}
                >
                    {icon}
                </div>
            </div>
            <div className="mt-3 overflow-hidden rounded-lg bg-slate-50 px-1 py-1">
                <svg
                    viewBox="0 0 52 24"
                    className="h-7 w-full"
                    aria-hidden="true"
                    fill="none"
                >
                    <path
                        d={`${trend} L50 24 L2 24 Z`}
                        className={style.area}
                        opacity="0.8"
                    />
                    <path
                        d={trend}
                        className={cn('fill-none stroke-[2.2]', style.line)}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </div>
    );
}
