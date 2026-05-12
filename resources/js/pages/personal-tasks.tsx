import { Head, router, usePage } from '@inertiajs/react';
import { NotebookPen, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Personal Tasks',
        href: '/personal-tasks',
    },
];

type EmployeeTask = {
    id: number;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    due_date: string | null;
};

export default function PersonalTasks() {
    const { tasks } = usePage<{ tasks: EmployeeTask[] }>().props;
    const [title, setTitle] = useState('');

    const createTask = () => {
        if (!title.trim()) {
            return;
        }

        router.post(
            '/personal-tasks',
            {
                title: title.trim(),
                status: 'todo',
                priority: 'medium',
            },
            { preserveScroll: true },
        );
        setTitle('');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Personal Tasks" />

            <div className="space-y-6 px-4 py-6">
                <Heading
                    title="Personal Tasks"
                    description="Self-managed reminders and lightweight tasks stored in the application database."
                />

                <Card className="border-slate-200 bg-white/95 shadow-sm dark:border-slate-700/60 dark:bg-[#111827]">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <NotebookPen className="size-4 text-sky-600" />
                            Personal planning space
                        </CardTitle>
                        <CardDescription>
                            Capture personal follow-ups without mixing them into
                            manager-owned planning views.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        <Input
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="New personal task"
                            className="max-w-sm"
                        />
                        <Button onClick={createTask}>
                            <Plus className="size-4" />
                            Add
                        </Button>
                    </CardContent>
                </Card>

                <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {tasks.map((task) => (
                        <Card
                            key={task.id}
                            className="border-slate-200 bg-white/95 shadow-sm dark:border-slate-700/60 dark:bg-[#111827]"
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <CardTitle className="text-base">
                                            {task.title}
                                        </CardTitle>
                                        <CardDescription>
                                            {task.description ??
                                                'No notes attached.'}
                                        </CardDescription>
                                    </div>
                                    <Badge variant="outline">
                                        {task.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-wrap items-center justify-between gap-2">
                                <Button
                                    size="sm"
                                    variant={
                                        task.status === 'done'
                                            ? 'outline'
                                            : 'default'
                                    }
                                    onClick={() =>
                                        router.patch(
                                            `/personal-tasks/${task.id}`,
                                            {
                                                status:
                                                    task.status === 'done'
                                                        ? 'todo'
                                                        : 'done',
                                            },
                                            { preserveScroll: true },
                                        )
                                    }
                                >
                                    {task.status === 'done'
                                        ? 'Reopen'
                                        : 'Complete'}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        router.delete(
                                            `/personal-tasks/${task.id}`,
                                            { preserveScroll: true },
                                        )
                                    }
                                    aria-label={`Delete ${task.title}`}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </section>
            </div>
        </AppLayout>
    );
}
