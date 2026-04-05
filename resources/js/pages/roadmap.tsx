import { closestCenter, DndContext, useDroppable } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { RoadmapDialog } from '@/components/roadmap/roadmap-dialog';
import { RoadmapShell } from '@/components/roadmap/roadmap-shell';
import AppLayout from '@/layouts/app-layout';
import { roadmap } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Status = 'now' | 'next' | 'later';

type Item = {
    id: number;
    title: string;
    status: Status;
};

type ColumnProps = {
    id: Status;
    title: string;
    items: Item[];
    onEdit: (item: Item) => void;
    onOpen: (open: boolean) => void;
    onDelete: (id: Item['id']) => void;
};

type CardProps = {
    item: Item;
    onEdit: () => void;
    onDelete: () => void;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roadmap',
        href: roadmap(),
    },
];

const storageKey = 'biydaalt.roadmap.v1';

const defaultItems: Item[] = [
    {
        id: 101,
        title: 'Refine the onboarding flow',
        status: 'now',
    },
    {
        id: 102,
        title: 'Ship feedback collection',
        status: 'now',
    },
    {
        id: 201,
        title: 'Draft release milestones',
        status: 'next',
    },
    {
        id: 202,
        title: 'Align cross-team dependencies',
        status: 'next',
    },
    {
        id: 301,
        title: 'Explore customer-facing timeline views',
        status: 'later',
    },
];

const validStatuses: Status[] = ['now', 'next', 'later'];

function createId() {
    return Math.floor(Date.now() + Math.random() * 1000);
}

function isStatus(value: unknown): value is Status {
    return typeof value === 'string' && validStatuses.includes(value as Status);
}

function readRoadmapData() {
    if (typeof window === 'undefined') {
        return defaultItems;
    }

    try {
        const raw = window.localStorage.getItem(storageKey);

        if (!raw) {
            return defaultItems;
        }

        const parsed = JSON.parse(raw) as { items?: Item[] };

        return Array.isArray(parsed.items) &&
            parsed.items.every(
                (item) =>
                    typeof item?.id === 'number' &&
                    typeof item?.title === 'string' &&
                    isStatus(item?.status),
            )
            ? parsed.items
            : defaultItems;
    } catch {
        return defaultItems;
    }
}

export default function Roadmap() {
    const [initialItems] = useState(readRoadmapData);
    const [items, setItems] = useState<Item[]>(initialItems);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Item | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        try {
            window.localStorage.setItem(storageKey, JSON.stringify({ items }));
        } catch {
            return;
        }
    }, [items]);

    const handleClose = () => {
        setOpen(false);
        setEditing(null);
    };

    const handleSubmit = (title: string, status: Item['status']) => {
        if (editing) {
            setItems((current) =>
                current.map((item) =>
                    item.id === editing.id ? { ...item, title, status } : item,
                ),
            );

            return;
        }

        setItems((current) => [
            {
                id: createId(),
                title,
                status,
            },
            ...current,
        ]);
    };

    const handleDelete = (id: number) => {
        setItems((current) => current.filter((item) => item.id !== id));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { over, active } = event;

        if (!over) {
            return;
        }

        setItems((current) =>
            current.map((item) => {
                if (item.id !== active.id) {
                    return item;
                }

                const nextStatus = isStatus(over.id)
                    ? over.id
                    : current.find((candidate) => candidate.id === over.id)
                          ?.status;

                return nextStatus ? { ...item, status: nextStatus } : item;
            }),
        );
    };

    const nowItems = items.filter((item) => item.status === 'now');
    const nextItems = items.filter((item) => item.status === 'next');
    const laterItems = items.filter((item) => item.status === 'later');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roadmap" />

            <RoadmapShell>
                <div className="mb-4 flex justify-end">
                    <button
                        onClick={() => {
                            setEditing(null);
                            setOpen(true);
                        }}
                        className="rounded bg-sky-500 px-4 py-2 text-white"
                    >
                        + New
                    </button>
                </div>

                <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <div className="grid gap-4 md:grid-cols-3">
                        <Column
                            id="now"
                            title="Now"
                            items={nowItems}
                            onEdit={(item) => setEditing(item)}
                            onOpen={setOpen}
                            onDelete={handleDelete}
                        />
                        <Column
                            id="next"
                            title="Next"
                            items={nextItems}
                            onEdit={(item) => setEditing(item)}
                            onOpen={setOpen}
                            onDelete={handleDelete}
                        />
                        <Column
                            id="later"
                            title="Later"
                            items={laterItems}
                            onEdit={(item) => setEditing(item)}
                            onOpen={setOpen}
                            onDelete={handleDelete}
                        />
                    </div>
                </DndContext>

                <RoadmapDialog
                    key={`${editing?.id ?? 'new'}-${open ? 'open' : 'closed'}`}
                    open={open}
                    onClose={handleClose}
                    initial={editing}
                    onSubmit={handleSubmit}
                />
            </RoadmapShell>
        </AppLayout>
    );
}

function Column({ id, title, items, onEdit, onOpen, onDelete }: ColumnProps) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className="rounded-xl border bg-white p-4">
            <h2 className="mb-3 font-semibold">
                {title} ({items.length})
            </h2>

            <SortableContext
                items={items.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-2">
                    {items.map((item) => (
                        <Card
                            key={item.id}
                            item={item}
                            onEdit={() => {
                                onEdit(item);
                                onOpen(true);
                            }}
                            onDelete={() => onDelete(item.id)}
                        />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
}

function Card({ item, onEdit, onDelete }: CardProps) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="rounded-lg border bg-white p-3 shadow-sm"
        >
            <div
                {...attributes}
                {...listeners}
                className="mb-2 cursor-grab text-xs text-gray-400"
            >
                Drag
            </div>

            <p className="text-sm font-medium">{item.title}</p>

            <div className="mt-2 flex justify-end gap-2">
                <button
                    onClick={(event) => {
                        event.stopPropagation();
                        onEdit();
                    }}
                    className="text-xs text-blue-500"
                >
                    Edit
                </button>

                <button
                    onClick={(event) => {
                        event.stopPropagation();
                        onDelete();
                    }}
                    className="text-xs text-red-500"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
