import { closestCenter, DndContext, useDroppable } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { RoadmapDialog } from '@/components/roadmap/roadmap-dialog';
import { RoadmapShell } from '@/components/roadmap/roadmap-shell';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type Status = 'now' | 'next' | 'later';

type Item = {
    id: number;
    title: string;
    status: Status;
    position: number;
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
        href: '/roadmap',
    },
];

const validStatuses: Status[] = ['now', 'next', 'later'];

function isStatus(value: unknown): value is Status {
    return typeof value === 'string' && validStatuses.includes(value as Status);
}

type RoadmapPageProps = {
    items: Item[];
};

export default function Roadmap() {
    const { items } = usePage<RoadmapPageProps>().props;
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Item | null>(null);

    const handleClose = () => {
        setOpen(false);
        setEditing(null);
    };

    const handleSubmit = (title: string, status: Item['status']) => {
        if (editing) {
            router.patch(
                `/roadmap/${editing.id}`,
                { title, status },
                {
                    preserveScroll: true,
                },
            );

            return;
        }

        router.post(
            '/roadmap',
            { title, status },
            {
                preserveScroll: true,
            },
        );
    };

    const handleDelete = (id: number) => {
        router.delete(`/roadmap/${id}`, {
            preserveScroll: true,
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { over, active } = event;

        if (!over) {
            return;
        }

        const activeItem = items.find((item) => item.id === active.id);
        const nextStatus = isStatus(over.id)
            ? over.id
            : items.find((candidate) => candidate.id === over.id)?.status;

        if (!activeItem || !nextStatus) {
            return;
        }

        router.patch(
            `/roadmap/${activeItem.id}/move`,
            {
                status: nextStatus,
                position: activeItem.position,
            },
            {
                preserveScroll: true,
            },
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
                        className="rounded bg-sky-500 px-4 py-2 text-white hover:bg-sky-600"
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
        <div
            ref={setNodeRef}
            className="rounded-xl border bg-white p-4 dark:border-slate-700/60 dark:bg-[#111827]"
        >
            <h2 className="mb-3 font-semibold dark:text-slate-100">
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
            className="rounded-lg border bg-white p-3 shadow-sm dark:border-slate-700/60 dark:bg-[#0f1728] dark:shadow-[0_20px_45px_-34px_rgba(2,6,23,0.88)]"
        >
            <div
                {...attributes}
                {...listeners}
                className="mb-2 cursor-grab text-xs text-gray-400 dark:text-slate-500"
            >
                Drag
            </div>

            <p className="text-sm font-medium dark:text-slate-100">
                {item.title}
            </p>

            <div className="mt-2 flex justify-end gap-2">
                <button
                    onClick={(event) => {
                        event.stopPropagation();
                        onEdit();
                    }}
                    className="text-xs text-blue-500 dark:text-sky-300"
                >
                    Edit
                </button>

                <button
                    onClick={(event) => {
                        event.stopPropagation();
                        onDelete();
                    }}
                    className="text-xs text-red-500 dark:text-rose-300"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
