import {
    GripVertical,
    PencilLine,
    Trash2,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useInitials } from '@/hooks/use-initials';
import type { BacklogItem } from '@/types/backlog';

type BacklogTableProps = {
    items: BacklogItem[];
    selectedIds: string[];
    onToggleSelect: (id: string) => void;
    onToggleSelectAll: () => void;
    onEdit: (item: BacklogItem) => void;
    onDelete: (id: string) => void;
    onReorder: (fromId: string, toId: string) => void;
};

function formatLabel(value: string) {
    return value.replace('-', ' ');
}

function getStatusTone(status: BacklogItem['status']) {
    switch (status) {
        case 'done':
            return 'border-emerald-200 bg-emerald-50 text-emerald-600';
        case 'blocked':
            return 'border-rose-200 bg-rose-50 text-rose-600';
        case 'in-progress':
            return 'border-sky-200 bg-sky-50 text-sky-600';
        default:
            return 'border-amber-200 bg-amber-50 text-amber-600';
    }
}

function getPriorityTone(priority: BacklogItem['priority']) {
    switch (priority) {
        case 'critical':
            return 'border-rose-200 bg-rose-50 text-rose-600';
        case 'high':
            return 'border-amber-200 bg-amber-50 text-amber-600';
        case 'medium':
            return 'border-sky-200 bg-sky-50 text-sky-600';
        default:
            return 'border-slate-200 bg-slate-100 text-slate-600';
    }
}

export function BacklogTable({
    items,
    selectedIds,
    onToggleSelect,
    onToggleSelectAll,
    onEdit,
    onDelete,
    onReorder,
}: BacklogTableProps) {
    const getInitials = useInitials();
    const allVisibleSelected =
        items.length > 0 && items.every((item) => selectedIds.includes(item.id));

    return (
        <div className="overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white">
            <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0">
                    <thead>
                        <tr className="text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                            <th className="border-b border-slate-200 px-4 py-3">
                                <Checkbox
                                    checked={allVisibleSelected}
                                    onCheckedChange={onToggleSelectAll}
                                    aria-label="Select all visible backlog rows"
                                />
                            </th>
                            <th className="border-b border-slate-200 px-4 py-3">Title</th>
                            <th className="border-b border-slate-200 px-4 py-3">Status</th>
                            <th className="border-b border-slate-200 px-4 py-3">Priority</th>
                            <th className="border-b border-slate-200 px-4 py-3">Owner</th>
                            <th className="border-b border-slate-200 px-4 py-3">Team</th>
                            <th className="border-b border-slate-200 px-4 py-3">Sprint</th>
                            <th className="border-b border-slate-200 px-4 py-3 text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => {
                            const selected = selectedIds.includes(item.id);

                            return (
                                <tr
                                    key={item.id}
                                    draggable
                                    onDragStart={(event) => {
                                        event.dataTransfer.setData('text/plain', item.id);
                                        event.dataTransfer.effectAllowed = 'move';
                                    }}
                                    onDragOver={(event) => {
                                        event.preventDefault();
                                        event.dataTransfer.dropEffect = 'move';
                                    }}
                                    onDrop={(event) => {
                                        event.preventDefault();
                                        const fromId = event.dataTransfer.getData('text/plain');

                                        if (fromId && fromId !== item.id) {
                                            onReorder(fromId, item.id);
                                        }
                                    }}
                                    className="group text-sm text-slate-600"
                                >
                                    <td className="border-b border-slate-100 px-4 py-4 align-top">
                                        <Checkbox
                                            checked={selected}
                                            onCheckedChange={() => onToggleSelect(item.id)}
                                            aria-label={`Select ${item.title}`}
                                        />
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 align-top">
                                        <div className="flex items-start gap-3">
                                            <span className="mt-0.5 text-slate-300 transition group-hover:text-slate-500">
                                                <GripVertical className="size-4" />
                                            </span>
                                            <div className="space-y-1">
                                                <p className="font-medium text-slate-900">
                                                    {item.title}
                                                </p>
                                                <p className="text-xs capitalize text-slate-400">
                                                    {item.kind}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 align-top">
                                        <Badge
                                            variant="outline"
                                            className={`rounded-full px-2.5 py-0.5 capitalize ${getStatusTone(item.status)}`}
                                        >
                                            {formatLabel(item.status)}
                                        </Badge>
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 align-top">
                                        <Badge
                                            variant="outline"
                                            className={`rounded-full px-2.5 py-0.5 capitalize ${getPriorityTone(item.priority)}`}
                                        >
                                            {item.priority}
                                        </Badge>
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 align-top">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="size-8 border border-slate-200 bg-white">
                                                <AvatarFallback className="bg-slate-900 text-[0.68rem] font-semibold text-white">
                                                    {getInitials(item.owner)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium text-slate-700">
                                                {item.owner}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 align-top">
                                        {item.team}
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 align-top">
                                        <div className="space-y-1">
                                            <p className="font-medium text-slate-700">
                                                {item.sprintLabel}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {item.estimateLabel}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="border-b border-slate-100 px-4 py-4 align-top">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                                onClick={() => onEdit(item)}
                                            >
                                                <PencilLine className="size-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-rose-500"
                                                onClick={() => onDelete(item.id)}
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
