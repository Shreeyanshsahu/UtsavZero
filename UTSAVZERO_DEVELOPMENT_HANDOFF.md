# UtsavZero --- Development Handoff

## Continuation brief for the next AI chat

**Handoff date:** 31 October 2026\
**Project:** UtsavZero --- Community Celebrations & Environmental
Intelligence Platform\
**Location/context:** Delhi, India\
**Challenge:** DTU SEVA FIRST Innovation Challenge 2026\
**Purpose:** Resume development from the exact current point without
redesigning the project, inventing files, or losing established
decisions.

> **Read this handoff together with `UTSAVZERO_PROJECT_BIBLE.md`.** The
> Project Bible is the master source of truth for the product concept,
> research, legal context, architecture direction, scope, and claim
> discipline. This handoff supplements it with the latest implementation
> progress and day-to-day development rules.

------------------------------------------------------------------------

# 1. Instructions for the next AI assistant

You are continuing an existing project, not starting a new one.

1.  Read this handoff and the Project Bible before recommending changes.
2.  Treat the Project Bible as the authoritative product reference. Keep
    it updated when major decisions or implementation status change.
3.  Inspect the actual repository and relevant files before proposing
    edits. Never assume a page, component, route, hook, context, or
    folder exists just because it would be a conventional name.
4.  Preserve the existing architecture, naming, routes, component APIs,
    design language, and working behaviour unless there is a clear
    reason to change them.
5.  Work incrementally. Solve the current issue or milestone first; do
    not introduce unrelated features.
6.  When code changes are needed, identify exact file paths and provide
    complete updated files when that is the clearest and safest
    approach. Explain what changed and why.
7.  Do not add dependencies, frameworks, backend services, or
    abstractions without checking the existing project and justifying
    the need.
8.  Distinguish implemented, tested, partially implemented, planned,
    proposed, simulated, and research-only features.
9.  Do not claim something works until it has been tested or the user
    confirms it.
10. At the end of a meaningful work session, summarise completed work,
    changed files, tests, known issues, and the next recommended task.
    Update the Project Bible's development-status section when
    appropriate.

**Important:** The user values understanding the implementation, not
blindly copying code. Explain the data flow and security implications in
practical terms.

------------------------------------------------------------------------

# 2. Product identity and direction

**Name:** UtsavZero\
**Description:** Community Celebrations & Environmental Intelligence
Platform\
**Tagline:** Discover cleaner celebrations. Plan smarter communities.\
**Mission:** "Zero pollution of Delhi" --- an aspirational long-term
mission, not a guaranteed outcome.

UtsavZero has two connected experiences:

-   **Public application:** residents discover organised,
    firecracker-free community celebrations through event listings,
    maps, event details, registration and tickets.
-   **Civic Intelligence Portal:** a proposed restricted
    geospatial-planning and decision-support experience for authorised
    planners. The prototype may demonstrate simulated review workflows,
    spatial checks and explainable planning indicators.

The original public-facing idea remains central: make attractive,
organised community alternatives easier to discover and attend. The
civic layer extends the concept; it does not replace the public product.

## Claim and legal discipline

-   Delhi's current official context includes a complete ban on sale and
    use of firecrackers in NCT Delhi. Public event discovery must focus
    on firecracker-free celebrations.
-   Any fireworks-zone workflow is a hypothetical policy simulation
    only. It is not a live permission service.
-   Never imply UtsavZero is a government portal, has government
    endorsement, issues legal permissions, or certifies a site as safe.
-   Use explicit labels such as **"Approved --- Simulated Demo Status"**
    for simulated decisions.
-   Do not claim that event attendance directly reduces AQI.
-   Keep measured air-quality observations separate from modelled
    emissions and hypothetical scenarios.
-   Registration is not verified attendance; a QR code is not secure
    verification until backed by server-side checks.
-   Do not turn the 2022/2024 study findings about elemental PM2.5
    during studied Diwali periods into claims about 95% or 85% of all
    Delhi pollution.

For detailed evidence, references, caveats, architecture and scope, use
the Project Bible.

------------------------------------------------------------------------

# 3. User's development and UI preferences

These are working rules for every future UI task.

## 3.1 Mobile-first is mandatory

