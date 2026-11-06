<p align="center">
  <img src="public/UtsavZeroLogo.png" alt="UtsavZero logo" width="230" />
</p>

<h1 align="center">UtsavZero</h1>

<p align="center">
  <strong>Celebrate together. Celebrate responsibly.</strong>
</p>

<p align="center">
  A community celebrations and environmental intelligence platform for Delhi.
</p>

<p align="center">
  <a href="https://github.com/Shreeyanshsahu/UtsavZero">
    <img src="https://img.shields.io/badge/Project-UtsavZero-F0440A?style=for-the-badge" alt="UtsavZero" />
  </a>
  <img src="https://img.shields.io/badge/Framework-Next.js_16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Backend-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Maps-Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet" />
</p>

<p align="center">
  <em>Same celebration. Cleaner tomorrow.</em>
</p>

---

## Contents

- [The idea](#-the-idea)
- [Why UtsavZero](#-why-utsavzero)
- [What the platform brings together](#-what-the-platform-brings-together)
- [Platform experiences](#-platform-experiences)
- [How it works](#-how-it-works)
- [Features](#-features)
- [Environmental and geographic intelligence](#-environmental-and-geographic-intelligence)
- [Technology](#-technology)
- [Application architecture](#-application-architecture)
- [Database overview](#-database-overview)
- [Booking and ticket lifecycle](#-booking-and-ticket-lifecycle)
- [Authentication and security](#-authentication-and-security)
- [Delhi geographic data pipeline](#-delhi-geographic-data-pipeline)
- [Getting started](#-getting-started)
- [Environment configuration](#-environment-configuration)
- [Available commands](#-available-commands)
- [Application routes](#-application-routes)
- [Current project state](#-current-project-state)
- [Known limitations and next steps](#-known-limitations-and-next-steps)
- [Responsible use of environmental data](#-responsible-use-of-environmental-data)
- [Project background](#-project-background)
- [Contributing and feedback](#-contributing-and-feedback)
- [Acknowledgements](#-acknowledgements)

---

## 🌱 The idea

**UtsavZero** is a community celebrations and environmental intelligence platform that aims to make cleaner, organised and more responsible festive experiences easier to discover, plan and participate in.

The project begins with a simple thought:

> **A festival of lights should bring people together — not leave the city struggling to breathe.**

Diwali is a celebration of light, hope, family and community. In Delhi, however, the festive season also brings difficult conversations about air pollution and the environmental impact of celebrations. The answer cannot be limited to telling people not to celebrate. Communities also need attractive, accessible ways to celebrate together.

UtsavZero explores that possibility through technology.

It brings event discovery, interactive maps, organiser tools, group bookings, digital tickets, geographic information and environmental context into one connected web platform.

The aim is not to replace the traditions people love. It is to help communities discover more ways to celebrate while being mindful of the environment around them.

## 💡 Why UtsavZero

Community celebrations are often shared through posters, social media posts, messaging groups and word of mouth. Information can be scattered, event locations can be difficult to compare, and organisers may have to coordinate registrations and entry using several disconnected tools.

At the same time, people who would like to attend community-led or firecracker-free celebrations may not know what is happening nearby.

UtsavZero explores a more connected approach:

- **Discover:** bring community celebrations into one discoverable platform.
- **Explore:** understand where events are happening through an interactive map.
- **Participate:** make group registration and digital tickets part of the event journey.
- **Organise:** give event hosts tools to publish events and coordinate attendees.
- **Understand:** connect celebrations with locality, geographic and environmental information.

The project is built around the belief that technology can make responsible choices easier to find and act on.

## ✨ What the platform brings together

UtsavZero is designed around three connected experiences.

| Experience | Who it is for | What it helps with |
|---|---|---|
| Public event discovery | Residents and visitors | Discover celebrations, explore locations and participate |
| Organiser workspace | Community and event organisers | Publish events, manage registrations and check in attendees |
| Civic intelligence prototype | Civic-planning and demonstration workflows | Explore localities, geographic features and proposed event zones |

The public and organiser experiences form the central event journey. The civic experience is a prototype concept and should not be interpreted as an official government service.

## 🧭 Platform experiences

### 1. Public portal — residents and visitors

The public experience is intended to make discovering a celebration feel straightforward.

Visitors can use the platform to:

- Browse published community events.
- Switch between event list and map-based exploration.
- Search and filter events using available categories and locality information.
- Open event detail pages.
- Review event descriptions, venue information, schedules and capacity details where provided.
- Follow the supported group-booking flow.
- Access their tickets and booking information.
- Present a digital QR ticket at the event for check-in.

The platform's event-discovery direction focuses on organised, cleaner and firecracker-free festive experiences. Individual event listings should always be checked for their own details and conditions.

### 2. Organiser portal — event hosts

Organisers need more than a form to announce an event. They need a way to manage the event journey.

The organiser experience includes workflows for:

- Accessing an organiser dashboard.
- Creating event listings.
- Adding event descriptions, categories and schedules.
- Entering venue and address information.
- Selecting a location through the map/location workflow.
- Setting event capacity and related details.
- Uploading event imagery where configured.
- Viewing events associated with the organiser account.
- Reviewing registrations.
- Scanning and validating attendee QR tickets.
- Recording successful check-ins and rejecting repeated use of a ticket.

The platform distinguishes private organisers from a proposed government/civic organiser workflow. Any civic authorisation represented in the prototype is simulated unless explicitly connected to a verified official process.

### 3. Civic intelligence portal — prototype

The civic experience explores how locality-level information and geographic features could support event-zone planning.

The codebase includes routes and components for:

- Locality exploration.
- Geographic feature visualisation.
- Proposed event zones.
- Zone applications.
- Authorisation and review screens.
- Civic dashboard information and recent activity.

These workflows are a prototype demonstration. They do not issue legal permissions, represent an official government system or replace statutory approval processes.

## 🔄 How it works

The intended visitor journey can be understood in four steps:

1. **Discover a celebration** — browse events and find something that interests you.
2. **Explore the location** — view the venue and its geographic context on the map.
3. **Plan with your people** — review event information and make a supported group booking.
4. **Attend together** — present the digital ticket and complete check-in at the event.

For organisers, the journey starts with publishing an event, continues through registration management and ends with ticket validation and attendance coordination.

## 🎉 Features

### Event discovery

- Event listing and detail pages.
- Search and category filtering.
- Map and list exploration.
- Locality and venue information.
- Event schedule and capacity information.
- Event imagery and descriptions.

### Event organisation

- Organiser dashboard.
- Event creation and editing workflows.
- Event scheduling and capacity fields.
- Location selection and map interaction.
- Event image upload workflow.
- Organiser-specific event listing.
- Registration management screens.

### Group bookings and tickets

- Group-oriented booking model.
- Booking confirmation experience.
- Digital ticket and QR presentation.
- Ticket retrieval for the signed-in user.
- Organiser-side QR scanning and validation.
- Check-in status and duplicate check-in protection.

### Geographic and civic experience

- Delhi boundary and ward geographic data.
- Locality-oriented exploration.
- Geographic feature visualisation.
- Proposed zone workflows.
- Zone application and decision screens.
- Civic dashboard components.

### Interface and experience

- Responsive Next.js application structure.
- Light and dark theme support.
- Shared navigation and footer.
- Reusable UI components.
- Dedicated resident, organiser and civic areas.

---

## 🌍 Environmental and geographic intelligence

Environmental awareness is a core direction of UtsavZero, not simply a visual theme.

The project includes a geographic and environmental data model intended to connect event locations with information about the surrounding area.

The database architecture includes concepts for:

- Localities.
- Geographic features.
- Air-quality observations.
- Environmental impact estimates.
- Event locations and proposed zones.

This information can help people explore the context around a place and can support future analysis of community events and environmental scenarios.

### Geographic context

The project uses map-based interfaces and geographic datasets to represent Delhi and its local areas. Geographic features can include mapped places and land-use or area features, depending on the source data and import pipeline.

### Air-quality observations

Air-quality observations are intended to provide environmental context. A reading must be interpreted with its source, location and observation time. It should not be presented as a measurement of the impact of one specific event.

### Environmental impact estimates

Impact estimates are modelled or calculated values, not automatically measured outcomes. Any estimate shown by the platform should explain its assumptions, methodology and uncertainty.

**UtsavZero does not claim that a single event, booking or user action produces a measurable city-wide AQI improvement.**

## 🧰 Technology

UtsavZero is built with a modern TypeScript and Next.js stack.

### Frontend

| Technology | Purpose |
|---|---|
| Next.js 16 | Application framework, routing and rendering |
| React 19 | Component-based user interface |
| TypeScript | Type safety and maintainable application code |
| Tailwind CSS 4 | Styling and responsive layouts |
| Lucide React | Interface icons |

### Backend and data

| Technology | Purpose |
|---|---|
| Supabase | Backend platform |
| PostgreSQL | Relational database |
| Supabase Auth | User authentication and sessions |
| Supabase Storage | File and image storage where configured |
| Supabase Row Level Security | Database access policies |
| Supabase database functions | Transactional booking and ticket workflows |
| Supabase Vault | Secret storage for supported database-side operations |

### Maps and geospatial processing

| Technology | Purpose |
|---|---|
| Leaflet | Interactive maps |
| React Leaflet | React integration for Leaflet |
| OpenStreetMap | Geographic source and map ecosystem |
| Turf.js | Geospatial calculations and geometry operations |
| osmtogeojson | OpenStreetMap data conversion |
| Leaflet Geoman | Map drawing and editing interactions |

### Tickets and export

| Technology | Purpose |
|---|---|
| qrcode.react | QR code rendering |
| @zxing/browser | Browser-based QR scanning |
| jsPDF | PDF generation |
| html2canvas-pro | DOM capture for export workflows |

### Object storage integration

The project includes AWS S3 SDK packages for S3-compatible object-storage workflows, including presigned upload support. Configure the relevant credentials and storage provider before using those integrations.

---

## 🏗️ Application architecture

The codebase follows a modular Next.js App Router structure. UI components, data hooks, services, shared contexts and Supabase clients are separated by responsibility.

```text
UtsavZero/
├── data/
│   └── geodata/
│       ├── delhi_boundary.geojson
│       ├── delhi_wards.geojson
│       └── osm/
│           ├── ward-111-classified-preview.geojson
│           ├── ward-111-osm-raw.json
│           └── ward-111-osm.geojson
│
├── public/
│   ├── images/
│   │   └── events/
│   ├── favicon.png
│   ├── UtsavZeroLogo.png
│   └── UtsavZerobgm.png
│
├── scripts/
│   ├── convert-osm-ward.mjs
│   ├── import-all-wards.mjs
│   ├── import-delhi-geodata.mjs
│   ├── import-osm-features-bulk.mjs
│   ├── import-osm-features.mjs
│   ├── import-osm-ward.mjs
│   ├── inspect-osm-features.mjs
│   └── preview-osm-classification.mjs
│
├── src/
│   ├── app/
│   │   ├── about/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── booking/
│   │   ├── civic/
│   │   ├── events/
│   │   ├── government-authorization/
│   │   ├── impact/
│   │   ├── login/
│   │   ├── organizer/
│   │   ├── profile/
│   │   ├── signup/
│   │   └── verify-email/
│   │
│   ├── components/
│   │   ├── civic/
│   │   ├── Events/
│   │   ├── HomeContent/
│   │   ├── hostevents/
│   │   ├── layout/
│   │   └── ui/
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── data/
│   │   └── mockEvents.ts
│   │
│   ├── hooks/
│   │   ├── civic/
│   │   ├── hostevents/
│   │   ├── useBooking.ts
│   │   ├── useEvent.ts
│   │   └── useEventFilters.ts
│   │
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts
│   │       ├── middleware.ts
│   │       └── server.ts
│   │
│   ├── services/
│   │   ├── booking/
│   │   ├── civic/
│   │   ├── events/
│   │   ├── geodata/
│   │   └── hostevents/
│   │
│   ├── types/
│   ├── utils/
│   └── proxy.ts
│
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

### Architectural responsibilities

- **`app/`** — route-level pages, layouts and API route handlers.
- **`components/`** — reusable visual components and feature-specific UI.
- **`context/`** — shared authentication and theme state.
- **`hooks/`** — reusable client-side data and interaction logic.
- **`lib/supabase/`** — browser and server Supabase client configuration.
- **`services/`** — data-access and business-operation modules.
- **`types/`** — shared TypeScript types.
- **`utils/`** — reusable helper functions.
- **`scripts/`** — geographic data import, conversion and inspection utilities.
- **`data/geodata/`** — geographic datasets used by the project.

---

## 🗄️ Database overview

The application uses Supabase PostgreSQL as its data layer.

The current project database design contains 16 principal tables, grouped by responsibility.

| Area | Tables |
|---|---|
| User identity | `profiles`, `user_roles` |
| Organisers | `organizer_profiles` |
| Events | `events`, `saved_events` |
| Bookings and tickets | `bookings`, `tickets`, `ticket_checkins` |
| Geography | `localities`, `geographic_features` |
| Environment | `air_quality_observations`, `impact_estimates` |
| Civic planning | `proposed_zones`, `zone_applications`, `zone_decisions` |
| Auditing | `audit_logs` |

### Important database functions

The booking and check-in workflow includes database functions such as:

- `create_group_booking` — creates a group booking and associated ticket records while applying booking and capacity rules.
- `cancel_group_booking` — handles cancellation of a group booking.
- `check_in_group_ticket` — validates a group ticket and records check-in.

The application also uses a `get_my_tickets` retrieval function in its ticket workflow.

> **Database source of truth:** this README describes the intended/current project architecture. The actual Supabase schema, deployed function definitions, constraints, grants and RLS policies in the connected project are authoritative. Review those definitions before making production changes.

---

## 🎟️ Booking and ticket lifecycle

UtsavZero uses a group-booking model rather than treating every attendee as a completely separate booking.

A typical flow is:

1. A signed-in visitor opens an event.
2. The visitor selects the group size and provides the required booking details.
3. The booking operation validates the event and available capacity.
4. The database creates the booking and associated ticket information.
5. The visitor can retrieve the ticket through the ticket experience.
6. The organiser scans the QR code at the venue.
7. The check-in operation validates the ticket and records attendance.
8. A repeated scan of an already checked-in ticket is rejected.

### Booking versus attendance

A booking indicates that a place was reserved. It does not prove that the attendee arrived.

A successful ticket check-in is the attendance record used by the check-in workflow.

### QR token handling

The ticket workflow was designed around a random QR token, with a hash used for verification and encrypted token storage for ticket retrieval. The encryption secret belongs on the database/server side and must never be exposed to browser code.

The exact deployed implementation, database grants and secret configuration should be audited before production use.

---

## 🔐 Authentication and security

Supabase Auth provides the authentication foundation.

The application includes:

- Email/password sign-up and sign-in.
- Email verification and callback handling.
- Google OAuth sign-in integration.
- Session handling using `@supabase/ssr`.
- Browser and server Supabase clients.
- Role-aware route handling in `src/proxy.ts`.
- Separate resident, organiser and civic experiences.

### Roles represented in the application

The route-protection implementation recognises these role values:

- `citizen`
- `private_organizer`
- `government_organizer`
- `civic_demo_admin`

The exact role assignment and permissions must be maintained in the database and verified against RLS policies and server-side operations.

### Security principles

- Never expose a Supabase service-role key in client-side code.
- Never expose QR encryption secrets to the browser.
- Enforce permissions in database policies and trusted server-side operations.
- Do not treat hidden buttons or frontend route checks as the only security boundary.
- Validate event ownership before organiser operations.
- Validate ticket ownership/organiser authorisation during check-in.
- Keep booking capacity checks inside a safe database transaction.
- Review function execution grants and `SECURITY DEFINER` search paths where applicable.
- Keep private environment files out of Git.

**A successful local build does not by itself establish that a deployment is secure.** Review the live Supabase configuration, RLS policies, function permissions, storage policies and authentication settings before production use.

---

## 🗺️ Delhi geographic data pipeline

Geographic information is an important part of UtsavZero's map-first approach.

The repository contains Delhi boundary and ward datasets, along with OpenStreetMap import and processing scripts.

### Geographic assets

The project includes:

- `data/geodata/delhi_boundary.geojson`
- `data/geodata/delhi_wards.geojson`
- `data/geodata/osm/ward-111-osm-raw.json`
- `data/geodata/osm/ward-111-osm.geojson`
- `data/geodata/osm/ward-111-classified-preview.geojson`

### Import and inspection scripts

The `scripts/` directory includes utilities for:

- Importing Delhi geographic data.
- Importing OpenStreetMap features for a ward.
- Bulk feature import.
- Importing across wards.
- Converting ward data.
- Inspecting imported geographic features.
- Previewing feature classification.

The Ward 111 files are retained as raw, converted and classified examples. The import scripts are intended to support expansion of the geographic dataset. Review their configuration and database target before running a bulk import.

### Safe import practices

Before running a geographic import:

1. Confirm the target Supabase project.
2. Review the script's ward selection and batch settings.
3. Confirm that the target table and expected columns match.
4. Check whether the operation inserts, updates or replaces existing records.
5. Run a small test first.
6. Verify record counts and geometry validity.
7. Keep a recoverable database backup before large imports.

Do not assume that a script is safe to run repeatedly without checking its upsert keys and duplicate-handling behaviour.

---

## 🚀 Getting started

### Prerequisites

- Node.js compatible with the installed Next.js version.
- npm.
- Git.
- A Supabase project.
- Access to the project's required database schema and authentication configuration.

### 1. Clone the repository

```bash
git clone https://github.com/Shreeyanshsahu/UtsavZero.git
cd UtsavZero
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root. See [Environment configuration](#-environment-configuration).

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 5. Create a production build

```bash
npm run build
```

### 6. Run the production server locally

```bash
npm run start
```

The application requires a correctly configured Supabase project for authentication and database-backed features to work. A successful frontend start does not mean the backend has been configured.

---

## ⚙️ Environment configuration

The current browser and server Supabase clients read these public environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Some optional integrations or scripts may require additional configuration depending on which features are enabled. Inspect the relevant source files before adding variables.

Examples of configuration that may be needed for separately enabled workflows include:

- S3-compatible object storage credentials and bucket configuration.
- Server-side upload configuration.
- Geographic data import credentials or database access.
- Any server-only secret used by a database or API integration.

Do not copy secrets into this README or commit them to source control.

### Environment variable rules

- `NEXT_PUBLIC_` variables are exposed to the browser bundle.
- Only values intended to be public should use the `NEXT_PUBLIC_` prefix.
- Service-role keys, private storage credentials and encryption secrets must remain server-side.
- Keep `.env.local` out of Git.
- Rotate any credential that has been accidentally committed or exposed.

---

## 🧪 Available commands

The current `package.json` defines the following scripts:

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

Before considering a change complete, run the production build and test the affected user journey against the configured Supabase project.

---

## 🧩 Application routes

The following route groups are present in the repository structure.

| Route | Purpose |
|---|---|
| `/` | Public homepage |
| `/about` | About UtsavZero and its mission |
| `/impact` | Environmental impact experience |
| `/events` | Event discovery |
| `/events/[eventId]` | Event details |
| `/events/[eventId]/book` | Event booking |
| `/booking/[bookingId]/confirmation` | Booking confirmation |
| `/login` | Sign in |
| `/signup` | Account registration |
| `/verify-email` | Email verification experience |
| `/auth/callback` | Authentication callback |
| `/profile` | Resident profile and ticket experience |
| `/organizer` | Organiser dashboard |
| `/organizer/organize` | Event creation and management |
| `/organizer/registrations` | Registration management |
| `/organizer/check-in` | Ticket check-in |
| `/civic` | Civic dashboard prototype |
| `/civic/localities` | Locality exploration |
| `/civic/zones` | Proposed zone experience |
| `/civic/authorizations` | Civic authorisation prototype |
| `/government-authorization/apply` | Government-role application workflow |

Some routes are protected by the role-aware proxy. Their access depends on authentication and the user's assigned role.

The route table documents code paths, not a guarantee that every route is complete or publicly accessible.

---

## 📍 Current project state

UtsavZero has grown from an initial concept into a substantial working prototype with a Next.js application, Supabase-backed workflows, map components, event organisation tools and a dedicated visual identity.

The repository includes implementations for the central event journey, group booking and ticket check-in, alongside broader civic and environmental concepts.

**Development status: prototype / development currently paused.**

The project is preserved as a development snapshot. Some experiences are implemented, some require further testing, and some remain planned or partially developed. It should not be represented as a fully completed production platform.

### Implemented or present in the codebase

- Next.js App Router application.
- Shared navigation, footer and theme context.
- Public homepage and About page.
- Supabase browser/server client setup.
- Authentication and callback routes.
- Role-aware route handling.
- Event discovery and event detail experiences.
- Event map and location components.
- Organiser dashboard and event creation workflows.
- Group booking services and booking confirmation route.
- Ticket retrieval and QR presentation components.
- Organiser check-in components and service.
- Civic dashboard, locality and zone route groups.
- Delhi boundary and ward geographic data.
- OpenStreetMap geographic import and inspection scripts.

### Areas requiring further verification or development

- Full end-to-end QA across resident, organiser and civic roles.
- Organiser registration management and all edge cases.
- Booking cancellation, capacity race conditions and failure recovery.
- Ticket security and duplicate check-in behaviour under concurrent requests.
- Full RLS and database function permission audit.
- Civic workflows and their role/approval boundaries.
- Environmental data source coverage, freshness and methodology.
- Expansion and validation of geographic features across all Delhi wards.
- Production monitoring, error handling and operational documentation.
- Mobile and browser compatibility testing.

The list is intentionally conservative: a component or route existing in the repository does not prove that every associated workflow is complete, deployed or production-ready.

---

## 🛠️ Known limitations and next steps

If development resumes, the following sequence provides a practical starting point.

### 1. Stabilise the core experience

- Reconfirm Supabase connectivity.
- Test sign-up, email verification, sign-in and sign-out.
- Test the resident journey from event discovery to ticket retrieval.
- Test the organiser journey from event creation to check-in.
- Verify role-based route access.

### 2. Complete booking and ticket QA

- Test events with limited capacity.
- Test concurrent booking attempts.
- Test cancellation and capacity restoration.
- Test invalid, reused and unauthorised QR tokens.
- Verify check-in records and audit information.
- Confirm that booking records and ticket records remain consistent.

### 3. Finish geographic coverage

- Generalise the ward import pipeline.
- Review the import configuration before each bulk run.
- Expand geographic feature coverage across Delhi's wards.
- Validate geometries and classifications.
- Confirm that locality and feature records are correctly related.

### 4. Strengthen environmental intelligence

- Document the source and timestamp for each observation.
- Distinguish observations from estimates.
- Document assumptions used in impact calculations.
- Avoid unsupported claims about pollution reduction.
- Show uncertainty and limitations wherever appropriate.

### 5. Review production readiness

- Audit RLS policies and database function grants.
- Review storage access policies.
- Check authentication redirects and protected routes.
- Verify secret management.
- Add appropriate error monitoring and operational logging.
- Complete responsive and accessibility testing.

---

## 🌿 Responsible use of environmental data

Environmental responsibility requires more than good intentions. It requires careful handling of information and honest communication.

UtsavZero should distinguish clearly between:

- **Observed data:** a reading or record collected from an identified source.
- **Estimated data:** a value calculated using stated assumptions.
- **Simulated data:** a hypothetical scenario used for demonstration.
- **Verified outcomes:** results supported by an appropriate measurement or evaluation process.

These categories are not interchangeable.

For example:

- Event registrations are not the same as attendance.
- Attendance is not proof that a particular amount of pollution was avoided.
- An estimated emissions scenario is not an AQI measurement.
- A nearby air-quality observation does not establish that one event caused a change in air quality.

The goal is to make environmental information useful without overstating what it proves.

---

## 🏫 Project background

| Detail | Information |
|---|---|
| Project name | UtsavZero |
| Institution | Delhi Technological University (DTU) |
| Programme | SEVA FIRST Innovation Challenge 2026 |
| Project category | Community celebrations and environmental intelligence |
| Primary geography | Delhi, India |
| Initial focus | Cleaner and organised Diwali celebrations |
| Frontend | Next.js, React and TypeScript |
| Backend | Supabase and PostgreSQL |
| Maps | Leaflet and OpenStreetMap |
| Repository | [github.com/Shreeyanshsahu/UtsavZero](https://github.com/Shreeyanshsahu/UtsavZero) |

### The thought behind the name

**Utsav** represents celebration, festivity and togetherness.

**Zero** represents the aspiration to move towards zero-pollution celebrations — a direction and a goal, not a claim that the platform has already achieved zero environmental impact.

---

## 🤝 Contributing and feedback

UtsavZero began as an innovation project and remains a work in progress.

If you explore the codebase, build on the idea or suggest improvements, a few principles are worth keeping in mind:

1. Preserve the community-first purpose of the platform.
2. Keep environmental claims transparent and evidence-based.
3. Treat authentication, authorisation and database security as core requirements.
4. Test complete user journeys, not only individual components.
5. Document assumptions and setup requirements so future contributors can continue the work.

For code changes, create a focused branch, explain the purpose of the change and run the relevant checks before merging.

---

## 🙏 Acknowledgements

UtsavZero is built on the work of the open-source community and the tools that make modern web development and geographic exploration possible.

Thank you to the teams and communities behind:

- Next.js and React
- TypeScript and Tailwind CSS
- Supabase and PostgreSQL
- Leaflet and OpenStreetMap
- Turf.js
- The open-source contributors behind the libraries used in this project

And to everyone who believes that technology can help communities find better ways to come together.

---

<p align="center">
  <img src="public/UtsavZeroLogo.png" alt="UtsavZero" width="160" />
</p>

<h2 align="center">UtsavZero</h2>

<p align="center">
  <strong>Celebrate together. Celebrate responsibly.</strong>
</p>

<p align="center">
  <em>A cleaner, brighter Delhi begins with the choices we make together.</em>
</p>
