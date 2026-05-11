<?php

namespace App\Http\Controllers;

use App\Http\Requests\FeedbackItemRequest;
use App\Models\FeedbackItem;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FeedbackItemController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', FeedbackItem::class);

        return Inertia::render('Feedback', [
            'items' => FeedbackItem::query()
                ->latest()
                ->get()
                ->map(fn (FeedbackItem $item) => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'description' => $item->description ?? '',
                    'status' => $item->status,
                    'priority' => $item->priority,
                    'deadline' => $item->deadline?->toDateString() ?? '',
                ]),
        ]);
    }

    public function store(FeedbackItemRequest $request): RedirectResponse
    {
        $this->authorize('create', FeedbackItem::class);

        FeedbackItem::create($request->validated());

        return redirect()->route('feedback');
    }

    public function update(FeedbackItemRequest $request, FeedbackItem $feedbackItem): RedirectResponse
    {
        $this->authorize('update', $feedbackItem);

        $feedbackItem->update($request->validated());

        return redirect()->route('feedback');
    }

    public function destroy(FeedbackItem $feedbackItem): RedirectResponse
    {
        $this->authorize('delete', $feedbackItem);

        $feedbackItem->delete();

        return redirect()->route('feedback');
    }
}