Always design and implement mobile-first:

1.  Start with the narrow-screen layout.
2.  Ensure the primary task is clear and usable on a phone.
3.  Add tablet and desktop enhancements with responsive breakpoints.
4.  Avoid desktop-only layouts that merely shrink on mobile.
5.  Check text wrapping, tap target sizes, form controls, modal/dialog
    height, map usability, horizontal overflow, and navigation on small
    screens.
6.  Keep content readable and actions reachable without awkward
    scrolling.
7.  For maps and data-heavy screens, deliberately design the mobile
    interaction rather than hiding essential functionality.

Do not call a UI responsive just because Tailwind classes include
breakpoints. Consider the actual mobile user journey.

## 3.2 ThemeContext is the source of truth for themes

The app already has a light/dark theme system using **ThemeContext**.
Use the existing theme context and its established API.

-   Inspect the existing ThemeContext implementation and its hook before
    using it.
-   Do not create a second theme provider, duplicate theme state, or
    invent a new theme architecture.
-   Do not use `window.matchMedia`, local component state, or hardcoded
    system preferences as a replacement for the existing ThemeContext.
-   Do not hardcode light-only colours in new components.
-   Use the project's existing theme-aware patterns and tokens/classes.
-   Check both light and dark mode for every UI change.
-   Preserve the user's selected theme when navigating between pages.
-   If the exact ThemeContext API is not known in the current code
    context, inspect its source file first; do not guess the hook name
    or returned properties.

**Visual expectation:** dark mode should feel intentionally designed,
not like a light screen with its background turned black. Maintain
readable contrast, subtle borders/surfaces, clear hierarchy, and
consistent interactive states. Match the existing app palette rather
than inventing a new one.

## 3.3 Visual and interaction quality

-   Keep the interface clean, polished, modern, and consistent across
    public and organiser experiences.
-   Use the existing component system and styling conventions.
-   Prefer reusable components when they remove real duplication; do not
    over-abstract small one-off elements.
-   Maintain consistent spacing, typography, radii, borders, shadows,
    icon sizing and states.
-   Include loading, empty, error, disabled, success and validation
    states where relevant.
-   Ensure forms have clear labels, useful validation messages and
    mobile-friendly controls.
-   Keep animations subtle and purposeful; respect reduced-motion
    considerations where the project supports them.
-   Use semantic HTML and accessible labels.
-   Avoid unnecessary visual clutter, oversized cards, and decorative UI
    that competes with the primary action.

## 3.4 Preserve existing design decisions

Do not redesign the whole site when asked to improve one component.
First inspect neighbouring pages and components to match their
conventions. Ask for a screenshot or source file only when the relevant
design or implementation cannot be established from the repository.

------------------------------------------------------------------------

# 4. Technology and architecture

The current project is a Next.js / React / TypeScript application styled
with Tailwind CSS.

Known technologies from the Project Bible and development history:

  -----------------------------------------------------------------------
  Area                    Technology / direction  Status
  ----------------------- ----------------------- -----------------------
  Frontend                Next.js, React,         Existing
                          TypeScript              

  Styling                 Tailwind CSS            Existing

  Icons                   Lucide React            Existing

  Maps                    Leaflet / React Leaflet Existing public map

  Theme                   Existing ThemeContext   Existing

  Backend/database        Supabase PostgreSQL     Being integrated

  Authentication          Supabase Auth           Used by organiser event
                                                  flow; broader public
                                                  booking integration
                                                  remains a separate
                                                  milestone

  Spatial database        PostGIS, if enabled and Proposed
                          needed                  

  Spatial utilities       Turf.js                 Proposed; inspect
                                                  dependencies before
                                                  adding

  QR                      qrcode.react            Existing demo QR
                                                  generation

  PDF ticket              jsPDF + html2canvas-pro Existing

  Forecasting / analysis  Python, pandas, NumPy,  Future
                          later scikit-learn if   
                          justified               

  External air quality    CPCB / OpenAQ           Future integration; not
                                                  currently live
  -----------------------------------------------------------------------

Do not introduce another frontend framework. Do not add FastAPI, a
separate ML service, or a new state-management library without a
concrete requirement.

------------------------------------------------------------------------

