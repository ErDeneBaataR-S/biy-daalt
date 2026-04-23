# Role-Based Admin Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the current shared product-management shell into a role-aware system for `admin`, `manager`, and `employee`, with backend-enforced access, role-specific landing pages, and less noisy navigation.

**Architecture:** Keep one Laravel + Inertia application, add a `role` field to users, centralize authorization through model helpers plus middleware/gates, and expose role/capability props to the frontend. Reuse existing pages where possible, but create focused entry points for admin overview, projects, and employee workspace pages so the app feels like one coherent system instead of a set of disconnected demos.

**Tech Stack:** Laravel 12, PHP, Pest, Inertia.js, React 19, TypeScript, Vite, Tailwind CSS

---

## File Structure

### Backend files to modify

- Modify: `database/migrations/0001_01_01_000000_create_users_table.php`
  - Add the initial `role` column for fresh installs.
- Create: `database/migrations/2026_04_23_000001_add_role_to_users_table.php`
  - Backfill existing databases with a default role.
- Modify: `app/Models/User.php`
  - Add role constants/helpers/casts and capability predicates.
- Modify: `database/factories/UserFactory.php`
  - Add `admin()`, `manager()`, and `employee()` states.
- Modify: `app/Http/Middleware/HandleInertiaRequests.php`
  - Share `auth.user.role` and derived capability flags.
- Create: `app/Support/RoleHome.php`
  - Centralize post-login landing route resolution by role.
- Create: `app/Http/Middleware/EnsureUserHasRole.php`
  - Restrict admin-only routes and other role-only areas.
- Modify: `bootstrap/app.php`
  - Register the new middleware alias.
- Modify: `routes/web.php`
  - Add role-aware home redirect, admin overview route, projects route, employee workspace routes.

### Frontend files to modify

- Modify: `resources/js/types/auth.ts`
  - Add explicit role and capability types.
- Modify: `resources/js/types/navigation.ts`
  - Support grouped and capability-aware nav items if needed.
- Modify: `resources/js/components/app-sidebar.tsx`
  - Replace the one-size-fits-all nav definition with role-aware nav selection.
- Modify: `resources/js/components/nav-main.tsx`
  - Support grouped items or section labels if needed.
- Modify: `resources/js/pages/dashboard.tsx`
  - Render role-aware content for admin/manager/employee.
- Modify: `resources/js/pages/backlog.tsx`
  - Degrade employee access to a limited secondary view.
- Modify: `resources/js/pages/analytics.tsx`
  - Split admin vs manager visibility and hide from employee nav.
- Modify: `resources/js/pages/settings/index.tsx`
  - Keep personal settings global; add admin system-settings entry point only for admins.
- Create: `resources/js/lib/navigation.ts`
  - Define admin nav and manager/employee nav in one place.
- Create: `resources/js/pages/admin/overview.tsx`
  - Admin landing page.
- Create: `resources/js/pages/projects.tsx`
  - Shared projects index page with role-specific actions.
- Create: `resources/js/pages/my-dashboard.tsx`
  - Employee-first dashboard.
- Create: `resources/js/pages/my-tasks.tsx`
  - Employee assigned-work page.
- Create: `resources/js/pages/personal-tasks.tsx`
  - Employee personal-task page.
- Create: `resources/js/pages/updates.tsx`
  - Employee read-only updates page.

### Tests to add or modify

- Create: `tests/Feature/Auth/RoleLandingTest.php`
- Create: `tests/Feature/AdminAccessTest.php`
- Create: `tests/Feature/EmployeeWorkspaceTest.php`
- Modify: `tests/Feature/DashboardTest.php`
- Modify: `tests/Feature/BacklogTest.php`
- Modify: `tests/Feature/AnalyticsTest.php`

### Supporting references to keep open while implementing

- `routes/settings.php`
- `resources/js/layouts/app-layout.tsx`
- `resources/js/components/app-header.tsx`
- `resources/js/pages/roadmap.tsx`
- `resources/js/pages/Releases.tsx`
- `resources/js/pages/Feedback.tsx`

### Decomposition note

