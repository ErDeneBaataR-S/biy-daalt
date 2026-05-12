import { Head, Link, usePage } from '@inertiajs/react';
import { Activity, ArrowRight, ClipboardList, ShieldCheck } from 'lucide-react';
import { login, register } from '@/routes';
import type { Auth } from '@/types/auth';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const homeHref =
        auth.user?.role === 'admin'
            ? '/admin'
            : auth.user?.role === 'employee'
              ? '/my-dashboard'
              : '/dashboard';

    return (
        <>
            <Head title="TeamPulse" />
            <main className="min-h-screen bg-slate-950 text-white">
                <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6">
                    <header className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500">
                                <Activity className="size-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">
                                    TeamPulse
                                </p>
                                <p className="text-xs text-slate-400">
                                    Work hub
                                </p>
                            </div>
                        </div>

                        <nav className="flex items-center gap-3 text-sm">
                            {auth.user ? (
                                <Link
                                    href={homeHref}
                                    className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 font-medium text-slate-950"
                                >
                                    Open workspace
                                    <ArrowRight className="size-4" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="rounded-md px-4 py-2 font-medium text-slate-200 hover:bg-white/10"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="rounded-md bg-white px-4 py-2 font-medium text-slate-950"
                                        >
                                            Register
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </header>

                    <div className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr]">
                        <section className="max-w-2xl space-y-6">
                            <p className="text-sm font-semibold tracking-[0.2em] text-sky-300 uppercase">
                                Role-based team operations
                            </p>
                            <h1 className="text-5xl font-semibold tracking-normal text-white md:text-6xl">
                                TeamPulse
                            </h1>
                            <p className="max-w-xl text-lg leading-8 text-slate-300">
                                Connect admins, managers, and employees through
                                shared projects, planning views, personal tasks,
                                and updates.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href={auth.user ? homeHref : login()}
                                    className="inline-flex items-center gap-2 rounded-md bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-300"
                                >
                                    {auth.user
                                        ? 'Open workspace'
                                        : 'Start working'}
                                    <ArrowRight className="size-4" />
                                </Link>
                            </div>
                        </section>

                        <section className="grid gap-3">
                            {[
                                {
                                    title: 'Admin control',
                                    description:
                                        'Manage users, roles, access, and organization-wide visibility.',
                                    icon: ShieldCheck,
                                },
                                {
                                    title: 'Manager planning',
                                    description:
                                        'Coordinate projects, backlog, roadmap, feedback, releases, and analytics.',
                                    icon: ClipboardList,
                                },
                                {
                                    title: 'Employee focus',
                                    description:
                                        'Track assigned work, personal tasks, and updates in one connected workspace.',
                                    icon: Activity,
                                },
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    className="rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-slate-950/40"
                                >
                                    <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-sky-400/15 text-sky-200">
                                        <item.icon className="size-5" />
                                    </div>
                                    <h2 className="text-base font-semibold">
                                        {item.title}
                                    </h2>
                                    <p className="mt-2 text-sm leading-6 text-slate-300">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </section>
                    </div>
                </section>
            </main>
        </>
    );
}