# 5. Folder structure --- what is known and what is not

**Do not treat the Project Bible's suggested structure as the actual
repository structure.** It is a proposed extension only. Inspect the
repository before creating or moving files.

## 5.1 Confirmed paths from the current organiser workflow

The following paths were explicitly used in the code reviewed during the
latest session:

``` text
src/
├── components/
│   └── hostevents/
│       ├── layout/
│       │   └── OrganizerLayout
│       └── organize/
│           ├── EventForm
│           └── EventList
├── services/
│   └── hostevents/
│       └── eventService
└── lib/
    └── supabase/
        └── client
```

The current page component is named `OrganizeEventsPage` and imports:

``` tsx
import OrganizerLayout from "@/components/hostevents/layout/OrganizerLayout";
import EventForm from "@/components/hostevents/organize/EventForm";
import EventList from "@/components/hostevents/organize/EventList";
```

**Its exact route/file path has not been established in this handoff.**
Do not assume it is `src/app/organize/page.tsx` or create another
organiser page. Search the repository for `OrganizeEventsPage` or the
`OrganizerLayout` imports to locate the real file.

The event image upload service calls:

``` text
/api/uploads/event-image
```

The actual route handler path and storage configuration should be
inspected in the repository.

## 5.2 Other known file references

The public app has a `mockEvents.ts` data source containing eight
demonstration events, but its exact path has not been established here.
Search before editing.

The public application includes homepage, discovery, map/list, event
details, booking UI, ticket UI and related components. Their exact
folder tree must be read from the current repository, not reconstructed
from memory.

## 5.3 Required first repository-inspection step

At the start of the next coding session, inspect the real tree. For
example:

``` bash
find src -maxdepth 5 -type f | sort
```

Also inspect:

``` bash
cat package.json
```

Then identify: - App Router routes and layouts; - ThemeContext provider
and hook; - Supabase client setup; - organiser components and service
modules; - upload API route; - public event and booking components; -
shared types and data files; - existing UI primitives and Tailwind
configuration.

Do not dump or rewrite the whole repository unnecessarily. Inspect
relevant files in context.

------------------------------------------------------------------------

# 6. Current implementation status

The status below combines the Project Bible with the latest
organiser-event work. Items marked "user-reported" have been reported as
working by the user; the next assistant should still verify code and
runtime behaviour before making stronger claims.

## 6.1 Public application --- user-reported implemented

-   Next.js / React / TypeScript frontend.
-   Homepage and responsive navigation.
-   Light and dark theme through ThemeContext.
-   Event discovery page with search and category filters.
-   Leaflet map synchronised with list selection.
-   Event details page.
-   Booking UI and attendee validation.
-   Booking review and confirmation flow.
-   Digital ticket UI.
-   QR code generation using a demo booking reference.
-   PDF ticket download using jsPDF and html2canvas-pro.
-   Eight demonstration events in `mockEvents.ts`.

## 6.2 Organiser event workflow --- latest work

The user has now shared and reviewed these components/services:

### `EventForm.tsx`

Known behaviour: - Fetches localities through `fetchLocalities()`. -
Collects title, description, category, venue, address, locality,
start/end time, capacity and optional image. - Validates required
fields, future start time, end after start, and capacity. - Supports
saving as draft or publishing. - Uploads an optional image through
`uploadEventImage()`. - Calls `createEvent()` with event details and
status. - Displays success/error feedback and resets form after
successful submission.

Known improvement notes: - There was a `validateForm()` function that
was not used; validation was duplicated in `handleSubmit`. - The service
validates date objects, but the form should also be reviewed for invalid
date values and consistent validation. - Image upload happens before
event insert; if insert fails, the uploaded object may be orphaned. This
is a later robustness improvement, not the first priority. - The form
did not originally notify the event list after a successful insert. A
callback was added as part of the current fix.

### `src/services/hostevents/eventService.ts`

The user supplied this service implementation. It includes:

-   `Locality` interface: `id`, `name`, `city`, `state`.
-   `CreateEventInput` interface with camelCase input fields.
-   `fetchLocalities()`:
    -   creates Supabase client;
    -   selects `id, name, city, state` from `localities`;
    -   orders by locality name;
    -   throws a readable error on failure.