The spec has one coherent vertical slice: role model, route access, navigation, and first-pass page reshaping. The persistence hardening work is intentionally deferred; do not try to redesign the whole data model during this plan.

## Task 1: Add user roles to the backend model and factories

**Files:**
- Modify: `database/migrations/0001_01_01_000000_create_users_table.php`
- Create: `database/migrations/2026_04_23_000001_add_role_to_users_table.php`
- Modify: `app/Models/User.php`
- Modify: `database/factories/UserFactory.php`
- Test: `tests/Feature/Auth/RoleLandingTest.php`

- [ ] **Step 1: Write the failing test for role-aware users**

```php
<?php

use App\Models\User;

test('user factory can create each supported role', function () {
    expect(User::factory()->admin()->make()->role)->toBe('admin');
    expect(User::factory()->manager()->make()->role)->toBe('manager');
    expect(User::factory()->employee()->make()->role)->toBe('employee');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php artisan test tests/Feature/Auth/RoleLandingTest.php --filter="user factory can create each supported role"`
Expected: FAIL because `role` and factory states do not exist yet.

- [ ] **Step 3: Add the role column and model helpers**

```php
// database/migrations/0001_01_01_000000_create_users_table.php
$table->string('role')->default('employee');
```

```php
// database/migrations/2026_04_23_000001_add_role_to_users_table.php
Schema::table('users', function (Blueprint $table) {
    $table->string('role')->default('employee')->after('password');
});

DB::table('users')->whereNull('role')->update(['role' => 'employee']);
```

```php
// app/Models/User.php
public const ROLE_ADMIN = 'admin';
public const ROLE_MANAGER = 'manager';
public const ROLE_EMPLOYEE = 'employee';

protected $fillable = [
    'name',
    'email',
    'password',
    'role',
];

public function isAdmin(): bool
{
    return $this->role === self::ROLE_ADMIN;
}

public function isManager(): bool
{
    return $this->role === self::ROLE_MANAGER;
}

public function isEmployee(): bool
{
    return $this->role === self::ROLE_EMPLOYEE;
}
```

```php
// database/factories/UserFactory.php
public function admin(): static
{
    return $this->state(fn () => ['role' => User::ROLE_ADMIN]);
}

public function manager(): static
{
    return $this->state(fn () => ['role' => User::ROLE_MANAGER]);
}

public function employee(): static
{
    return $this->state(fn () => ['role' => User::ROLE_EMPLOYEE]);
}
```

- [ ] **Step 4: Run the focused test and migrations**

Run: `php artisan test tests/Feature/Auth/RoleLandingTest.php --filter="user factory can create each supported role"`
Expected: PASS

Run: `php artisan migrate`
Expected: migration completes and `users.role` exists.

- [ ] **Step 5: Commit**

```bash
git add database/migrations/0001_01_01_000000_create_users_table.php database/migrations/2026_04_23_000001_add_role_to_users_table.php app/Models/User.php database/factories/UserFactory.php tests/Feature/Auth/RoleLandingTest.php
git commit -m "feat: add role support to users"
```

## Task 2: Add role-aware login landing and shared auth capabilities

**Files:**
- Create: `app/Support/RoleHome.php`
- Modify: `app/Http/Middleware/HandleInertiaRequests.php`
- Modify: `routes/web.php`
- Modify: `resources/js/types/auth.ts`
- Test: `tests/Feature/Auth/RoleLandingTest.php`

- [ ] **Step 1: Write the failing tests for role landing and shared props**

```php
<?php

use App\Models\User;

test('admin is redirected to admin overview after hitting home', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->get(route('home'))
        ->assertRedirect(route('admin.overview'));
});

test('employee inertia props include role and capability flags', function () {
    $user = User::factory()->employee()->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn ($page) => $page
            ->where('auth.user.role', 'employee')
            ->where('auth.capabilities.access_admin', false)
            ->where('auth.capabilities.create_personal_tasks', true)
        );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php artisan test tests/Feature/Auth/RoleLandingTest.php`
Expected: FAIL because home redirect and capability props do not exist.

- [ ] **Step 3: Implement role home resolution and shared props**

