# Analytics and Settings Pages Design

## Summary

This spec defines the two remaining primary application pages that are still missing dedicated implementations:

- `Analytics`: a metrics-driven page that turns the product-management data already represented in the app into trends, conversions, and operational insights.
- `Settings`: a standalone landing page that acts as a control center for account management, while preserving the existing detailed settings subpages.

The goal is to complete the primary navigation without introducing disconnected placeholder pages or duplicating existing functionality.

## Current Context

The application already has top-level pages for:

- Dashboard
- Roadmap
- Backlog
- Feedback
- Releases
- Docs

The sidebar already includes disabled entries for `Analytics` and `Settings`. Settings functionality also already exists through:

- `/settings/profile`
- `/settings/security`
- `/settings/appearance`

Because those detailed settings screens already exist, the missing work is not a raw CRUD build. It is a missing navigation and page-structure problem.

## Goals

- Replace the disabled `Analytics` and `Settings` navigation items with working destinations.
- Make both pages feel native to the existing application shell and visual language.
- Avoid duplicate feature ownership between the new pages and the existing settings subpages.
- Keep the initial scope frontend-first unless backend support is required by the current data model.

## Non-Goals

- Building a fully configurable BI or reporting system
- Replacing the existing settings subpages
- Moving destructive account actions onto the settings overview
- Designing new global layout systems unrelated to these two pages

## Page 1: Settings Overview

### Purpose

`/settings` becomes a dedicated landing page for account management. It serves as the first stop for users who click the main sidebar `Settings` item.

This page should provide:

- a quick understanding of account state
- a few lightweight actions
- clear entry points into detailed settings management

It should not duplicate the full forms that already live under the settings subpages.

### Information Architecture

The settings overview page will contain four sections:

1. **Account summary**
   Shows the current user's essential state, such as name, email, verification state, and a concise security summary.

2. **Quick actions**
   Lightweight controls or shortcuts that users may reasonably use from an overview page, such as appearance switching or navigation into common account tasks.

3. **Management cards**
   Three cards for Profile, Security, and Appearance. Each card includes a short summary of the current state plus a clear call to action.

4. **Detailed settings navigation**
   The existing settings pages remain the source of truth for editing detailed account configuration.

### Content Model

#### Account Summary

This section should show:

- user name
- email address
- email verification status
- whether two-factor authentication is enabled, if available

The summary should prioritize clarity over density.

#### Quick Actions

This section may include:

- appearance toggle or appearance shortcut
- link to change password/security settings
- link to edit profile

Direct actions on the page should remain small in scope. The page should not embed the full profile or password forms.

#### Management Cards

Each card should include:

- title
- one-sentence description
- current state summary
- primary button linking to the detailed page

Card definitions:

- **Profile**
  Summary of name and email, with a button to manage profile details.

- **Security**
  Summary of password and two-factor state, with a button to manage security.

- **Appearance**
  Summary of current theme preference, with a button to manage appearance settings.

### Navigation Changes

- The main app sidebar `Settings` item should link to `/settings` instead of staying disabled.
- The settings section navigation should include `Overview` as the first entry, before `Profile`, `Security`, and `Appearance`.
- Existing direct routes for the detailed settings pages should remain unchanged.

### Route Strategy

- Add a dedicated `GET /settings` route for the overview page.
- Keep `/settings/profile`, `/settings/security`, and `/settings/appearance` as detailed management routes.
- If the current redirect from `/settings` points to `/settings/profile`, remove or replace it with the new overview page route.

### Boundaries

The settings overview owns:

- summary presentation
- shortcut actions
- top-level settings entry point

The detailed settings subpages own:

- full editing workflows
- destructive actions
- form validation and persistence

## Page 2: Analytics

### Purpose

`/analytics` becomes a dedicated metrics page focused on operational and product workflow insight.

It complements the `Dashboard` rather than replacing it:

- `Dashboard` remains the high-level daily overview
- `Analytics` becomes the deeper trend and conversion view

### Recommended Analytics Direction

The page should follow an **operational analytics** model because that best matches the existing product structure:

- backlog items
- roadmap progress
- feedback intake
- releases shipped

This is a better fit than executive-only reporting or fully customizable reporting.

### Information Architecture

The analytics page will contain five sections:

1. **Header and controls**
   Page title, short description, and optional date-range controls.

2. **KPI row**
   A compact set of headline metrics.

3. **Trend charts**
   Visualize changes over time.

4. **Conversion and throughput**
   Show movement between key workflow stages.

5. **Breakdowns and insight panel**
   Present category/status distribution plus short textual insights.

### KPI Row

Initial KPI cards should cover:

- new backlog items
- feedback received
- releases shipped
- completion or close rate

Each card should include:

- metric label
- primary value
- optional delta or contextual helper text

### Trends Section

Initial trend views should emphasize:

- backlog growth over time
- feedback volume over time

If meaningful project data is not yet available, the implementation may begin with structured placeholder content or static demo data that matches the visual system, but the component boundaries should allow real data wiring later.

### Conversion and Throughput Section

This section should show practical workflow movement such as:

- feedback to backlog conversion
- backlog to release progression

This gives the page a distinct purpose that the dashboard does not currently own.

### Breakdown Section

This section may present:

- counts by status
- counts by priority
- counts by category

The exact breakdown dimensions should be chosen based on the data already present or easiest to expose from the existing application state.

### Insight Panel

This area should surface concise human-readable takeaways, such as:

- increased feedback volume
- slowing release throughput
- concentration of work in a specific status bucket

These insights should stay short and derived from visible page data rather than introducing opaque scoring logic.

## Shared Design Principles

Both pages should:

- reuse the existing app layout and sidebar shell
- follow existing spacing, card, and heading conventions
- feel like first-class product pages rather than placeholder scaffolds
- avoid introducing a separate visual design language

## Data and Implementation Notes

### Settings Overview

This page can likely be built primarily from already available authenticated user props plus any existing settings-related state already surfaced to the current settings screens.

If two-factor or appearance summary data is not already present in the overview response shape, the server-side page props may need a small extension.

### Analytics

Analytics may require one of two implementation paths:

- **Phase 1 frontend-first**: implement the page structure and components with representative static data
- **Phase 2 data-backed**: add controller or inertia props that compute metrics from actual application data

The preferred implementation order is:

1. ship the page structure and navigation cleanly
2. wire real metrics once the source-of-truth data shape is clear

This keeps the navigation complete without blocking on analytics modeling complexity.

## Error Handling

- Missing or unavailable metrics should degrade to empty states or fallback labels, not broken charts.
- Summary cards should handle absent optional account details gracefully.
- Settings overview actions should route users to detailed pages when inline action capability is insufficient.

## Testing Strategy

### Backend / Feature Tests

- verify `/settings` responds successfully for authenticated users
- verify sidebar navigation points to working destinations
- verify `/analytics` responds successfully for authenticated users

### Frontend Tests

- verify the settings overview renders summary cards and primary links
- verify the settings nav includes `Overview`
- verify analytics renders KPI cards and major sections
- verify placeholder or missing data states do not break rendering

## Open Decisions Resolved

- `Settings` should be a separate landing page, not just a direct jump to `Profile`.
- The settings overview should include quick actions and summary information.
- `Analytics` should be an operational analytics page rather than a fully customizable reporting tool.

## Recommended Implementation Order

1. Add routes and navigation for `/settings` and `/analytics`
2. Implement the settings overview page and settings navigation update
3. Implement the analytics page shell and component structure
4. Add tests for both pages
5. Evaluate whether analytics should stay mock-data-backed initially or receive real metrics immediately

