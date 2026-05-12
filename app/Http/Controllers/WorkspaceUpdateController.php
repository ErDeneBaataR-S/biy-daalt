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
        return Inertia::render('updates', [
            'updates' => WorkspaceUpdate::query()
                ->whereBelongsTo($request->user())
                ->latest()
                ->get(),
        ]);
    }

    public function store(WorkspaceUpdateRequest $request): RedirectResponse
    {
        $request->user()->workspaceUpdates()->create($request->validated());

        return back();
    }

    public function update(WorkspaceUpdateRequest $request, WorkspaceUpdate $workspaceUpdate): RedirectResponse
    {
        $this->ensureOwner($request, $workspaceUpdate);

        $workspaceUpdate->update($request->validated());

        return back();
    }

    public function destroy(Request $request, WorkspaceUpdate $workspaceUpdate): RedirectResponse
    {
        $this->ensureOwner($request, $workspaceUpdate);

        $workspaceUpdate->delete();

        return back();
    }

    private function ensureOwner(Request $request, WorkspaceUpdate $workspaceUpdate): void
    {
        abort_unless($workspaceUpdate->user_id === $request->user()->id, 403);
    }
}
