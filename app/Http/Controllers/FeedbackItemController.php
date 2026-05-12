<?php

namespace App\Http\Controllers;

use App\Http\Requests\FeedbackItemRequest;
use App\Models\EmployeeTask;
use App\Models\FeedbackItem;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FeedbackItemController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', FeedbackItem::class);

        $query = FeedbackItem::query()->with('submittedBy:id,name,email,manager_id')->latest();

        if (request()->user()->isEmployee()) {
            $query->where('submitted_by_id', request()->user()->id);
        } elseif (request()->user()->isManager()) {
            $query->where(function ($feedback) {
                $feedback
                    ->whereNull('submitted_by_id')
                    ->orWhereHas('submittedBy', fn ($user) => $user->where('manager_id', request()->user()->id));
            });
        }

        return Inertia::render('Feedback', [
            'items' => $query->get()
                ->map(fn (FeedbackItem $item) => [
                    'id' => $item->id,
                    'submittedBy' => $item->submittedBy?->only(['id', 'name', 'email']),
                    'title' => $item->title,
                    'description' => $item->description ?? '',
                    'status' => $item->status,
                    'priority' => $item->priority,
                    'deadline' => $item->deadline?->toDateString() ?? '',
                    'approvedAt' => $item->approved_at?->toISOString(),
                ]),
        ]);
    }

    public function store(FeedbackItemRequest $request): RedirectResponse
    {
        $this->authorize('create', FeedbackItem::class);

        FeedbackItem::create([
            'submitted_by_id' => $request->user()->isEmployee() ? $request->user()->id : null,
            ...$request->validated(),
        ]);

        return redirect()->route('feedback');
    }

    public function approve(FeedbackItem $feedbackItem): RedirectResponse
    {
        $this->authorize('update', $feedbackItem);

        abort_unless($feedbackItem->submittedBy?->isEmployee(), 422);

        $feedbackItem->update([
            'status' => 'Approved',
            'reviewed_by_id' => request()->user()->id,
            'approved_at' => now(),
        ]);

        EmployeeTask::firstOrCreate(
            ['feedback_item_id' => $feedbackItem->id],
            [
                'user_id' => $feedbackItem->submitted_by_id,
                'assigned_by_id' => request()->user()->id,
                'type' => EmployeeTask::TYPE_ASSIGNED,
                'title' => $feedbackItem->title,
                'description' => $feedbackItem->description,
                'status' => 'todo',
                'priority' => strtolower($feedbackItem->priority ?: 'medium'),
                'due_date' => $feedbackItem->deadline,
            ],
        );

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