-   `createEvent()`:
    -   gets the authenticated user with `supabase.auth.getUser()`;
    -   rejects unauthenticated creation;
    -   validates title and positive whole-number capacity;
    -   validates parseable future start/end times and end after start;
    -   inserts into `events`;
    -   explicitly sets `organizer_id: user.id`;
    -   maps camelCase input to snake_case DB columns;
    -   sets `event_type: "community"` and `is_firecracker_free: true`;
    -   sets `cover_image_key` from optional `coverImageKey`;
    -   returns inserted row via `.select("*").single()`.
-   `uploadEventImage()`:
    -   POSTs content type and file size to `/api/uploads/event-image`;
    -   receives an upload URL and object key;
    -   PUTs the file to the upload URL;
    -   returns the object key.

The service's `organizer_id` matches the organiser list filter described
below. Actual DB schema, constraints, RLS policies and upload route must
still be checked if errors arise.

### `EventList.tsx`

Known behaviour: - Gets the authenticated user. - Queries `events`. -
Selects:
`id, title, category, venue_name, address, starts_at, ends_at, capacity, reserved_count, status`. -
Filters `.eq("organizer_id", user.id)`. - Orders newest first by
`created_at`. - Displays event cards and status filters: all, published,
draft, cancelled, completed. - Has loading/error states and
retry/refresh UI. - No Realtime subscription.

### Latest bug and fix --- confirmed by user

**Problem:** A newly created event was successfully inserted, but the
existing event list did not refresh automatically.

**Cause:** `EventList` fetched only on initial mount. `EventForm` and
`EventList` were siblings, and the list was not notified after a
successful insert.

**Fix implemented by the user with assistant guidance:** A parent-level
`refreshKey` state and `onEventCreated` callback.

Expected wiring:

``` tsx
const [refreshKey, setRefreshKey] = useState(0);

const handleEventCreated = () => {
  setRefreshKey((prev) => prev + 1);
};

<EventForm onEventCreated={handleEventCreated} />
<EventList refreshKey={refreshKey} />
```

`EventForm` calls `onEventCreated?.()` only after `createEvent()`
succeeds.

`EventList` accepts `refreshKey` and includes it in its fetch effect
dependencies:

``` tsx
useEffect(() => {
  let active = true;

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const supabase = createClient();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Please log in to view your events.");
      }

      const { data, error: fetchError } = await supabase
        .from("events")
        .select(
          "id, title, category, venue_name, address, starts_at, ends_at, capacity, reserved_count, status"
        )
        .eq("organizer_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      if (active) {
        setEvents((data ?? []) as OrganizerEvent[]);
      }
    } catch (err) {
      if (active) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your events."
        );
      }
    } finally {
      if (active) setLoading(false);
    }
  };

  loadEvents();

  return () => {
    active = false;
  };
}, [refreshKey]);
```

**User explicitly confirmed:** "yup everything works now".

Do not reintroduce Supabase Realtime for this problem. A simple refetch
after successful creation is sufficient. Realtime may be considered
later only if there is a real live-update requirement.

## 6.3 Not yet implemented in the described build

-   Persistent public booking flow in Supabase.
-   Full Supabase authentication integration for public booking.
-   User profiles.
-   Persistent My Tickets / booking history.
-   Secure QR token verification.
-   Atomic seat reservation.
-   Real attendance check-in.
-   Civic Intelligence Portal.
-   Civic role/permission model.
-   Geospatial zone creation and review.
-   Validated suitability model.
-   Production attendance forecasting.
-   Environmental emissions factors and validated impact model.
-   Live CPCB/OpenAQ integration.

Do not describe any of these as complete unless the repository and tests
establish otherwise.

------------------------------------------------------------------------

# 7. Immediate next steps and priorities

Resume from the working organiser event workflow. Do not jump straight
to AI or advanced geospatial modelling.

## Priority 1 --- Stabilise the organiser event workflow

1.  Verify the `refreshKey` / `onEventCreated` wiring in the actual
    files.
2.  Test both **Save Draft** and **Publish Event**.
3.  Confirm the inserted row in Supabase has the correct `organizer_id`,
    status, dates, locality and image key.
4.  Test the list after a browser refresh and after navigating
    away/back.