```php
// app/Support/RoleHome.php
namespace App\Support;

use App\Models\User;

class RoleHome
{
    public static function routeNameFor(User $user): string
    {
        return match ($user->role) {
            User::ROLE_ADMIN => 'admin.overview',
            User::ROLE_MANAGER => 'dashboard',
            default => 'my-dashboard',
        };
    }
}
```

```php
// routes/web.php
use App\Support\RoleHome;

Route::get('/home', function () {
    $user = request()->user();

    abort_unless($user, 403);

    return redirect()->route(RoleHome::routeNameFor($user));
})->middleware(['auth', 'verified'])->name('app.home');
```

```php
// app/Http/Middleware/HandleInertiaRequests.php
'auth' => [
    'user' => $request->user() ? [
        ...$request->user()->only(['id', 'name', 'email', 'role', 'email_verified_at', 'created_at', 'updated_at']),
    ] : null,
    'capabilities' => $request->user() ? [
        'access_admin' => $request->user()->isAdmin(),
        'manage_projects' => $request->user()->isAdmin() || $request->user()->isManager(),
        'create_personal_tasks' => $request->user()->isEmployee(),
        'view_company_updates' => true,
    ] : null,
],
```

```ts
// resources/js/types/auth.ts
export type UserRole = 'admin' | 'manager' | 'employee';

export type AuthCapabilities = {
    access_admin: boolean;
    manage_projects: boolean;
    create_personal_tasks: boolean;
    view_company_updates: boolean;
};
```

- [ ] **Step 4: Run the focused tests**

Run: `php artisan test tests/Feature/Auth/RoleLandingTest.php`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/Support/RoleHome.php app/Http/Middleware/HandleInertiaRequests.php routes/web.php resources/js/types/auth.ts tests/Feature/Auth/RoleLandingTest.php
git commit -m "feat: add role-aware landing and auth capabilities"
```

## Task 3: Add backend route protection for admin-only areas

**Files:**
- Create: `app/Http/Middleware/EnsureUserHasRole.php`
- Modify: `bootstrap/app.php`
- Modify: `routes/web.php`
- Test: `tests/Feature/AdminAccessTest.php`

- [ ] **Step 1: Write the failing admin access tests**

```php
<?php

use App\Models\User;

test('manager cannot access admin overview', function () {
    $user = User::factory()->manager()->create();

    $this->actingAs($user)
        ->get(route('admin.overview'))
        ->assertForbidden();
});

test('admin can access admin overview', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->get(route('admin.overview'))
        ->assertOk();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php artisan test tests/Feature/AdminAccessTest.php`
Expected: FAIL because the route and middleware do not exist.

- [ ] **Step 3: Implement the role middleware and protect admin routes**

```php
// app/Http/Middleware/EnsureUserHasRole.php
public function handle(Request $request, Closure $next, string ...$roles): Response
{
    $user = $request->user();

    abort_unless($user, 403);
    abort_unless(in_array($user->role, $roles, true), 403);

    return $next($request);
}
```

```php
// bootstrap/app.php
$middleware->alias([
    'role' => \App\Http\Middleware\EnsureUserHasRole::class,
]);
```

```php
// routes/web.php
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::inertia('admin', 'admin/overview')->name('admin.overview');
});
```

- [ ] **Step 4: Run the focused tests**

Run: `php artisan test tests/Feature/AdminAccessTest.php`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/Http/Middleware/EnsureUserHasRole.php bootstrap/app.php routes/web.php tests/Feature/AdminAccessTest.php
git commit -m "feat: protect admin-only routes by role"
```

## Task 4: Replace the shared sidebar with role-aware navigation

**Files:**
- Create: `resources/js/lib/navigation.ts`
- Modify: `resources/js/components/app-sidebar.tsx`
- Modify: `resources/js/components/nav-main.tsx`
- Modify: `resources/js/types/navigation.ts`
- Test: `tests/Feature/DashboardTest.php`

- [ ] **Step 1: Write the failing route/nav visibility test**

```php
<?php

use App\Models\User;

test('employee does not receive admin navigation items in dashboard props', function () {
    $user = User::factory()->employee()->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn ($page) => $page
            ->where('auth.user.role', 'employee')
            ->missing('admin')
        );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php artisan test tests/Feature/DashboardTest.php --filter="employee does not receive admin navigation items in dashboard props"`
