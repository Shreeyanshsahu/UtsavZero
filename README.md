<p align="center">
  <img src="public/UtsavZeroLogo.png" alt="UtsavZero Logo" width="200"/>
</p>

<h1 align="center">UtsavZero</h1>

<p align="center">
  <strong>Discover cleaner celebrations. Plan smarter communities.</strong>
</p>

<p align="center">
  A Community Celebrations & Environmental Intelligence Platform
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-MVP%20Development-orange" alt="Project Status"/>
  <img src="https://img.shields.io/badge/Platform-Web-blue" alt="Platform"/>
  <img src="https://img.shields.io/badge/Frontend-Next.js-black" alt="Frontend"/>
  <img src="https://img.shields.io/badge/Database-Supabase-green" alt="Database"/>
  <img src="https://img.shields.io/badge/Challenge-DTU%20SEVA%20FIRST-purple" alt="Challenge"/>
</p>

---

## 1. Overview

**UtsavZero** is a community celebration and environmental intelligence platform designed to make organised, cleaner and more responsible celebrations easier to discover and manage.

The platform connects residents, event organisers and a proposed civic-planning experience through a single web application. Residents can discover community celebrations, explore event locations, make group bookings and access digital QR tickets. Organisers can create events and validate tickets at the entrance. The civic experience explores simulated locality and environmental-planning workflows.

UtsavZero is being developed for the **DTU SEVA FIRST Innovation Challenge 2026**.

## 2. Problem Statement

Community celebrations are often coordinated through disconnected channels such as social media groups, posters and messaging applications. This can make it difficult for residents to find reliable event information and for organisers to manage locations, capacity, registrations and entry.

UtsavZero aims to address these challenges through:

- A central place to discover community celebrations.
- Map-based event exploration and location information.
- Organiser tools for creating and managing events.
- Group registration and digital ticketing.
- QR-based ticket validation and duplicate-entry prevention.
- A prototype civic-planning experience for exploring locality and environmental information.

## 3. Platform Experiences

### A. Public Portal — Residents

- Browse community events.
- Explore events through map and list views.
- Search and filter by category and locality.
- View event details, venue, schedule and capacity.
- Make supported group bookings.
- Access My Tickets and digital QR tickets.
- View ticket status, including checked-in status.

Public event discovery is intended to focus on organised, firecracker-free celebrations.

### B. Organiser Portal — Event Hosts

- Sign in through Supabase authentication.
- Access an organiser dashboard.
- Create and publish events or save drafts.
- Add event descriptions, categories, venue, address, schedule and capacity.
- Select event locations through the implemented map/location workflow.
- Upload event images where configured.
- View events associated with the organiser account.
- Scan attendee QR tickets and validate entry.
- Prevent reuse of an already checked-in group ticket.

The product concept distinguishes private community organisers from a proposed simulated civic-authorised organiser role. The latter is a prototype workflow and does not represent actual government authorisation.

### C. Civic Intelligence Portal — Prototype

The proposed civic experience explores:

- Locality-based planning.
- Geographic feature visualisation.
- Proposed event-zone workflows.
- Zone application and review.
- Simulated decisions.
- Environmental and participation indicators.

Civic workflows are demonstrations only. They do not issue legal permissions or represent an official government system.

## 4. Core Features and Current Status

| Feature | Current status |
|---|---|
| Public homepage and navigation | Implemented |
| Responsive interface | Implemented; continue device QA |
| Light/dark theme | Implemented |
| Event discovery and filters | Implemented |
| Map/list event exploration | Implemented |
| Event location and map workflow | Implemented; final QA remains |
| Event details | Implemented |
| Organiser authentication and dashboard | Implemented |
| Organiser event creation and listing | Implemented |
| Event list refresh after creation | Implemented |
| Supabase group booking function | Implemented |
| QR token generation and secure storage | Implemented |
| My Tickets retrieval and QR display | Implemented |
| Organiser QR check-in | Implemented and demonstrated |
| Duplicate check-in prevention | Demonstrated |
| Organiser registrations management | Requires audit/completion |
| Civic planning workflows | Further implementation required |
| Environmental intelligence | Further implementation required |

