# UtsavZero --- Prototype 1 Development Handover & 4-Day Execution Plan

**Handover date:** 3 November 2026\
**Planning window:** 4--7 November 2026\
**Prototype 1 target:** 8 November 2026\
**Challenge:** DTU SEVA FIRST Innovation Challenge 2026\
**Repository:** https://github.com/Shreeyanshsahu/UtsavZero\
**Deployment:** Vercel; custom domain `utsavzero.in`\
**Developer:** Solo developer

> **Purpose of this document:** This is the working technical and
> delivery handover for the final four development days before
> Prototype 1. It combines the previous Day 3 handover with an
> inspection of the supplied Repomix repository snapshot. It
> deliberately separates features that exist in the code, features
> previously reported as demonstrated, and work that still needs
> implementation or testing. Do not treat the existence of a page or
> function as proof that its entire workflow is production-ready.

------------------------------------------------------------------------

# 1. Executive status

UtsavZero is no longer at the blank-prototype stage. A substantial
public-facing application and several important backend workflows
already exist.

The public participation journey has been implemented to a meaningful
degree:

**Discover event → inspect details and location → book a group → receive
a digital QR ticket → view My Tickets → organiser scans ticket →
duplicate check-in is rejected.**

The organiser experience also has an existing dashboard, event
creation/listing, registrations page, and check-in interface.

The major unfinished product areas are the **Civic Intelligence planning
workflow** and the **Environmental Intelligence experience**. The
repository snapshot contains a civic dashboard and a reviewer
authorizations workflow, but it does not contain the actual
zone-planning pages and interactions needed to demonstrate the full
civic concept. The `/impact` page is currently only a themed shell with
a navbar and no impact dashboard content.

There is also an important distinction between the older Day 3 handover
and the current repository snapshot:

-   The Day 3 handover described organiser registrations management as a
    future task. The supplied repository already contains a
    registrations page, data service, hook, filters, stats, table and
    booking-details components. This should now be treated as
    **implemented at the UI/data-query level and awaiting end-to-end
    audit**, not as a blank feature.
-   The repository snapshot already contains
    `src/app/civic/authorizations/layout.tsx`, which performs a
    server-side reviewer email and role check. This is a newer addition
    than the earlier conversation's proposed next step. It must be
    tested, not recreated.
-   Event location and map integration were reported as completed by the
    developer. The repository contains the event location picker/map
    components and public map. The remaining work is persistence and
    accuracy QA, not rebuilding the map.

## Prototype 1 delivery objective

By 8 November, aim to deliver one coherent, reliable demonstration
rather than many unfinished modules.

The minimum coherent demo should show:

1.  A resident can discover a real published firecracker-free community
    event.
2.  The event has a real venue, map location, schedule and capacity.
3.  The resident can make a group booking.
4.  A QR ticket is issued and appears in My Tickets.
5.  An organiser can view the registration and scan the ticket.
6.  A second scan is rejected.
7.  The civic demo account can view a civic dashboard and complete at
    least one meaningful simulated zone-planning/review workflow.
8.  Environmental information is presented with clear source/assumption
    labels, without unsupported claims.
9.  The app works on desktop and mobile, in light and dark themes, with
    no blocking errors.

If time becomes constrained, protect the end-to-end public
booking/check-in journey and one complete civic demonstration before
adding secondary features.

------------------------------------------------------------------------

# 2. Product definition and claim discipline

UtsavZero is a community celebrations and environmental intelligence
platform intended to make cleaner community celebrations easier to
discover and organise, while demonstrating how locality-level
information could support civic planning.

### Public platform

-   Discover organised, firecracker-free community celebrations.
-   Explore events in map and list views.
-   Inspect event location, timing and capacity.
-   Make group bookings.
-   Access digital QR tickets and booking status.
-   Allow event organisers to validate entry.

### Organiser platform

-   Create and publish community events.
-   Set event details, venue, location, schedule and capacity.
-   Manage registrations.
-   Check in group tickets.
-   Review attendance information.

### Civic Intelligence Portal

-   Demonstrate locality and geographic-feature information.
-   Allow a reviewer/demo administrator to inspect proposed zones.
-   Demonstrate a zone application and simulated review decision.
-   Present spatial checks and explainable suitability indicators.
-   Show civic activity/audit information where available.

### Environmental Intelligence

-   Present air-quality observations and their sources/timestamps.
-   Show event participation and attendance indicators.
-   Provide transparent scenario estimates with assumptions and
    limitations.

**Legal and factual boundary:** The civic/government experience is a
prototype simulation, not an official government service. It must not
claim to issue legal permissions or represent actual government
approval. Public-facing event discovery should focus on firecracker-free
celebrations. Any fireworks-zone workflow is hypothetical policy
simulation only. Do not claim that an event directly reduces AQI or that
estimated emissions represent measured outcomes.

------------------------------------------------------------------------

# 3. Repository inspection --- what exists now

The following assessment is based on the supplied
`repomix-output.xml.zip` repository snapshot, together with the earlier
developer handover. Source-code presence is distinguished from
successful runtime testing.

## 3.1 Public discovery and event details

`<badge>`{=html}Implemented in repository`</badge>`{=html}

Relevant files: - `src/app/page.tsx` - `src/app/events/page.tsx` -
`src/app/events/[eventId]/page.tsx` -
`src/components/Events/Discovery/EventMap.tsx` -
`src/components/Events/Discovery/EventMapInner.tsx` -
`src/components/Events/Discovery/EventList.tsx` -
`src/components/Events/Discovery/EventCard.tsx` -
`src/components/Events/Discovery/EventSearchBar.tsx` -
`src/components/Events/Discovery/EventCategoryFilter.tsx` -
`src/components/Events/Details/` -
`src/services/events/publicEventService.ts` - `src/hooks/useEvent.ts` -
`src/hooks/useEventFilters.ts`

