import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type DashboardSectionHeadingProps = {
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
};

export function DashboardSectionHeading({
    title,
    description,
    action,
    className,
}: DashboardSectionHeadingProps) {
    return (
        <div
            className={cn('flex items-start justify-between gap-4', className)}
        >
            <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    {title}
                </h2>
                {description ? (
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {description}
                    </p>
                ) : null}
            </div>
            {action ? <div>{action}</div> : null}
        </div>
    );
}
