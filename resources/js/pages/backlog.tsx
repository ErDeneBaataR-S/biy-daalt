import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { BacklogFilterBar } from '@/components/backlog/backlog-filter-bar';
import { BacklogItemDialog } from '@/components/backlog/backlog-item-dialog';
import { BacklogShell } from '@/components/backlog/backlog-shell';
import { BacklogTable } from '@/components/backlog/backlog-table';
import AppLayout from '@/layouts/app-layout';
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
        href: '/backlog',
    },
];

const defaultFilters: BacklogFilter[] = [
    { id: 'all', label: 'All' },
    { id: 'assigned', label: 'Assigned to Me' },
    { id: 'priority', label: 'High Priority' },
    { id: 'sprint', label: 'Sprint 12' },
];

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

type BacklogPageProps = {
    auth: Auth;
    items: BacklogItem[];
};

export default function Backlog() {
    const { auth, items } = usePage<BacklogPageProps>().props;
    const [activeFilterId, setActiveFilterId] =
        useState<BacklogFilterId>('all');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [draftKind, setDraftKind] = useState<BacklogItemKind>('feature');
    const [editingItem, setEditingItem] = useState<BacklogItem | null>(null);

    const filteredItems = useMemo(
        () =>
            sortItems(items).filter((item) =>
                matchesFilter(item, activeFilterId, auth.user.name),
            ),
        [activeFilterId, auth.user.name, items],
    );

    const visibleSelectedCount = selectedIds.filter((id) =>
        filteredItems.some((item) => item.id === id),
    ).length;

    const handleSubmit = (draft: BacklogItemDraft) => {
        if (editingItem) {
            router.patch(`/backlog/${editingItem.id}`, draft, {
                preserveScroll: true,
            });
        } else {
            router.post('/backlog', draft, {
                preserveScroll: true,
            });
        }

        setDialogOpen(false);
        setEditingItem(null);
    };

    const handleDelete = (id: string) => {
        router.delete(`/backlog/${id}`, {
            preserveScroll: true,
        });
        setSelectedIds((current) =>
            current.filter((selectedId) => selectedId !== id),
        );
    };

    const handleReorder = (fromId: string, toId: string) => {
        const target = filteredItems.find((item) => item.id === toId);

        if (!target) {
            return;
        }

        router.patch(
            `/backlog/${fromId}/move`,
            {
                position: target.position,
            },
            {
                preserveScroll: true,
            },
        );
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
                        selectedCount={visibleSelectedCount}
                        visibleCount={filteredItems.length}
                        onChange={setActiveFilterId}
                    />

                    <BacklogTable
                        items={filteredItems}
                        selectedIds={selectedIds}
                        onToggleSelect={(id) =>
                            setSelectedIds((current) =>
                                current.includes(id)
                                    ? current.filter(
                                          (selectedId) => selectedId !== id,
                                      )
                                    : [...current, id],
                            )
                        }
                        onToggleSelectAll={() => {
                            const visibleIds = filteredItems.map(
                                (item) => item.id,
                            );
                            const allSelected =
                                visibleIds.length > 0 &&
                                visibleIds.every((id) =>
                                    selectedIds.includes(id),
                                );

                            setSelectedIds((current) =>
                                allSelected
                                    ? current.filter(
                                          (id) => !visibleIds.includes(id),
                                      )
                                    : Array.from(
                                          new Set([...current, ...visibleIds]),
                                      ),
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
