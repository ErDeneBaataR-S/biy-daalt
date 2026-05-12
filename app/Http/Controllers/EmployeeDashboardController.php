<?php

namespace App\Http\Controllers;

use App\Models\EmployeeTask;
use App\Models\WorkspaceUpdate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $assignedTasks = EmployeeTask::query()
            ->whereBelongsTo($user)
            ->where('type', EmployeeTask::TYPE_ASSIGNED)
            ->latest()
            ->take(5)
            ->get();

        $personalTasks = EmployeeTask::query()
            ->whereBelongsTo($user)
            ->where('type', EmployeeTask::TYPE_PERSONAL)
            ->latest()
            ->take(5)
            ->get();

        $updates = WorkspaceUpdate::query()
            ->where('status', 'published')
            ->where(function ($updates) use ($user) {
                $updates
                    ->where('audience', 'all')
                    ->orWhere('manager_id', $user->manager_id);
            })
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('my-dashboard', [
            'assignedTasks' => $assignedTasks,
            'personalTasks' => $personalTasks,
            'updates' => $updates,
            'metrics' => [
                'assignedOpen' => EmployeeTask::query()
                    ->whereBelongsTo($user)
                    ->where('type', EmployeeTask::TYPE_ASSIGNED)
                    ->where('status', '!=', 'done')
                    ->count(),
                'personalOpen' => EmployeeTask::query()
                    ->whereBelongsTo($user)
                    ->where('type', EmployeeTask::TYPE_PERSONAL)
                    ->where('status', '!=', 'done')
                    ->count(),
                'updatesTotal' => WorkspaceUpdate::query()
                    ->where('status', 'published')
                    ->where(function ($updates) use ($user) {
                        $updates
                            ->where('audience', 'all')
                            ->orWhere('manager_id', $user->manager_id);
                    })
                    ->count(),
            ],
        ]);
    }
}
