<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeTaskRequest;
use App\Models\EmployeeTask;
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

        $request->user()->employeeTasks()->create([
            'type' => $type,
            ...$request->validated(),
        ]);

        return back();
    }

    public function update(EmployeeTaskRequest $request, EmployeeTask $employeeTask): RedirectResponse
    {
        $this->ensureOwner($request, $employeeTask);

        $employeeTask->update($request->validated());

        return back();
    }

    public function destroy(Request $request, EmployeeTask $employeeTask): RedirectResponse
    {
        $this->ensureOwner($request, $employeeTask);

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

    private function ensureOwner(Request $request, EmployeeTask $employeeTask): void
    {
        abort_unless($employeeTask->user_id === $request->user()->id, 403);
    }

    private function validateType(string $type): void
    {
        abort_unless(in_array($type, [EmployeeTask::TYPE_ASSIGNED, EmployeeTask::TYPE_PERSONAL], true), 404);
    }
}
