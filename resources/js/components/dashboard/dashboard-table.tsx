import type { ReactNode } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export type DashboardTableRow = {
    id: string;
    title: string;
    status: {
        label: string;
        tone: string;
    };
    priority: {
        label: string;
        tone: string;
    };
    owner: string;
    team: string;
    estimate: string;
};

type DashboardTableProps = {
    columns: string[];
    rows: DashboardTableRow[];
    footer?: ReactNode;
};

const badgeToneClasses: Record<string, string> = {
    success:
        'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300',
    warning:
        'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300',
    danger: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300',
    neutral:
        'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300',
    info: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/60 dark:text-sky-300',
    purple: 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/60 dark:text-violet-300',
};

function initials(value: string) {
    return value
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

export function DashboardTable({ columns, rows, footer }: DashboardTableProps) {
    return (
        <div className="overflow-hidden rounded-[1.4rem] border border-slate-200/80 bg-white shadow-[0_30px_80px_-50px_rgba(15,23,42,0.4)] dark:border-slate-800 dark:bg-slate-950">
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="border-b border-slate-200/80 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/80">
                            {columns.map((column) => (
                                <th
                                    key={column}
                                    className="px-4 py-3 text-left text-[0.72rem] font-semibold tracking-[0.16em] text-slate-500 uppercase dark:text-slate-400"
                                >
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr
                                key={row.id}
                                className="border-b border-slate-200/70 last:border-b-0 dark:border-slate-800"
                            >
                                <td className="px-4 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                                    {row.title}
                                </td>
                                <td className="px-4 py-4">
                                    <Badge
                                        variant="outline"
                                        className={
                                            badgeToneClasses[row.status.tone]
                                        }
                                    >
                                        {row.status.label}
                                    </Badge>
                                </td>
                                <td className="px-4 py-4">
                                    <Badge
                                        variant="outline"
                                        className={
                                            badgeToneClasses[row.priority.tone]
                                        }
                                    >
                                        {row.priority.label}
                                    </Badge>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                                        <Avatar className="size-8 border border-slate-200 dark:border-slate-700">
                                            <AvatarFallback className="bg-slate-100 text-[0.68rem] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                                {initials(row.owner)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span>{row.owner}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                                    {row.team}
                                </td>
                                <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                                    {row.estimate}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {footer ? (
                <div className="border-t border-slate-200/70 px-4 py-3 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    {footer}
                </div>
            ) : null}
        </div>
    );
}