What the code shows: - Public event page fetches events through
`fetchPublicEvents()`. - Search filters by title, description, venue,
address and city. - Category and family-friendly filters are
implemented. - Events with valid latitude/longitude are separated for
map display. - The event page has loading, error and retry states. -
Event discovery uses map and list components. - Event detail components
exist for the selected event.

Remaining verification: - Verify only eligible published
community/firecracker-free events are exposed. - Verify event markers
use persisted database coordinates, not mock/fallback coordinates. -
Verify no event with null or invalid coordinates breaks the map. -
Verify map selection and list selection remain in sync. - Verify mobile
map/list usability and both themes. - Verify event detail data matches
the booking page and database.

## 3.2 Event location and organiser event creation

`<badge>`{=html}Implemented; persistence QA remains`</badge>`{=html}

Relevant files: - `src/app/organizer/organize/page.tsx` -
`src/components/hostevents/organize/EventForm.tsx` -
`src/components/hostevents/organize/EventDetailsForm.tsx` -
`src/components/hostevents/organize/EventScheduleForm.tsx` -
`src/components/hostevents/organize/EventCapacityForm.tsx` -
`src/components/hostevents/organize/EventImageUpload.tsx` -
`src/components/hostevents/organize/EventLocationPicker.tsx` -
`src/components/hostevents/organize/EventLocationMap.tsx` -
`src/components/hostevents/organize/LocationSearchInput.tsx` -
`src/components/hostevents/organize/EventLocalitySelect.tsx` -
`src/components/hostevents/organize/EventList.tsx` -
`src/services/hostevents/eventService.ts` -
`src/hooks/hostevents/useOrganizerEvents.ts` -
`src/app/api/places/autocomplete/route.ts` -
`src/app/api/uploads/event-image/route.ts`

What the codebase and earlier handover establish: - Organiser event
creation form and event list exist. - The page refreshes the event list
after a successful create. - A map/location selection workflow has been
implemented and was reported complete by the developer. - The database
event design includes locality, venue, address, latitude, longitude,
start and end timestamps. - Image upload API route exists.

Remaining verification: - Create an event with a real map-selected
location. - Confirm `latitude`, `longitude`, `locality_id`, `venue_name`
and `address` persist correctly. - Reopen/refresh the event and confirm
the saved location is restored. - Confirm public discovery displays the
same saved location. - Confirm image upload works on localhost and the
deployed domain. - Confirm event ownership is always derived from the
authenticated user, not trusted from a client-supplied organiser ID. -
Test invalid schedule, capacity and missing-location inputs. - Check
whether editing and cancellation are implemented; do not assume they
exist simply because create/list exists.

## 3.3 Booking flow

`<badge>`{=html}Implemented; edge-case QA remains`</badge>`{=html}

Relevant files: - `src/app/events/[eventId]/book/page.tsx` -
`src/components/Events/Booking/` -
`src/services/booking/bookingService.ts` - `src/hooks/useBooking.ts` -
`src/types/booking.ts` - `src/utils/bookingHelpher.ts`

The booking service: - Fetches a bookable event from `events`. -
Restricts the fetched event to `published`, `community` and
`is_firecracker_free = true`. - Requires an authenticated user before
booking. - Calls `create_group_booking` with event ID, quantity and
attendee details. - Normalises numeric price values in the response.

The previous Day 3 handover reports that
`public.create_group_booking(...)`: - Requires authentication. -
Validates quantity and attendee details. - Locks the event row. - Checks
publication status, eligibility, event timing and remaining capacity. -
Reserves capacity transactionally. - Creates a booking. - Generates a
cryptographically random QR token. - Stores a SHA-256 hash and encrypted
token. - Returns booking/ticket information.

This is a key completed backend milestone. Preserve the database
transaction model; do not move capacity reservation into frontend code.

Remaining verification: - Test quantity 1 and multiple attendees. - Test
quantity greater than remaining capacity. - Test booking after event
start/expiry. - Test unpublished or ineligible event. - Test
unauthenticated booking. - Test repeated rapid
submissions/double-click. - Test two users attempting to book the last
available places concurrently. - Confirm booking status, payment status
and reserved count stay consistent. - Confirm a failed booking does not
leave a partial booking or incorrect capacity count. - Confirm the
confirmation page displays the exact returned booking details.

## 3.4 My Tickets and QR security

`<badge>`{=html}Implemented; security regression testing
remains`</badge>`{=html}

Relevant files: - `src/app/profile/page.tsx` -
`src/services/booking/myTicketsService.ts` -
`src/components/Events/Ticket/` -
`src/components/Events/Ticket/BookingQRCode.tsx` -
`src/components/Events/Ticket/BookingTicket.tsx` -
`src/components/Events/Ticket/DownloadTicket.tsx` -
`src/utils/ticketGenrator.ts`

The Day 3 handover reports: - `public.get_my_tickets()` requires
authentication. - It returns only the current user's
booking/ticket/event data. - QR token decryption occurs in PostgreSQL. -
The encryption key is held in Supabase Vault as
`utsavzero_qr_encryption_key`. - The group booking model has one group
ticket whose quantity represents the number of places. - My Tickets
displays event and ticket information, QR code and ticket status.

Remaining verification: - A user can see only their own tickets. - A
user cannot retrieve another user's raw QR token. - Refreshing My
Tickets does not lose ticket state. - Cancelled, expired and checked-in
tickets have correct visual states. - Download/print ticket output is
legible and includes the right event and booking data. - QR token and
encryption secret never appear in logs or browser environment
variables. - Test ticket retrieval after logout/login and in a second
browser session.

