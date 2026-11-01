# UTSAVZERO — DAY 3 DEVELOPMENT HANDOVER
## Project Continuation, Implementation Status & Remaining Roadmap

**Handover date:** 1 November 2026  
**Project:** UtsavZero — Community Celebrations & Environmental Intelligence Platform  
**Challenge:** DTU SEVA FIRST Innovation Challenge 2026  
**Project geography:** Delhi, India  
**Developer:** Solo developer  
**Repository:** https://github.com/Shreeyanshsahu/UtsavZero  
**Current target:** MVP and video pitch by 9 November 2026

---

# 1. PURPOSE OF THIS HANDOVER

This document records the development state of UtsavZero at the end of Day 3.

It supersedes outdated implementation-status checklists in the earlier development handover where newer work has been completed.

The next assistant must:

1. Read this handover and the UtsavZero Project Bible.
2. Treat this document as the latest development-status reference.
3. Inspect the actual current repository before changing code.
4. Preserve existing working functionality.
5. Never assume a file is empty or a feature is missing without inspecting it.
6. Avoid rebuilding completed features.
7. Distinguish user-confirmed functionality from functionality independently verified through code or testing.

The Project Bible remains authoritative for the product concept, research, legal context and claim discipline.

---

# 2. PROJECT IDENTITY

**UtsavZero** is a community celebration and environmental intelligence platform.

Its two connected experiences are:

### Public application
- Discover organised, firecracker-free community celebrations.
- Explore events through maps and listings.
- View event location, timings and capacity.
- Register for events through group bookings.
- Receive digital QR tickets.
- View bookings and ticket status.
- Allow organisers to validate entry.

### Civic Intelligence Portal
- Restricted civic demonstration interface.
- Locality and geographical information.
- Proposed-zone management.
- Spatial overlap and proximity analysis.
- Sensitive-location screening.
- Proposal review and simulated decisions.
- Environmental and participation intelligence.

The civic workflow is a prototype and must not be represented as an actual government approval service.

**Important legal constraint:** Delhi's current official context includes a complete ban on sale and use of firecrackers in NCT Delhi. Public-facing events must focus on firecracker-free celebrations. Any fireworks-zone workflow remains a hypothetical policy simulation.

---

# 3. DAY 3 — WORK COMPLETED

Day 3 has been a major integration day. The focus was connecting the event-location workflow and making the public booking and organiser entry process work with persistent backend data.

## 3.1 Event location and map integration

**Status: Completed — user-confirmed**

The event-location/map milestone that was previously listed as a priority is now complete.

The earlier handoff instructed the next developer to implement event geolocation, latitude/longitude and a map-based location picker. That instruction is now outdated.

The current project has completed the map/location work.

The relevant functionality to preserve includes the existing event-location interface and its connection to the event workflow.

The latest database ERD shows the `events` table includes:

- `locality_id`
- `venue_name`
- `address`
- `latitude`
- `longitude`
- `starts_at`
- `ends_at`

The public event and geographical data architecture is represented in the shared ERD.

**Next verification, not a rebuild:**
- Confirm newly created event coordinates are persisted.
- Confirm saved coordinates load correctly when reopening an event.
- Confirm public map markers use persisted coordinates rather than fallback/mock coordinates.
- Confirm existing event creation and discovery still work in both themes and on mobile.

Do not rebuild the location picker or map interface unless a specific defect is found.

## 3.2 Persistent booking backend

**Status: Implemented; core flow demonstrated**

The project now uses a Supabase database function for group booking.

Function:

`public.create_group_booking(...)`

Parameters:

- `p_event_id`
- `p_quantity`
- `p_attendee_name`
- `p_attendee_email`
- `p_attendee_phone`

The function:

1. Requires an authenticated user.
2. Validates the requested quantity.
3. Validates attendee details.
4. Locks the event row.
5. Checks that the event is published and eligible for booking.
6. Checks event start time and remaining capacity.
7. Reserves capacity through a database transaction.
8. Creates a booking.
9. Generates a cryptographically random QR token.
10. Stores its SHA-256 hash and encrypted value in the ticket record.
11. Returns booking and ticket information.

The booking function also handles payment status separately from booking status.

For the prototype, free events can use `not_required`, while paid-event handling remains demo-oriented.

## 3.3 My Tickets

**Status: Implemented — user-confirmed**

