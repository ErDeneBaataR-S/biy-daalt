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
import type {
    Initiative,
    InitiativeDraft,
    InitiativeStatus,
} from '@/types/dashboard';

const defaultInitiative: InitiativeDraft = {
    title: '',
    owner: '',
    status: 'planned',
    completed: false,
};

function getInitialInitiativeForm(
    initiative?: Initiative | null,
): InitiativeDraft {
    if (!initiative) {
        return defaultInitiative;
    }

    return {
        title: initiative.title,
        owner: initiative.owner,
        status: initiative.status,
        completed: initiative.completed,
    };
}

type DashboardInitiativeDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initiative?: Initiative | null;
    onSubmit: (initiative: InitiativeDraft) => void;
};

export function DashboardInitiativeDialog({
    open,
    onOpenChange,
    initiative,
    onSubmit,
}: DashboardInitiativeDialogProps) {
    const [form, setForm] = useState<InitiativeDraft>(() =>
        getInitialInitiativeForm(initiative),
    );

    const handleSubmit = () => {
        onSubmit({
            ...form,
            completed: form.completed || form.status === 'completed',
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-[1.5rem] border-slate-200 p-0 sm:max-w-xl dark:border-slate-700/70 dark:bg-[#111827]">
                <div className="border-b border-slate-200/80 px-6 py-5 dark:border-slate-700/70">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-slate-900 dark:text-slate-100">
                            {initiative
                                ? 'Edit initiative'
                                : 'Create initiative'}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
                            Track dashboard initiatives in the frontend until
                            the backend is ready.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="grid gap-4 px-6 py-5">
                    <label className="grid gap-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            Title
                        </span>
                        <Input
                            value={form.title}
                            onChange={(event) =>
                                setForm((current) => ({
                                    ...current,
                                    title: event.target.value,
                                }))
                            }
                            placeholder="Improve onboarding"
                        />
                    </label>

                    <label className="grid gap-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            Owner
                        </span>
                        <Input
                            value={form.owner}
                            onChange={(event) =>
                                setForm((current) => ({
                                    ...current,
                                    owner: event.target.value,
                                }))
                            }
                            placeholder="Product team"
                        />
                    </label>

                    <label className="grid gap-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            Status
                        </span>
                        <select
                            value={form.status}
                            onChange={(event) =>
                                setForm((current) => ({
                                    ...current,
                                    status: event.target
                                        .value as InitiativeStatus,
                                    completed:
                                        event.target.value === 'completed',
                                }))
                            }
                            className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-xs transition outline-none focus-visible:border-sky-400 dark:border-slate-700 dark:bg-[#0f1728] dark:text-slate-100"
                        >
                            <option value="planned">Planned</option>
                            <option value="on-track">On track</option>
                            <option value="at-risk">At risk</option>
                            <option value="completed">Completed</option>
                        </select>
                    </label>
                </div>

                <DialogFooter className="border-t border-slate-200/80 px-6 py-5 dark:border-slate-700/70">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-sky-500 text-white hover:bg-sky-600"
                        disabled={!form.title.trim() || !form.owner.trim()}
                    >
                        {initiative ? 'Save changes' : 'Create initiative'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
