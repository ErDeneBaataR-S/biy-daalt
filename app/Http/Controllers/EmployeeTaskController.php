<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeTaskRequest;
use App\Models\EmployeeTask;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeTaskController extends Controller
{
    public function assigned(Request $request): Response
    {
        return $this->renderTaskPage($request, EmployeeTask::TYPE_ASSIGNED, 'my-tasks');
    }

    public function personal(Request $request): Response
    {
        return $this->renderTaskPage($request, EmployeeTask::TYPE_PERSONAL, 'personal-tasks');
    }

    public function store(EmployeeTaskRequest $request, string $type): RedirectResponse
    {
        $this->validateType($type);

        $assignee = $this->resolveAssignee($request, $type);

        $assignee->employeeTasks()->create([
            'assigned_by_id' => $type === EmployeeTask::TYPE_ASSIGNED ? $request->user()->id : null,
            'type' => $type,
            ...$request->validated(),
        ]);

        return back();
    }

    public function update(EmployeeTaskRequest $request, EmployeeTask $employeeTask): RedirectResponse
    {
        $this->ensureAllowed($request, $employeeTask);

        $employeeTask->update($request->validated());

        return back();
    }

    public function destroy(Request $request, EmployeeTask $employeeTask): RedirectResponse
    {
        $this->ensureAllowed($request, $employeeTask);

        $employeeTask->delete();

        return back();
    }

    private function renderTaskPage(Request $request, string $type, string $component): Response
    {
        return Inertia::render($component, [
            'tasks' => EmployeeTask::query()
                ->whereBelongsTo($request->user())
                ->where('type', $type)
                ->latest()
                ->get(),
        ]);
    }

    private function ensureAllowed(Request $request, EmployeeTask $employeeTask): void
    {
        $user = $request->user();

        abort_unless(
            $employeeTask->user_id === $user->id ||
                ($user->isManager() && $employeeTask->assigned_by_id === $user->id),
            403,
        );
    }

    private function validateType(string $type): void
    {
        abort_unless(in_array($type, [EmployeeTask::TYPE_ASSIGNED, EmployeeTask::TYPE_PERSONAL], true), 404);
    }

    private function resolveAssignee(Request $request, string $type): User
    {
        if ($type === EmployeeTask::TYPE_PERSONAL) {
            return $request->user();
        }

        abort_unless($request->user()->isManager(), 403);

        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
        ]);

        $assignee = User::query()->findOrFail($validated['user_id']);

        abort_unless($assignee->isEmployee() && $assignee->manager_id === $request->user()->id, 403);

        return $assignee;
    }
}