The My Tickets functionality now retrieves real booking and ticket information from Supabase.

Database function:

`public.get_my_tickets()`

It:

- Requires authentication.
- Retrieves only the current user's bookings.
- Joins `bookings`, `tickets` and `events`.
- Retrieves ticket and booking status.
- Retrieves event details.
- Decrypts the QR token inside PostgreSQL.
- Returns ticket information to the authenticated client.

The encryption key is read from the Supabase Vault secret:

`utsavzero_qr_encryption_key`

The browser does not need access to the encryption key.

The current group-booking model returns one ticket record representing a group booking, with its quantity indicating the number of reserved places.

My Tickets displays relevant booking and event information, including the QR code and ticket status.

## 3.4 QR ticket check-in

**Status: Implemented — demonstrated by user**

Database function:

`public.check_in_group_ticket(p_qr_token text)`

The function:

- Requires authentication.
- Validates the token format.
- Hashes the submitted token.
- Finds the matching ticket.
- Checks the associated booking and event.
- Verifies organiser ownership or the permitted civic demo role.
- Prevents repeated check-in.
- Updates ticket status.
- Records the check-in attempt in `ticket_checkins`.

Expected outcomes include:

- `success`
- `already_used`
- `invalid`
- `cancelled`
- `expired`
- `not_authorized`

The frontend uses the RPC:

`supabase.rpc("check_in_group_ticket", { p_qr_token: token })`

The user demonstrated the following behaviour:

1. A valid ticket is scanned.
2. The ticket is marked checked in.
3. My Tickets reflects the checked-in status.
4. Scanning the same ticket again is rejected.
5. The interface displays an already-used/entry-not-permitted result.

The project also has a camera-scanning workflow using the installed ZXing browser library.

Do not rebuild the scanner or QR generation unnecessarily.

## 3.5 Database architecture and ERD

The latest shared ERD represents the following database tables:

### Identity and organiser
- `profiles`
- `user_roles`
- `organizer_profiles`

### Events and participation
- `events`
- `saved_events`
- `bookings`
- `tickets`
- `ticket_checkins`

### Geographical and environmental information
- `localities`
- `geographic_features`
- `air_quality_observations`
- `impact_estimates`

### Civic planning
- `proposed_zones`
- `zone_applications`
- `zone_decisions`

### Audit
- `audit_logs`

The ERD should be treated as the current architectural reference, but actual SQL migrations, constraints, foreign keys, RLS and function definitions remain the authoritative database implementation.

---

# 4. DEVELOPMENT STATUS AT THE END OF DAY 3

The following checklist supersedes older checklists where they conflict.

## 4.1 Public platform

- [x] Homepage and navigation.
- [x] Responsive interface.
- [x] Light/dark ThemeContext.
- [x] Event discovery.
- [x] Search and category filters.
- [x] Public map and event selection interface.
- [x] Event details.
- [x] Event location and map integration.
- [x] Organiser event creation.
- [x] Organiser event list.
- [x] Event-list refresh after successful creation.
- [x] Group booking database function.
- [x] QR token generation and storage.
- [x] My Tickets database retrieval.
- [x] Digital QR ticket display.
- [x] Organiser QR check-in.
- [x] Duplicate check-in prevention demonstrated.

## 4.2 Organiser platform

- [x] Organiser dashboard foundation.
- [x] Event creation form.
- [x] Authenticated organiser ownership on event insertion.
- [x] Event list filtered by organiser.
- [x] Event list refresh after successful creation.
- [x] QR scanner implementation.
- [ ] Complete registrations management audit.
- [ ] Verify attendee/booking list and capacity information.
- [ ] Verify check-in history presentation.
- [ ] Verify event edit and cancellation workflows.
- [ ] Verify all organiser actions against RLS and database permissions.

## 4.3 Backend and security

- [x] Supabase authentication foundation.
- [x] Core relational schema.
- [x] Group booking function.
- [x] My Tickets function.
- [x] Ticket QR hashing.
- [x] Encrypted QR token storage.
- [x] Server/database-side QR validation.
- [x] Duplicate check-in protection.
- [ ] Complete end-to-end RLS audit.
- [ ] Test concurrent booking and capacity limits.
- [ ] Test cancellation and expiry cases.
- [ ] Verify all relevant function grants and permissions.
- [ ] Verify production environment configuration.