## 3.5 Organiser check-in

`<badge>`{=html}Implemented and previously demonstrated`</badge>`{=html}

Relevant files: - `src/app/organizer/check-in/page.tsx` -
`src/components/hostevents/checkin/CameraScanner.tsx` -
`src/components/hostevents/checkin/UploadQRScanner.tsx` -
`src/components/hostevents/checkin/USBScannerInput.tsx` -
`src/components/hostevents/checkin/ScannerSelector.tsx` -
`src/components/hostevents/checkin/TicketValidationResult.tsx` -
`src/components/hostevents/checkin/CheckinHistory.tsx` -
`src/hooks/hostevents/useTicketCheckin.ts` -
`src/services/hostevents/checkinService.ts`

The check-in service validates the token shape and calls
`check_in_group_ticket`. It expects these statuses: - `success` -
`already_used` - `invalid` - `cancelled` - `expired` - `not_authorized`

The earlier handover reports the developer demonstrated: 1. A valid
ticket scans successfully. 2. Ticket becomes checked in. 3. My Tickets
reflects the checked-in state. 4. A second scan is rejected. 5. The UI
reports that entry is not permitted again.

The database function is reported to verify organiser ownership or
permitted civic demo role and write check-in records.

Remaining verification: - Test camera scan on a real phone/browser with
camera permissions. - Test uploaded QR image scanning. - Test USB/manual
scanner input. - Test invalid token, cancelled ticket, expired ticket
and unauthorised organiser. - Test a ticket belonging to a different
organiser's event. - Confirm successful check-in updates the organiser
registrations view and My Tickets. - Confirm duplicate attempts are
recorded/auditable without changing attendance twice. - Verify camera
stream stops when leaving the page.

## 3.6 Organiser registrations management

`<badge>`{=html}UI and data-query implementation exists`</badge>`{=html}

This is an important update from the older Day 3 handover: registrations
management is already present in the supplied repository.

Relevant files: - `src/app/organizer/registrations/page.tsx` -
`src/components/hostevents/registrations/RegistrationHeader.tsx` -
`src/components/hostevents/registrations/RegistrationStats.tsx` -
`src/components/hostevents/registrations/RegistrationFilters.tsx` -
`src/components/hostevents/registrations/RegistrationTable.tsx` -
`src/components/hostevents/registrations/BookingDetails.tsx` -
`src/hooks/hostevents/useRegistrations.ts` -
`src/services/hostevents/registrationService.ts`

The service: - Authenticates the current user. - Fetches events whose
`organizer_id` matches the current user. - Fetches bookings for those
event IDs. - Fetches tickets for those bookings. - Combines the results
into organiser registration records. - Includes attendee, booking,
event, price/payment and ticket/check-in fields.

The page includes: - Search by attendee name, email, booking reference,
event title or ticket number. - Event filter. - Booking status filter. -
Registration stats component. - Registration table. - Booking details
selection/modal. - Refresh and error state.

Do not rebuild this feature from scratch.

Important code-level audit item: `useRegistrations.ts` currently
contains both a `refresh` callback that fetches data and a separate
initial `useEffect` that duplicates the fetch logic. This should be
simplified carefully, preserving loading, error and refresh behaviour.
It is a cleanup opportunity, not evidence that the page is absent.

Remaining work: - Verify RLS permits an organiser to read bookings only
for their own events. - Verify tickets are only returned for bookings
attached to that organiser's events. - Test empty events, no bookings
and multiple events. - Verify group quantity is shown correctly and not
mistaken for one attendee. - Verify stats use the intended statuses and
quantity semantics. - Verify check-in status and checked-in timestamp
are displayed correctly. - Verify cancelled and expired records are
filtered and counted correctly. - Verify details modal does not expose
unnecessary personal information. - Test refresh after a booking and
after check-in. - Test responsive table behaviour on mobile. - Confirm
the database's actual column names and status enum values match the
service types.

## 3.7 Authentication and role-based routing

`<badge>`{=html}Implemented; final integration/security tests
remain`</badge>`{=html}

Relevant files: - `src/app/signup/page.tsx` - `src/app/login/page.tsx` -
`src/app/verify-email/page.tsx` - `src/app/auth/callback/route.ts` -
`src/context/AuthContext.tsx` - `src/lib/supabase/client.ts` -
`src/lib/supabase/server.ts` - `src/lib/supabase/middleware.ts` -
`src/proxy.ts`

The repository contains: - Supabase email/password signup and login
UI. - Signup role selection and metadata flow. - Auth callback using
`exchangeCodeForSession`. - Server-side Supabase client using
`@supabase/ssr` and Next.js cookies. - `src/proxy.ts` route gating for
civic, organiser and profile paths. - Role checks based on `user_roles`.

The current proxy role model includes: - `citizen` -
`private_organizer` - `government_organizer` - `civic_demo_admin`

The signup metadata field `requested_role` is a request/category, not
proof of permission. Do not grant privileged roles based on client
metadata.

Earlier configuration: - Supabase Site URL: `https://utsavzero.in` -
Redirect allow-list includes localhost, Vercel and custom-domain URLs. -
Resend SMTP is configured through Supabase using `smtp.resend.com`, port
`465`, username `resend`, sender `no-reply@utsavzero.in`.

Remaining verification: - Test citizen signup and email verification. -
Test private organiser signup and role assignment. - Test
government-personnel signup and redirect to
`/government-authorization/apply`. - Confirm government applicant
remains a citizen until approved. - Test login/logout and session
refresh. - Test direct navigation to restricted routes. - Test
unauthenticated redirects preserve the intended `next` destination. -
Test a user with multiple roles. - Confirm no user can self-assign
`government_organizer` or `civic_demo_admin`. - Test auth callback on
localhost and custom domain. - Confirm email links are not expired and
use the correct origin.

