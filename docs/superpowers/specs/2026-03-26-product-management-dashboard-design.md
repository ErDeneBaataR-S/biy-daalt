# Product Management Dashboard Design

## Goal

Reshape the authenticated `/dashboard` page so it closely matches the provided reference image: a light product-management dashboard with a compact left sidebar, thin top toolbar, summary cards, and two primary content panels. This version remains frontend-only and adds basic CRUD behavior for initiatives/tasks and releases using browser `localStorage`.

## Scope

Included in this design:

- Replace the `/dashboard` page composition and visual hierarchy
- Restyle the authenticated sidebar so it visually matches the reference image
- Show the full sidebar navigation list from the reference
- Keep only the `Dashboard` page functional for now
- Add frontend CRUD flows for initiatives/tasks and releases
- Persist dashboard data in browser `localStorage`
- Generate dynamic ids in React when new items are created
- Keep the existing Laravel route and Inertia page flow
- Use Tailwind for all styling changes

Not included in this design:

- Database models
- New backend endpoints
- Server persistence
- Functional pages for roadmap, backlog, feedback, analytics, docs, or settings
- Advanced analytics logic

## Existing Project Context

The app at `C:\Labs\Projects\BiyDaalt` is already a Laravel + React + Inertia application with Tailwind, shared app layouts, and reusable UI primitives under `resources/js/components/ui`. The current authenticated dashboard is rendered from `resources/js/pages/dashboard.tsx`, and the shared sidebar navigation lives in `resources/js/components/app-sidebar.tsx`.

The current dashboard is denser and broader than the approved target. The work is a visual simplification plus a frontend state upgrade from static mock data to client-persisted CRUD data.

## Architecture

The authenticated `/dashboard` route remains unchanged. Laravel continues to serve the page through Inertia, and React remains responsible for rendering dashboard content.

All dashboard data for this phase lives in the frontend. The page owns typed client-side state for initiatives/tasks and releases, initializes that state from default seed data, hydrates from `localStorage` on load, and writes changes back to `localStorage` after create, edit, delete, or status updates.

This keeps the backend untouched while creating a clear migration path to real server props or API-backed persistence later.

## UI Structure

The dashboard should read much closer to the reference image than the current implementation.

### Shared Shell

- Keep the existing authenticated app layout and responsive shell behavior
- Present a single bright workspace panel inside the main content area
- Use a lighter overall surface hierarchy than the current dashboard

### Sidebar

The sidebar should visually match the screenshot and include these labels:

- Dashboard
- Roadmap
- Backlog
- Feedback
- Releases
- Analytics
- Docs
- Settings

Only `Dashboard` needs to be functionally meaningful in this first pass. The remaining items can stay as placeholder destinations or inert links, but they should appear visually complete in the sidebar.

The visual treatment should emphasize:

- small brand row
- compact navigation spacing
- subtle active-state highlight for `Dashboard`
- pale gray and blue surface hierarchy matching the screenshot

### Dashboard Content

The page should be simplified to these sections:

- top toolbar with search, small utility icons, and a blue `New` button
- page title row
- compact summary cards
- `Top Initiatives` panel
- `Releases` panel
- optional compact `My Work` style support panel if it helps preserve the screenshot composition

The older extra sections should be removed so the page remains visually close to the reference.

## CRUD Behavior

Frontend CRUD should cover both initiatives/tasks and releases.

Required behavior:

- create a new initiative/task
- edit an existing initiative/task
- delete an initiative/task
- toggle initiative/task completion or status
- create a new release
- edit an existing release
- delete a release
- update release metadata such as title, date, or status

The `New` action in the toolbar can open the primary creation flow, while secondary inline actions can live inside the relevant dashboard panels.

## Data Design

The dashboard needs typed frontend models for:

- summary metrics derived from current client-side data
- initiatives/tasks
- releases

Each initiative and release must receive a generated id in the frontend when created. Those ids are used for list rendering, edit targeting, delete targeting, and any local selection state.

Persistence strategy:

- initialize with seeded default data when `localStorage` is empty
- hydrate from `localStorage` when stored data exists
- save all CRUD mutations back to `localStorage`

## Component Boundaries

Recommended structure:

- `resources/js/pages/dashboard.tsx`
  - page composition
  - dashboard state wiring
  - `localStorage` hydration and persistence hooks
- `resources/js/components/dashboard/dashboard-shell.tsx`
  - dashboard workspace frame and toolbar
- `resources/js/components/dashboard/dashboard-metric-card.tsx`
  - compact metric cards with small visual accents
- `resources/js/components/dashboard/*`
  - focused list/form/dialog components for initiatives and releases as needed
- `resources/js/components/app-sidebar.tsx`
  - shared sidebar styling and navigation presentation

The implementation should avoid pushing all dashboard CRUD logic into one oversized page file. Small, focused dashboard components are preferred where they reduce complexity.

## Styling Direction

Tailwind remains the styling layer. The implementation should not depend on third-party templates.

Visual direction:

- pale gray application background
- white content surfaces
- subtle blue accents
- soft rounded corners
- thin borders
- restrained shadows
- simplified enterprise typography hierarchy

The result should feel intentionally close to the screenshot rather than like a generic admin panel.

## Responsiveness

Desktop should match the reference composition as closely as practical within the existing shell. On narrower widths:

- the toolbar should wrap cleanly
- summary cards should stack cleanly
- the dashboard content panels should become a vertical flow
- CRUD controls should remain usable without precision clicking

The sidebar should continue using the existing responsive shell behavior.

## Error Handling

Because the page is frontend-only, runtime error handling stays narrow.

The reliability requirements are:

- dashboard renders safely from seeded data
- malformed or missing `localStorage` data falls back to defaults
- CRUD operations do not break the page if storage is unavailable or empty

## Testing Strategy

This work should follow TDD where the repository already has support.

Required verification:

- update the Laravel feature test for `/dashboard` so it asserts the new stable labels and sections
- add frontend tests only if the project already supports them without introducing excessive new tooling
- run TypeScript checks
- run linting
- run a production build

If no React component test runner is already configured, do not introduce one just for this first dashboard rewrite unless needed for practical confidence.

## Success Criteria

The first version is successful when:

- `/dashboard` visually resembles the provided reference image
- the sidebar matches the screenshot and shows the full navigation set
- only the dashboard page is functionally implemented
- initiatives/tasks and releases support frontend CRUD
- data persists across refreshes through `localStorage`
- newly created items use generated dynamic ids in the frontend
- the implementation passes the focused dashboard test, TypeScript checks, linting, and production build
