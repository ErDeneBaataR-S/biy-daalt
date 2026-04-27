import { Head, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    MessageSquareMore,
    PackageCheck,
    TrendingUp,
} from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { Auth, BreadcrumbItem } from '@/types';
import type {
    AnalyticsBreakdownItem,
    AnalyticsInsight,
    AnalyticsMetric,
    AnalyticsSeriesPoint,
} from '@/types/analytics';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Analytics',
        href: '/analytics',
    },
];

const metrics: AnalyticsMetric[] = [
    {
        label: 'New backlog items',
        value: '24',
        helper: 'Captured this month',
        delta: '+6 vs last month',
    },
    {
        label: 'Feedback received',
        value: '58',
        helper: 'Across product channels',
        delta: '+18%',
    },
    {
        label: 'Releases shipped',
        value: '4',
        helper: 'Completed in the current window',
        delta: '+1',
    },
    {
        label: 'Close rate',
        value: '71%',
        helper: 'Feedback and backlog items resolved',
        delta: '+9 pts',
    },
];

const backlogSeries: AnalyticsSeriesPoint[] = [
    { label: 'Jan', value: 12 },
    { label: 'Feb', value: 18 },
    { label: 'Mar', value: 22 },
    { label: 'Apr', value: 24 },
];

const feedbackSeries: AnalyticsSeriesPoint[] = [
    { label: 'Jan', value: 26 },
    { label: 'Feb', value: 31 },
    { label: 'Mar', value: 44 },
    { label: 'Apr', value: 58 },
];

const breakdownItems: AnalyticsBreakdownItem[] = [
    { label: 'Planned', value: '19 items', tone: 'sky' },
    { label: 'In review', value: '8 items', tone: 'amber' },
    { label: 'Shipped', value: '11 items', tone: 'emerald' },
    { label: 'Queued', value: '6 items', tone: 'slate' },
];

const insights: AnalyticsInsight[] = [
    {
        title: 'Feedback volume accelerated',
        description:
            'Customer input rose sharply through March and remained elevated into April.',
    },
    {
        title: 'Backlog intake stayed healthy',
        description:
            'Backlog growth increased steadily without a sudden spike that would suggest triage debt.',
    },
    {
        title: 'Release cadence is stable',
        description:
            'Recent delivery volume supports a consistent throughput view rather than stop-start shipping.',
    },
];

const toneClasses = {
    sky: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/60 dark:text-sky-300',
    emerald:
        'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300',
    amber: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300',
    slate: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300',
} as const;

