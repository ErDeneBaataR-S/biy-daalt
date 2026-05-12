<?php

namespace App\Http\Controllers;

use App\Models\EmployeeTask;
use App\Models\FeedbackItem;
use App\Models\ManagerTask;
use App\Models\User;
use App\Models\WorkspaceUpdate;
use Inertia\Inertia;
use Inertia\Response;

class ManagerWorkspaceController extends Controller
{
    public function __invoke(): Response
    {
        $manager = request()->user();

        return Inertia::render('dashboard', [
            'employees' => User::query()
                ->where('role', User::ROLE_EMPLOYEE)
                ->where('manager_id', $manager->id)
                ->orderBy('name')
                ->get(['id', 'name', 'email']),
            'assignedTasks' => EmployeeTask::query()
                ->with('user:id,name,email')
                ->where('assigned_by_id', $manager->id)
                ->latest()
                ->get(),
            'managerTasks' => ManagerTask::query()
                ->with('employee:id,name,email')
                ->where('manager_id', $manager->id)
                ->latest()
                ->get(),
            'updates' => WorkspaceUpdate::query()
                ->where('manager_id', $manager->id)
                ->latest()
                ->get(),
            'ideas' => FeedbackItem::query()
                ->with('submittedBy:id,name,email')
                ->whereNull('approved_at')
                ->whereHas('submittedBy', fn ($query) => $query->where('manager_id', $manager->id))
                ->latest()
                ->get(),
        ]);
    }
}