Expected: FAIL or remain unimplemented because the frontend nav logic is still hardcoded.

- [ ] **Step 3: Extract navigation definitions and switch by role**

```ts
// resources/js/lib/navigation.ts
import { ChartColumnBig, LayoutGrid, ListTodo, Settings, Shield, UserCog } from 'lucide-react';
import type { UserRole } from '@/types/auth';
import type { NavItem } from '@/types/navigation';

export function getSidebarItems(role: UserRole): NavItem[] {
    if (role === 'admin') {
        return [
            { title: 'Overview', href: '/admin', icon: LayoutGrid },
            { title: 'Users', href: '/admin/users', icon: UserCog },
            { title: 'Roles / Access', href: '/admin/access', icon: Shield },
            { title: 'Projects', href: '/projects', icon: ListTodo },
            { title: 'Analytics', href: '/analytics', icon: ChartColumnBig },
            { title: 'Settings', href: '/settings', icon: Settings },
        ];
    }

    if (role === 'employee') {
        return [
            { title: 'My Dashboard', href: '/my-dashboard', icon: LayoutGrid },
            { title: 'My Tasks', href: '/my-tasks', icon: ListTodo },
            { title: 'Personal Tasks', href: '/personal-tasks', icon: ListTodo },
            { title: 'Updates', href: '/updates', icon: ChartColumnBig },
        ];
    }

    return [
        { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
        { title: 'Projects', href: '/projects', icon: ListTodo },
        { title: 'Backlog', href: '/backlog', icon: ListTodo },
        { title: 'Roadmap', href: '/roadmap', icon: ListTodo },
        { title: 'Feedback', href: '/feedback', icon: ListTodo },
        { title: 'Releases', href: '/releases', icon: ListTodo },
        { title: 'Analytics', href: '/analytics', icon: ChartColumnBig },
    ];
}
```

```tsx
// resources/js/components/app-sidebar.tsx
const { auth } = usePage<{ auth: Auth }>().props;
const mainNavItems = getSidebarItems(auth.user.role);
```

- [ ] **Step 4: Run typecheck and focused tests**

Run: `npm run types:check`
Expected: PASS

Run: `php artisan test tests/Feature/DashboardTest.php`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add resources/js/lib/navigation.ts resources/js/components/app-sidebar.tsx resources/js/components/nav-main.tsx resources/js/types/navigation.ts tests/Feature/DashboardTest.php
git commit -m "feat: make sidebar role-aware"
```

## Task 5: Add admin overview and projects entry points

**Files:**
- Create: `resources/js/pages/admin/overview.tsx`
- Create: `resources/js/pages/projects.tsx`
- Modify: `routes/web.php`
- Test: `tests/Feature/AdminAccessTest.php`

- [ ] **Step 1: Write the failing page tests**

```php
<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('admin overview renders the admin overview component', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($user)
        ->get(route('admin.overview'))
        ->assertInertia(fn (Assert $page) => $page->component('admin/overview'));
});

test('manager can visit projects page', function () {
    $user = User::factory()->manager()->create();

    $this->actingAs($user)
        ->get(route('projects.index'))
        ->assertInertia(fn (Assert $page) => $page->component('projects'));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php artisan test tests/Feature/AdminAccessTest.php`
Expected: FAIL because the new pages and routes are not complete.

- [ ] **Step 3: Implement the pages and routes**

```php
// routes/web.php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('projects', 'projects')->name('projects.index');
    Route::inertia('my-dashboard', 'my-dashboard')->name('my-dashboard');
    Route::inertia('my-tasks', 'my-tasks')->name('my-tasks');
    Route::inertia('personal-tasks', 'personal-tasks')->name('personal-tasks');
    Route::inertia('updates', 'updates')->name('updates');
});
```

```tsx
// resources/js/pages/admin/overview.tsx
export default function AdminOverview() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Overview', href: '/admin' }]}>
            <Head title="Admin Overview" />
            <div className="space-y-6 px-4 py-6">
                <Heading
                    title="Admin Overview"
                    description="Organization access, project oversight, and system health."
                />
            </div>
        </AppLayout>
    );
}
```

```tsx
// resources/js/pages/projects.tsx
export default function Projects() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const canManage = auth.capabilities.manage_projects;

    return (
        <AppLayout breadcrumbs={[{ title: 'Projects', href: '/projects' }]}>
            <Head title="Projects" />
            <div className="space-y-6 px-4 py-6">
                <Heading
                    title="Projects"
                    description={canManage ? 'Manage owned projects and track company-wide visibility.' : 'Browse project status and company progress.'}
                />
            </div>
        </AppLayout>
    );
}
```

- [ ] **Step 4: Run focused tests**

Run: `php artisan test tests/Feature/AdminAccessTest.php`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add routes/web.php resources/js/pages/admin/overview.tsx resources/js/pages/projects.tsx tests/Feature/AdminAccessTest.php
git commit -m "feat: add admin overview and projects pages"
```