## 3.8 Government authorization application and reviewer workflow

`<badge>`{=html}Implemented; verify full lifecycle`</badge>`{=html}

Relevant files: - `src/app/government-authorization/apply/page.tsx` -
`src/app/civic/authorizations/page.tsx` -
`src/app/civic/authorizations/layout.tsx`

Database table: - `government_authorization_applications`

The earlier schema record includes: - `id` - `user_id` - `full_name` -
`department` - `designation` - `official_email` - `reason` -
`supporting_documents` - `status` - `reviewed_by` - `review_remarks` -
`reviewed_at` - `submitted_at` - `updated_at`

Existing intended policies: - Applicants can insert only their own
pending application. - Applicants can read their own application. - The
designated reviewer can read all applications. - Review status must not
be changed directly by applicants. - Review decisions go through the
protected `review_government_authorization` RPC.

The reviewer page includes filters, application details, document links,
remarks, approve and reject actions.

### Important new repository finding: server-side reviewer guard already exists

The supplied repository contains:

`src/app/civic/authorizations/layout.tsx`

It: 1. Creates the Supabase server client. 2. Calls
`supabase.auth.getUser()`. 3. Redirects signed-out users to `/login`. 4.
Requires the exact email `utsavzeroauth@gmail.com`. 5. Queries
`user_roles`. 6. Requires `civic_demo_admin`. 7. Redirects other users
to `/civic`.

This is newer than the previous conversation's proposed action to create
this file. Do not recreate it. Test it.

Remaining verification: - Ensure `src/proxy.ts` does not conflict with
or bypass the route layout. - Signed-out user is redirected to login. -
Other email with civic role is denied. - Exact reviewer email without
role is denied. - Exact reviewer email with role can access. - Reviewer
can list applications. - Reviewer can approve and reject through the
RPC. - Approval adds the intended role only after a valid decision. -
Rejection does not grant a role. - Reviewer cannot review their own
application if the RPC is designed to prevent it. - Applicant cannot
update `status`, `reviewed_by`, `review_remarks` or `reviewed_at`
directly. - Errors and stale/pending applications are handled correctly.

## 3.9 Civic Intelligence dashboard

`<badge>`{=html}Dashboard foundation implemented`</badge>`{=html}

Relevant files: - `src/app/civic/page.tsx` -
`src/components/civic/layout/CivicLayout.tsx` -
`src/components/civic/dashboard/CivicStatsCards.tsx` -
`src/components/civic/dashboard/CivicRecentActivity.tsx` -
`src/hooks/civic/useCivicDashboard.ts` -
`src/hooks/civic/useCivicActivity.ts` -
`src/services/civic/civicDashboardService.ts` -
`src/services/civic/civicActivityService.ts`

The current dashboard: - Displays locality count. - Displays
geographic-feature count. - Displays proposed-zone count. - Displays
application count. - Displays decision count. - Loads recent activity
from zone applications and decisions. - Includes refresh, loading and
error states. - Clearly describes civic decisions as simulated.

This is a real foundation, but it is not the complete civic-planning
product.

### Major missing civic workflow

The repository snapshot does not show actual pages for: - Zone
listing/management. - Zone creation/editing. - Map-based polygon
drawing. - Geometry validation. - Spatial overlap checks. - Proximity
checks against sensitive geographic features. -
Suitability/explainability results. - Zone application submission UI. -
Decision/review detail workflow beyond government personnel
authorizations. - Public map display of simulated-approved zones.

The database architecture includes `proposed_zones`,
`zone_applications`, `zone_decisions` and `geographic_features`, and the
dashboard queries some of them. Table existence and dashboard counts do
not mean the complete workflow is implemented.

This is the highest-priority product gap for the civic part of Prototype
1.

## 3.10 Environmental Intelligence

`<badge>`{=html}Not implemented in current page
snapshot`</badge>`{=html}

Relevant current route: - `src/app/impact/page.tsx`

The inspected impact page currently renders only: - Theme-aware page
background. - Navbar.

It contains no impact dashboard, AQI presentation, scenario calculator
or environmental charts.

The README and database architecture mention: -
`air_quality_observations` - `impact_estimates`

But the supplied source snapshot does not show a working environmental
dashboard/service using those tables.

This is a major remaining implementation area. For Prototype 1, build a
small, transparent and credible experience rather than a complex
unvalidated model.

Minimum credible version: - Air-quality observation card/chart only if
actual sourced data is available. - Clearly label station/source and
observation timestamp. - Attendance/participation counts from actual
UtsavZero bookings and check-ins. - A transparent scenario estimate with
visible assumptions. - Explain that scenario estimates are not measured
AQI changes. - Include empty/unavailable states if no valid observation
data exists.

Do not fabricate live air-quality readings or present hypothetical
estimates as measured impact.

## 3.11 Other pages and navigation

The inspected repository also contains: - `/about` - `/impact` -
`/events` - `/events/[eventId]` - `/events/[eventId]/book` -
`/booking/[bookingId]/confirmation` - `/login` - `/signup` -
`/verify-email` - `/profile` - `/organizer` - `/organizer/organize` -
`/organizer/registrations` - `/organizer/check-in` - `/civic` -
`/civic/authorizations` - `/government-authorization/apply`

Organizer sidebar marks Analytics and Settings as "Coming soon". Do not
spend Prototype 1 time building these unless the core demo is already
complete.

------------------------------------------------------------------------

# 4. Full completion inventory

Status key: - **Implemented:** relevant code is present. - **Reported
demonstrated:** developer previously confirmed working behaviour. -
**Needs QA:** implementation exists but must be tested end-to-end. -
**Not implemented in snapshot:** route/feature is absent or visibly only
a shell. - **Unknown:** cannot be established from the supplied source
snapshot; inspect live database/configuration or run the app.

