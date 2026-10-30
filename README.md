<p align="center">
  <img src="public/UtsavZeroLogo.png" alt="UtsavZero Logo" width="180">
</p>

<h1 align="center">UtsavZero</h1>
<p align="center"><strong>Celebrate Together. Breathe Better. Choose UtsavZero.</strong></p>
<p align="center">A map-based celebration discovery and civic event-planning prototype for Delhi.</p>

---

## Overview

UtsavZero is a technology-driven platform being developed as part of the **DTU SEVA innovation challenge**. It aims to make organised, cleaner community celebrations easier to discover and attend, while providing a geospatial planning workflow for a simulated government-authorised event programme.

The platform connects three groups through one shared system:

1. **Citizens** discover events, register and access digital tickets.
2. **Private organisers** create and manage firecracker-free community events.
3. **Government-authorised organisers** use a restricted Civic Intelligence Portal to assess proposed zones and manage simulated public-display events.

The prototype is designed to demonstrate how event discovery, organiser workflows and location intelligence could work together. It does **not** grant legal permission, certify a location as safe, or represent an official government system.

## The problem

During Diwali, residents may find it difficult to discover organised community celebrations and convenient cleaner alternatives. Event information can be scattered across social media, local groups and separate booking channels.

At the same time, planning a large public event requires more than selecting a venue. Planners need to consider location, access, expected attendance, capacity, nearby sensitive places and operational constraints.

UtsavZero explores a shared digital platform that brings event discovery and structured location assessment into one workflow.

## Our solution

UtsavZero has two connected experiences backed by a common data layer.

### 1. Citizen platform

- Discover events through an interactive map and event listings.
- Browse event details, timings, venue and organiser information.
- Register for events and view booking confirmations.
- Access digital tickets with QR codes.
- Explore public firecracker-free events and, in the prototype demonstration, clearly labelled simulated authorised-display events.
- View transparent event and environmental information where supporting data is available.

### 2. Private organiser portal

Private organisers can:

- Create firecracker-free cultural and community events.
- Add venue, date, time, capacity, description and ticket information.
- Manage event listings and registrations.
- Review attendee information for their own events.

Private organisers cannot create or approve government-authorised firecracker displays.

### 3. Government-authorised organiser portal

This restricted portal represents a **simulated civic planning workflow** operated by the UtsavZero team for the prototype.

It is intended to demonstrate how an authorised authority could:

- View a map of proposed event locations and planning zones.
- Select or draw a proposed zone.
- Review location context and available geographic information.
- Check spatial overlap and proximity to mapped sensitive locations.
- Review access, capacity and missing-data indicators.
- Record a human review decision.
- Publish an approved *simulated* event to the citizen platform.
- Monitor registrations and attendance as separate metrics.

A geospatial suitability indicator is decision support only. It is not a safety certificate, legal clearance or substitute for expert assessment and statutory approvals.

## User roles and permissions

| Capability | Citizen | Private organiser | Government-authorised organiser |
|---|:---:|:---:|:---:|
| Browse public events | Yes | Yes | Yes |
| Register/book events | Yes | As attendee | As attendee |
| Create firecracker-free events | No | Yes | Yes, if configured |
| Manage own event registrations | No | Yes | Yes |
| Propose planning zones | No | No | Yes |
| Review geospatial indicators | No | No | Yes |
| Approve simulated public-display events | No | No | Yes |
| Publish simulated authorised events | No | No | Yes |

Role assignment and permissions will ultimately be enforced by the backend, not merely hidden or shown in the frontend.

## Demonstration workflow

1. A government-authorised organiser signs in to the Civic Intelligence Portal.
2. The organiser selects a proposed area or draws a planning zone on the map.
3. The system displays available geographic context, overlap checks, proximity indicators and missing information.
4. The organiser reviews the results and records a simulated decision.
5. The simulated approved event is published to the shared event catalogue.
6. Citizens can discover the event, view its details and register.
7. The organiser can monitor registrations and attendance separately.

