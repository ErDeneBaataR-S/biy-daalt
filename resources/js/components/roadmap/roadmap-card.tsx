export function RoadmapCard({ title }: { title: string }) {
    return (
        <div className="rounded-lg border bg-white p-3 shadow-sm">
            <p className="text-sm font-medium">{title}</p>
        </div>
    );
}
