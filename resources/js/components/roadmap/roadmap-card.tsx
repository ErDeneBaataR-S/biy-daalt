export function RoadmapCard({ title }: { title: string }) {
    return (
        <div className="rounded-lg border p-3 bg-white shadow-sm">
            <p className="text-sm font-medium">{title}</p>
        </div>
    );
}