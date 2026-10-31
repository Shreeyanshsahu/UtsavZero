 
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

**UtsavZero** is a community celebration and environmental intelligence platform designed to encourage cleaner, more organised, and environmentally responsible celebrations.

Festivals and community events bring people together, but unorganised celebrations can create challenges such as air and noise pollution, overcrowding, poor event coordination, and limited public awareness of cleaner alternatives.

UtsavZero aims to address these challenges through a unified digital platform where residents can discover community celebrations, organisers can host and manage events, and civic administrators can explore simulated planning and environmental monitoring workflows.

The platform brings together event discovery, organiser management, digital registrations, location-based event exploration, and a proposed civic intelligence system.

## 2. Problem Statement

Community celebrations are often organised through disconnected channels such as social media groups, posters, messaging applications, and local announcements.

This creates several problems:

- **Fragmented information:** Residents struggle to find reliable information about nearby community events.
- **Unorganised event management:** Organisers lack a centralised platform to publish and manage events.
- **Limited accessibility:** People may not know about cleaner, firecracker-free alternatives happening in their locality.
- **Coordination challenges:** Event capacity, registrations, venue information, and attendance are difficult to manage consistently.
- **Limited planning visibility:** There is no unified interface in this project for exploring proposed community-event zones and environmental indicators.

UtsavZero proposes a single platform that connects residents, event organisers, and civic planning workflows.

## 3. Our Solution

UtsavZero provides three interconnected experiences:

### A. Public Portal — For Residents

Residents can discover and explore community celebrations through a centralised interface.

Key capabilities:
- Browse available community events.
- Explore events using map and list views.
- Search and filter events by category and locality.
- View event details, venue, schedule, and available capacity.
- Register for supported events.
- Access digital registration tickets and QR codes.
- Explore organised firecracker-free celebrations.

### B. Organiser Portal — For Event Hosts

The organiser portal provides an interface for creating and managing community events.

Key capabilities:
- Organiser authentication.
- Organiser dashboard.
- Create and publish events.
- Save event drafts.
- Add event descriptions, categories, venues, dates, and capacity.
- Upload event images.
- View and manage created events.
- Track event publication status.

UtsavZero distinguishes between two proposed organiser categories:

**Private Organisers**
- Community groups, societies, clubs, and private event organisers.
- Can host and publish eligible community celebrations.
- Events promoted through the public discovery portal are intended to focus on firecracker-free celebrations.

**Government-Authorised Organisers (Simulated)**
- A proposed restricted organiser category for demonstrating civic event-planning workflows.
- Can simulate the creation of proposed event zones and controlled planning scenarios.
- In the prototype, the development team may act as the simulated authority.
- These workflows are demonstrations only and do not grant legal permissions or represent an actual government system.

### C. Civic Intelligence Portal — For Administrators

The proposed Civic Intelligence Portal explores how location-based planning and environmental indicators could support better-organised community celebrations.

Planned capabilities:
- Locality-based event planning.
- Map-based zone visualisation.
- Simulated event-zone proposals.
- Review and status management for proposals.
- Community-event distribution insights.
- Environmental indicator dashboards.
- Scenario-based comparisons and visual reports.

**Important:** Civic workflows and environmental scenarios are prototype simulations. They must not be interpreted as official government approvals, measured pollution reductions, or live environmental monitoring.

## 4. Core Features

| Feature | Description |
|---|---|
| Event Discovery | Browse and discover community celebrations. |
| Interactive Map | Explore event locations geographically. |
| Search & Filters | Find events by category and locality. |
| Event Details | View event information, venue, timing, and capacity. |
| Organiser Dashboard | Manage events through an organiser interface. |
| Event Creation | Create events with descriptions, images, and schedules. |
| Event Registration | Register for supported community events. |
| Digital Tickets | Generate registration tickets and QR codes. |
| Civic Planning | Demonstrate proposed locality and zone workflows. |
| Environmental Dashboard | Explore simulated environmental indicators. |
| Theme Support | Switch between light and dark themes. |
| Responsive Interface | Support desktop and mobile screen sizes. |

*Feature availability depends on the current implementation. See the development status below.*

## 5. Technology Stack

### Frontend

- **Next.js** — React framework and application routing.
- **React** — Component-based user interface.
- **TypeScript** — Type-safe application development.
- **Tailwind CSS** — Utility-first styling.
- **Lucide React** — Interface icons.

### Backend & Database

- **Supabase** — Backend platform.
- **PostgreSQL** — Relational database.
- **Supabase Auth** — User authentication.
- **Supabase Storage** — File and image storage, where configured.
- **Supabase Row Level Security (RLS)** — Database access control.

### Maps & Location

- **Leaflet** — Interactive maps.
- **React Leaflet** — React integration for Leaflet.
- **OpenStreetMap** — Map tile and geographic visualisation source.

### Tickets & Export

- **qrcode.react** — QR code generation.
- **jsPDF** — PDF generation.
- **html2canvas-pro** — Capturing interface content for export.

## 6. Application Architecture

UtsavZero follows a modular application structure.

```text
UtsavZero/
│
├── public/
│   └── UtsavZeroLogo.png
│
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   ├── (auth)/
│   │   ├── hostevents/
│   │   └── ...
│   │
│   ├── components/
│   │   ├── hostevents/
│   │   │   ├── layout/
│   │   │   └── organize/
│   │   └── ...
│   │
│   ├── context/
│   │
│   ├── lib/
│   │   └── supabase/
│   │       └── client.ts
│   │
│   ├── services/
│   │   └── hostevents/
│   │       └── eventService.ts
│   │
│   └── ...
│
├── .env.local
├── package.json
└── README.md
```

