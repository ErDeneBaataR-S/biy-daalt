import { Head, Link, usePage } from '@inertiajs/react';
import { BellRing, CheckSquare, ListChecks } from 'lucide-react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
        title: 'My Dashboard',
        href: '/my-dashboard',
    },
];

type EmployeeTask = {
    id: number;
    title: string;
    status: string;
    priority: string;
};

type WorkspaceUpdate = {
    id: number;
    title: string;
    status: string;
};

type Props = {
    assignedTasks: EmployeeTask[];
    personalTasks: EmployeeTask[];
    updates: WorkspaceUpdate[];
    metrics: {
        assignedOpen: number;
        personalOpen: number;
        updatesTotal: number;
    };
};

export default function MyDashboard() {
    const { assignedTasks, personalTasks, updates, metrics } =
        usePage<Props>().props;

    const cards = [
        {
            title: 'Assigned work',
            description: 'Open assigned tasks routed to your workspace.',
            icon: CheckSquare,
            value: metrics.assignedOpen,
            href: '/my-tasks',
            items: assignedTasks,
        },
        {
            title: 'Personal tasks',
            description: 'Open personal follow-ups owned by you.',
            icon: ListChecks,
            value: metrics.personalOpen,
            href: '/personal-tasks',
            items: personalTasks,
        },
        {
            title: 'Updates',
            description: 'Update records connected to your employee feed.',
            icon: BellRing,
            value: metrics.updatesTotal,
            href: '/updates',
            items: updates,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Dashboard" />

            <div className="space-y-6 px-4 py-6">
                <section className="space-y-3">
                    <p className="text-xs font-semibold tracking-[0.18em] text-sky-500 uppercase">
                        Personal workspace
                    </p>
                    <Heading
                        title="My Dashboard"
                        description="Your assigned work, personal tasks, and updates are now connected to persistent records."
                    />
                </section>

                <section className="grid gap-4 lg:grid-cols-3">
                    {cards.map((card) => (
                        <Card
                            key={card.title}
                            className="border-slate-200 bg-white/95 shadow-sm dark:border-slate-700/60 dark:bg-[#111827]"
                        >
                            <CardHeader className="gap-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="rounded-2xl border border-sky-200 bg-sky-50 p-3 text-sky-700 dark:border-sky-900 dark:bg-sky-950/60 dark:text-sky-300">
                                        <card.icon className="size-5" />
                                    </div>
                                    <Badge variant="outline">
                                        {card.value}
                                    </Badge>
                                </div>
                                <div>
                                    <CardTitle className="text-lg">
                                        {card.title}
                                    </CardTitle>
                                    <CardDescription className="mt-2 text-sm">
                                        {card.description}
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2">
                                    {card.items.length === 0 ? (
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            No records yet.
                                        </p>
                                    ) : (
                                        card.items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between gap-3 rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-700"
                                            >
                                                <span className="truncate">
                                                    {item.title}
                                                </span>
                                                <Badge variant="outline">
                                                    {item.status}
                                                </Badge>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <Link href={card.href}>Open</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </section>
            </div>
        </AppLayout>
    );
}
