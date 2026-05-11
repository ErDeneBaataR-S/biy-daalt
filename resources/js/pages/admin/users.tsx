import { Head, router, usePage } from '@inertiajs/react';
import {
    Search,
    ShieldCheck,
    Trash2,
    UserPlus,
    UsersRound,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { Auth, BreadcrumbItem, UserRole } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin',
    },
    {
        title: 'Users',
        href: '/admin/users',
    },
];

type AdminUser = {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    email_verified_at: string | null;
    created_at: string;
};

type UserForm = {
    name: string;
    email: string;
    password: string;
    role: UserRole;
};

type PageProps = {
    auth: Auth;
    users: AdminUser[];
    roles: UserRole[];
    errors: Partial<Record<keyof UserForm, string>>;
};

const emptyForm: UserForm = {
    name: '',
    email: '',
    password: '',
    role: 'employee',
};

const roleLabels: Record<UserRole, string> = {
    admin: 'Admin',
    manager: 'Manager',
    employee: 'Employee',
};

export default function AdminUsers() {
    const { auth, users, roles, errors } = usePage<PageProps>().props;
    const [search, setSearch] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [form, setForm] = useState<UserForm>(emptyForm);

    const filteredUsers = useMemo(() => {
        const needle = search.trim().toLowerCase();

        if (!needle) {
            return users;
        }

        return users.filter((user) =>
            [user.name, user.email, user.role].some((value) =>
                value.toLowerCase().includes(needle),
            ),
        );
    }, [search, users]);

    const roleTotals = useMemo(
        () =>
            roles.map((role) => ({
                role,
                count: users.filter((user) => user.role === role).length,
            })),
        [roles, users],
    );

    const createUser = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        router.post('/admin/users', form, {
            preserveScroll: true,
            onSuccess: () => {
                setForm(emptyForm);
                setDialogOpen(false);
            },
        });
    };

    const updateRole = (user: AdminUser, role: UserRole) => {
        router.patch(
            `/admin/users/${user.id}/role`,
            { role },
            { preserveScroll: true },
        );
    };

    const deleteUser = (user: AdminUser) => {
        router.delete(`/admin/users/${user.id}`, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Users" />

            <div className="space-y-6 px-4 py-6">
                <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                        <p className="text-xs font-semibold tracking-[0.18em] text-sky-500 uppercase">
                            Control center
                        </p>
                        <Heading
                            title="Users"
                            description="Create company accounts, assign roles, and keep admin access protected."
                        />
                    </div>

                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto">
                                <UserPlus className="size-4" />
                                Add user
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <form onSubmit={createUser} className="space-y-5">
                                <DialogHeader>
                                    <DialogTitle>Create user</DialogTitle>
                                    <DialogDescription>
                                        Add a new account with the correct
                                        company access level.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="grid gap-4">
                                    <label className="grid gap-2 text-sm font-medium">
                                        Name
                                        <Input
                                            value={form.name}
                                            onChange={(event) =>
                                                setForm((current) => ({
                                                    ...current,
                                                    name: event.target.value,
                                                }))
                                            }
                                            required
                                        />
                                        <InputError message={errors.name} />
                                    </label>

                                    <label className="grid gap-2 text-sm font-medium">
                                        Email
                                        <Input
                                            type="email"
                                            value={form.email}
                                            onChange={(event) =>
                                                setForm((current) => ({
                                                    ...current,
                                                    email: event.target.value,
                                                }))
                                            }
                                            required
                                        />
                                        <InputError message={errors.email} />
                                    </label>

                                    <label className="grid gap-2 text-sm font-medium">
                                        Password
                                        <Input
                                            type="password"
                                            value={form.password}
                                            onChange={(event) =>
                                                setForm((current) => ({
                                                    ...current,
                                                    password:
                                                        event.target.value,
                                                }))
                                            }
                                            required
                                        />
                                        <InputError message={errors.password} />
                                    </label>

                                    <label className="grid gap-2 text-sm font-medium">
                                        Role
                                        <Select
                                            value={form.role}
                                            onValueChange={(role: UserRole) =>
                                                setForm((current) => ({
                                                    ...current,
                                                    role,
                                                }))
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roles.map((role) => (
                                                    <SelectItem
                                                        key={role}
                                                        value={role}
                                                    >
                                                        {roleLabels[role]}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.role} />
                                    </label>
                                </div>

                                <DialogFooter>
                                    <Button type="submit">Create</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </section>

                <section className="grid gap-3 md:grid-cols-3">
                    {roleTotals.map((item) => (
                        <Card
                            key={item.role}
                            className="border-slate-200 bg-white/95 shadow-sm dark:border-slate-700/60 dark:bg-[#111827]"
                        >
                            <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
                                <div>
                                    <CardDescription>
                                        {roleLabels[item.role]}
                                    </CardDescription>
                                    <CardTitle className="mt-2 text-3xl">
                                        {item.count}
                                    </CardTitle>
                                </div>
                                <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sky-700 dark:border-sky-900 dark:bg-sky-950/60 dark:text-sky-300">
                                    <ShieldCheck className="size-5" />
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </section>

                <Card className="border-slate-200 bg-white/95 shadow-sm dark:border-slate-700/60 dark:bg-[#111827]">
                    <CardHeader className="gap-4">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <UsersRound className="size-5 text-sky-600" />
                                    Company users
                                </CardTitle>
                                <CardDescription>
                                    {filteredUsers.length} of {users.length}{' '}
                                    accounts shown
                                </CardDescription>
                            </div>
                            <label className="relative w-full lg:w-80">
                                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search users"
                                    className="pl-9"
                                />
                            </label>
                        </div>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left text-sm">
                            <thead className="border-b border-slate-200 text-xs font-semibold tracking-[0.14em] text-slate-400 uppercase dark:border-slate-700/60">
                                <tr>
                                    <th className="py-3 pr-4">User</th>
                                    <th className="py-3 pr-4">Role</th>
                                    <th className="py-3 pr-4">Verified</th>
                                    <th className="py-3 pr-4">Created</th>
                                    <th className="py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredUsers.map((user) => {
                                    const isCurrentUser =
                                        user.id === auth.user.id;

                                    return (
                                        <tr key={user.id}>
                                            <td className="py-4 pr-4">
                                                <div>
                                                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-slate-500 dark:text-slate-400">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <Select
                                                    value={user.role}
                                                    disabled={isCurrentUser}
                                                    onValueChange={(
                                                        role: UserRole,
                                                    ) => updateRole(user, role)}
                                                >
                                                    <SelectTrigger className="w-36">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {roles.map((role) => (
                                                            <SelectItem
                                                                key={role}
                                                                value={role}
                                                            >
                                                                {
                                                                    roleLabels[
                                                                        role
                                                                    ]
                                                                }
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <Badge
                                                    variant="outline"
                                                    className="rounded-full"
                                                >
                                                    {user.email_verified_at
                                                        ? 'Verified'
                                                        : 'Pending'}
                                                </Badge>
                                            </td>
                                            <td className="py-4 pr-4 text-slate-500 dark:text-slate-400">
                                                {new Date(
                                                    user.created_at,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 text-right">
                                                {isCurrentUser ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="rounded-full"
                                                    >
                                                        You
                                                    </Badge>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            deleteUser(user)
                                                        }
                                                        aria-label={`Delete ${user.name}`}
                                                    >
                                                        <Trash2 className="size-4 text-rose-600" />
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
