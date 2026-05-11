import { Head, usePage } from '@inertiajs/react';
import { CheckCircle2, Shield, UsersRound } from 'lucide-react';
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
import type { BreadcrumbItem, UserRole } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin',
    },
    {
        title: 'Roles / Access',
        href: '/admin/access',
    },
];

type RoleAccess = {
    role: UserRole;
    capabilities: string[];
};

type PageProps = {
    roles: RoleAccess[];
};

const roleLabels: Record<UserRole, string> = {
    admin: 'Admin',
    manager: 'Manager',
    employee: 'Employee',
};

export default function AdminAccess() {
    const { roles } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles / Access" />

            <div className="space-y-6 px-4 py-6">
                <section className="space-y-3">
                    <p className="text-xs font-semibold tracking-[0.18em] text-sky-500 uppercase">
                        Control center
                    </p>
                    <Heading
                        title="Roles / Access"
                        description="A read-only map of company roles and their current workspace permissions."
                    />
                </section>

                <section className="grid gap-4 lg:grid-cols-3">
                    {roles.map((item) => (
                        <Card
                            key={item.role}
                            className="border-slate-200 bg-white/95 shadow-sm dark:border-slate-700/60 dark:bg-[#111827]"
                        >
                            <CardHeader className="gap-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sky-700 dark:border-sky-900 dark:bg-sky-950/60 dark:text-sky-300">
                                        {item.role === 'admin' ? (
                                            <Shield className="size-5" />
                                        ) : (
                                            <UsersRound className="size-5" />
                                        )}
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="rounded-full"
                                    >
                                        {item.capabilities.length} permissions
                                    </Badge>
                                </div>
                                <div>
                                    <CardTitle>
                                        {roleLabels[item.role]}
                                    </CardTitle>
                                    <CardDescription className="mt-2">
                                        {item.role === 'admin'
                                            ? 'System control and full oversight.'
                                            : item.role === 'manager'
                                              ? 'Planning and delivery workflow access.'
                                              : 'Personal workspace and company updates.'}
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {item.capabilities.map((capability) => (
                                        <li
                                            key={capability}
                                            className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
                                        >
                                            <CheckCircle2 className="size-4 text-emerald-600" />
                                            {capability}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </section>
            </div>
        </AppLayout>
    );
}
