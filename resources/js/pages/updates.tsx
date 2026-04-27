import { Head } from '@inertiajs/react';
import { Megaphone } from 'lucide-react';
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
        title: 'Updates',
        href: '/updates',
    },
];

export default function Updates() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Updates" />

            <div className="space-y-6 px-4 py-6">
                <Heading
                    title="Updates"
                    description="Company and project updates that employees can review without navigating the planning workspace."
                />

                <Card className="border-slate-200 bg-white/95 shadow-sm dark:border-slate-700/60 dark:bg-[#111827] dark:shadow-[0_22px_45px_-34px_rgba(2,6,23,0.88)]">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base text-slate-900 dark:text-slate-100">
                            <Megaphone className="size-4 text-sky-600" />
                            Shared updates feed
                        </CardTitle>
                        <CardDescription>
                            A read-only landing area for release notes, process
                            changes, and delivery updates.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-slate-500 dark:text-slate-400">
                        This completes the employee workspace skeleton without
                        overloading the backlog or analytics pages.
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
