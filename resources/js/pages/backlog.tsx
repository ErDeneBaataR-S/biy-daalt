import { Head, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { BacklogFilterBar } from '@/components/backlog/backlog-filter-bar';
import { BacklogItemDialog } from '@/components/backlog/backlog-item-dialog';
import { BacklogShell } from '@/components/backlog/backlog-shell';
import { BacklogTable } from '@/components/backlog/backlog-table';
import AppLayout from '@/layouts/app-layout';
import { backlog } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import type { Auth } from '@/types/auth';
import type {
    BacklogFilter,
    BacklogFilterId,
    BacklogItem,
    BacklogItemDraft,
    BacklogItemKind,
} from '@/types/backlog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Backlog',
        href: backlog(),
    },
];

const storageKey = 'biydaalt.backlog.v1';

const defaultFilters: BacklogFilter[] = [
    { id: 'all', label: 'All' },
    { id: 'assigned', label: 'Assigned to Me' },
    { id: 'priority', label: 'High Priority' },
    { id: 'sprint', label: 'Sprint 12' },
];

const defaultItems: BacklogItem[] = [
    {
        id: 'backlog-1',
        kind: 'feature',
        title: 'Launch Authentication',
        status: 'done',
        priority: 'medium',
        owner: 'Den',
        team: 'Team',
        sprintLabel: '5 meats',
        estimateLabel: '8 pts',
        position: 1,
    },
    {
        id: 'backlog-2',
        kind: 'bug',
        title: 'Bug Fixes',
        status: 'in-review',
        priority: 'high',
        owner: 'Dert',
        team: 'Team',
        sprintLabel: '5 meats',
        estimateLabel: '3 meats',
        position: 2,
    },
    {
        id: 'backlog-3',
        kind: 'design',
        title: 'Dashboard Redesign',
        status: 'blocked',
        priority: 'medium',
        owner: 'Orom',
        team: 'Team',
        sprintLabel: '2 meats',
        estimateLabel: '2 meats',
        position: 3,
    },
    {
        id: 'backlog-4',
        kind: 'research',
        title: 'API Optimization',
        status: 'in-review',
        priority: 'high',
        owner: 'Asthe',
        team: 'Team',
        sprintLabel: 'Sprint 12',
        estimateLabel: '5 meats',
        position: 4,
    },
];

