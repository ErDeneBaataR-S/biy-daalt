import { Head, router, usePage } from '@inertiajs/react';
import {
    BellRing,
    BriefcaseBusiness,
    CircleAlert,
    PencilLine,
    Plus,
    Rocket,
    Trash2,
    TrendingUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { DashboardInitiativeDialog } from '@/components/dashboard/dashboard-initiative-dialog';
import { DashboardMetricCard } from '@/components/dashboard/dashboard-metric-card';
import { DashboardPanel } from '@/components/dashboard/dashboard-panel';
import { DashboardReleaseDialog } from '@/components/dashboard/dashboard-release-dialog';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { Auth, BreadcrumbItem } from '@/types';
import type {
    Initiative,
    InitiativeDraft,
    InitiativeStatus,
    Release,
    ReleaseDraft,
    ReleaseStatus,
} from '@/types/dashboard';

type ManagedEmployee = {
    id: number;
    name: string;
    email: string;
};

type ManagerTask = {
    id: number;
    title: string;
    status: string;
    employee_id?: number | null;
    employee?: ManagedEmployee | null;
};

type ManagerUpdate = {
    id: number;
    title: string;
    status: string;
    audience: string;
};

type ImprovementIdea = {
    id: number;
    title: string;
    priority: string;
    submitted_by?: ManagedEmployee | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

const storageKey = 'biydaalt.dashboard.v1';

const defaultInitiatives: Initiative[] = [
    {
        id: 'initiative-1',
        title: 'Improve onboarding',
        owner: 'Growth squad',
        status: 'on-track',
        completed: false,
    },
    {
        id: 'initiative-2',
        title: 'Launch new feature rollout',
        owner: 'Core product',
        status: 'planned',
        completed: false,
    },
    {
        id: 'initiative-3',
        title: 'Fix activation drop-off',
        owner: 'Lifecycle team',
        status: 'at-risk',
        completed: false,
    },
];

const defaultReleases: Release[] = [
    {
        id: 'release-1',
        name: 'Workspace navigation refresh',
        version: 'v2.6',
        targetDate: '2026-04-04',
        status: 'planned',
        summary:
            'Updated shell polish, cleaner navigation, and faster entry points.',
    },
    {
        id: 'release-2',
        name: 'Feedback triage tools',
        version: 'v2.7',
        targetDate: '2026-04-12',
        status: 'in-review',
        summary: 'Improved triage workflows for product ops and support.',
    },
];

function generateId(prefix: string) {
    if (
        typeof crypto !== 'undefined' &&
        typeof crypto.randomUUID === 'function'
    ) {
        return `${prefix}-${crypto.randomUUID()}`;
    }

    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readDashboardData() {
    if (typeof window === 'undefined') {
        return {
            initiatives: defaultInitiatives,
            releases: defaultReleases,
        };
    }

    try {
        const raw = window.localStorage.getItem(storageKey);

        if (!raw) {
            return {
                initiatives: defaultInitiatives,
                releases: defaultReleases,
            };
        }

        const parsed = JSON.parse(raw) as {
            initiatives?: Initiative[];
            releases?: Release[];
        };

        return {
            initiatives: Array.isArray(parsed.initiatives)
                ? parsed.initiatives
                : defaultInitiatives,
            releases: Array.isArray(parsed.releases)
                ? parsed.releases
                : defaultReleases,
        };
    } catch {
        return {
            initiatives: defaultInitiatives,
            releases: defaultReleases,
        };
    }
}

function formatStatusLabel(status: InitiativeStatus | ReleaseStatus) {
    return status.replace('-', ' ');
}

function formatReleaseDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
    }).format(date);
}

function getInitiativeTone(status: InitiativeStatus) {
    switch (status) {
        case 'at-risk':
            return 'border-rose-200 bg-rose-50 text-rose-600';
        case 'completed':
            return 'border-emerald-200 bg-emerald-50 text-emerald-600';
        case 'on-track':
            return 'border-sky-200 bg-sky-50 text-sky-600';
        default:
            return 'border-slate-200 bg-slate-50 text-slate-600';
    }
}

function getReleaseTone(status: ReleaseStatus) {
    switch (status) {
        case 'shipped':
            return 'border-emerald-200 bg-emerald-50 text-emerald-600';
        case 'in-review':
            return 'border-amber-200 bg-amber-50 text-amber-600';
        default:
            return 'border-sky-200 bg-sky-50 text-sky-600';
    }
}

