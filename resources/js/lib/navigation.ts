import {
    BookOpenText,
    CalendarRange,
    ChartColumnBig,
    LayoutGrid,
    ListTodo,
    MessageSquareMore,
    Settings,
    Shield,
    Sparkles,
    UserCog,
} from 'lucide-react';
import type { UserRole } from '@/types/auth';
import type { NavItem } from '@/types/navigation';

export function getSidebarItems(role: UserRole): NavItem[] {
    if (role === 'admin') {
        return [
            {
                title: 'Overview',
                href: '/admin',
                icon: LayoutGrid,
            },
            {
                title: 'Users',
                href: '/admin/users',
                icon: UserCog,
                disabled: true,
            },
            {
                title: 'Roles / Access',
                href: '/admin/access',
                icon: Shield,
                disabled: true,
            },
            {
                title: 'Projects',
                href: '/projects',
                icon: ListTodo,
            },
            {
                title: 'Analytics',
                href: '/analytics',
                icon: ChartColumnBig,
            },
            {
                title: 'Docs',
                href: '/docs',
                icon: BookOpenText,
            },
            {
                title: 'Settings',
                href: '/settings',
                icon: Settings,
            },
        ];
    }

    if (role === 'employee') {
        return [
            {
                title: 'My Dashboard',
                href: '/my-dashboard',
                icon: LayoutGrid,
            },
            {
                title: 'My Tasks',
                href: '/my-tasks',
                icon: ListTodo,
            },
            {
                title: 'Personal Tasks',
                href: '/personal-tasks',
                icon: ListTodo,
            },
            {
                title: 'Updates',
                href: '/updates',
                icon: MessageSquareMore,
            },
            {
                title: 'Docs',
                href: '/docs',
                icon: BookOpenText,
            },
            {
                title: 'Settings',
                href: '/settings',
                icon: Settings,
            },
        ];
    }

    return [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Projects',
            href: '/projects',
            icon: ListTodo,
        },
        {
            title: 'Backlog',
            href: '/backlog',
            icon: ListTodo,
        },
        {
            title: 'Roadmap',
            href: '/roadmap',
            icon: Sparkles,
        },
        {
            title: 'Feedback',
            href: '/feedback',
            icon: MessageSquareMore,
        },
        {
            title: 'Releases',
            href: '/releases',
            icon: CalendarRange,
        },
        {
            title: 'Analytics',
            href: '/analytics',
            icon: ChartColumnBig,
        },
        {
            title: 'Docs',
            href: '/docs',
            icon: BookOpenText,
        },
        {
            title: 'Settings',
            href: '/settings',
            icon: Settings,
        },
    ];
}
