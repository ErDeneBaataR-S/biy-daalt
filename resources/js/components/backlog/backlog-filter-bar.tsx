import { Badge } from '@/components/ui/badge';
import type { BacklogFilter, BacklogFilterId } from '@/types/backlog';

type BacklogFilterBarProps = {
    filters: BacklogFilter[];
    activeFilterId: BacklogFilterId;
    selectedCount: number;
    visibleCount: number;
    onChange: (filterId: BacklogFilterId) => void;
};

export function BacklogFilterBar({
    filters,
    activeFilterId,
    selectedCount,
    visibleCount,
    onChange,
}: BacklogFilterBarProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
                {filters.map((filter) => {
                    const isActive = filter.id === activeFilterId;

                    return (
                        <button
                            key={filter.id}
                            type="button"
                            onClick={() => onChange(filter.id)}
                            className="cursor-pointer"
                        >
                            <Badge
                                variant={isActive ? 'default' : 'outline'}
                                className={
                                    isActive
                                        ? 'rounded-lg bg-slate-900 px-3 py-1 text-white hover:bg-slate-900 dark:bg-sky-500 dark:text-white dark:hover:bg-sky-500'
                                        : 'rounded-lg border-slate-200 bg-white px-3 py-1 text-slate-600 dark:border-slate-700 dark:bg-[#162033] dark:text-slate-300'
                                }
                            >
                                {filter.label}
                            </Badge>
                        </button>
                    );
                })}
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span>{visibleCount} visible</span>
                <span className="text-slate-300">•</span>
                <span>{selectedCount} selected</span>
            </div>
        </div>
    );
}
