import { Head, router, usePage } from '@inertiajs/react';
import { FolderKanban, Lock, Plus, ShieldCheck, Trash2 } from 'lucide-react';
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
        title: 'Projects',
        href: '/projects',
    },
];

type Project = {
    id: number;
    name: string;
    description: string | null;
    status: string;
    owner: string | null;
};

export default function Projects() {
    const { auth, projects } = usePage<{ auth: Auth; projects: Project[] }>()
        .props;
    const canManage = auth.capabilities.manage_projects;
    const [name, setName] = useState('');

    const createProject = () => {
        if (!name.trim()) {
            return;
        }

        router.post(
            '/projects',
            {
                name: name.trim(),
                status: 'active',
                owner: auth.user.name,
            },
            {
                preserveScroll: true,
            },
        );
        setName('');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />

            <div className="space-y-6 px-4 py-6">
                <section className="space-y-3">
                    <p className="text-xs font-semibold tracking-[0.18em] text-sky-500 uppercase">
                        Project portfolio
                    </p>
                    <Heading
                        title="Projects"
                        description={
                            canManage
                                ? 'Manage owned projects, align delivery, and keep shared visibility across the organization.'
                                : 'Browse project status and company progress without manager-level editing controls.'
                        }
                    />
                </section>

                <section className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
                    <Card className="border-slate-200 bg-white/95 shadow-sm dark:border-slate-700/60 dark:bg-[#111827] dark:shadow-[0_22px_45px_-34px_rgba(2,6,23,0.88)]">
                        <CardHeader className="gap-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="rounded-2xl border border-sky-200 bg-sky-50 p-3 text-sky-700 dark:border-sky-900 dark:bg-sky-950/60 dark:text-sky-300">
                                    <FolderKanban className="size-5" />
                                </div>
                                <Badge
                                    variant="outline"
                                    className="rounded-full border-slate-200 bg-white px-2.5 py-0.5 text-[0.68rem] font-semibold text-slate-500 dark:border-slate-700 dark:bg-[#162033] dark:text-slate-300"
                                >
                                    {canManage
                                        ? 'Manage projects'
                                        : 'Read only'}
                                </Badge>
                            </div>
                            <div>
                                <CardTitle className="text-lg text-slate-900 dark:text-slate-100">
                                    Shared project index
                                </CardTitle>
                                <CardDescription className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    This entry point separates project
                                    visibility from the backlog workspace so
                                    admins and managers can share a cleaner
                                    overview.
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-3 md:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700/60 dark:bg-[#0f1728]">
                                <p className="text-xs font-semibold tracking-[0.16em] text-slate-400 uppercase">
                                    Access level
                                </p>
                                <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                                    {canManage ? 'Manager / Admin' : 'Viewer'}
                                </p>
                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    {canManage
                                        ? 'Editing and planning controls can live here as the role flow expands.'
                                        : 'Employees can inspect progress without inheriting operational controls.'}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700/60 dark:bg-[#0f1728]">
                                <p className="text-xs font-semibold tracking-[0.16em] text-slate-400 uppercase">
                                    Next slice
                                </p>
                                <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                                    Delivery routing
                                </p>
                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    Backlog, roadmap, and employee workspace
                                    pages can now evolve around this shared
                                    project home.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 bg-white/95 shadow-sm dark:border-slate-700/60 dark:bg-[#111827] dark:shadow-[0_22px_45px_-34px_rgba(2,6,23,0.88)]">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base text-slate-900 dark:text-slate-100">
                                {canManage ? (
                                    <ShieldCheck className="size-4 text-emerald-600" />
                                ) : (
                                    <Lock className="size-4 text-amber-600" />
                                )}
                                Role behavior
                            </CardTitle>
                            <CardDescription>
                                The page copy adapts to shared capability flags
                                rather than duplicating role checks throughout
                                the frontend.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                            <p>
                                Current user role:{' '}
                                <span className="font-semibold text-slate-700 dark:text-slate-200">
                                    {auth.user.role}
                                </span>
                            </p>
                            <p>
                                `manage_projects` is{' '}
                                <span className="font-semibold text-slate-700 dark:text-slate-200">
                                    {canManage ? 'enabled' : 'disabled'}
                                </span>
                                .
                            </p>
                        </CardContent>
                    </Card>
                </section>

                <section className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            Project records
                        </h2>
                        {canManage ? (
                            <div className="flex gap-2">
                                <Input
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    placeholder="New project"
                                    className="w-52"
                                />
                                <Button onClick={createProject}>
                                    <Plus className="size-4" />
                                    Add
                                </Button>
                            </div>
                        ) : null}
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {projects.map((project) => (
                            <Card
                                key={project.id}
                                className="border-slate-200 bg-white/95 shadow-sm dark:border-slate-700/60 dark:bg-[#111827]"
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <CardTitle className="text-base">
                                                {project.name}
                                            </CardTitle>
                                            <CardDescription>
                                                {project.owner ?? 'Unassigned'}
                                            </CardDescription>
                                        </div>
                                        <Badge variant="outline">
                                            {project.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex items-end justify-between gap-3">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {project.description ??
                                            'No description yet.'}
                                    </p>
                                    {canManage ? (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                router.delete(
                                                    `/projects/${project.id}`,
                                                    { preserveScroll: true },
                                                )
                                            }
                                            aria-label={`Delete ${project.name}`}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    ) : null}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
