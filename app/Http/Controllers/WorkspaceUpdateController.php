<?php

namespace App\Http\Controllers;

use App\Http\Requests\WorkspaceUpdateRequest;
use App\Models\WorkspaceUpdate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkspaceUpdateController extends Controller
{
    public function index(Request $request): Response
    {
        $query = WorkspaceUpdate::query()->with('manager:id,name,email')->latest();

        if ($request->user()->isManager()) {
            $query->where('manager_id', $request->user()->id);
        } elseif ($request->user()->isEmployee()) {
            $query->where('status', 'published')
                ->where(function ($updates) use ($request) {
                    $updates
                        ->where('audience', 'all')
                        ->orWhere('manager_id', $request->user()->manager_id);
                });
        }

        return Inertia::render('updates', [
            'updates' => $query->get(),
        ]);
    }

    public function store(WorkspaceUpdateRequest $request): RedirectResponse
    {
        abort_unless($request->user()->isManager(), 403);

        $request->user()->workspaceUpdates()->create([
            'manager_id' => $request->user()->id,
            'audience' => 'assigned',
            ...$request->validated(),
        ]);

        return back();
    }

    public function update(WorkspaceUpdateRequest $request, WorkspaceUpdate $workspaceUpdate): RedirectResponse
    {
        $this->ensureManagerOwner($request, $workspaceUpdate);

        $workspaceUpdate->update($request->validated());

        return back();
    }

    public function destroy(Request $request, WorkspaceUpdate $workspaceUpdate): RedirectResponse
    {
        $this->ensureManagerOwner($request, $workspaceUpdate);

        $workspaceUpdate->delete();

        return back();
    }

    private function ensureManagerOwner(Request $request, WorkspaceUpdate $workspaceUpdate): void
    {
        abort_unless($request->user()->isManager() && $workspaceUpdate->manager_id === $request->user()->id, 403);
    }
}
