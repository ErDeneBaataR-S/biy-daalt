# Role-Based Admin Flow Design

## Summary

This spec redesigns the current product-management UI into a role-based web system with three positions:

- `admin`
- `manager`
- `employee`

The current application uses one shared authenticated shell and mostly equal navigation for every user. That creates two UX problems:

- everyone sees the same navigation regardless of responsibility
- the product feels like a set of separate demos instead of one coherent system

The new design introduces role-aware navigation, role-aware landing pages, and explicit access boundaries so the app matches how each user actually works.

## Current Context

The application already contains these authenticated destinations:

- `dashboard`
- `backlog`
- `roadmap`
- `feedback`
- `releases`
- `analytics`
- `docs`
- `settings`

At the moment:

- the sidebar is shared by all authenticated users
- the `users` table has no role column
- most product pages are frontend-driven and persist to `localStorage`
- authorization is mostly route-level auth, not role/capability-based

This means the current system has the right page categories, but not the right flow or access model.

## Goals

- Introduce a clear role model for `admin`, `manager`, and `employee`
- Make navigation and default landing pages role-specific
- Reduce employee noise and make the employee experience task-focused
- Make the admin experience clearly broader than the rest of the system
- Keep manager and employee experiences related, but not identical
- Establish backend-enforced access rules instead of frontend-only hiding

## Non-Goals

- Building a full enterprise permission matrix in the first pass
- Replacing every existing page with a brand-new screen
- Solving full backend persistence for all current frontend-first modules in the same phase
- Designing departmental or custom per-user navigation

## Role Model

### Admin

`admin` is the system-level role.

Responsibilities:

- manage users
- manage roles/access
- manage or oversee all projects
- access broader analytics and system settings

Access shape:

- full read/write across the application
- full organization visibility
- broader analytics than non-admin roles

### Manager

`manager` is the delivery and team-operations role.

Responsibilities:

- manage owned projects
- create and assign project work
- track project progress and delivery
- monitor all projects across the company

Access shape:

- can view all projects
- can create/edit/manage only projects within owned scope
- can create/edit/assign project tasks within owned scope
- cannot manage global users/roles/settings

### Employee

`employee` is the execution-focused role.

Responsibilities:

- work from a personal dashboard
- update assigned tasks
- create and manage personal tasks
- stay informed through read-only company/project updates

Access shape:

- can update assigned work
- can create personal tasks, but not project tasks
- can see read-only updates relevant to the company/project context
- cannot assign work or manage projects/system settings

## Navigation and Landing Flow

The system should stop treating all pages as equal destinations. Instead, each role should enter the app through its main workflow.

### Admin Flow

Landing page:

- `Admin Overview`

Primary navigation:

- Overview
- Users
- Roles / Access
- Projects
- Analytics
- Releases
- Settings

Admin should have a distinct sidebar because the role owns broader system functions and analytics than the rest of the app.

### Manager Flow

Landing page:

- `Manager Dashboard`

Primary navigation:

- Dashboard
- Projects
- Backlog
- Roadmap
- Feedback
- Releases
- Analytics

The manager experience should focus on planning, assigning, and tracking work.

### Employee Flow

Landing page:

- `My Dashboard`

Primary navigation:

- My Dashboard
- My Tasks
- Personal Tasks
- Updates

Secondary access:

- optional limited backlog/company context view when needed

The employee experience should be intentionally narrow and should not open with a dense multi-tool sidebar.

## Access Rules

### Admin

- full read/write access across users, roles, projects, tasks, releases, settings, and analytics
- can assign managers to projects
- can view organization-wide metrics

### Manager

- can view all projects
- can create/edit/delete only owned or managed projects
- can create/edit/assign project tasks inside owned scope
- can update roadmap, feedback, and releases inside owned scope
- can access manager-level analytics
- cannot manage global users or roles

### Employee

- can update status on assigned tasks
- can create/edit personal tasks
- can view read-only company/project updates
- can access broader backlog context in a limited way
- cannot assign project tasks, edit projects, or manage system settings

