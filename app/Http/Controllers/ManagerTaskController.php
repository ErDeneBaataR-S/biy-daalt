<?php

namespace App\Http\Controllers;

use App\Http\Requests\ManagerTaskRequest;
use App\Models\EmployeeTask;
use App\Models\ManagerTask;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ManagerTaskController extends Controller
{
    public function store(ManagerTaskRequest $request): RedirectResponse
    {
        $request->user()->managerTasks()->create([
            'status' => 'unassigned',
            'priority' => 'medium',
            ...$request->validated(),
        ]);

        return back();
    }

    public function assign(Request $request, ManagerTask $managerTask): RedirectResponse
    {
        $this->ensureOwner($request, $managerTask);

        $validated = $request->validate([
            'employee_id' => ['required', 'integer', 'exists:users,id'],
        ]);

        $employee = User::query()->findOrFail($validated['employee_id']);

        abort_unless($employee->isEmployee() && $employee->manager_id === $request->user()->id, 403);

        $managerTask->update([
            'employee_id' => $employee->id,
            'status' => 'assigned',
        ]);

        EmployeeTask::create([
            'user_id' => $employee->id,
            'assigned_by_id' => $request->user()->id,
            'type' => EmployeeTask::TYPE_ASSIGNED,
            'title' => $managerTask->title,
            'description' => $managerTask->description,
            'status' => 'todo',
            'priority' => $managerTask->priority,
        ]);

        return back();
    }

    public function destroy(Request $request, ManagerTask $managerTask): RedirectResponse
    {
        $this->ensureOwner($request, $managerTask);

        $managerTask->delete();

        return back();
    }

    private function ensureOwner(Request $request, ManagerTask $managerTask): void
    {
        abort_unless($managerTask->manager_id === $request->user()->id, 403);
    }
}
