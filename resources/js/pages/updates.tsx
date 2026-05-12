import { Head, router, usePage } from '@inertiajs/react';
import { Megaphone, Plus, Trash2 } from 'lucide-react';
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
import type { Auth, BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Updates',
        href: '/updates',
    },
];

type WorkspaceUpdate = {
    id: number;
    title: string;
    body: string | null;
    status: string;
    audience: string;
    created_at: string;
    manager?: {
        id: number;
        name: string;
        email: string;
    } | null;
};

export default function Updates() {
    const { auth, updates } = usePage<{
        auth: Auth;
        updates: WorkspaceUpdate[];
    }>().props;
    const canManage = auth.user.role === 'manager';
    const [title, setTitle] = useState('');

    const createUpdate = () => {
        if (!title.trim()) {
            return;
        }

        router.post(
            '/updates',
            {
                title: title.trim(),
                status: 'published',
            },
            { preserveScroll: true },
        );
        setTitle('');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Updates" />

            <div className="space-y-6 px-4 py-6">
                <Heading
                    title="Updates"
                    description={
                        canManage
                            ? 'Publish updates for your assigned employees. Admins can see the feed for oversight.'
                            : 'Read manager-published updates connected to your workspace.'
                    }
                />

                {canManage ? (
                    <Card className="border-slate-200 bg-white/95 shadow-sm dark:border-slate-700/60 dark:bg-[#111827]">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Megaphone className="size-4 text-sky-600" />
                                Shared updates feed
                            </CardTitle>
                            <CardDescription>
                                Add update records and mark them as draft or
                                published.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            <Input
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                                placeholder="New update"
                                className="max-w-sm"
                            />
                            <Button onClick={createUpdate}>
                                <Plus className="size-4" />
                                Add
                            </Button>
                        </CardContent>
                    </Card>
                ) : null}

                <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {updates.map((update) => (
                        <Card
                            key={update.id}
                            className="border-slate-200 bg-white/95 shadow-sm dark:border-slate-700/60 dark:bg-[#111827]"
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <CardTitle className="text-base">
                                            {update.title}
                                        </CardTitle>
                                        <CardDescription>
                                            {update.manager?.name
                                                ? `By ${update.manager.name}`
                                                : (update.body ??
                                                  'No details yet.')}
                                        </CardDescription>
                                    </div>
                                    <Badge variant="outline">
                                        {update.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-wrap items-center justify-between gap-2">
                                {canManage ? (
                                    <>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                router.patch(
                                                    `/updates/${update.id}`,
                                                    {
                                                        status:
                                                            update.status ===
                                                            'published'
                                                                ? 'draft'
                                                                : 'published',
                                                    },
                                                    { preserveScroll: true },
                                                )
                                            }
                                        >
                                            {update.status === 'published'
                                                ? 'Move to draft'
                                                : 'Publish'}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                router.delete(
                                                    `/updates/${update.id}`,
                                                    {
                                                        preserveScroll: true,
                                                    },
                                                )
                                            }
                                            aria-label={`Delete ${update.title}`}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </>
                                ) : null}
                            </CardContent>
                        </Card>
                    ))}
                </section>
            </div>
        </AppLayout>
    );
}