function createId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }

    return `backlog-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sortItems(items: BacklogItem[]) {
    return [...items].sort((left, right) => left.position - right.position);
}

function matchesFilter(
    item: BacklogItem,
    filterId: BacklogFilterId,
    currentUserName: string,
) {
    switch (filterId) {
        case 'assigned':
            return item.owner === currentUserName;
        case 'priority':
            return item.priority === 'high' || item.priority === 'critical';
        case 'sprint':
            return item.sprintLabel === 'Sprint 12';
        default:
            return true;
    }
}

function readBacklogData() {
    if (typeof window === 'undefined') {
        return {
            items: defaultItems,
            activeFilterId: 'all' as BacklogFilterId,
        };
    }

    try {
        const raw = window.localStorage.getItem(storageKey);

        if (!raw) {
            return {
                items: defaultItems,
                activeFilterId: 'all' as BacklogFilterId,
            };
        }

        const parsed = JSON.parse(raw) as {
            items?: BacklogItem[];
            activeFilterId?: BacklogFilterId;
        };

        return {
            items: Array.isArray(parsed.items) ? sortItems(parsed.items) : defaultItems,
            activeFilterId:
                parsed.activeFilterId && defaultFilters.some((filter) => filter.id === parsed.activeFilterId)
                    ? parsed.activeFilterId
                    : ('all' as BacklogFilterId),
        };
    } catch {
        return {
            items: defaultItems,
            activeFilterId: 'all' as BacklogFilterId,
        };
    }
}

export default function Backlog() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [{ items: initialItems, activeFilterId: initialFilterId }] =
        useState(readBacklogData);
    const [items, setItems] = useState<BacklogItem[]>(initialItems);
    const [activeFilterId, setActiveFilterId] =
        useState<BacklogFilterId>(initialFilterId);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [draftKind, setDraftKind] = useState<BacklogItemKind>('feature');
    const [editingItem, setEditingItem] = useState<BacklogItem | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        try {
            window.localStorage.setItem(
                storageKey,
                JSON.stringify({
                    items,
                    activeFilterId,
                }),
            );
        } catch {
            return;
        }
    }, [activeFilterId, items]);

    const filteredItems = useMemo(
        () =>
            sortItems(items).filter((item) =>
                matchesFilter(item, activeFilterId, auth.user.name),
            ),
        [activeFilterId, auth.user.name, items],
    );

    useEffect(() => {
        setSelectedIds((current) =>
            current.filter((id) => filteredItems.some((item) => item.id === id)),
        );
    }, [filteredItems]);

    const handleSubmit = (draft: BacklogItemDraft) => {
        if (editingItem) {
            setItems((current) =>
                sortItems(
                    current.map((item) =>
                        item.id === editingItem.id ? { ...item, ...draft } : item,
                    ),
                ),
            );
        } else {
            setItems((current) => {
                const ordered = sortItems(current);

                return [
                    {
                        id: createId(),
                        position: ordered.length + 1,
                        ...draft,
                    },
                    ...ordered.map((item, index) => ({
                        ...item,
                        position: index + 2,
                    })),
                ];
            });
        }

        setDialogOpen(false);
        setEditingItem(null);
    };

    const handleDelete = (id: string) => {
        setItems((current) =>
            sortItems(current.filter((item) => item.id !== id)).map((item, index) => ({
                ...item,
                position: index + 1,
            })),
        );
        setSelectedIds((current) => current.filter((selectedId) => selectedId !== id));
    };

    const handleReorder = (fromId: string, toId: string) => {
        setItems((current) => {
            const ordered = sortItems(current);
            const visibleIds = filteredItems.map((item) => item.id);
            const visibleItems = ordered.filter((item) => visibleIds.includes(item.id));
            const fromIndex = visibleItems.findIndex((item) => item.id === fromId);
            const toIndex = visibleItems.findIndex((item) => item.id === toId);

            if (fromIndex === -1 || toIndex === -1) {
                return current;
            }

            const reorderedVisible = [...visibleItems];
            const [moved] = reorderedVisible.splice(fromIndex, 1);
            reorderedVisible.splice(toIndex, 0, moved);

            let visibleCursor = 0;
            const merged = ordered.map((item) =>
                visibleIds.includes(item.id) ? reorderedVisible[visibleCursor++] : item,
            );

            return merged.map((item, index) => ({
                ...item,
                position: index + 1,
            }));
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Backlog" />

            <BacklogShell
                itemCount={items.length}
                onCreateKind={(kind) => {
                    setDraftKind(kind);
                    setEditingItem(null);
                    setDialogOpen(true);
                }}
            >
                <div className="space-y-4">
                    <BacklogFilterBar
                        filters={defaultFilters}
                        activeFilterId={activeFilterId}
                        selectedCount={selectedIds.length}
                        visibleCount={filteredItems.length}
                        onChange={setActiveFilterId}
                    />

                    <BacklogTable
                        items={filteredItems}
                        selectedIds={selectedIds}
                        onToggleSelect={(id) =>
                            setSelectedIds((current) =>
                                current.includes(id)
                                    ? current.filter((selectedId) => selectedId !== id)
                                    : [...current, id],
                            )
                        }
                        onToggleSelectAll={() => {
                            const visibleIds = filteredItems.map((item) => item.id);
                            const allSelected =
                                visibleIds.length > 0 &&
                                visibleIds.every((id) => selectedIds.includes(id));

                            setSelectedIds((current) =>
                                allSelected
                                    ? current.filter((id) => !visibleIds.includes(id))
                                    : Array.from(new Set([...current, ...visibleIds])),
                            );
                        }}
                        onEdit={(item) => {
                            setDraftKind(item.kind);
                            setEditingItem(item);
                            setDialogOpen(true);
                        }}
                        onDelete={handleDelete}
                        onReorder={handleReorder}
                    />
                </div>
            </BacklogShell>

            <BacklogItemDialog
                key={`${editingItem?.id ?? draftKind}-${dialogOpen ? 'open' : 'closed'}`}
                open={dialogOpen}
                item={editingItem}
                initialKind={draftKind}
                onOpenChange={(open) => {
                    setDialogOpen(open);

                    if (!open) {
                        setEditingItem(null);
                    }
                }}
                onSubmit={handleSubmit}
            />
        </AppLayout>
    );
}
