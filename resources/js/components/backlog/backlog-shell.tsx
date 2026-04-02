import {
    ChevronDown,
    Plus,
    SlidersHorizontal,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { BacklogItemKind } from '@/types/backlog';

type BacklogShellProps = {
    children: ReactNode;
    itemCount: number;
    onCreateKind: (kind: BacklogItemKind) => void;
};

const createOptions: BacklogItemKind[] = ['feature', 'bug', 'design', 'research'];

function formatLabel(value: string) {
    return value.replace('-', ' ');
}

export function BacklogShell({
    children,
    itemCount,
    onCreateKind,
}: BacklogShellProps) {
    return (
        <div className="flex flex-1 flex-col bg-[#eef2f7] px-3 py-3 sm:px-4 sm:py-4 lg:px-5">
            <div className="mx-auto w-full max-w-7xl rounded-[2rem] border border-white/70 bg-[#f8fafe] p-4 shadow-[0_30px_80px_-48px_rgba(15,23,42,0.35)] sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-500">
                            Product workspace
                        </p>
                        <h1 className="mt-2 text-[1.9rem] font-semibold tracking-[-0.04em] text-slate-900">
                            Backlog
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {itemCount} work items in the frontend backlog workspace.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="rounded-xl border-slate-200 bg-white text-slate-600"
                        >
                            <SlidersHorizontal className="size-4" />
                            Filters
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="rounded-xl bg-sky-500 text-white hover:bg-sky-600">
                                    <Plus className="size-4" />
                                    New
                                    <ChevronDown className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="min-w-48 rounded-xl border-slate-200 bg-white"
                            >
                                <DropdownMenuLabel>Create item</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {createOptions.map((option) => (
                                    <DropdownMenuItem
                                        key={option}
                                        onClick={() => onCreateKind(option)}
                                        className="capitalize"
                                    >
                                        {formatLabel(option)}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="pt-4">{children}</div>
            </div>
        </div>
    );
}
