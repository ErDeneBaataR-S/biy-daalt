import { router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    DndContext,
    closestCenter,
    useDroppable,
} from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RoadmapShell } from '@/components/roadmap/roadmap-shell';
import { RoadmapDialog } from '@/components/roadmap/roadmap-dialog';

type Item = {
    id: number;
    title: string;
    status: 'now' | 'next' | 'later';
};

export default function Roadmap({ items }: { items: Item[] }) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Item | null>(null);

    const handleSubmit = (title: string, status: Item['status']) => {
        if (editing) {
            router.put(`/roadmap/${editing.id}`, { title, status });
            return;
        }

        router.post('/roadmap', { title, status });
    };

    const handleDelete = (id: number) => {
        router.delete(`/roadmap/${id}`);
    };

    const handleDragEnd = (event: any) => {
        const { over, active } = event;
        if (!over) return;

        const item = items.find(i => i.id === active.id);
        if (!item) return;

        router.put(`/roadmap/${active.id}`, {
            title: item.title,
            status: over.id,
        });
    };

    const nowItems = items.filter(i => i.status === 'now');
    const nextItems = items.filter(i => i.status === 'next');
    const laterItems = items.filter(i => i.status === 'later');

    return (
        <AppShell>
            <Head title="Roadmap" />

            <RoadmapShell>

                <div className="mb-4 flex justify-end">
                    <button
                        onClick={() => setOpen(true)}
                        className="rounded bg-sky-500 px-4 py-2 text-white"
                    >
                        + New
                    </button>
                </div>

                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <div className="grid gap-4 md:grid-cols-3">

                        <Column id="now" title="Now" items={nowItems} onEdit={setEditing} onOpen={setOpen} onDelete={handleDelete}/>
                        <Column id="next" title="Next" items={nextItems} onEdit={setEditing} onOpen={setOpen} onDelete={handleDelete}/>
                        <Column id="later" title="Later" items={laterItems} onEdit={setEditing} onOpen={setOpen} onDelete={handleDelete}/>

                    </div>
                </DndContext>

                <RoadmapDialog
                    open={open}
                    onClose={() => {
                        setOpen(false);
                        setEditing(null);
                    }}
                    initial={editing}
                    onSubmit={handleSubmit}
                />

            </RoadmapShell>
        </AppShell>
    );
}

function Column({ id, title, items, onEdit, onOpen, onDelete }: any) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className="rounded-xl border bg-white p-4">
            <h2 className="mb-3 font-semibold">
                {title} ({items.length})
            </h2>

            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                    {items.map((item: any) => (
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

function Card({ item, onEdit, onDelete }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="rounded-lg border p-3 bg-white shadow-sm"
        >
            {/* 🔥 DRAG HANDLE */}
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab mb-2 text-xs text-gray-400"
            >
                ⠿ drag
            </div>

            <p className="text-sm font-medium">{item.title}</p>

            <div className="mt-2 flex justify-end gap-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                    }}
                    className="text-xs text-blue-500"
                >
                    Edit
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
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