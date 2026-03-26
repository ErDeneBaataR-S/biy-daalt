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
import type { Release, ReleaseDraft, ReleaseStatus } from '@/types/dashboard';

const defaultRelease: ReleaseDraft = {
    name: '',
    version: '',
    targetDate: '',
    status: 'planned',
    summary: '',
};

function getInitialReleaseForm(release?: Release | null): ReleaseDraft {
    if (!release) {
        return defaultRelease;
    }

    return {
        name: release.name,
        version: release.version,
        targetDate: release.targetDate,
        status: release.status,
        summary: release.summary,
    };
}

type DashboardReleaseDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    release?: Release | null;
    onSubmit: (release: ReleaseDraft) => void;
};

export function DashboardReleaseDialog({
    open,
    onOpenChange,
    release,
    onSubmit,
}: DashboardReleaseDialogProps) {
    const [form, setForm] = useState<ReleaseDraft>(() => getInitialReleaseForm(release));

    const handleSubmit = () => {
        onSubmit(form);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-[1.5rem] border-slate-200 p-0 sm:max-w-xl">
                <div className="border-b border-slate-200/80 px-6 py-5">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-slate-900">
                            {release ? 'Edit release' : 'Create release'}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-slate-500">
                            Keep releases in browser storage until Laravel persistence is ready.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="grid gap-4 px-6 py-5">
                    <label className="grid gap-2">
                        <span className="text-sm font-medium text-slate-700">Release name</span>
                        <Input
                            value={form.name}
                            onChange={(event) =>
                                setForm((current) => ({
                                    ...current,
                                    name: event.target.value,
                                }))
                            }
                            placeholder="Spring workflow update"
                        />
                    </label>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="grid gap-2">
                            <span className="text-sm font-medium text-slate-700">Version</span>
                            <Input
                                value={form.version}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        version: event.target.value,
                                    }))
                                }
                                placeholder="v2.4"
                            />
                        </label>

                        <label className="grid gap-2">
                            <span className="text-sm font-medium text-slate-700">Target date</span>
                            <Input
                                type="date"
                                value={form.targetDate}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        targetDate: event.target.value,
                                    }))
                                }
                            />
                        </label>
                    </div>

                    <label className="grid gap-2">
                        <span className="text-sm font-medium text-slate-700">Status</span>
                        <select
                            value={form.status}
                            onChange={(event) =>
                                setForm((current) => ({
                                    ...current,
                                    status: event.target.value as ReleaseStatus,
                                }))
                            }
                            className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-xs outline-none transition focus-visible:border-sky-400"
                        >
                            <option value="planned">Planned</option>
                            <option value="in-review">In review</option>
                            <option value="shipped">Shipped</option>
                        </select>
                    </label>

                    <label className="grid gap-2">
                        <span className="text-sm font-medium text-slate-700">Summary</span>
                        <textarea
                            value={form.summary}
                            onChange={(event) =>
                                setForm((current) => ({
                                    ...current,
                                    summary: event.target.value,
                                }))
                            }
                            rows={3}
                            placeholder="Short note about what ships in this release."
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-xs outline-none transition focus-visible:border-sky-400"
                        />
                    </label>
                </div>

                <DialogFooter className="border-t border-slate-200/80 px-6 py-5">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-sky-500 text-white hover:bg-sky-600"
                        disabled={
                            !form.name.trim() ||
                            !form.version.trim() ||
                            !form.targetDate.trim()
                        }
                    >
                        {release ? 'Save changes' : 'Create release'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
