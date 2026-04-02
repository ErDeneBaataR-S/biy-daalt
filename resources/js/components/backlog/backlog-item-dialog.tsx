import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type {
    BacklogItem,
    BacklogItemDraft,
    BacklogItemKind,
    BacklogItemPriority,
    BacklogItemStatus,
} from '@/types/backlog';

type BacklogItemDialogProps = {
    open: boolean;
    item: BacklogItem | null;
    initialKind: BacklogItemKind;
    onOpenChange: (open: boolean) => void;
    onSubmit: (draft: BacklogItemDraft) => void;
};

const statusOptions: BacklogItemStatus[] = [
    'done',
    'in-progress',
    'in-review',
    'blocked',
];

const priorityOptions: BacklogItemPriority[] = [
    'low',
    'medium',
    'high',
    'critical',
];

const kindOptions: BacklogItemKind[] = ['feature', 'bug', 'design', 'research'];

function createDraft(kind: BacklogItemKind): BacklogItemDraft {
    return {
        kind,
        title: '',
        status: 'in-review',
        priority: 'medium',
        owner: '',
        team: '',
        sprintLabel: 'Sprint 12',
        estimateLabel: '3 meats',
    };
}

function createDraftFromItem(
    item: BacklogItem | null,
    initialKind: BacklogItemKind,
): BacklogItemDraft {
    if (!item) {
        return createDraft(initialKind);
    }

    return {
        kind: item.kind,
        title: item.title,
        status: item.status,
        priority: item.priority,
        owner: item.owner,
        team: item.team,
        sprintLabel: item.sprintLabel,
        estimateLabel: item.estimateLabel,
    };
}

function formatLabel(value: string) {
    return value.replace('-', ' ');
}

export function BacklogItemDialog({
    open,
    item,
    initialKind,
    onOpenChange,
    onSubmit,
}: BacklogItemDialogProps) {
    const [draft, setDraft] = useState<BacklogItemDraft>(() =>
        createDraftFromItem(item, initialKind),
    );

    const title = item ? 'Edit work item' : 'Create work item';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-[1.5rem] border-slate-200 p-0">
                <div className="p-6">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            Update the backlog item details for the frontend-only workspace.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        className="mt-6 grid gap-4"
                        onSubmit={(event) => {
                            event.preventDefault();
                            onSubmit(draft);
                        }}
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="backlog-title">Title</Label>
                            <Input
                                id="backlog-title"
                                value={draft.title}
                                onChange={(event) =>
                                    setDraft((current) => ({
                                        ...current,
                                        title: event.target.value,
                                    }))
                                }
                                placeholder="API Optimization"
                                required
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="grid gap-2">
                                <Label>Kind</Label>
                                <Select
                                    value={draft.kind}
                                    onValueChange={(value: BacklogItemKind) =>
                                        setDraft((current) => ({
                                            ...current,
                                            kind: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {kindOptions.map((option) => (
                                            <SelectItem key={option} value={option}>
                                                {formatLabel(option)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label>Status</Label>
                                <Select
                                    value={draft.status}
                                    onValueChange={(value: BacklogItemStatus) =>
                                        setDraft((current) => ({
                                            ...current,
                                            status: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map((option) => (
                                            <SelectItem key={option} value={option}>
                                                {formatLabel(option)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label>Priority</Label>
                                <Select
                                    value={draft.priority}
                                    onValueChange={(value: BacklogItemPriority) =>
                                        setDraft((current) => ({
                                            ...current,
                                            priority: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {priorityOptions.map((option) => (
                                            <SelectItem key={option} value={option}>
                                                {formatLabel(option)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="backlog-owner">Owner</Label>
                                <Input
                                    id="backlog-owner"
                                    value={draft.owner}
                                    onChange={(event) =>
                                        setDraft((current) => ({
                                            ...current,
                                            owner: event.target.value,
                                        }))
                                    }
                                    placeholder="Den"
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="backlog-team">Team</Label>
                                <Input
                                    id="backlog-team"
                                    value={draft.team}
                                    onChange={(event) =>
                                        setDraft((current) => ({
                                            ...current,
                                            team: event.target.value,
                                        }))
                                    }
                                    placeholder="Team"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="backlog-sprint">Sprint label</Label>
                                <Input
                                    id="backlog-sprint"
                                    value={draft.sprintLabel}
                                    onChange={(event) =>
                                        setDraft((current) => ({
                                            ...current,
                                            sprintLabel: event.target.value,
                                        }))
                                    }
                                    placeholder="Sprint 12"
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="backlog-estimate">Estimate label</Label>
                                <Input
                                    id="backlog-estimate"
                                    value={draft.estimateLabel}
                                    onChange={(event) =>
                                        setDraft((current) => ({
                                            ...current,
                                            estimateLabel: event.target.value,
                                        }))
                                    }
                                    placeholder="5 meats"
                                    required
                                />
                            </div>
                        </div>

                        <DialogFooter className="mt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-sky-500 text-white hover:bg-sky-600">
                                Save item
                            </Button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