*This is a high-level architectural illustration. Actual folders and routes may differ as development progresses.*

## 7. Authentication & Data Management

Supabase is used as the backend foundation for authentication and database operations.

The application is designed around separate user experiences:

- Residents access the public event discovery experience.
- Organisers access event creation and management features.
- Civic administration features are intended to be restricted and simulated for the prototype.

The organiser event workflow uses the authenticated Supabase user to associate created events with their organiser account.

Database access should be protected through appropriate Row Level Security policies. Users should only be able to access or modify records permitted by their role and ownership.

## 8. Development Status

UtsavZero is currently under MVP development.

The following status distinguishes reported working functionality from planned work.

### Implemented / Reported Working

- [x] Next.js application foundation.
- [x] Responsive public-facing interface.
- [x] Light and dark theme support.
- [x] Event discovery interface.
- [x] Search and category filtering.
- [x] Map and list-based event exploration.
- [x] Event details interface.
- [x] Supabase authentication setup.
- [x] Organiser dashboard interface.
- [x] Event creation workflow.
- [x] Organiser event listing and refresh after creation.
- [x] Demo registration and ticket interface.
- [x] QR code generation for demo tickets.
- [x] PDF ticket export.

### In Progress / Requires Final Verification

- [ ] Verify event draft and publish persistence.
- [ ] Verify database schema and organiser ownership policies.
- [ ] Persist event coordinates from map-based location selection.
- [ ] Connect public discovery to published Supabase events.
- [ ] Persist resident registrations in the database.
- [ ] Implement a reliable My Tickets experience.
- [ ] Validate capacity and duplicate registrations.
- [ ] Complete end-to-end testing across resident and organiser flows.

### Planned

- [ ] Secure QR ticket verification.
- [ ] Attendance and check-in management.
- [ ] Restricted simulated civic administration portal.
- [ ] Interactive locality and planning-zone workflows.
- [ ] Environmental intelligence dashboard.
- [ ] Scenario-based environmental impact indicators.
- [ ] Integration with suitable public environmental datasets.
- [ ] Advanced geospatial analysis.

## 9. Environmental Responsibility

Environmental responsibility is a central principle of UtsavZero.

The platform promotes organised, firecracker-free community celebrations and aims to make cleaner alternatives easier to discover.

The proposed environmental intelligence module may explore indicators such as:

- Event distribution across localities.
- Participation in organised community celebrations.
- Hypothetical pollution scenarios.
- Estimated environmental impact under clearly defined assumptions.

Any estimates must be labelled as estimates or simulations. They are not direct measurements of pollution avoided or proof of changes in air quality.

Future integrations with public environmental data sources may support more informed environmental analysis.

## 10. Installation & Local Development

### Prerequisites

Make sure you have:

- Node.js installed.
- npm installed.
- Git installed.
- A Supabase project for backend functionality.

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

Add the Supabase credentials required by the application:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Use the exact environment variable names expected by your Supabase client configuration. Never commit secret service-role keys or other private credentials.

### Run the development server

```bash
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

### Build for production

```bash
npm run build
```

## 11. Project Objectives

The primary objectives of UtsavZero are:

1. Make community celebrations easier to discover.
2. Encourage participation in organised, firecracker-free events.
3. Provide organisers with a centralised event-management platform.
4. Improve visibility of event locations and schedules.
5. Demonstrate how geospatial planning interfaces could support civic decision-making.
6. Explore environmental indicators that can inform more responsible community celebrations.

## 12. Future Scope

UtsavZero can be extended into a broader community-event and civic-planning ecosystem.

Potential future improvements include:

- Verified organiser accounts and role-based permissions.
- Real-time event capacity and registration management.
- Secure QR-based event check-in.
- Advanced geospatial analysis using PostGIS.
- Locality-level event planning and analytics.
- Integration with verified public environmental datasets.
- Accessibility improvements and multilingual support.
- Analytics for organisers and community administrators.

## 13. Important Disclaimer

UtsavZero is an independent prototype developed for demonstration and innovation purposes.

It is not an official government platform, does not issue legal permissions, and does not authorise the use of firecrackers.

Any government-authorised organiser workflow, event-zone proposal, civic approval, or environmental impact dashboard shown in the prototype is simulated unless explicitly connected to a verified official source.

The platform's public event discovery concept focuses on organised, firecracker-free celebrations.

## 14. Team

**Project:** UtsavZero

**Institution:** Delhi Technological University (DTU)

**Challenge:** SEVA FIRST Innovation Challenge 2026

| Role | Responsibility |
|---|---|
| Project Lead & MVP Developer | Product architecture, frontend and backend development, integration, and MVP delivery. |
| Research & Documentation | Problem research, user needs, domain research, and documentation. |
| Testing & Validation | Feature testing, workflow validation, usability feedback, and issue reporting. |

## 15. Contributing

This project is currently being developed as an MVP for the DTU SEVA FIRST Innovation Challenge 2026.

Suggestions, feedback, and ideas for improving community-event organisation and environmental awareness are welcome.

## 16. Project Repository

GitHub: https://github.com/Shreeyanshsahu/UtsavZero

---

<p align="center">
  <strong>UtsavZero — Celebrate Together. Celebrate Responsibly.</strong>
</p>

<p align="center">
  Building cleaner celebrations and smarter communities.
</p>