*Status reflects the current development handover and user-demonstrated flows. It does not mean every edge case or production security requirement has been independently tested.*

## 5. Booking and Ticket Verification

UtsavZero uses a **group-booking model**. A booking represents a reservation for a quantity of attendees, and the associated group ticket is used for entry validation.

The current Supabase database functions include:

- `public.create_group_booking(...)` — validates and creates a group booking, reserves event capacity and creates ticket data.
- `public.get_my_tickets()` — retrieves the authenticated user's ticket and event information.
- `public.check_in_group_ticket(p_qr_token text)` — validates a QR token and records check-in.

The ticket workflow uses a random QR token. Its hash is stored for verification, while an encrypted token is retained for retrieval by the ticket owner. The encryption key is stored in Supabase Vault rather than exposed to browser code.

A successful check-in changes the ticket status. A second scan of the same ticket is rejected. The check-in function also checks organiser authorisation and records check-in attempts.

**Important:** A booking is not proof of attendance. Attendance is represented by a successful check-in.

## 6. Technology Stack

### Frontend
- **Next.js** — React framework and application routing.
- **React** — component-based user interface.
- **TypeScript** — type-safe application development.
- **Tailwind CSS** — utility-first styling.
- **Lucide React** — interface icons.

### Backend and Database
- **Supabase** — backend platform.
- **PostgreSQL** — relational database.
- **Supabase Auth** — user authentication.
- **Supabase Storage** — file/image storage where configured.
- **Supabase Row Level Security (RLS)** — database access control.
- **Supabase database functions** — booking and ticket-validation operations.
- **Supabase Vault** — storage for the QR encryption secret.

### Maps and Location
- **Leaflet** — interactive maps.
- **React Leaflet** — React integration for Leaflet.
- **OpenStreetMap** — map tile and geographic visualisation source.

### Tickets and Export
- **qrcode.react** — QR code generation.
- **@zxing/browser** — browser-based QR scanning.
- **jsPDF** — PDF generation.
- **html2canvas-pro** — capturing interface content for export.

## 7. Database Overview

The current database architecture includes the following tables, as represented in the project ERD.

**Identity and organiser**
- `profiles`
- `user_roles`
- `organizer_profiles`

**Events and participation**
- `events`
- `saved_events`
- `bookings`
- `tickets`
- `ticket_checkins`

**Geographical and environmental information**
- `localities`
- `geographic_features`
- `air_quality_observations`
- `impact_estimates`

**Civic planning**
- `proposed_zones`
- `zone_applications`
- `zone_decisions`

**Audit**
- `audit_logs`

The ERD is an architectural reference. Actual migrations, foreign keys, constraints, RLS policies and database functions in Supabase are authoritative.

## 8. Application Architecture

The application follows a modular Next.js structure. This is a high-level illustration; inspect the repository for the exact current file tree.

```text
UtsavZero/
├── public/
│   └── UtsavZeroLogo.png
├── src/
│   ├── app/
│   ├── components/
│   │   └── hostevents/
│   ├── context/
│   ├── hooks/
│   ├── lib/
│   │   └── supabase/
│   ├── services/
│   └── types/
├── .env.local
├── package.json
└── README.md
```

## 9. Authentication, Roles and Data Security

Supabase Auth provides the authentication foundation. The application has distinct public, organiser and proposed civic experiences.

Security principles:

- Associate created events with the authenticated organiser.
- Enforce ownership and role checks through database policies and server-side functions.
- Do not rely on hiding frontend controls as an access-control mechanism.
- Do not expose Supabase service-role credentials or the QR encryption secret in client-side code.
- Verify ticket tokens on the database side.
- Keep booking capacity validation and reservation inside the database transaction.
- Restrict civic decision-making actions to the intended role and keep prototype decisions clearly labelled as simulated.

