<?php

namespace App\Http\Controllers;

use App\Http\Requests\BacklogItemRequest;
use App\Models\BacklogItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class BacklogItemController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', BacklogItem::class);

        return Inertia::render('backlog', [
            'items' => BacklogItem::query()
                ->orderBy('position')
                ->get()
                ->map(fn (BacklogItem $item) => [
                    'id' => (string) $item->id,
                    'kind' => $item->kind,
                    'title' => $item->title,
                    'status' => $item->status,
                    'priority' => $item->priority,
                    'owner' => $item->owner ?? '',
                    'team' => $item->team ?? '',
                    'sprintLabel' => $item->sprint_label ?? '',
                    'estimateLabel' => $item->estimate_label ?? '',
                    'position' => $item->position,
                ]),
        ]);
    }

    public function store(BacklogItemRequest $request): RedirectResponse
    {
        $this->authorize('create', BacklogItem::class);

        BacklogItem::create([
            'position' => ((int) BacklogItem::max('position')) + 1,
            ...$this->toDatabasePayload($request->validated()),
        ]);

        return redirect()->route('backlog');
    }

    public function update(BacklogItemRequest $request, BacklogItem $backlogItem): RedirectResponse
    {
        $this->authorize('update', $backlogItem);

        $backlogItem->update($this->toDatabasePayload($request->validated()));

        return redirect()->route('backlog');
    }

    public function destroy(BacklogItem $backlogItem): RedirectResponse
    {
        $this->authorize('delete', $backlogItem);

        $backlogItem->delete();
        $this->normalizePositions();

        return redirect()->route('backlog');
    }

    public function move(Request $request, BacklogItem $backlogItem): RedirectResponse
    {
        $this->authorize('update', $backlogItem);

        $validated = $request->validate([
            'position' => ['required', 'integer', 'min:1'],
        ]);

        DB::transaction(function () use ($backlogItem, $validated) {
            $targetPosition = (int) $validated['position'];
            $items = BacklogItem::query()
                ->orderBy('position')
                ->get()
                ->reject(fn (BacklogItem $item) => $item->is($backlogItem))
                ->values();

            $items->splice($targetPosition - 1, 0, [$backlogItem]);

            $items->values()->each(
                fn (BacklogItem $item, int $index) => $item->update(['position' => $index + 1])
            );
        });

        return redirect()->route('backlog');
    }

    private function normalizePositions(): void
    {
        BacklogItem::query()
            ->orderBy('position')
            ->get()
            ->values()
            ->each(fn (BacklogItem $item, int $index) => $item->update(['position' => $index + 1]));
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function toDatabasePayload(array $validated): array
    {
        if (array_key_exists('sprintLabel', $validated)) {
            $validated['sprint_label'] = $validated['sprintLabel'];
            unset($validated['sprintLabel']);
        }

        if (array_key_exists('estimateLabel', $validated)) {
            $validated['estimate_label'] = $validated['estimateLabel'];
            unset($validated['estimateLabel']);
        }

        return $validated;
    }
}