## 4.4 Location and maps

- [x] Event location interface.
- [x] Map/location workflow.
- [x] Event geographical schema represented in ERD.
- [ ] Final persistence and reload verification.
- [ ] Final public-marker accuracy verification.
- [ ] Mobile map interaction QA.

The last three items are verification tasks, not a request to rebuild the completed map work.

## 4.5 Civic Intelligence Portal

- [ ] Civic dashboard and navigation.
- [ ] Restricted demo role workflow.
- [ ] Locality and geographic-feature data.
- [ ] Zone creation and editing.
- [ ] Polygon geometry validation.
- [ ] Spatial overlap and proximity checks.
- [ ] Sensitive-location screening.
- [ ] Explainable planning suitability indicator.
- [ ] Zone application submission.
- [ ] Proposal review and simulated decisions.
- [ ] Simulated-approved zone display on the public map.
- [ ] Audit-history interface.

The database tables for several of these workflows already exist. Inspect the current pages, components, services and SQL functions before deciding what still needs implementation.

## 4.6 Environmental intelligence

- [ ] Environmental dashboard.
- [ ] Air-quality observation integration.
- [ ] Station, source, pollutant and timestamp display.
- [ ] Participation baseline.
- [ ] Attendance forecasting baseline.
- [ ] Scenario-based emissions calculator.
- [ ] Assumption and uncertainty presentation.

Do not claim that event attendance directly reduces AQI.

---

# 5. IMPORTANT DATABASE AND SECURITY DECISIONS

These decisions must be preserved.

### Booking
- Group booking is the current MVP model.
- Booking quantity represents the number of places.
- Capacity must be checked and reserved atomically in the database.
- Client-side capacity checks are not sufficient.

### QR tokens
- Generate cryptographically random tokens.
- Store a SHA-256 hash for verification.
- Store the encrypted token only where retrieval is required for the user's ticket.
- Keep the encryption key in Supabase Vault.
- Never expose the Vault secret or service-role key in browser code.

### Check-in
- Only the event organiser or an explicitly permitted role can check in a ticket.
- A ticket must not be checked in twice.
- Check-in attempts must remain auditable.
- A successful booking is not proof of attendance until check-in.

### Civic permissions
- Public users must not be able to perform civic approval actions.
- Do not rely on hiding UI controls as security.
- Use database permissions and RLS.
- All prototype approvals must be explicitly labelled simulated.

---

# 6. WHAT IS STILL LEFT — UPDATED PRIORITIES

The location/map task is no longer the next major development task.

The next priorities are:

## Priority 1 — Registrations management

Complete the organiser's registrations workflow.

The objective is to let an organiser understand:

- Which users booked their events.
- Booking references.
- Attendee information.
- Group size.
- Booking status.
- Ticket status.
- Check-in status.
- Remaining event capacity.
- Attendance/check-in history.

Before coding, inspect the existing registrations page and its services. Do not replace working components.

## Priority 2 — End-to-end booking and organiser QA

Test the complete journey:

1. User signs in.
2. User discovers an event.
3. User opens event details.
4. User books a group ticket.
5. Booking and capacity are saved in Supabase.
6. My Tickets displays the ticket.
7. Organiser opens the scanner.
8. Organiser scans the QR.
9. Ticket becomes checked in.
10. A second scan is rejected.
11. Registration and attendance views reflect the outcome.

Also test:
- Unauthenticated booking.
- Invalid QR.
- Cancelled ticket.
- Expired ticket.
- Full event.
- Duplicate booking/check-in attempts.
- User attempting to check in another organiser's ticket.

## Priority 3 — Civic Intelligence Portal

Build the prototype civic workflow using the existing database architecture.

Recommended sequence:

1. Civic portal shell.
2. Restricted demo access.
3. Locality map and geographical layers.
4. Proposed zone creation.
5. Polygon validation.
6. Nearby feature and overlap checks.
7. Explainable planning indicators.
8. Zone application and review.
9. Simulated decision history.
10. Public map display of simulated-approved zones.

Keep this workflow explicitly simulation-only.

## Priority 4 — Environmental Intelligence

Build a credible demonstration with transparent data:

1. Air-quality observation presentation.
2. Station and source metadata.
3. Registration and attendance indicators.
4. Basic attendance scenario estimates.
5. Environmental scenario calculator.
6. Assumptions and uncertainty disclosure.