## 4.1 Public experience

  ---------------------------------------------------------------------------
  Feature                 Status                  Remaining action
  ----------------------- ----------------------- ---------------------------
  Homepage                Implemented             Final content and
                                                  responsive QA

  Navbar/footer           Implemented             Link and mobile QA

  Theme switching         Implemented             Check every route in both
                                                  themes

  Event discovery         Implemented             Data and eligibility QA

  Search/category filters Implemented             Filter edge cases

  Event map/list          Implemented             Coordinates and selection
                                                  QA

  Event detail            Implemented             Data consistency QA

  Booking flow UI         Implemented             Full booking tests

  Group booking RPC       Reported implemented    Concurrency and failure
                                                  tests

  Confirmation page       Present                 Validate returned data and
                                                  refresh behaviour

  My Tickets              Reported implemented    Ownership/security/status
                                                  tests

  QR display/download     Present                 Test output and QR validity

  Check-in scanner        Reported demonstrated   Camera, upload and
                                                  invalid-token QA
  ---------------------------------------------------------------------------

## 4.2 Organiser experience

  -----------------------------------------------------------------------
  Feature                 Status                  Remaining action
  ----------------------- ----------------------- -----------------------
  Organiser dashboard     Implemented             Verify stats and links

  Create event            Implemented             Validation and
                                                  persistence QA

  Location picker/map     Reported completed      Persist/reload/public
                                                  marker QA

  Image upload            API and UI present      Test R2 permissions and
                                                  CORS

  Event list              Implemented             Ownership, refresh and
                                                  empty state

  Registrations page      Implemented             Full query/RLS/status
                                                  QA

  Registration filters    Implemented             Test combinations

  Booking detail view     Implemented             Check sensitive data
                                                  and ticket state

  QR check-in             Reported demonstrated   Regression and
                                                  cross-organiser tests

  Check-in history        Component present       Verify actual history
                                                  data and UI

  Analytics               Coming soon             Out of Prototype 1
                                                  scope unless time
                                                  remains

  Settings                Coming soon             Out of Prototype 1
                                                  scope
  -----------------------------------------------------------------------

## 4.3 Civic experience

  -----------------------------------------------------------------------
  Feature                 Status                  Remaining action
  ----------------------- ----------------------- -----------------------
  Civic layout/sidebar    Implemented             Verify navigation

  Civic dashboard         Implemented             Test actual data counts

  Recent activity         Implemented             Test empty/error states

  Reviewer authorizations Implemented             Full approval lifecycle
                                                  QA

  Server-side reviewer    Present in snapshot     Test all allowed/denied
  guard                                           cases

  Locality data           Table/query exists      Inspect quality and
                                                  coverage

  Geographic features     Table/query exists      Inspect data and
                                                  geometry

  Proposed zones          Table and dashboard     Build
                          count exist             list/create/detail UI

  Polygon drawing         Not present in snapshot Implement or scope down

  Geometry validation     Not present in snapshot Implement essential
                                                  checks

  Overlap/proximity       Not present in snapshot Implement explainable
  analysis                                        checks

  Sensitive-site          Not present in snapshot Connect geographic
  screening                                       features

  Zone applications       Table and activity      Build submission
                          query exist             workflow

  Simulated review        Table and activity      Build reviewer decision
  decision                query exist             workflow

  Approved zone public    Not present in snapshot Implement only after
  display                                         workflow

  Audit interface         Table exists            Build minimum
                                                  activity/audit view
  -----------------------------------------------------------------------

## 4.4 Environmental experience

  -------------------------------------------------------------------------
  Feature                   Status                  Remaining action
  ------------------------- ----------------------- -----------------------
  Impact page               Shell only              Build page

  AQI/air-quality display   Not present in source   Source and display
                            snapshot                actual observations

  Data source/timestamp     Not present             Show provenance

  Event participation       Partial underlying      Define and query
  metrics                   booking data            metrics

  Attendance metrics        Check-in backend exists Aggregate real
                                                    check-ins

  Scenario calculator       Not present             Build transparent
                                                    baseline

  Emissions estimates       Table named in          Inspect schema and
                            architecture            assumptions

  Impact charts             Not present             Add only meaningful
                                                    charts

  Methodology/limitations   Not present in impact   Write clear disclosures
                            page                    
  -------------------------------------------------------------------------

## 4.5 Platform reliability and delivery

  --------------------------------------------------------------------------
  Area                    Status                  Remaining action
  ----------------------- ----------------------- --------------------------
  TypeScript build        Previously reported     Re-run after final changes
                          successful              

  ESLint                  Script exists           Run and resolve relevant
                                                  errors

  Supabase RLS            Policies exist          Audit role/ownership
                                                  boundaries

  Supabase functions      Several key functions   Inspect
                          exist                   grants/search_path/error
                                                  cases

  Auth redirects          Configured earlier      Test local and production

  Resend SMTP             Configured earlier      Send test verification
                                                  email

  R2 uploads              Existing integration    Verify CORS on custom
                                                  domain

  Vercel deployment       Existing deployment     Confirm latest production
                                                  build

  Custom domain           DNS partly updated      Verify `www` CNAME and TLS

  Favicon                 PNG exists and loads    Check Next.js icon
                          locally                 precedence in production

  README                  Present                 Update final status and
                                                  setup

  Demo video              Previously reported     Record final integrated
                          working video           walkthrough

  Pitch presentation      Required deliverable    Finalise story,
                                                  architecture and demo

  Project documentation   Existing                Update architecture,
                          README/handover         security and limitations
  --------------------------------------------------------------------------

------------------------------------------------------------------------