## Task 6: Add the employee workspace pages and role-aware home pages

**Files:**
- Create: `resources/js/pages/my-dashboard.tsx`
- Create: `resources/js/pages/my-tasks.tsx`
- Create: `resources/js/pages/personal-tasks.tsx`
- Create: `resources/js/pages/updates.tsx`
- Modify: `resources/js/pages/dashboard.tsx`
- Test: `tests/Feature/EmployeeWorkspaceTest.php`

- [ ] **Step 1: Write the failing employee workspace tests**

```php
<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('employee can visit my dashboard', function () {
    $user = User::factory()->employee()->create();

    $this->actingAs($user)
        ->get(route('my-dashboard'))
        ->assertInertia(fn (Assert $page) => $page->component('my-dashboard'));
});

test('manager is redirected away from employee-only pages', function () {
    $user = User::factory()->manager()->create();

    $this->actingAs($user)
        ->get(route('my-tasks'))
        ->assertForbidden();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php artisan test tests/Feature/EmployeeWorkspaceTest.php`
Expected: FAIL because the pages exist only in the plan so far.

- [ ] **Step 3: Implement the employee-first pages**

```tsx
// resources/js/pages/my-dashboard.tsx
export default function MyDashboard() {
    return (
        <AppLayout breadcrumbs={[{ title: 'My Dashboard', href: '/my-dashboard' }]}>
            <Head title="My Dashboard" />
            <div className="space-y-6 px-4 py-6">
                <Heading
                    title="My Dashboard"
                    description="Your assigned work, personal tasks, and current updates."
                />
            </div>
        </AppLayout>
    );
}
```

```tsx
// resources/js/pages/my-tasks.tsx
export default function MyTasks() {
    return (
        <AppLayout breadcrumbs={[{ title: 'My Tasks', href: '/my-tasks' }]}>
            <Head title="My Tasks" />
        </AppLayout>
    );
}
```

```php
// routes/web.php
Route::middleware(['auth', 'verified', 'role:employee'])->group(function () {
    Route::inertia('my-dashboard', 'my-dashboard')->name('my-dashboard');
    Route::inertia('my-tasks', 'my-tasks')->name('my-tasks');
    Route::inertia('personal-tasks', 'personal-tasks')->name('personal-tasks');
    Route::inertia('updates', 'updates')->name('updates');
});
```

```tsx
// resources/js/pages/dashboard.tsx
if (auth.user.role === 'manager') {
    // keep manager-oriented current dashboard experience
}
```

- [ ] **Step 4: Run focused tests**

Run: `php artisan test tests/Feature/EmployeeWorkspaceTest.php`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add routes/web.php resources/js/pages/my-dashboard.tsx resources/js/pages/my-tasks.tsx resources/js/pages/personal-tasks.tsx resources/js/pages/updates.tsx resources/js/pages/dashboard.tsx tests/Feature/EmployeeWorkspaceTest.php
git commit -m "feat: add employee workspace pages"
```

## Task 7: Tighten role behavior on shared pages

**Files:**
- Modify: `resources/js/pages/backlog.tsx`
- Modify: `resources/js/pages/analytics.tsx`
- Modify: `resources/js/pages/settings/index.tsx`
- Modify: `tests/Feature/BacklogTest.php`
- Modify: `tests/Feature/AnalyticsTest.php`

- [ ] **Step 1: Write the failing shared-page role tests**

```php
<?php