5.  Check loading, error, empty and retry states.
6.  Verify the flow in both light and dark themes and at mobile width.
7.  Check the Supabase `events` table schema and RLS policies if any
    data issue appears.

Potential follow-up improvements, in order: - consolidate duplicate form
validation; - validate invalid date strings in the form; - handle image
cleanup if event insertion fails; - improve organiser event edit/cancel
workflows only after create/list are stable.

## Priority 2 --- Inspect backend schema and security

Before implementing public bookings, establish the actual schema and RLS
rules. Do not assume the schema in the Project Bible has already been
created.

Document: - current `events` columns, constraints and defaults; -
`localities` table structure; - organiser ownership policy; - public
event read policy; - event creation and update policies; - profile/auth
relationship; - storage bucket and upload authorisation; - whether
`reserved_count` is updated anywhere and by what mechanism.

Never trust client-side capacity checks for final reservation integrity.

## Priority 3 --- Public booking backend

Implement a persistent booking workflow only after schema design: -
authenticated or explicitly designed guest booking; - atomic capacity
reservation; - booking lifecycle; - ticket records; - secure, random QR
tokens; - server-side ticket verification; - atomic check-in; - My
Tickets persistence.

Keep booking, ticket and attendance as separate concepts.

## Priority 4 --- Civic Intelligence Portal

Only after the public and organiser foundation is stable: - civic demo
shell and restricted demo navigation; - locality map; - GeoJSON zone
creation and validation; - nearby feature and overlap/proximity
checks; - explainable planning suitability indicators; - proposal review
and simulated decisions; - simulated-approved zones reflected on public
map.

Do not implement real government approvals or claim official authority.

## Priority 5 --- Environmental intelligence

Only after reliable event and attendance data exists: - participation
baselines and forecasts; - measured air-quality observations with
station/source/timestamp; - scenario-based emissions calculator using
compatible research-supported factors; - uncertainty and sensitivity
analysis.

Do not build an "AI prediction" feature without sufficient data and an
evaluation plan.

------------------------------------------------------------------------

# 8. Working method for each coding task

Use this sequence:

1.  **Understand:** restate the specific behaviour or bug and identify
    the relevant route/component/service.
2.  **Inspect:** read the actual component, its parent, related types,
    service, theme context and database interaction as applicable.
3.  **Trace:** explain the data flow and where the current behaviour
    originates.
4.  **Plan:** propose the smallest safe change.
5.  **Implement:** preserve existing code conventions and APIs.
6.  **Validate:** run or recommend the relevant
    lint/typecheck/build/manual test. Never claim a test was run if it
    was not.
7.  **Record:** list exact files changed and update the handoff/project
    tracking notes.

For database issues, inspect both client code and SQL schema/RLS. A
correct frontend query can still return no rows because of RLS or
ownership mismatch.

For UI issues, inspect ThemeContext and a neighbouring component before
choosing colours or patterns.

------------------------------------------------------------------------

# 9. Project tracking checklist

Use this as the working checklist and update it as work is completed.
The Project Bible remains the master record; this checklist is a
practical session tracker.

## Current organiser milestone

-   [x] Event form wired to `createEvent()`.
-   [x] Authenticated user assigned as `organizer_id` in event insert.
-   [x] Organiser list filters by current user's `organizer_id`.
-   [x] Event list refreshes after successful event creation using
    parent callback.
-   [x] User confirmed the current refresh fix works.
-   [ ] Test Save Draft end-to-end.
-   [ ] Test Publish Event end-to-end.
-   [ ] Verify saved values against actual Supabase rows.
-   [ ] Verify RLS policies and table constraints.
-   [ ] Verify image upload route, storage permissions and failure
    cleanup.
-   [ ] Test mobile layout and both themes.

## Public platform

-   [x] Homepage / navigation (user-reported).
-   [x] ThemeContext light/dark system (user-reported).
-   [x] Event discovery and filters (user-reported).
-   [x] Map/list synchronisation (user-reported).
-   [x] Event detail UI (user-reported).
-   [x] Demo booking flow and validation (user-reported).
-   [x] Demo QR ticket and PDF export (user-reported).
-   [ ] Persistent bookings.
-   [ ] My Tickets persistence.
-   [ ] Secure QR verification.
-   [ ] Atomic seat reservation.
-   [ ] Check-in and verified attendance.