**Important legal and safety boundary:** Delhi's current restrictions on firecrackers must be respected. Any firecracker-display workflow in this student prototype is a policy/planning simulation only. It must not be used to organise, advertise as legally permitted, or conduct a real display. A real-world deployment would require confirmation of applicable law, permissions and competent-authority decisions.

## Current implementation

The uploaded codebase currently contains:

- Next.js App Router application using React and TypeScript.
- Responsive homepage and shared navigation/footer.
- Light/dark theme context.
- Event discovery page with search and category filters.
- Leaflet-based interactive event map.
- Event details pages.
- Booking form and review flow.
- Digital ticket and QR-code presentation.
- PDF ticket download.
- Eight sample events in local mock data.

### Current limitations

The current implementation is an early frontend prototype. The following are not yet implemented as production backend capabilities:

- Supabase authentication and role-based access control.
- Persistent database-backed events and bookings.
- Private organiser dashboard.
- Government-authorised organiser portal.
- Zone drawing and geospatial analysis.
- Server-side QR ticket validation and check-in.
- Atomic capacity reservation and duplicate-booking protection.
- Verified attendance reporting.
- Live AQI or validated environmental-impact calculations.

The Impact page exists in the application, but its dashboard functionality is not yet implemented. Sample event data and client-side booking flows should be treated as demonstrations, not live operational records.

## Technology stack

| Layer | Current / planned technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| Maps | Leaflet, React Leaflet, OpenStreetMap |
| Icons | Lucide React |
| QR tickets | qrcode.react |
| PDF tickets | jsPDF, html2canvas-pro |
| Backend (planned) | Supabase |
| Database (planned) | PostgreSQL; PostGIS if available |
| Geospatial analysis (planned) | Turf.js and/or PostGIS |
| Charts (planned) | Recharts |
| Deployment (planned) | Vercel or equivalent |

The current dependencies are defined in `package.json`. Planned technologies are not yet installed or integrated unless stated above.

## Getting started

### Prerequisites

- Node.js (use a current LTS release)
- npm

### Installation

```bash
git clone <your-repository-url>
cd <repository-folder>
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available scripts

```bash
npm run dev     # Start local development server
npm run build   # Create production build
npm run start   # Run production server
npm run lint    # Run ESLint
```

## Project structure

```text
src/
├── app/
│   ├── about/
│   ├── booking/[bookingId]/confirmation/
│   ├── events/
│   │   ├── [eventId]/
│   │   │   └── book/
│   │   └── page.tsx
│   ├── impact/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Events/
│   │   ├── Booking/
│   │   ├── Details/
│   │   ├── Discovery/
│   │   └── Ticket/
│   ├── HomeContent/
│   ├── layout/
│   └── ui/
├── context/
├── data/
├── hooks/
├── types/
└── utils/
```

## Development roadmap

1. **Backend foundation:** database schema, authentication and secure role permissions.
2. **Citizen experience:** persistent events, bookings, saved events and ticket validation.
3. **Private organiser experience:** event creation, editing and registration management.
4. **Civic Intelligence Portal:** restricted dashboard, map layers, proposed zones and review workflow.
5. **Geospatial intelligence:** spatial checks, sensitive-location proximity indicators, capacity/access review and explainable outputs.
6. **Integrated demonstration:** simulated approval, publication to the citizen map, registration and attendance reporting.

## Impact measurement principles

UtsavZero will not claim a specific reduction in Delhi's pollution or AQI without suitable measurements and a defensible methodology.

- Registrations, expected attendance and verified attendance will be reported separately.
- Environmental estimates will disclose their assumptions, data sources and emission factors.
- A change in event attendance or activity is not automatically proof of an equivalent change in ambient AQI.
- A dashboard should distinguish measured values, estimates and illustrative scenarios.

## Mission

To make organised, cleaner celebrations easier to discover and participate in, while exploring how transparent location intelligence can support better-informed public event planning.

## Team

Developed by a student team as part of the **DTU SEVA innovation challenge**.

---

<p align="center"><strong>UtsavZero — Celebrate Together. Breathe Better. Choose UtsavZero. 🌿</strong></p>
