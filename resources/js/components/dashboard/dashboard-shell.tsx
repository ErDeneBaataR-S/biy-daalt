import { usePage } from '@inertiajs/react';
import { Bell, ChevronDown, CopyPlus, Search } from 'lucide-react';
import type { ChangeEvent, ReactNode } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useInitials } from '@/hooks/use-initials';
import type { Auth } from '@/types/auth';

type DashboardShellProps = {
    searchValue: string;
    onSearchChange: (value: string) => void;
    onCreateInitiative: () => void;
    onCreateRelease: () => void;
    children: ReactNode;
};

export function DashboardShell({
    searchValue,
    onSearchChange,
    onCreateInitiative,
    onCreateRelease,
    children,
}: DashboardShellProps) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const getInitials = useInitials();

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        onSearchChange(event.target.value);
    };

    return (
        <div className="flex flex-1 flex-col bg-[#eef2f7] px-3 py-3 sm:px-4 sm:py-4 lg:px-5">
            <div className="mx-auto w-full max-w-7xl rounded-[2rem] border border-white/70 bg-[#f8fafe] p-3 shadow-[0_30px_80px_-48px_rgba(15,23,42,0.35)] sm:p-4 lg:p-5">
                <div className="flex flex-col gap-3 border-b border-slate-200/80 pb-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                        <SidebarTrigger className="h-9 w-9 rounded-xl border border-slate-200 bg-white text-slate-500 md:hidden" />
                        <div className="relative w-full max-w-xl flex-1 lg:w-[24rem]">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                aria-label="Search dashboard"
                                placeholder="Search"
                                value={searchValue}
                                onChange={handleSearchChange}
                                className="h-10 rounded-full border-slate-200 bg-white pl-10 text-sm shadow-none focus-visible:ring-sky-100"
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-9 rounded-full border border-white/70 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        >
                            <Search className="size-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-9 rounded-full border border-white/70 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        >
                            <Bell className="size-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-9 rounded-full border border-white/70 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        >
                            <CopyPlus className="size-4" />
                        </Button>
                        <Avatar className="size-9 border border-slate-200 bg-white">
                            <AvatarFallback className="bg-slate-900 text-[0.7rem] font-semibold text-white">
                                {getInitials(auth.user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <Button
                            onClick={onCreateInitiative}
                            className="h-10 rounded-xl bg-sky-500 px-4 text-sm font-medium text-white shadow-none hover:bg-sky-600"
                        >
                            New
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="size-9 rounded-xl border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                            onClick={onCreateRelease}
                        >
                            <ChevronDown className="size-4" />
                        </Button>
                    </div>
                </div>
                <div className="space-y-4 pt-4 lg:space-y-5">{children}</div>
            </div>
        </div>
    );
}
