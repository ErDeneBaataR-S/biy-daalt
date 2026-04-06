import { Head, Link, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    Palette,
    ShieldCheck,
    UserRound,
} from 'lucide-react';
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
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: '/settings',
    },
];

const quickActions = [
    {
        label: 'Edit profile',
        href: '/settings/profile',
        // description: 'Update your name and email details.',
    },
    {
        label: 'Open security',
        href: '/settings/security',
        // description: 'Review password and two-factor access.',
    },
    {
        label: 'Change appearance',
        href: '/settings/appearance',
        // description: 'Switch theme and interface preferences.',
    },
];

const toneClasses = {
    sky: 'border-sky-200 bg-sky-50 text-sky-700',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
} as const;

export default function SettingsOverview() {
    const { auth } = usePage().props as {
        auth: {
            user: {
                name: string;
                email: string;
                email_verified_at: string | null;
            };
        };
    };

    const accountItems = [
        {
            label: 'Email status',
            value: auth.user.email_verified_at
                ? 'Verified'
                : 'Pending verification',
            tone: auth.user.email_verified_at ? 'emerald' : 'amber',
        },
        {
            label: 'Security',
            value: 'Password and 2FA ready',
            tone: 'sky',
        },
        {
            label: 'Appearance',
            value: 'Theme preferences available',
            tone: 'sky',
        },
    ] as const;

    const managementCards = [
        {
            title: 'Profile',
            description:
                'Review your personal details and update your account identity.',
            href: '/settings/profile',
            icon: UserRound,
            summary: auth.user.email,
            actionLabel: 'Manage profile',
        },
        {
            title: 'Security',
            description:
                'Check password and two-factor protection settings.',
            href: '/settings/security',
            icon: ShieldCheck,
            summary: 'Passwords and recovery settings',
            actionLabel: 'Manage security',
        },
        {
            title: 'Appearance',
            description:
                'Adjust theme preferences and interface appearance.',
            href: '/settings/appearance',
            icon: Palette,
            summary: 'Theme and display preferences',
            actionLabel: 'Manage appearance',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Settings" />

            <h1 className="sr-only">Settings</h1>

            <SettingsLayout>
                <div className="space-y-8">
                    <section className="space-y-3">
                        <Heading
                            variant="small"
                            title="Account overview"
                            description="Your account status and the fastest paths to common settings tasks."
                        />
                    </section>

                    <section className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_360px]">
                        <Card className="border-slate-200 bg-white/95 shadow-sm">
                            <CardHeader className="gap-5">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-500">
                                            Account
                                        </p>
                                        <CardTitle className="mt-2 text-2xl text-slate-900">
                                            {auth.user.name}
                                        </CardTitle>
                                        <CardDescription className="mt-1 text-sm text-slate-500">
                                            {auth.user.email}
                                        </CardDescription>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            'rounded-full px-3 py-1 text-xs font-semibold',
                                            auth.user.email_verified_at
                                                ? toneClasses.emerald
                                                : toneClasses.amber,
                                        )}
                                    >
                                        {auth.user.email_verified_at
                                            ? 'Verified'
                                            : 'Needs attention'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-3">
                                {accountItems.map((item) => (
                                    <div
                                        key={item.label}
                                        className={cn(
                                            'rounded-3xl border px-5 py-5',
                                            toneClasses[item.tone],
                                        )}
                                    >
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em]">
                                            {item.label}
                                        </p>
                                        <p className="mt-3 text-base font-semibold">
                                            {item.value}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="border-slate-200 bg-slate-50/90 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base text-slate-900">
                                    <CheckCircle2 className="size-4 text-sky-600" />
                                    Quick actions
                                </CardTitle>
                                <CardDescription>
                                    Open the most common account tasks without
                                    searching through the settings section.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                {quickActions.map((action) => (
                                    <Button
                                        key={action.href}
                                        variant="outline"
                                        asChild
                                        className="h-auto justify-start rounded-2xl border-slate-200 bg-white px-4 py-4 text-left text-slate-700"
                                    >
                                        <Link href={action.href}>
                                            <span className="block text-sm font-semibold text-slate-900">
                                                {action.label}
                                            </span>
                                            {/* <span className="mt-1 block text-xs text-slate-500">
                                                {action.description}
                                            </span> */}
                                        </Link>
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>
                    </section>

                    <section className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                        {managementCards.map((card) => (
                            <Card
                                key={card.title}
                                className="border-slate-200 bg-white/95 shadow-sm"
                            >
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base text-slate-900">
                                        <card.icon className="size-4 text-sky-600" />
                                        {card.title}
                                    </CardTitle>
                                    <CardDescription>
                                        {card.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex h-full flex-col gap-4">
                                    <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                                        {card.summary}
                                    </p>
                                    <Button
                                        asChild
                                        className="mt-auto w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800"
                                    >
                                        <Link href={card.href}>
                                            {card.actionLabel}
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </section>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
