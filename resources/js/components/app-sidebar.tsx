import { Link } from '@inertiajs/react';
import {
    BookOpenText,
    CalendarRange,
    ChartColumnBig,
    LayoutGrid,
    ListTodo,
    MessageSquareMore,
    Settings,
    Sparkles,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { backlog, dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Roadmap',
        href: '/roadmap',
        icon: Sparkles,
    },
    {
        title: 'Backlog',
        href: backlog(),
        icon: ListTodo,
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

export function AppSidebar() {
    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="border-none bg-transparent"
        >
            <SidebarHeader className="px-4 pt-5 pb-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="h-auto rounded-2xl border border-white/70 bg-white/90 p-2 shadow-[0_18px_40px_-38px_rgba(15,23,42,0.9)] hover:bg-white data-[active=true]:bg-white dark:border-slate-700/60 dark:bg-[#111a2b]/95 dark:hover:bg-[#162033] dark:data-[active=true]:bg-[#162033]"
                        >
                            <Link
                                href={dashboard()}
                                prefetch
                                className="rounded-2xl"
                            >
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-3 pb-3">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="px-3 pt-2 pb-3">
                <div className="rounded-2xl border border-white/80 bg-white/90 p-2 shadow-[0_18px_40px_-38px_rgba(15,23,42,0.9)] dark:border-slate-700/60 dark:bg-[#111a2b]/95 dark:shadow-[0_20px_45px_-34px_rgba(2,6,23,0.9)]">
                    <NavUser />
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
