# Product Management Dashboard Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the authenticated dashboard to match the approved reference layout while adding frontend-only CRUD for initiatives/tasks and releases with `localStorage` persistence and generated ids.

**Architecture:** Keep the existing Laravel `/dashboard` route and Inertia wiring unchanged. Implement the redesign inside the React app shell, move dashboard data to typed client-side state backed by `localStorage`, and keep sidebar navigation visually complete while limiting real functionality to the dashboard page.

**Tech Stack:** Laravel 12, Inertia.js, React 19, TypeScript, Tailwind CSS 4, Pest

---

### Task 1: Lock the Dashboard Route Contract

**Files:**
- Modify: `tests/Feature/DashboardTest.php`
- Test: `tests/Feature/DashboardTest.php`

- [ ] **Step 1: Write the failing test**

Strengthen the existing dashboard feature test so it asserts the authenticated route still resolves and includes stable dashboard labels such as `Dashboard`, `Top Initiatives`, and `Releases`.

- [ ] **Step 2: Run test to verify it fails for the new expectations**

Run: `php artisan test tests/Feature/DashboardTest.php`
Expected: FAIL because the current page does not yet expose the approved labels or structure.

- [ ] **Step 3: Write minimal implementation support**

Keep the `/dashboard` route and Inertia component wiring intact while redesigning the client-rendered page.

- [ ] **Step 4: Run test to verify it passes**

Run: `php artisan test tests/Feature/DashboardTest.php`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/Feature/DashboardTest.php
git commit -m "test: lock dashboard route expectations"
```

### Task 2: Build Client-Side Dashboard Data with Dynamic IDs

**Files:**
- Modify: `resources/js/pages/dashboard.tsx`
- Create or Modify: `resources/js/components/dashboard/*`

- [ ] **Step 1: Write the failing behavior-oriented test if practical in existing tooling**

If frontend tests already exist, write a failing test covering initialization from default data and persistence to `localStorage`. If no supported frontend test runner exists, document that limitation and proceed with route-level coverage plus manual verification.

- [ ] **Step 2: Define typed dashboard models**

Add focused TypeScript types for:
- initiatives/tasks
- releases
- dashboard metrics or derived summaries

Each create flow must generate a frontend id, for example with `crypto.randomUUID()` and a safe fallback if needed.

- [ ] **Step 3: Implement `localStorage` hydration**

Load seeded default data when storage is empty, and hydrate stored data when keys already exist.

- [ ] **Step 4: Implement CRUD state mutations**

Add create, edit, delete, and status update flows for initiatives/tasks and releases.

- [ ] **Step 5: Run TypeScript validation**

Run: `npm run types:check`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add resources/js/pages/dashboard.tsx resources/js/components/dashboard
git commit -m "feat: add local dashboard state and persistence"
```

### Task 3: Rebuild the Dashboard UI to Match the Reference

**Files:**
- Modify: `resources/js/pages/dashboard.tsx`
- Modify: `resources/js/components/dashboard/dashboard-shell.tsx`
- Modify: `resources/js/components/dashboard/dashboard-metric-card.tsx`
- Create or Modify: `resources/js/components/dashboard/*`
- Verify only: `resources/js/components/ui/button.tsx`
- Verify only: `resources/js/components/ui/input.tsx`

- [ ] **Step 1: Review the current dashboard composition**

Identify which existing sections should be removed so the final page stays visually close to the screenshot.

- [ ] **Step 2: Implement the screenshot-aligned layout**

Build:
- thin toolbar with search, icons, and blue `New` button
- page title row
- compact summary cards
- `Top Initiatives` panel
- `Releases` panel
- any compact support panel needed to preserve composition

- [ ] **Step 3: Connect CRUD controls into the layout**

Expose creation, editing, deletion, and status toggles in the dashboard panels without expanding into full backend workflows.

- [ ] **Step 4: Refine responsive behavior**

Ensure the layout stacks cleanly on smaller widths and interactive controls remain usable.

- [ ] **Step 5: Run TypeScript validation**

Run: `npm run types:check`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add resources/js/pages/dashboard.tsx resources/js/components/dashboard
git commit -m "feat: redesign dashboard with frontend crud panels"
```

### Task 4: Restyle the Shared Sidebar to Match the Screenshot

**Files:**
- Modify: `resources/js/components/app-sidebar.tsx`
- Verify only: `resources/js/components/app-logo.tsx`
- Verify only: `resources/js/components/nav-main.tsx`

- [ ] **Step 1: Review the current shared sidebar composition**

Identify elements that conflict with the screenshot, including spacing, emphasis, and any extra blocks.

- [ ] **Step 2: Implement the new sidebar styling**

Adjust the shared sidebar so it includes the full reference navigation and visually matches the screenshot with:
- lighter treatment
- compact spacing
- small brand row
- clear active state for `Dashboard`

- [ ] **Step 3: Run lint**

Run: `npm run lint:check`
Expected: PASS

- [ ] **Step 4: Run production build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add resources/js/components/app-sidebar.tsx
git commit -m "feat: restyle sidebar for dashboard redesign"
```

### Task 5: Final Verification

**Files:**
- Verify only: `resources/js/pages/dashboard.tsx`
- Verify only: `resources/js/components/dashboard/*.tsx`
- Verify only: `resources/js/components/app-sidebar.tsx`
- Verify only: `tests/Feature/DashboardTest.php`

- [ ] **Step 1: Run focused Laravel tests**

Run: `php artisan test tests/Feature/DashboardTest.php`
Expected: PASS

- [ ] **Step 2: Run lint**

Run: `npm run lint:check`
Expected: PASS

- [ ] **Step 3: Run type-check**

Run: `npm run types:check`
Expected: PASS

- [ ] **Step 4: Run production build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: verify product dashboard redesign"
```
