import { Head } from '@inertiajs/react';
import { CheckCheck } from 'lucide-react';
import Heading from '@/components/heading';
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
        title: 'My Tasks',
        href: '/my-tasks',
    },
];

export default function MyTasks() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Tasks" />

            <div className="space-y-6 px-4 py-6">
                <Heading
                    title="My Tasks"
                    description="Assigned work ready for execution, organized as an employee-first task list."
                />

                <Card className="border-slate-200 bg-white/95 shadow-sm dark:border-slate-700/60 dark:bg-[#111827] dark:shadow-[0_22px_45px_-34px_rgba(2,6,23,0.88)]">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base text-slate-900 dark:text-slate-100">
                            <CheckCheck className="size-4 text-sky-600" />
                            Assigned execution queue
                        </CardTitle>
                        <CardDescription>
                            This page is the employee-only destination for work
                            assigned from shared project flows.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-slate-500 dark:text-slate-400">
                        Detailed task-state behavior can be added here without
                        exposing manager backlog controls.
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