# 5. Four-day execution plan --- 4 to 7 November

The schedule is deliberately aggressive. The goal is a coherent
Prototype 1 by 8 November, not a complete production-grade platform.

## Day 1 --- Wednesday, 4 November

### Stabilise public workflows and registrations

**Primary outcome:** a reliable public booking-to-check-in
demonstration.

Tasks: 1. Run the current application and inspect all key routes. 2. Run
`npm run build` and `npm run lint`; record existing errors before making
changes. 3. Test event creation with a real venue/location. 4. Verify
saved coordinates and public map marker. 5. Test booking quantity,
capacity and failure handling. 6. Verify My Tickets and QR token
display. 7. Test organiser check-in and duplicate scan. 8. Audit
registrations service and RLS. 9. Fix duplicate initial fetch logic in
`useRegistrations.ts` only if confirmed safe. 10. Verify registration
stats, booking details, group quantity and check-in state. 11. Test
image upload on the target domain if domain/CORS is ready.

**Definition of done:** - A test resident can book a published event. -
Booking and capacity persist. - Ticket appears in My Tickets. -
Organiser can see the booking. - Organiser can scan once successfully. -
Second scan is rejected. - Registration and ticket states agree.

**Do not start analytics/settings.**

## Day 2 --- Thursday, 5 November

### Build the minimum complete Civic Intelligence workflow

**Primary outcome:** one working simulated zone proposal and decision
journey.

Before coding: - Inspect the actual schemas, constraints and policies
for `localities`, `geographic_features`, `proposed_zones`,
`zone_applications` and `zone_decisions`. - Inspect any existing SQL
functions and geographic columns. - Confirm which geometry type and
coordinate reference system are actually stored. - Do not invent
database columns or function signatures.

Recommended minimum workflow: 1. Civic dashboard loads real counts. 2.
Reviewer/admin opens a zone workspace. 3. Locality list/map is
displayed. 4. User selects a locality and proposes a zone. 5. User draws
a polygon or uses a deliberately simplified map-based boundary input. 6.
Validate polygon has enough points and valid geometry. 7. Check whether
it overlaps existing proposed zones. 8. Check proximity to sensitive
geographic features if those records have usable geometry. 9. Display an
explainable result: passed checks, warnings and unavailable checks. 10.
Submit a zone application. 11. Reviewer records a simulated decision
with remarks. 12. Decision and activity appear on the dashboard.

**Definition of done:** A complete demo user journey exists from
proposed zone to submitted application to simulated reviewer decision.
It is clearly labelled as a prototype simulation.

**Scope control:** If robust polygon drawing/geometry is not achievable,
do not fake spatial analysis. Deliver a smaller truthful workflow using
existing locality/feature data and visibly label which checks are
actually performed.

## Day 3 --- Friday, 6 November

### Build Environmental Intelligence and connect real metrics

**Primary outcome:** an impact page that uses actual data and clearly
disclosed estimates.

Tasks: 1. Inspect the actual `air_quality_observations` and
`impact_estimates` schemas. 2. Determine whether there are real
observation rows and what their sources/timestamps mean. 3. If valid
observations exist, build an AQI/observation display with source and
time. 4. If no valid data exists, show a clear unavailable/empty state
rather than invented live data. 5. Query real published events, bookings
and successful check-ins for participation indicators. 6. Distinguish
registrations from actual attendance. 7. Add a simple scenario
calculator only if assumptions can be stated. 8. Label modelled
estimates as estimates, not measured outcomes. 9. Add methodology and
limitations. 10. Connect the impact page to navigation and test both
themes.

**Minimum dashboard blocks:** - Latest available air-quality observation
(or unavailable state). - Data source and timestamp. - Events hosted. -
Places reserved/registered. - Actual successful check-ins. - Scenario
estimate with assumptions. - Methodology and limitations.

**Definition of done:** The `/impact` page is no longer an empty shell
and every displayed number has a known source or is explicitly labelled
as an estimate.

## Day 4 --- Saturday, 7 November

### Integration, security, responsiveness and release candidate

**Primary outcome:** stable Prototype 1 release candidate.

Tasks: 1. Test citizen signup/login/logout. 2. Test private organiser
signup and route access. 3. Test government application submission and
status. 4. Test reviewer server-side layout guard: - signed out; - wrong
email; - reviewer email without role; - correct email with role. 5. Test
reviewer approve/reject actions and verify role changes. 6. Test direct
URL access to all restricted pages. 7. Audit RLS for events, bookings,
tickets, check-ins, applications and civic data. 8. Test image uploads
and custom-domain CORS. 9. Verify custom domain, HTTPS, auth redirects
and favicon. 10. Test desktop, tablet and mobile. 11. Test light and
dark theme. 12. Run build and lint. 13. Fix only release-blocking
defects. 14. Update README and handover. 15. Prepare the exact demo
account/data and rehearse the demo.

**Definition of done:** No critical broken route, broken
booking/check-in journey, role bypass, exposed secret, or misleading
environmental/government claim remains in the demo.

## Sunday, 8 November --- Prototype 1 freeze and recording

Treat this as a buffer and delivery day, not a day for large new
features: - Freeze features. - Seed/reset demo data carefully. - Run the
final smoke test. - Record the prototype walkthrough. - Capture
screenshots. - Prepare backup screenshots/video in case the live
deployment has an outage. - Do not run destructive database cleanup
without a verified backup and a clear list of retained demo accounts.

------------------------------------------------------------------------

# 6. Recommended demo script

A coherent demo should take approximately 4--6 minutes.

### Part A --- Resident experience

1.  Open UtsavZero homepage.
2.  Go to Discover Celebrations.
3.  Search/filter events.
4.  Select an event from the map/list.
5.  Open event details and show location, schedule and capacity.
6.  Sign in and make a group booking.
7.  Open My Tickets and show the QR ticket.