function TrendBars({
    points,
    colorClass,
}: {
    points: AnalyticsSeriesPoint[];
    colorClass: string;
}) {
    const maxValue = Math.max(...points.map((point) => point.value), 1);

    return (
        <div className="grid grid-cols-4 gap-3">
            {points.map((point) => (
                <div key={point.label} className="space-y-2">
                    <div className="flex h-32 items-end rounded-2xl bg-slate-100 p-2 dark:bg-[#0f1728]">
                        <div
                            className={cn(
                                'w-full rounded-xl transition-all',
                                colorClass,
                            )}
                            style={{
                                height: `${Math.max(
                                    18,
                                    Math.round((point.value / maxValue) * 100),
                                )}%`,
                            }}
                        />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>{point.label}</span>
                        <span className="font-medium text-slate-700 dark:text-slate-200">
                            {point.value}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function Analytics() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const isAdmin = auth.user.role === 'admin';
    const pageTitle = isAdmin
        ? 'Organization Analytics'
        : 'Delivery Analytics';
    const pageDescription = isAdmin
        ? 'Organization-wide trends, portfolio visibility, and workflow signals across backlog, feedback, and releases.'
        : 'Delivery-focused trends and workflow signals across backlog, feedback, and releases.';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={pageTitle} />

            <div className="space-y-6 px-4 py-6">
                <section>
                    <p className="text-xs font-semibold tracking-[0.18em] text-sky-500 uppercase">
                        {isAdmin ? 'Organization intelligence' : 'Delivery intelligence'}
                    </p>
                    <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h1 className="text-[1.9rem] font-semibold tracking-[-0.04em] text-slate-900 dark:text-slate-100">
                                {pageTitle}
                            </h1>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                {pageDescription}
                            </p>
                        </div>
                        <Badge
                            variant="outline"
                            className="rounded-full border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-[#162033] dark:text-slate-300"
                        >
                            Last 30 days
                        </Badge>
                    </div>
                </section>

                <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {metrics.map((metric) => (
                        <Card
                            key={metric.label}
                            className="border-slate-200 bg-white/95 shadow-sm dark:border-slate-700/60 dark:bg-[#111827] dark:shadow-[0_22px_45px_-34px_rgba(2,6,23,0.88)]"
                        >
                            <CardHeader className="gap-3">
                                <CardDescription className="text-xs font-semibold tracking-[0.16em] text-slate-400 uppercase">
                                    {metric.label}
                                </CardDescription>
                                <div className="flex items-end justify-between gap-3">
                                    <CardTitle className="text-3xl text-slate-900">
                                        {metric.value}
                                    </CardTitle>
                                    {metric.delta && (
                                        <span className="text-xs font-semibold text-emerald-600">
                                            {metric.delta}
                                        </span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-500">
                                    {metric.helper}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </section>

                <section className="grid gap-4 xl:grid-cols-2">
                    <Card className="border-slate-200 bg-white/95 shadow-sm dark:border-slate-700/60 dark:bg-[#111827] dark:shadow-[0_22px_45px_-34px_rgba(2,6,23,0.88)]">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base text-slate-900">
                                <BarChart3 className="size-4 text-sky-600" />
                                Backlog growth
                            </CardTitle>
                            <CardDescription>
                                Intake stayed active across the current
                                reporting window.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TrendBars
                                points={backlogSeries}
                                colorClass="bg-sky-500"
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 bg-white/95 shadow-sm dark:border-slate-700/60 dark:bg-[#111827] dark:shadow-[0_22px_45px_-34px_rgba(2,6,23,0.88)]">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base text-slate-900">
                                <MessageSquareMore className="size-4 text-amber-600" />
                                Feedback trend
                            </CardTitle>
                            <CardDescription>
                                User feedback volume has been increasing faster
                                than backlog intake.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TrendBars
                                points={feedbackSeries}
                                colorClass="bg-amber-500"
                            />
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
                    <Card className="border-slate-200 bg-white/95 shadow-sm dark:border-slate-700/60 dark:bg-[#111827] dark:shadow-[0_22px_45px_-34px_rgba(2,6,23,0.88)]">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base text-slate-900">
                                <ArrowRight className="size-4 text-sky-600" />
                                Workflow conversion
                            </CardTitle>
                            <CardDescription>
                                Track how signals move from feedback into
                                backlog and from backlog into shipped work.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700/60 dark:bg-[#0f1728]">
                                <p className="text-xs font-semibold tracking-[0.16em] text-slate-400 uppercase">
                                    Feedback to backlog
                                </p>
                                <p className="mt-3 text-3xl font-semibold text-slate-900">
                                    41%
                                </p>
                                <p className="mt-2 text-sm text-slate-500">
                                    24 backlog items came from 58 tracked
                                    feedback submissions.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700/60 dark:bg-[#0f1728]">
                                <p className="text-xs font-semibold tracking-[0.16em] text-slate-400 uppercase">
                                    Backlog to release
                                </p>
                                <p className="mt-3 text-3xl font-semibold text-slate-900">
                                    17%
                                </p>
                                <p className="mt-2 text-sm text-slate-500">
                                    4 recent releases shipped against the active
                                    tracked work in the current cycle.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 bg-white/95 shadow-sm dark:border-slate-700/60 dark:bg-[#111827] dark:shadow-[0_22px_45px_-34px_rgba(2,6,23,0.88)]">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base text-slate-900">
                                <PackageCheck className="size-4 text-emerald-600" />
                                Status breakdown
                            </CardTitle>
                            <CardDescription>
                                {isAdmin
                                    ? 'Distribution snapshot across the organization work pipeline.'
                                    : 'Distribution snapshot across the current delivery pipeline.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {breakdownItems.map((item) => (
                                <div
                                    key={item.label}
                                    className={cn(
                                        'rounded-2xl border px-4 py-3',
                                        toneClasses[item.tone],
                                    )}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-sm font-semibold">
                                            {item.label}
                                        </span>
                                        <span className="text-sm">
                                            {item.value}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>

                <section>
                    <Card className="border-slate-200 bg-white/95 shadow-sm dark:border-slate-700/60 dark:bg-[#111827] dark:shadow-[0_22px_45px_-34px_rgba(2,6,23,0.88)]">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base text-slate-900">
                                <TrendingUp className="size-4 text-sky-600" />
                                Insights
                            </CardTitle>
                            <CardDescription>
                                {isAdmin
                                    ? 'Short takeaways derived from organization-wide trend and throughput metrics.'
                                    : 'Short takeaways derived from delivery trend and throughput metrics.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3 xl:grid-cols-3">
                            {insights.map((insight) => (
                                <div
                                    key={insight.title}
                                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700/60 dark:bg-[#0f1728]"
                                >
                                    <Heading
                                        variant="small"
                                        title={insight.title}
                                        description={insight.description}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>
            </div>
        </AppLayout>
    );
}
