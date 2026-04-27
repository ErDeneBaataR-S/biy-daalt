import { Head } from '@inertiajs/react';
import { NotebookPen } from 'lucide-react';
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
        title: 'Personal Tasks',
        href: '/personal-tasks',
    },
];

export default function PersonalTasks() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Personal Tasks" />

            <div className="space-y-6 px-4 py-6">
                <Heading
                    title="Personal Tasks"
                    description="A separate place for self-managed reminders and lightweight tasks that do not belong in team backlog flow."
                />

                <Card className="border-slate-200 bg-white/95 shadow-sm dark:border-slate-700/60 dark:bg-[#111827] dark:shadow-[0_22px_45px_-34px_rgba(2,6,23,0.88)]">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base text-slate-900 dark:text-slate-100">
                            <NotebookPen className="size-4 text-sky-600" />
                            Personal planning space
                        </CardTitle>
                        <CardDescription>
                            Keep personal follow-ups visible without mixing them
                            into manager-owned operational views.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-slate-500 dark:text-slate-400">
                        Future iterations can add quick capture and lightweight
                        tracking here.
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