## Product Reshape

The existing pages should be reorganized into three functional groups.

### Core Admin

Admin-owned areas:

- admin overview
- users
- roles/access
- organization analytics
- system settings

### Work Management

Shared concept area, primarily for managers:

- projects
- backlog
- roadmap
- feedback
- releases

### Personal Workspace

Employee-first area:

- my dashboard
- my tasks
- personal tasks
- updates

## Existing Page Reinterpretation

### Dashboard

The current `dashboard` route should become role-aware:

- admin: organization/system summary
- manager: team/project summary
- employee: personal summary

The page may remain a shared route if the content is capability-driven, or split later if the views diverge too much.

### Backlog

`backlog` should remain a manager-first operational page.

- manager: full operational tool
- employee: optional limited secondary view only

Employees should not rely on the full backlog page as their main work surface.

### My Tasks and Personal Tasks

New employee-centered surfaces should become the main execution workflow:

- `My Tasks`: assigned project work
- `Personal Tasks`: employee-created personal work items

These pages replace the need for employees to navigate a manager-style backlog first.

### Analytics

`analytics` should split by capability:

- admin: broader organization/system analytics
- manager: delivery and team analytics
- employee: either lightweight personal stats or no dedicated analytics page

### Feedback, Releases, Roadmap

These remain shared concepts, but the visible controls and allowed actions depend on role.

### Settings

Personal settings remain available to all authenticated users.

System settings become admin-only.

## Architecture Direction

This codebase should implement the redesign through a role-aware application shell rather than separate apps.

Recommended direction:

- one shared application
- one distinct admin navigation set
- one shared manager/employee navigation structure with role-based filtering
- shared pages where possible
- capability-based action rendering inside those pages

This approach fits the current Laravel + Inertia structure better than building fully separate frontends for each role.

## Data Flow and Authorization

Role-based behavior must be enforced in three layers:

1. **Database role state**
   Add a role field to users with supported values:
   - `admin`
   - `manager`
   - `employee`

2. **Backend authorization**
   Laravel must own the source of truth for access decisions through centralized helpers/policies/middleware.

3. **Frontend capability awareness**
   Inertia shared props should expose the authenticated user's role and relevant capabilities so the UI can render the correct navigation and actions.

UI hiding alone is not sufficient. Backend access checks are required for any restricted page or mutation.

## Error Handling and UX Boundaries

- users must not see actions they cannot complete
- direct access to restricted routes must return a proper unauthorized/forbidden response
- limited-access pages should degrade to read-only instead of showing broken controls
- employees should be routed toward personal work first, not broad organizational tooling

## Phased Delivery

### Phase 1: Role Foundation

- add role data to users
- expose role/capabilities through shared props
- add route and authorization guards

### Phase 2: Role-Aware Navigation

- create admin navigation
- create manager/employee filtered navigation
- add role-based post-login landing logic

### Phase 3: Employee Workflow Cleanup

- create `My Dashboard`
- create `My Tasks`
- create `Personal Tasks`
- reduce employee dependence on generic backlog pages

### Phase 4: Shared Page Capability Tightening

- adjust dashboard, backlog, roadmap, feedback, releases, analytics, and settings behavior by role

### Phase 5: Persistence Hardening

- progressively replace frontend-only `localStorage` behavior where required for a real multi-user system

This sequencing keeps security and UX changes aligned while keeping the first implementation scope contained.

## Testing Strategy

Minimum coverage for this redesign:

- feature tests for route access by role
- feature tests for post-login redirect by role
- feature tests proving admin-only pages are blocked for manager/employee users
- feature tests proving manager permissions differ from employee permissions
- frontend tests for role-aware sidebar rendering

## Success Criteria

- users no longer see the same navigation regardless of role
- the admin experience clearly exposes broader controls and analytics
- managers can manage work without carrying system-level controls
- employees land in a focused personal workspace instead of a manager-style toolset
- access control is enforced by the backend, not just hidden buttons
- the application feels like one coherent role-based system instead of disconnected page demos
