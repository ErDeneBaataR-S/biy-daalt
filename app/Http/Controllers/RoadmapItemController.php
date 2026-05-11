<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoadmapItemRequest;
use App\Models\RoadmapItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class RoadmapItemController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', RoadmapItem::class);

        return Inertia::render('roadmap', [
            'items' => RoadmapItem::query()->orderBy('position')->get(),
        ]);
    }

    public function store(RoadmapItemRequest $request): RedirectResponse
    {
        $this->authorize('create', RoadmapItem::class);

        RoadmapItem::create([
            'position' => ((int) RoadmapItem::where('status', $request->input('status', 'now'))->max('position')) + 1,
            ...$request->validated(),
        ]);

        return redirect()->route('roadmap');
    }

    public function update(RoadmapItemRequest $request, RoadmapItem $roadmapItem): RedirectResponse
    {
        $this->authorize('update', $roadmapItem);

        $roadmapItem->update($request->validated());

        return redirect()->route('roadmap');
    }

    public function destroy(RoadmapItem $roadmapItem): RedirectResponse
    {
        $this->authorize('delete', $roadmapItem);

        $roadmapItem->delete();
        $this->normalizePositions();

        return redirect()->route('roadmap');
    }

    public function move(Request $request, RoadmapItem $roadmapItem): RedirectResponse
    {
        $this->authorize('update', $roadmapItem);

        $validated = $request->validate([
            'status' => ['required', 'string', 'max:50'],
            'position' => ['required', 'integer', 'min:1'],
        ]);

        DB::transaction(function () use ($roadmapItem, $validated) {
            $roadmapItem->update(['status' => $validated['status']]);
            $this->normalizePositions($roadmapItem, (int) $validated['position']);
        });

        return redirect()->route('roadmap');
    }

    private function normalizePositions(?RoadmapItem $movedItem = null, ?int $targetPosition = null): void
    {
        RoadmapItem::query()
            ->select('status')
            ->distinct()
            ->pluck('status')
            ->each(function (string $status) use ($movedItem, $targetPosition) {
                $items = RoadmapItem::query()
                    ->where('status', $status)
                    ->orderBy('position')
                    ->get();

                if ($movedItem && $movedItem->status === $status && $targetPosition) {
                    $items = $items
                        ->reject(fn (RoadmapItem $item) => $item->is($movedItem))
                        ->values();
                    $items->splice($targetPosition - 1, 0, [$movedItem]);
                }

                $items->values()->each(
                    fn (RoadmapItem $item, int $index) => $item->update(['position' => $index + 1])
                );
            });
    }
}