export default function Dashboard() {
    const { auth, employees, assignedTasks, managerTasks, updates, ideas } =
        usePage<{
            auth: Auth;
            employees: ManagedEmployee[];
            assignedTasks: ManagerTask[];
            managerTasks: ManagerTask[];
            updates: ManagerUpdate[];
            ideas: ImprovementIdea[];
        }>().props;
    const [{ initiatives: initialInitiatives, releases: initialReleases }] =
        useState(readDashboardData);
    const [searchValue, setSearchValue] = useState('');
    const [initiatives, setInitiatives] =
        useState<Initiative[]>(initialInitiatives);
    const [releases, setReleases] = useState<Release[]>(initialReleases);
    const [initiativeDialogOpen, setInitiativeDialogOpen] = useState(false);
    const [releaseDialogOpen, setReleaseDialogOpen] = useState(false);
    const [editingInitiative, setEditingInitiative] =
        useState<Initiative | null>(null);
    const [editingRelease, setEditingRelease] = useState<Release | null>(null);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(
        employees[0]?.id ? String(employees[0].id) : '',
    );
    const [selectedTaskId, setSelectedTaskId] = useState('');
    const [assignmentTitle, setAssignmentTitle] = useState('');
    const [updateTitle, setUpdateTitle] = useState('');

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        try {
            window.localStorage.setItem(
                storageKey,
                JSON.stringify({ initiatives, releases }),
            );
        } catch {
            return;
        }
    }, [initiatives, releases]);

    const normalizedQuery = searchValue.trim().toLowerCase();
    const filteredInitiatives = initiatives.filter((initiative) => {
        if (!normalizedQuery) {
            return true;
        }

        return [initiative.title, initiative.owner, initiative.status].some(
            (value) => value.toLowerCase().includes(normalizedQuery),
        );
    });
    const filteredReleases = releases.filter((release) => {
        if (!normalizedQuery) {
            return true;
        }

        return [
            release.name,
            release.version,
            release.status,
            release.summary,
            release.targetDate,
        ].some((value) => value.toLowerCase().includes(normalizedQuery));
    });

    const activeInitiatives = initiatives.filter(
        (initiative) => !initiative.completed,
    ).length;
    const healthyInitiatives = initiatives.filter(
        (initiative) => initiative.status !== 'at-risk',
    ).length;
    const onTrackPercentage =
        initiatives.length === 0
            ? 0
            : Math.round((healthyInitiatives / initiatives.length) * 100);
    const atRiskCount = initiatives.filter(
        (initiative) => initiative.status === 'at-risk',
    ).length;
    const upcomingReleases = releases.filter(
        (release) => release.status !== 'shipped',
    ).length;
    const unassignedManagerTasks = managerTasks.filter(
        (task) => task.status === 'unassigned',
    );

    const metrics = [
        {
            label: 'Active Initiatives',
            value: `${activeInitiatives}`,
            helper: `${initiatives.length} total tracked`,
            tone: 'blue' as const,
            trend: 'M2 22C10 18 18 19 26 16C34 13 42 14 50 8',
            icon: <BriefcaseBusiness className="size-4" />,
        },
        {
            label: 'On Track',
            value: `${onTrackPercentage}%`,
            helper: 'Healthy delivery confidence',
            tone: 'sky' as const,
            trend: 'M2 22C10 22 18 20 26 16C34 12 42 10 50 7',
            icon: <TrendingUp className="size-4" />,
        },
        {
            label: 'At Risk',
            value: `${atRiskCount}`,
            helper: 'Needs active attention',
            tone: 'rose' as const,
            trend: 'M2 22C10 18 18 13 26 15C34 17 42 10 50 12',
            icon: <CircleAlert className="size-4" />,
        },
        {
            label: 'Upcoming Releases',
            value: `${upcomingReleases}`,
            helper: 'Planned or in review',
            tone: 'slate' as const,
            trend: 'M2 21H20V16H34V16H50V9',
            icon: <Rocket className="size-4" />,
        },
    ];

    const workspaceLabel =
        auth.user.role === 'manager'
            ? 'Manager workspace'
            : 'Product workspace';
    const workspaceDescription =
        auth.user.role === 'manager'
            ? 'Planning-focused overview with local CRUD for initiatives and releases.'
            : 'Frontend-only overview with local CRUD for initiatives and releases.';

    const handleCreateInitiative = (draft: InitiativeDraft) => {
        setInitiatives((current) => [
            {
                id: generateId('initiative'),
                ...draft,
            },
            ...current,
        ]);
        setEditingInitiative(null);
    };

    const handleUpdateInitiative = (draft: InitiativeDraft) => {
        if (!editingInitiative) {
            return;
        }

        setInitiatives((current) =>
            current.map((initiative) =>
                initiative.id === editingInitiative.id
                    ? {
                          ...initiative,
                          ...draft,
                      }
                    : initiative,
            ),
        );
        setEditingInitiative(null);
    };

    const handleCreateRelease = (draft: ReleaseDraft) => {
        setReleases((current) => [
            {
                id: generateId('release'),
                ...draft,
            },
            ...current,
        ]);
        setEditingRelease(null);
    };

    const handleUpdateRelease = (draft: ReleaseDraft) => {
        if (!editingRelease) {
            return;
        }

        setReleases((current) =>
            current.map((release) =>
                release.id === editingRelease.id
                    ? {
                          ...release,
                          ...draft,
                      }
                    : release,
            ),
        );
        setEditingRelease(null);
    };

    const createManagerTask = () => {
        if (!assignmentTitle.trim()) {
            return;
        }

        router.post(
            '/manager/tasks',
            {
                title: assignmentTitle.trim(),
                priority: 'medium',
            },
            { preserveScroll: true },
        );
        setAssignmentTitle('');
    };

    const assignManagerTask = () => {
        if (!selectedTaskId || !selectedEmployeeId) {
            return;
        }

        router.patch(
            `/manager/tasks/${selectedTaskId}/assign`,
            {
                employee_id: Number(selectedEmployeeId),
            },
            { preserveScroll: true },
        );
        setSelectedTaskId('');
    };

    const createUpdate = () => {
        if (!updateTitle.trim()) {
            return;
        }

        router.post(
            '/updates',
            {
                title: updateTitle.trim(),
                status: 'published',
                audience: 'assigned',
            },
            { preserveScroll: true },
        );
        setUpdateTitle('');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manager Dashboard" />

            <DashboardShell
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                onCreateInitiative={() => {
                    setEditingInitiative(null);
                    setInitiativeDialogOpen(true);
                }}
                onCreateRelease={() => {
                    setEditingRelease(null);
                    setReleaseDialogOpen(true);
                }}
            >
                <section>
                    <p className="text-xs font-semibold tracking-[0.18em] text-sky-500 uppercase">
                        {workspaceLabel}
                    </p>
                    <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h1 className="text-[1.9rem] font-semibold tracking-[-0.04em] text-slate-900">
                                Dashboard
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                {workspaceDescription}
                            </p>
                        </div>
                        <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500">
                            {filteredInitiatives.length} initiatives /{' '}
                            {filteredReleases.length} releases
                        </div>
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {metrics.map((metric) => (
                            <DashboardMetricCard
                                key={metric.label}
                                {...metric}
                            />
                        ))}
                    </div>
                </section>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,1fr)]">
                    <DashboardPanel
                        title="Top Initiatives"
                        description="Manage current work items directly from the dashboard."
                        action={
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl border-slate-200 bg-white"
                                onClick={() => {
                                    setEditingInitiative(null);
                                    setInitiativeDialogOpen(true);
                                }}
                            >
                                <Plus className="size-4" />
                                Add
                            </Button>
                        }
                    >
                        <div className="space-y-3">
                            {filteredInitiatives.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center text-sm text-slate-500">
                                    No initiatives match your current search.
                                </div>
                            ) : (
                                filteredInitiatives.map((initiative) => (
                                    <div
                                        key={initiative.id}
                                        className="flex flex-col gap-3 rounded-[1.1rem] border border-slate-200 bg-slate-50/70 px-4 py-4"
                                    >
                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                checked={initiative.completed}
                                                onCheckedChange={(checked) => {
                                                    const completed =
                                                        checked === true;

                                                    setInitiatives((current) =>
                                                        current.map((item) =>
                                                            item.id ===
                                                            initiative.id
                                                                ? {
                                                                      ...item,
                                                                      completed,
                                                                      status: completed
                                                                          ? 'completed'
                                                                          : item.status ===
                                                                              'completed'
                                                                            ? 'on-track'
                                                                            : item.status,
                                                                  }
                                                                : item,
                                                        ),
                                                    );
                                                }}
                                                aria-label={initiative.title}
                                                className="mt-1 border-sky-200 data-[state=checked]:border-sky-500 data-[state=checked]:bg-sky-500"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="text-sm font-semibold text-slate-800">
                                                        {initiative.title}
                                                    </p>
                                                    <Badge
                                                        variant="outline"
                                                        className={`rounded-full border px-2.5 py-0.5 text-[0.68rem] font-semibold capitalize ${getInitiativeTone(initiative.status)}`}
                                                    >
                                                        {formatStatusLabel(
                                                            initiative.status,
                                                        )}
                                                    </Badge>
                                                </div>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    Owner: {initiative.owner}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8 rounded-lg text-slate-400 hover:bg-white hover:text-slate-700"
                                                    onClick={() => {
                                                        setEditingInitiative(
                                                            initiative,
                                                        );
                                                        setInitiativeDialogOpen(
                                                            true,
                                                        );
                                                    }}
                                                >
                                                    <PencilLine className="size-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8 rounded-lg text-slate-400 hover:bg-white hover:text-rose-500"
                                                    onClick={() =>
                                                        setInitiatives(
                                                            (current) =>
                                                                current.filter(
                                                                    (item) =>
                                                                        item.id !==
                                                                        initiative.id,
                                                                ),
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </DashboardPanel>

                    <div className="grid gap-4">
                        <DashboardPanel
                            title="Employee Control"
                            description="Assign work, publish updates, and approve employee ideas into todo work."
                        >
                            <div className="space-y-4">
                                <div className="rounded-[1.1rem] border border-slate-200 bg-slate-50/80 p-3">
                                    <p className="mb-2 text-sm font-semibold text-slate-800">
                                        Add task
                                    </p>
                                    <div className="flex gap-2">
                                        <Input
                                            value={assignmentTitle}
                                            onChange={(event) =>
                                                setAssignmentTitle(
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Task title"
                                        />
                                        <Button onClick={createManagerTask}>
                                            Add
                                        </Button>
                                    </div>
                                </div>

                                <div className="rounded-[1.1rem] border border-slate-200 bg-slate-50/80 p-3">
                                    <p className="mb-2 text-sm font-semibold text-slate-800">
                                        Assign task to employee
                                    </p>
                                    <div className="grid gap-2">
                                        <select
                                            value={selectedTaskId}
                                            onChange={(event) =>
                                                setSelectedTaskId(
                                                    event.target.value,
                                                )
                                            }
                                            className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm"
                                        >
                                            <option value="">
                                                Select unassigned task
                                            </option>
                                            {unassignedManagerTasks.map(
                                                (task) => (
                                                    <option
                                                        key={task.id}
                                                        value={task.id}
                                                    >
                                                        {task.title}
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                        <select
                                            value={selectedEmployeeId}
                                            onChange={(event) =>
                                                setSelectedEmployeeId(
                                                    event.target.value,
                                                )
                                            }
                                            className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm"
                                        >
                                            {employees.length === 0 ? (
                                                <option value="">
                                                    No assigned employees
                                                </option>
                                            ) : (
                                                employees.map((employee) => (
                                                    <option
                                                        key={employee.id}
                                                        value={employee.id}
                                                    >
                                                        {employee.name}
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                        <Button onClick={assignManagerTask}>
                                            Assign
                                        </Button>
                                    </div>
                                </div>

                                <div className="rounded-[1.1rem] border border-slate-200 bg-slate-50/80 p-3">
                                    <p className="mb-2 text-sm font-semibold text-slate-800">
                                        Publish update
                                    </p>
                                    <div className="flex gap-2">
                                        <Input
                                            value={updateTitle}
                                            onChange={(event) =>
                                                setUpdateTitle(
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Update title"
                                        />
                                        <Button onClick={createUpdate}>
                                            Publish
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-slate-800">
                                        Pending improvement ideas
                                    </p>
                                    {ideas.length === 0 ? (
                                        <p className="text-sm text-slate-500">
                                            No employee ideas waiting.
                                        </p>
                                    ) : (
                                        ideas.slice(0, 4).map((idea) => (
                                            <div
                                                key={idea.id}
                                                className="flex items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-3 py-2"
                                            >
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium text-slate-800">
                                                        {idea.title}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {
                                                            idea.submitted_by
                                                                ?.name
                                                        }
                                                    </p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        router.patch(
                                                            `/feedback/${idea.id}/approve`,
                                                            {},
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
                                                    }
                                                >
                                                    Approve
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="grid gap-2 text-sm text-slate-500">
                                    <p>
                                        {unassignedManagerTasks.length}{' '}
                                        unassigned tasks
                                    </p>
                                    <p>{assignedTasks.length} assigned tasks</p>
                                    <p>{updates.length} manager updates</p>
                                </div>
                            </div>
                        </DashboardPanel>

                        <DashboardPanel
                            title="Releases"
                            description="Plan and update release information before backend persistence exists."
                            action={
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl border-slate-200 bg-white"
                                    onClick={() => {
                                        setEditingRelease(null);
                                        setReleaseDialogOpen(true);
                                    }}
                                >
                                    <Plus className="size-4" />
                                    Add
                                </Button>
                            }
                        >
                            <div className="space-y-3">
                                {filteredReleases.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center text-sm text-slate-500">
                                        No releases match your current search.
                                    </div>
                                ) : (
                                    filteredReleases.map((release) => (
                                        <div
                                            key={release.id}
                                            className="rounded-[1.1rem] border border-slate-200 bg-slate-50/70 px-4 py-4"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <p className="text-sm font-semibold text-slate-800">
                                                            {release.name}
                                                        </p>
                                                        <Badge
                                                            variant="outline"
                                                            className={`rounded-full border px-2.5 py-0.5 text-[0.68rem] font-semibold capitalize ${getReleaseTone(release.status)}`}
                                                        >
                                                            {formatStatusLabel(
                                                                release.status,
                                                            )}
                                                        </Badge>
                                                    </div>
                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {release.version} /{' '}
                                                        {formatReleaseDate(
                                                            release.targetDate,
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 rounded-lg text-slate-400 hover:bg-white hover:text-slate-700"
                                                        onClick={() => {
                                                            setEditingRelease(
                                                                release,
                                                            );
                                                            setReleaseDialogOpen(
                                                                true,
                                                            );
                                                        }}
                                                    >
                                                        <PencilLine className="size-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 rounded-lg text-slate-400 hover:bg-white hover:text-rose-500"
                                                        onClick={() =>
                                                            setReleases(
                                                                (current) =>
                                                                    current.filter(
                                                                        (
                                                                            item,
                                                                        ) =>
                                                                            item.id !==
                                                                            release.id,
                                                                    ),
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                                {release.summary}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </DashboardPanel>

                        <DashboardPanel
                            title="My Work"
                            description="Quick signals to keep the right side of the layout aligned with the reference."
                            action={
                                <BellRing className="size-4 text-slate-400" />
                            }
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between rounded-[1.1rem] border border-slate-200 bg-slate-50/80 px-4 py-3">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">
                                            Local storage sync
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Dashboard data persists after
                                            refresh.
                                        </p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="rounded-full border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[0.68rem] font-semibold text-emerald-600"
                                    >
                                        Ready
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between rounded-[1.1rem] border border-slate-200 bg-slate-50/80 px-4 py-3">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">
                                            Backend handoff
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            IDs are dynamic in React and can map
                                            to Laravel later.
                                        </p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="rounded-full border-slate-200 bg-white px-2.5 py-0.5 text-[0.68rem] font-semibold text-slate-500"
                                    >
                                        Pending
                                    </Badge>
                                </div>
                            </div>
                        </DashboardPanel>
                    </div>
                </div>
            </DashboardShell>

            <DashboardInitiativeDialog
                key={`initiative-${editingInitiative?.id ?? 'new'}-${initiativeDialogOpen ? 'open' : 'closed'}`}
                open={initiativeDialogOpen}
                onOpenChange={(open) => {
                    setInitiativeDialogOpen(open);

                    if (!open) {
                        setEditingInitiative(null);
                    }
                }}
                initiative={editingInitiative}
                onSubmit={(draft) => {
                    if (editingInitiative) {
                        handleUpdateInitiative(draft);

                        return;
                    }

                    handleCreateInitiative(draft);
                }}
            />

            <DashboardReleaseDialog
                key={`release-${editingRelease?.id ?? 'new'}-${releaseDialogOpen ? 'open' : 'closed'}`}
                open={releaseDialogOpen}
                onOpenChange={(open) => {
                    setReleaseDialogOpen(open);

                    if (!open) {
                        setEditingRelease(null);
                    }
                }}
                release={editingRelease}
                onSubmit={(draft) => {
                    if (editingRelease) {
                        handleUpdateRelease(draft);

                        return;
                    }

                    handleCreateRelease(draft);
                }}
            />
        </AppLayout>
    );
}
