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
        href: '#roadmap',
        icon: Sparkles,
        disabled: true,
    },
    {
        title: 'Backlog',
        href: backlog(),
        icon: ListTodo,
    },
    {
        title: 'Feedback',
        href: '#feedback',
        icon: MessageSquareMore,
        disabled: true,
    },
    {
        title: 'Releases',
        href: '#releases',
        icon: CalendarRange,
        disabled: true,
    },
    {
        title: 'Analytics',
        href: '#analytics',
        icon: ChartColumnBig,
        disabled: true,
    },
    {
        title: 'Docs',
        href: '#docs',
        icon: BookOpenText,
        disabled: true,
    },
    {
        title: 'Settings',
        href: '#settings',
        icon: Settings,
        disabled: true,
    },
];

export function AppSidebar() {
    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="border-none bg-transparent"
        >
            <SidebarHeader className="px-4 pb-4 pt-5">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="h-auto rounded-2xl border border-white/70 bg-white/90 p-2 shadow-[0_18px_40px_-38px_rgba(15,23,42,0.9)] hover:bg-white data-[active=true]:bg-white"
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

            <SidebarFooter className="px-3 pb-3 pt-2">
                <div className="rounded-2xl border border-white/80 bg-white/90 p-2 shadow-[0_18px_40px_-38px_rgba(15,23,42,0.9)]">
                    <NavUser />
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