Do not introduce machine learning merely for appearance. Build a baseline first and evaluate it only when sufficient data exists.

## Priority 5 — Final MVP preparation

- Full responsive QA.
- Light/dark theme QA.
- Loading, empty, error and success states.
- RLS and database security review.
- TypeScript checks.
- Production build.
- Deployment verification.
- README update.
- Demo video.
- Final pitch presentation.
- Documentation.

---

# 7. UPDATED DEVELOPMENT SCHEDULE

The remaining time is limited. Focus on an integrated demonstrable MVP.

| Date | Main focus |
|---|---|
| November 2 | Registrations management and organiser workflow |
| November 3 | Booking/check-in edge cases and backend security |
| November 4 | Civic portal foundation |
| November 5 | Zone creation and spatial analysis |
| November 6 | Proposal review and simulated decisions |
| November 7 | Environmental dashboard and integration |
| November 8 | QA, fixes, build and video recording |
| November 9 | Final submission |

This is a working schedule. Re-plan based on actual implementation progress.

---

# 8. DEVELOPMENT RULES FOR THE NEXT ASSISTANT

These rules are mandatory.

### Repository inspection
- Inspect actual files before editing.
- Do not assume a file is empty.
- Do not invent file paths or database columns.
- Read relevant parent components, services, hooks and types.
- Use the latest repository snapshot if available.

### UI development
- Mobile-first is mandatory.
- Use the existing ThemeContext.
- Do not create another theme provider.
- Check both light and dark themes.
- Preserve existing branding and design.
- Test mobile, tablet and desktop layouts.

### Code changes
- Work incrementally.
- Preserve working code.
- Explain data flow and security implications.
- Provide exact paths.
- Provide complete updated files when necessary.
- Do not add dependencies without checking the existing package configuration.

### Testing and reporting
At the end of each session, report:

1. What was completed.
2. Which files changed.
3. Which SQL functions, tables or policies changed.
4. Which tests were actually run.
5. What remains incomplete.
6. The next recommended task.

Never claim that a test passed unless it was actually run or the user explicitly confirmed its outcome.

---

# 9. IMPORTANT PROJECT BIBLE CORRECTIONS

The Project Bible's original development-status section was written before the backend booking, My Tickets, secure QR verification and map-location milestones were completed.

The next assistant must not follow its older status checklist literally.

Update the Project Bible's development-status section to reflect:

- Event location and map integration completed.
- Persistent group booking implemented.
- My Tickets retrieval implemented.
- Secure QR token generation and retrieval implemented.
- Organiser check-in implemented.
- Duplicate check-in prevention demonstrated.

Keep research, legal context, product positioning and environmental claim limitations unchanged.

The Project Bible and this Day 3 handover should remain consistent.

---

# 10. NEXT SESSION — EXACT STARTING INSTRUCTIONS

Continue UtsavZero from the end of Day 3.

The event-location and map milestone is complete. Do not rebuild it.

The persistent group-booking function, My Tickets retrieval, encrypted QR token workflow and organiser check-in have been implemented and demonstrated.

The next major task is to complete the organiser registrations management workflow.

Before writing code:

1. Inspect the current repository tree.
2. Inspect the actual registrations page.
3. Inspect the organiser dashboard and layout.
4. Inspect the booking and ticket types.
5. Inspect the booking service and check-in service.
6. Inspect the actual Supabase schema and RLS policies.
7. Determine which parts of registrations management already work.

Then implement only the missing pieces.

After that, test the complete user booking → My Tickets → organiser QR scan → attendance workflow before moving to the civic portal.

**Repository:** https://github.com/Shreeyanshsahu/UtsavZero

---

# 11. FINAL DAY 3 SUMMARY

Day 3 represents a significant step forward in UtsavZero.

The project now has a substantially more complete public participation workflow:

**Event discovery → Map/location → Group booking → Digital QR ticket → My Tickets → Organiser check-in → Duplicate-entry prevention.**

The location/map milestone is complete and should be treated as such, subject only to final QA.

The most important remaining public-platform task is organiser registrations management and full end-to-end testing.

After that, the main development focus should shift to the Civic Intelligence Portal and Environmental Intelligence modules.

**Development principle: Do not rebuild what already works. Complete the missing connections, verify the data and security, and deliver a coherent MVP.**