use App\Models\User;

test('employee cannot use manager backlog route as a primary workspace', function () {
    $user = User::factory()->employee()->create();

    $this->actingAs($user)
        ->get(route('backlog'))
        ->assertForbidden();
});

test('employee is redirected away from analytics', function () {
    $user = User::factory()->employee()->create();

    $this->actingAs($user)
        ->get(route('analytics'))
        ->assertForbidden();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `php artisan test tests/Feature/BacklogTest.php tests/Feature/AnalyticsTest.php`
Expected: FAIL because those routes are still shared too broadly.

- [ ] **Step 3: Restrict shared routes and update page content**

```php
// routes/web.php
Route::middleware(['auth', 'verified', 'role:admin,manager'])->group(function () {
    Route::inertia('backlog', 'backlog')->name('backlog');
    Route::inertia('analytics', 'analytics')->name('analytics');
});
```

```tsx
// resources/js/pages/analytics.tsx
const title = auth.user.role === 'admin' ? 'Organization Analytics' : 'Delivery Analytics';
```

```tsx
// resources/js/pages/settings/index.tsx
{auth.user.role === 'admin' && (
    <Card>
        <CardTitle>System settings</CardTitle>
    </Card>
)}
```

- [ ] **Step 4: Run focused tests and typecheck**

Run: `php artisan test tests/Feature/BacklogTest.php tests/Feature/AnalyticsTest.php`
Expected: PASS

Run: `npm run types:check`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add routes/web.php resources/js/pages/backlog.tsx resources/js/pages/analytics.tsx resources/js/pages/settings/index.tsx tests/Feature/BacklogTest.php tests/Feature/AnalyticsTest.php
git commit -m "feat: tighten role behavior on shared pages"
```

## Task 8: Run full verification and document follow-up persistence work

**Files:**
- Modify: `docs/superpowers/specs/2026-04-23-role-based-admin-flow-design.md` (only if implementation forces a clarified note)
- Modify: `docs/superpowers/plans/2026-04-23-role-based-admin-flow.md` (checklist updates only during execution)

- [ ] **Step 1: Run backend feature coverage**

Run: `php artisan test tests/Feature/Auth/RoleLandingTest.php tests/Feature/AdminAccessTest.php tests/Feature/EmployeeWorkspaceTest.php tests/Feature/DashboardTest.php tests/Feature/BacklogTest.php tests/Feature/AnalyticsTest.php`
Expected: PASS

- [ ] **Step 2: Run frontend type verification**

Run: `npm run types:check`
Expected: PASS

- [ ] **Step 3: Run formatting/lint verification if touched files require it**

Run: `npm run lint:check`
Expected: PASS or only pre-existing unrelated warnings

- [ ] **Step 4: Review against the spec before closing**

Check:

- admin has a broader sidebar and landing page
- manager and employee no longer share the same primary flow
- employee starts in a personal workspace
- route protection is backend-enforced
- analytics/backlog behavior is role-scoped

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: verify role-based admin flow"
```

## Self-Review

### Spec coverage

- Role model: Tasks 1-3
- Role-aware navigation and landing pages: Tasks 2, 4, 5, 6
- Admin vs manager vs employee flows: Tasks 4-7
- Backend-enforced access: Tasks 2, 3, 7
- Employee workspace cleanup: Task 6
- Shared page tightening: Task 7
- Verification: Task 8

### Placeholder scan

No `TBD`, `TODO`, or deferred implementation placeholders are left in the task steps. The intentionally deferred persistence work is explicitly out of scope and only verified as follow-up context in Task 8.

### Type consistency

- Role values remain `admin | manager | employee` across migration, model, factory, shared props, and frontend types.
- The landing routes remain `admin.overview`, `dashboard`, and `my-dashboard`.
- Capability names remain `access_admin`, `manage_projects`, `create_personal_tasks`, and `view_company_updates`.