## Civic and intelligence modules

-   [ ] Civic portal shell.
-   [ ] Restricted civic role model.
-   [ ] Locality/zone GeoJSON.
-   [ ] Polygon drawing and geometry validation.
-   [ ] Spatial overlap/proximity checks.
-   [ ] Sensitive-location screening with data provenance.
-   [ ] Explainable planning suitability indicator.
-   [ ] Simulated proposal review lifecycle.
-   [ ] Public map display of simulated-approved zones.
-   [ ] Attendance baseline and forecast evaluation.
-   [ ] Environmental scenario calculator with sourced factors.
-   [ ] CPCB/OpenAQ observation integration.

------------------------------------------------------------------------

# 10. Important project decisions to preserve

-   Keep the public product centred on discoverable, organised,
    firecracker-free community celebrations.
-   The civic portal is a proposed restricted decision-support workflow,
    not a government product.
-   The hypothetical fireworks policy module must remain clearly
    simulation-only under the current Delhi legal context.
-   Do not equate registrations with attendance.
-   Do not equate attendance with avoided fireworks use.
-   Do not equate emissions scenarios with measured AQI.
-   A suitability indicator is not a safety certification or automatic
    approval.
-   Missing or stale geographic data must be visible.
-   Human/competent-authority review remains essential.
-   Avoid scope expansion before the end-to-end public and organiser
    workflows are dependable.
-   Keep the Project Bible and implementation status aligned.

------------------------------------------------------------------------

# 11. Start-of-chat prompt for the next AI

You can paste this section into a new AI conversation together with the
Project Bible and this handoff:

> I am continuing development of UtsavZero, an existing Next.js +
> React + TypeScript + Tailwind project. Read the attached UtsavZero
> Project Bible and Development Handoff fully before suggesting changes.
>
> Treat the Project Bible as the master source of truth. The handoff
> contains the latest code progress. Do not assume folder paths or
> pages: inspect the actual repository and relevant files before
> editing. Preserve the current architecture and working behaviour.
>
> My UI rules are mandatory: always build mobile-first; use the existing
> ThemeContext for light/dark mode; never create a duplicate theme
> system; check every UI change in both themes and at
> mobile/tablet/desktop sizes; match existing design conventions.
>
> Work incrementally and explain the data flow. Do not add dependencies
> or redesign unrelated parts. Give exact file paths and complete
> updated files when needed. Distinguish implemented from
> planned/simulated features. Do not claim tests passed unless they were
> actually run.
>
> Current latest progress: the organiser event creation and event list
> refresh flow is working. `EventForm` calls `createEvent()` through
> `src/services/hostevents/eventService.ts`; the service gets the
> authenticated Supabase user and inserts `organizer_id: user.id`. The
> organiser `EventList` filters by that same organizer ID. The list now
> refreshes after a successful create using a parent `refreshKey` and
> `onEventCreated` callback. I confirmed this works. Do not add Realtime
> for this issue.
>
> First inspect the real folder tree, package scripts, ThemeContext,
> organiser page/component files, Supabase schema/RLS and upload route
> as relevant. Then continue with the next highest-priority unfinished
> task: test Save Draft and Publish Event end-to-end, verify the
> persisted Supabase rows and security policies, and stabilise the
> organiser workflow before moving on to booking backend work.
>
> At the end of each session, tell me what changed, what was tested,
> what remains, and what the next task should be. Keep the Project Bible
> updated when major project status changes.

------------------------------------------------------------------------

# 12. Source-of-truth reminder

This handoff is a development snapshot, not a replacement for the
Project Bible. If the two differ:

-   use the Project Bible for product mission, research, legal context,
    positioning, proposed architecture, scope and claim discipline;
-   use this handoff for the latest organiser implementation notes and
    development preferences;
-   inspect the actual repository for current code and folder structure;
-   ask the user only when a necessary decision or missing source cannot
    be established by inspection.

**Next concrete action:** resume by verifying Save Draft and Publish
Event end-to-end, then inspect the real Supabase schema/RLS and upload
route before expanding the backend.
