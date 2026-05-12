<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserManagerRequest;
use App\Http\Requests\Admin\UpdateUserRoleRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/users', [
            'users' => User::query()
                ->orderBy('name')
                ->get(['id', 'name', 'email', 'role', 'manager_id', 'email_verified_at', 'created_at']),
            'managers' => User::query()
                ->where('role', User::ROLE_MANAGER)
                ->orderBy('name')
                ->get(['id', 'name', 'email']),
            'roles' => User::roles(),
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $user = User::create([
            ...$validated,
            'manager_id' => null,
        ]);

        $user->forceFill([
            'email_verified_at' => now(),
        ])->save();

        return redirect()->route('admin.users.index');
    }

    public function updateManager(UpdateUserManagerRequest $request, User $user): RedirectResponse
    {
        abort_unless($user->isEmployee(), 403);

        $user->update($request->validated());

        return redirect()->route('admin.users.index');
    }

    public function updateRole(UpdateUserRoleRequest $request, User $user): RedirectResponse
    {
        $role = $request->validated('role');

        abort_if($request->user()->is($user) && $role !== User::ROLE_ADMIN, 403);
        abort_if($user->isAdmin() && $role !== User::ROLE_ADMIN && $this->adminCount() <= 1, 403);

        $user->update([
            'role' => $role,
            'manager_id' => $role === User::ROLE_EMPLOYEE ? $user->manager_id : null,
        ]);

        return redirect()->route('admin.users.index');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        abort_if($request->user()->is($user), 403);
        abort_if($user->isAdmin() && $this->adminCount() <= 1, 403);

        $user->delete();

        return redirect()->route('admin.users.index');
    }

    private function adminCount(): int
    {
        return User::query()->where('role', User::ROLE_ADMIN)->count();
    }
}
