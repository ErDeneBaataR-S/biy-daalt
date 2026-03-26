import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-0 py-0">
            <SidebarMenu className="gap-1.5">
                {items.map((item) => {
                    const isActive = isCurrentUrl(item.href);
                    const isDisabled = item.disabled ?? false;

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive && !isDisabled}
                                tooltip={{ children: item.title }}
                                className={cn(
                                    'h-10 rounded-xl px-3 text-[0.92rem] font-medium text-slate-500 hover:bg-white hover:text-slate-900 data-[active=true]:bg-white data-[active=true]:text-sky-600 data-[active=true]:shadow-sm',
                                    isActive &&
                                        !isDisabled &&
                                        'before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-sky-500',
                                    isDisabled &&
                                        'cursor-default opacity-70 hover:bg-transparent hover:text-slate-500',
                                )}
                            >
                                <Link
                                    href={item.href}
                                    prefetch={!isDisabled}
                                    onClick={(event) => {
                                        if (isDisabled) {
                                            event.preventDefault();
                                        }
                                    }}
                                >
                                    {item.icon && <item.icon className="size-4" />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