The security model and RLS policies must be reviewed before production deployment.

## 10. Installation and Local Development

### Prerequisites

- Node.js
- npm
- Git
- A Supabase project configured for the application

### Clone the repository

```bash
git clone https://github.com/Shreeyanshsahu/UtsavZero.git
cd UtsavZero
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env.local` file in the project root.

The Supabase browser client currently expects:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Check the current Supabase client and server-side integrations for any additional required variables. Never commit `.env.local`, service-role keys, storage secrets or other private credentials.

### Start the development server

```bash
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

### Build the application

```bash
npm run build
```

Run the build before submitting or deploying changes.

## 11. Team Testing Checklist

The team should test the application using designated test accounts and test events.

### Resident flow

- [ ] Sign up and sign in.
- [ ] Browse and search events.
- [ ] Open event details and verify the displayed location.
- [ ] Book a group ticket.
- [ ] Confirm booking and capacity data in Supabase.
- [ ] Open My Tickets.
- [ ] Verify QR code and booking information.

### Organiser flow

- [ ] Sign in as the event organiser.
- [ ] Create and publish a test event.
- [ ] Confirm the event appears in the organiser event list.
- [ ] Open the check-in page.
- [ ] Scan a valid ticket.
- [ ] Confirm the ticket is marked checked in.
- [ ] Scan the same ticket again and confirm duplicate entry is rejected.
- [ ] Review registrations and attendance information.

### Edge cases and security

- [ ] Try an invalid QR token.
- [ ] Try a ticket belonging to another organiser.
- [ ] Test a cancelled or expired ticket.
- [ ] Test booking when event capacity is full.
- [ ] Test concurrent booking attempts.
- [ ] Verify role permissions and RLS behaviour.
- [ ] Check mobile layout and both themes.

## 12. Development Roadmap

The next development priorities are:

1. Complete the organiser registrations management workflow.
2. Audit and test booking, capacity and check-in edge cases.
3. Review RLS policies, function permissions and production configuration.
4. Continue the Civic Intelligence Portal, including proposed zones and simulated review workflows.
5. Develop environmental indicators with clear data sources, assumptions and uncertainty.
6. Complete responsive QA, production build, documentation and demo preparation.

The event location and map workflow has been implemented. Remaining work in this area is verification and quality assurance, not rebuilding the feature.

## 13. Environmental Responsibility and Claim Discipline

UtsavZero promotes organised, firecracker-free community celebrations and aims to make cleaner alternatives easier to discover.

Environmental indicators may explore:

- Event distribution across localities.
- Registrations and verified attendance.
- Hypothetical environmental scenarios.
- Estimated impacts under explicitly stated assumptions.
- Air-quality observations with source, station and timestamp information.

Do not equate registrations with attendance, attendance with avoided fireworks use, or an emissions scenario with measured AQI. Estimates must be labelled as estimates or simulations and include relevant assumptions and uncertainty.

## 14. Important Disclaimer

UtsavZero is an independent prototype developed for demonstration and innovation purposes.

It is not an official government platform, does not issue legal permissions and does not authorise the use of firecrackers.

Any government-authorised organiser workflow, event-zone proposal, civic approval or environmental impact dashboard shown in the prototype is simulated unless explicitly connected to a verified official source.

The public event-discovery concept focuses on organised, firecracker-free celebrations.

## 15. Project Information

- **Project:** UtsavZero
- **Institution:** Delhi Technological University (DTU)
- **Challenge:** SEVA FIRST Innovation Challenge 2026
- **Repository:** https://github.com/Shreeyanshsahu/UtsavZero

## 16. Contributing

UtsavZero is currently being developed as an MVP for the DTU SEVA FIRST Innovation Challenge 2026.

Suggestions, feedback and ideas for improving community-event organisation and environmental awareness are welcome.

---

<p align="center">
  <strong>UtsavZero — Celebrate Together. Celebrate Responsibly.</strong>
</p>

<p align="center">
  Building cleaner celebrations and smarter communities.
</p>
