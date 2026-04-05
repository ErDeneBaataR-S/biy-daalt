import { Badge } from '@/components/ui/badge';

type DashboardReleaseDay = {
    day: string;
    active?: boolean;
    muted?: boolean;
};

type DashboardReleaseCardProps = {
    month: string;
    days: DashboardReleaseDay[];
    releases: Array<{
        name: string;
        status: string;
    }>;
};

export function DashboardReleaseCard({
    month,
    days,
    releases,
}: DashboardReleaseCardProps) {
    return (
        <div className="rounded-[1.4rem] border border-slate-200/80 bg-white p-5 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.4)] dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400">
                        Releases
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {month}
                    </h3>
                </div>
                <Badge
                    variant="outline"
                    className="border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/60 dark:text-sky-300"
                >
                    Now
                </Badge>
            </div>

            <div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs text-slate-500 dark:text-slate-400">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((weekday) => (
                    <span key={weekday}>{weekday}</span>
                ))}
                {days.map((day, index) => (
                    <div
                        key={`${day.day}-${index}`}
                        className={[
                            'flex h-9 items-center justify-center rounded-xl border text-sm font-medium',
                            day.active
                                ? 'border-sky-200 bg-sky-500 text-white shadow-sm'
                                : 'border-transparent bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200',
                            day.muted ? 'opacity-45' : '',
                        ].join(' ')}
                    >
                        {day.day}
                    </div>
                ))}
            </div>

            <div className="mt-5 space-y-3">
                {releases.map((release) => (
                    <div
                        key={release.name}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 px-4 py-3 dark:border-slate-800"
                    >
                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                {release.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Shipping lane update
                            </p>
                        </div>
                        <Badge
                            variant="outline"
                            className="border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/60 dark:text-violet-300"
                        >
                            {release.status}
                        </Badge>
                    </div>
                ))}
            </div>
        </div>
    );
}
