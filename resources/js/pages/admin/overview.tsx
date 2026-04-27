import { Head } from '@inertiajs/react';
import { Activity, ShieldCheck, UsersRound } from 'lucide-react';
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
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Overview',
        href: '/admin',
    },
];

const overviewCards = [
    {
        title: 'Access posture',
        description:
            'Role boundaries, entry points, and system-level controls are now separated from shared workspace routes.',
        icon: ShieldCheck,
        badge: 'Admin only',
    },
    {
        title: 'Project oversight',
        description:
            'Use the shared projects space to review delivery health without dropping into manager-only workflow tools.',
        icon: UsersRound,
        badge: 'Cross-team',
    },
    {
        title: 'System health',
        description:
            'Authentication, route protection, and role-aware navigation are active and ready for the next workflow pages.',
        icon: Activity,
        badge: 'In progress',
    },
];

export default function AdminOverview() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Overview" />

            <div className="space-y-6 px-4 py-6">
                <section className="space-y-3">
                    <p className="text-xs font-semibold tracking-[0.18em] text-sky-500 uppercase">
                        System administration
                    </p>
                    <Heading
                        title="Admin Overview"
                        description="Organization access, project oversight, and platform health from one role-specific landing page."
                    />
                </section>

                <section className="grid gap-4 lg:grid-cols-3">
                    {overviewCards.map((card) => (
                        <Card
                            key={card.title}
                            className="border-slate-200 bg-white/95 shadow-sm dark:border-slate-700/60 dark:bg-[#111827] dark:shadow-[0_22px_45px_-34px_rgba(2,6,23,0.88)]"
                        >
                            <CardHeader className="gap-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="rounded-2xl border border-sky-200 bg-sky-50 p-3 text-sky-700 dark:border-sky-900 dark:bg-sky-950/60 dark:text-sky-300">
                                        <card.icon className="size-5" />
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="rounded-full border-slate-200 bg-white px-2.5 py-0.5 text-[0.68rem] font-semibold text-slate-500 dark:border-slate-700 dark:bg-[#162033] dark:text-slate-300"
                                    >
                                        {card.badge}
                                    </Badge>
                                </div>
                                <div>
                                    <CardTitle className="text-lg text-slate-900 dark:text-slate-100">
                                        {card.title}
                                    </CardTitle>
                                    <CardDescription className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                        {card.description}
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    This page becomes the anchor for broader
                                    admin-only controls as the role flow
                                    continues.
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </section>
            </div>
        </AppLayout>
    );
}