### Part B --- Organiser experience

8.  Sign in as the event organiser.
9.  Open Registrations and locate the booking.
10. Open booking details and show group quantity.
11. Open Check-in and scan the QR.
12. Show successful check-in.
13. Scan again and show duplicate-entry rejection.
14. Return to registrations/ticket state and show the updated status.

### Part C --- Civic simulation

15. Sign in as the designated civic demo reviewer.
16. Open Civic Intelligence dashboard.
17. Show locality/geographic information.
18. Create or inspect a proposed zone.
19. Show validation/warnings and submit an application.
20. Record a simulated decision with remarks.
21. Show activity/decision status.

### Part D --- Environmental intelligence

22. Open Impact.
23. Show actual air-quality observation/source/time if available.
24. Show registrations and actual attendance separately.
25. Explain the scenario estimate and its assumptions/limitations.

Do not demo an unimplemented screen as though it works. If any workflow
is out of scope, use a clearly labelled static concept slide instead of
a fake live interaction.

------------------------------------------------------------------------

# 7. Data and security audit checklist

This is a high-risk area because the application handles accounts,
attendee contact details, bookings and QR entry.

## Authentication and roles

-   [ ] `requested_role` metadata never grants privileged roles by
    itself.
-   [ ] Citizen cannot access organiser pages without organiser role.
-   [ ] Organiser cannot access civic routes without civic role.
-   [ ] Civic reviewer route requires exact reviewer email AND
    `civic_demo_admin`.
-   [ ] Server-side guard is active and tested.
-   [ ] Logout invalidates the session.
-   [ ] Callback rejects external redirect destinations.

## Events

-   [ ] Organiser can only manage their own events.
-   [ ] Event owner ID comes from authenticated identity.
-   [ ] Public reads are limited to eligible published events.
-   [ ] Draft/unpublished events are not publicly bookable.
-   [ ] Invalid coordinates do not crash maps.

## Bookings and tickets

-   [ ] Booking requires authentication.
-   [ ] Capacity is checked atomically.
-   [ ] A user cannot read another user's booking/ticket.
-   [ ] Organiser can only read bookings for their events.
-   [ ] QR hash verification occurs in the database.
-   [ ] QR encryption key remains in Vault.
-   [ ] QR token is not logged or exposed in public APIs.
-   [ ] A ticket cannot be checked in twice.
-   [ ] An organiser cannot check in another organiser's event ticket.
-   [ ] Cancellation/expiry is reflected consistently in booking and
    ticket records.

## Government authorization

-   [ ] Applicants can insert only their own pending application.
-   [ ] Applicants can read only their own application.
-   [ ] Applicants cannot edit reviewer fields or status.
-   [ ] Only the designated reviewer can review.
-   [ ] Approval grants the intended role only through the protected
    RPC.
-   [ ] Rejection does not grant the role.
-   [ ] Self-review is blocked if required by the review policy.

## Civic planning

-   [ ] Public users cannot submit or approve privileged civic
    decisions.
-   [ ] Zone geometry is validated server-side or by trusted database
    logic.
-   [ ] Spatial warnings are explainable.
-   [ ] Missing geographic data is reported as unavailable, not treated
    as a pass.
-   [ ] Simulated decisions are labelled as simulated.
-   [ ] Audit data records meaningful decision activity.

## Secrets and deployment

-   [ ] No service-role key in client bundle.
-   [ ] No QR encryption key in client bundle.
-   [ ] `.env.local` is not committed.
-   [ ] R2 credentials are server-only.
-   [ ] CORS includes only required origins/methods/headers.
-   [ ] Production auth redirects use the intended domain.

------------------------------------------------------------------------

# 8. Deployment and configuration follow-ups

## Custom domain

Vercel supplied: - A record: `@` → `216.198.79.1` - CNAME: `www` →
`36f346381ed4e398.vercel-dns-017.com`

The existing GoDaddy A record for `@` was edited to `216.198.79.1` and
the developer confirmed that change.

Still verify: - `www` CNAME points to the Vercel target. - Vercel
reports both domains valid. - HTTPS certificate is provisioned. -
`utsavzero.in` and `www.utsavzero.in` redirect/canonicalise as intended.

Do not alter nameservers, SOA, Resend DKIM, Resend CNAME, SPF or DMARC
records as part of this work.

## R2 CORS

The current organiser upload flow was configured for `PUT` with
`Content-Type`. Existing allowed origins included localhost and Vercel
deployments. The custom-domain origins proposed for addition are: -
`https://utsavzero.in` - `https://www.utsavzero.in`

Verify whether this change was saved. Preserve the existing
method/header configuration unless the actual upload code requires a
change.

## Favicon and metadata

-   `public/favicon.png` exists and was confirmed to load locally.
-   `src/app/layout.tsx` metadata was updated for UtsavZero.
-   `src/app/favicon.ico` also existed in an earlier file inspection and
    may take precedence over the public PNG.
-   Verify production browser tab icon and page title.

## Email

Resend SMTP was configured through Supabase: - Host `smtp.resend.com` -
Port `465` - Username `resend` - Sender `no-reply@utsavzero.in` - Sender
name `UtsavZero`

Send a fresh verification email and test the link on localhost and
production.

------------------------------------------------------------------------

# 9. Known code-level follow-ups from repository inspection

These are specific observations from the supplied snapshot. They should
be verified before edits.

1.  `src/app/impact/page.tsx` currently contains only the themed wrapper
    and navbar. It needs the environmental experience.
2.  `src/app/civic/page.tsx` has a working dashboard foundation with
    stats and recent activity hooks/services. It is not the full
    zone-management workflow.
3.  The `src/app/civic/authorizations/layout.tsx` server-side guard
    already exists in the snapshot. Test it rather than recreate it.
4.  `src/app/organizer/registrations/page.tsx` and its
    components/service already exist. Audit and complete the workflow
    rather than rebuild it.
5.  `src/hooks/hostevents/useRegistrations.ts` duplicates the initial
    fetch logic separately from the `refresh` callback. Consider
    simplifying to one reusable fetch path after verifying behaviour.
6.  `src/components/hostevents/layout/OrganizerSidebar.tsx` explicitly
    marks Analytics and Settings as coming soon. These are not Prototype
    1 priorities.
7.  `src/data/mockEvents.ts` exists. Confirm it is not unintentionally
    used as the production event source.
8.  `src/proxy.ts` applies role-based route gating to `/civic`,
    `/organizer` and `/profile`. Test it together with the nested
    reviewer layout and Supabase cookie refresh.
9.  The source snapshot includes
    `src/app/api/places/autocomplete/route.ts` and
    `src/app/api/uploads/event-image/route.ts`. Test their environment
    variables, upstream error handling and production deployment.
10. The source snapshot does not include the actual Supabase
    migration/SQL files or the separate Project Bible. Database
    conclusions must be confirmed against the live Supabase
    schema/functions/policies before changing SQL.

------------------------------------------------------------------------

# 10. Out of scope for Prototype 1

Unless the critical demo is already stable, defer: - Organiser analytics
dashboard. - Organiser settings page. - Advanced predictive/ML
environmental modelling. - Complex real-time crowd forecasting. - Real
government integration or legal authorisation. - Payment gateway
integration if the prototype is using free/demo bookings. - Large
redesigns of already-working event discovery, booking or ticket pages. -
Rebuilding completed map/location components. - Cosmetic animations that
do not improve usability. - Features that require unverified data
sources or unsupported environmental claims.

A smaller working prototype is stronger than a broad set of
nonfunctional screens.

------------------------------------------------------------------------

# 11. Final release checklist for Prototype 1

## Core demo

-   [ ] Resident can discover an event.
-   [ ] Event details and map location are correct.
-   [ ] Resident can book a group.
-   [ ] Capacity is updated correctly.
-   [ ] QR ticket appears in My Tickets.
-   [ ] Organiser sees the booking.
-   [ ] Organiser scans ticket successfully.
-   [ ] Duplicate scan is rejected.
-   [ ] Civic reviewer can access the protected portal.
-   [ ] At least one zone/application/review workflow works end-to-end.
-   [ ] Impact page contains meaningful sourced data or a transparent
    unavailable state and scenario estimate.

## Quality

-   [ ] Desktop QA.
-   [ ] Mobile QA.
-   [ ] Light theme QA.
-   [ ] Dark theme QA.
-   [ ] Loading states.
-   [ ] Empty states.
-   [ ] Error states.
-   [ ] No critical console/runtime errors.
-   [ ] No broken navigation.
-   [ ] No role bypass.
-   [ ] No exposed secrets.
-   [ ] `npm run build` passes.
-   [ ] `npm run lint` reviewed.
-   [ ] Production deployment smoke test passes.

## Submission

-   [ ] README updated.
-   [ ] Technical architecture documented.
-   [ ] Database/role/security summary documented.
-   [ ] Demo accounts and seed data prepared securely.
-   [ ] Final walkthrough recorded.
-   [ ] Pitch deck updated.
-   [ ] Backup screenshots/video prepared.
-   [ ] Final handover lists known limitations honestly.

------------------------------------------------------------------------

# 12. Session continuation protocol

The next development session should proceed one step at a time.

1.  Start by confirming the current branch and working tree.
2.  Run the existing app and build before changing anything.
3.  Confirm the supplied Repomix snapshot matches the current working
    tree; it may be stale.
4.  Begin with the Day 1 public booking/registration regression test.
5.  Do not edit multiple unrelated workflows in one pass.
6.  Before SQL changes, inspect the exact live schema, existing
    functions, grants and RLS policies.
7.  After each task, report:
    -   What was completed.
    -   Files changed.
    -   SQL changes, if any.
    -   Tests actually run.
    -   Remaining issues.
    -   Next single task.
8.  Preserve existing working features and design.

## Immediate first action

**Do not start by building a new registrations page or recreating the
reviewer guard. Both already exist in the repository snapshot.**

Start by running the current app and testing the complete public
journey:

**event creation/location → public discovery → group booking → My
Tickets → organiser registrations → QR check-in → duplicate-scan
rejection.**

Fix only the failures found. Once this path is stable, move to the civic
zone workflow, then Environmental Intelligence, then release QA.

------------------------------------------------------------------------

# 13. Closing assessment

UtsavZero already has a meaningful foundation: public event discovery,
event creation and location selection, group booking, digital tickets,
My Tickets, organiser check-in, registrations UI/data access,
authentication, role routing, and a civic dashboard/reviewer workflow.

The remaining workload is still substantial. The most important missing
product capability is the actual civic zone-planning journey. The
environmental impact page is currently an empty shell and needs to
become a truthful, data-backed demonstration. The existing public and
organiser journeys need rigorous end-to-end testing and security
verification. Domain, upload, email and production checks also remain.

The next four days should be treated as a focused integration sprint:

-   **4 Nov:** Stabilise public booking, registrations and check-in.
-   **5 Nov:** Complete one civic zone proposal/review journey.
-   **6 Nov:** Build the Environmental Intelligence experience.
-   **7 Nov:** Integrate, secure, test and prepare the release
    candidate.
-   **8 Nov:** Freeze, smoke-test and record Prototype 1.

**Guiding rule: preserve what works, complete the highest-value missing
workflow, and verify every claim in the demo.**