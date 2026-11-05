# UTSAVZERO — PROJECT HANDOFF
## November 5, 2026 — Intelligence-First Development Handoff

**Project:** UtsavZero  
**Challenge:** DTU SEVA FIRST Innovation Challenge 2026  
**Project Lead:** Solo developer  
**Primary Geography:** Delhi, India  
**Repository:** https://github.com/Shreeyanshsahu/UtsavZero  
**Local Project:** `/Users/shreeanshsahu/Desktop/WEB_DEV/utsavzero`  
**Development Branch:** `main` (verify current branch before committing)  
**Current Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Leaflet, Supabase, PostgreSQL, PostGIS  
**Handoff Date:** November 5, 2026  
**Remaining Development Window:** November 6, November 7 and part of November 8, 2026.

---

# 1. EXECUTIVE SUMMARY

UtsavZero is an AI-assisted geospatial and environmental intelligence platform designed to support better-informed planning of community celebrations.

Its central innovation is the integration of two kinds of intelligence:

1. **Locality Intelligence:** Understand the geographical characteristics of a ward and identify, compare and evaluate potential open-space locations for organised community celebrations.
2. **Environmental Intelligence:** Understand historical air-quality conditions, especially around Diwali, analyse available environmental observations and evaluate transparent environmental scenarios.

The two intelligence systems must work together.

The system should not simply show an AQI graph or a map containing hospitals and roads. It should combine these datasets to generate a structured understanding of a particular locality.

An AI interpretation layer should then transform the analytical results into a human-readable intelligence report that explains:

- What the system discovered.
- Which data and calculations support each finding.
- Which geographical or environmental problems exist.
- Which candidate locations deserve further consideration.
- Why one candidate differs from another.
- What mitigation measures could be considered.
- What additional information is required before making a decision.
- What the limitations and confidence of the analysis are.

A human decision-maker reviews the evidence and makes the final decision.

**The central product is the Spatial Intelligence Engine.** Event discovery, civic workflows and public information pages support this central product; they must not replace it.

## Core product statement

UtsavZero combines locality-level geospatial analysis, historical environmental intelligence and AI-assisted interpretation to identify and compare potential community-event locations, explain environmental and geographical considerations, and generate evidence-backed planning reports for human decision-makers.

The public-facing platform connects this intelligence with organised, firecracker-free community celebrations.

---

# 2. IMPORTANT PRODUCT DIRECTION CHANGE

The previous development direction was becoming too focused on:

- Creating zone forms.
- Saving zone applications.
- Building administrative tables.
- Creating approval and rejection buttons.
- Building ordinary CRUD dashboards.

These are supporting capabilities, not the central innovation.

The project direction is now explicitly intelligence-first.

## What we are actually building

The system should answer two important questions.

### Question A — Locality Intelligence

Which geographical locations within a selected ward have characteristics that make them worth considering for an organised public celebration?

The engine should discover candidate locations using available geographical data, examine their surrounding infrastructure, identify possible conflicts and compare the candidates.

### Question B — Environmental Intelligence

How have environmental conditions varied across Delhi, particularly during historical Diwali periods, and what do those observations imply for environmental planning scenarios?

The engine should analyse historical AQI and pollutant observations, monitoring-station coverage, meteorological context and research-supported environmental information.

### Combined intelligence

The two reports are combined into a single structured intelligence package.

An AI model interprets the package and produces a locality-specific report with:

- Geographic findings.
- Environmental findings.
- Candidate comparisons.
- Potential problems.
- Evidence-backed recommendations.
- Mitigation possibilities.
- Scenario comparisons.
- Missing-data warnings.
- Confidence and limitations.

**Do not build two disconnected dashboards. Build two analytical modules that feed one intelligence and reporting pipeline.**

---

# 3. CURRENT DEVELOPMENT STATUS

## 3.1 Existing frontend and product foundation

The following work was previously implemented and reported working:

- Next.js / React / TypeScript frontend.
- Responsive homepage and navigation.
- Light and dark themes.
- Event discovery page.
- Search and category filters.
- Leaflet map with synchronised map/list selection.
- Event detail pages.
- Booking UI and attendee validation.
- Booking review and confirmation flow.
- Digital ticket UI.
- QR code generation for demo bookings.
- PDF ticket download.
- Demonstration event data.

These existing pages must be preserved.

Do not rewrite working public pages merely to accommodate the intelligence engine.

## 3.2 Database foundation

Existing Supabase tables:

- `air_quality_observations`
- `audit_logs`
- `bookings`
- `events`
- `geographic_features`
- `impact_estimates`
- `localities`
- `organizer_profiles`
- `profiles`
- `proposed_zones`
- `saved_events`
- `ticket_checkins`
- `tickets`
- `user_roles`
- `zone_applications`
- `zone_decisions`

Existing database functions:

- `cancel_group_booking`
- `check_in_group_ticket`
- `create_group_booking`

Existing PostGIS and civic functionality:

- PostGIS installed in the `extensions` schema.
- `localities.boundary_geom` contains ward geometries.
- `geographic_features.geometry_geom` contains imported feature geometries.
- Existing JSONB geometry fields are preserved.
- 290 Delhi ward boundaries imported.
- 159,013 geographic features imported.
- GiST indexes created on geometry columns, as previously reported.
- An expression index on geography was attempted; verify its existence before relying on it.

## 3.3 Geographic dataset

Imported features:

| Feature type | Imported count |
|---|---:|
| Hospitals | 671 |
| Schools | 1,301 |
| Residential areas | 3,607 |
| Roads | 153,434 |
| **Total** | **159,013** |

The dataset includes:

- 290 ward localities.
- Hospital points and polygons.
- School points and polygons.
- Residential-area polygons.
- Road geometries.

Source provenance and completeness should be preserved and displayed where available.

Important: the existing OSM data does not automatically provide a complete, authoritative inventory of public parks, available event venues or legally usable open spaces. Candidate discovery will require careful interpretation and potentially additional data.

## 3.4 Spatial assessment implementation

The following is currently working:

- Ward selection through the locality ID.
- Ward boundary loading.
- Interactive Leaflet polygon drawing.
- Polygon editing.
- Polygon validation.
- Ward containment checking.
- PostGIS area calculation.
- Nearby feature discovery.
- Cross-ward infrastructure searches.
- Distance calculation.
- Nearby feature counts.
- Sorted feature details.
- Warnings and data limitations.
- Civic-admin authorization check.

The RPC function is:

`public.assess_proposed_zone(uuid, jsonb)`

It performs:

- Civic role verification.
- GeoJSON validation.
- Polygon and MultiPolygon validation.
- Ward retrieval.
- `ST_Covers` ward containment validation.
- Nearby feature queries.
- Distance calculations.
- Structured JSON output.

The function uses a geometry bounding-box operator with explicit schema qualification:

```sql
gf.geometry_geom OPERATOR(extensions.&&) v_search_bounds
```

This was necessary because the function uses an empty search path.

The query timeout was addressed by narrowing candidates using spatial bounding boxes before exact distance calculations.

**Do not casually rewrite this working function.** Preserve its authorization, validation and response contract.

## 3.5 Current frontend assessment page

Current file:

`src/app/civic/zones/page.tsx`

The page currently supports:

- Ward selection.
- Map loading.
- Polygon drawing.
- Geometry validation.
- Assessment request.
- Area display.
- Nearby feature counts.
- Nearby feature details.
- Distance labels.
- Warnings.

This is the first spatial-analysis interface, not the finished intelligence engine.

## 3.6 Remaining verification

Before building new functionality, perform only a brief verification:

1. Confirm the project builds.
2. Confirm the current spatial assessment still works.
3. Confirm the actual search radii in the installed SQL function.
4. Confirm the expression geography index if needed.
5. Confirm the current repository branch and working tree.

Do not repeat the full database audit or re-import the geographic dataset.

---

# 4. THE NEW CENTRAL ARCHITECTURE

The intelligence engine should have five layers.

## Layer 1 — Data ingestion

Gather and organise:

### Geographic information

- Ward boundaries.
- Open-space and park geometries, where available.
- Hospitals.
- Schools.
- Residential areas.
- Roads.
- Emergency-access context, where available.
- Population context with source and date.
- Existing events.
- Proposed zones.

### Environmental information

- Historical AQI observations.
- PM2.5 measurements.
- PM10 measurements.
- Other pollutant observations where available.
- Monitoring station location and metadata.
- Observation timestamps.
- Weather information.
- Wind speed and direction where available.
- Temperature and humidity where available.
- Historical Diwali-period observations.

Every environmental record should retain:

- Source.
- Station ID.
- Measurement timestamp.
- Pollutant.
- Unit.
- Value.
- Geographic location.
- Data coverage and quality information.

Do not silently combine incompatible measurements or different station types.

## Layer 2 — Locality Intelligence Engine

Responsible for geographical analysis.

Required capabilities:

1. Ward geographical profile.
2. Candidate open-space discovery.
3. Candidate location comparison.
4. Nearby hospital and school analysis.
5. Residential-area proximity.
6. Road connectivity context.
7. Spatial overlap detection.
8. Existing event proximity.
9. Proposed-zone conflict detection.
10. Candidate area calculation.
11. Missing geographic information.
12. Explainable component-level indicators.

The engine should eventually identify candidate locations automatically rather than requiring the administrator to manually draw every possible candidate.

For the first prototype, use a selected ward and a manageable number of candidate locations.

Candidate identification must use defensible geometry and source information. Do not treat every empty-looking map area as an available public venue.

## Layer 3 — Environmental Intelligence Engine

Responsible for historical and scenario-based environmental analysis.

Required capabilities:

1. Historical air-quality data collection.
2. Monitoring station coverage analysis.
3. Pre-Diwali, Diwali and post-Diwali comparisons.
4. PM2.5 and PM10 trend analysis.
5. Comparison between available monitoring locations.
6. Historical variation across selected periods.
7. Meteorological context where available.
8. Data completeness assessment.
9. Scenario-based emissions calculations when validated emission factors are available.
10. Environmental limitations and uncertainty.

The engine must distinguish:

- Measured environmental observations.
- Historical statistical summaries.
- Modelled emissions.
- Hypothetical scenario assumptions.

AQI is not a direct measure of emissions from one locality.

A monitoring station reading describes ambient conditions at that station and time. It does not prove which particular locality or activity caused those conditions.

## Layer 4 — Combined Intelligence and AI Interpretation

This is the main innovation layer.

The two analytical engines produce structured results.

Those results are assembled into a single intelligence package containing:

- Ward profile.
- Environmental profile.
- Candidate location profiles.
- Infrastructure distances.
- Spatial conflict results.
- Historical AQI summaries.
- Meteorological information.
- Scenario calculations.
- Data provenance.
- Missing-data warnings.
- Confidence limitations.

The AI model receives this structured information and generates an understandable report.

The AI must not invent:

- AQI measurements.
- Emissions factors.
- Distance calculations.
- Available open spaces.
- Population numbers.
- Legal permissions.
- Safety thresholds.
- Scientifically supported duration or activity limits.

All numerical analysis must originate from deterministic calculations or traceable source data.

AI is responsible for interpretation, explanation, comparison and report writing.

## Layer 5 — Human decision interface

A government-style decision-maker interface should show:

- Combined intelligence report.
- Candidate location comparison.
- Interactive map.
- Environmental charts.
- Geographical findings.
- Potential problems.
- Recommended mitigation.
- Missing evidence.
- Data sources.
- Decision history.

The human decision-maker remains responsible for the final decision.

---

# 5. ENVIRONMENTAL SCENARIO MODELLING

The original concept includes exploring different hypothetical event-activity scenarios.

We should retain this as a dedicated analytical capability.

## 5.1 Required scenario parameters

Where defensible inputs exist:

- Activity quantity.
- Product category.
- Compatible pollutant-specific emission factors.
- Event duration.
- Scenario assumptions.
- Meteorological context.
- Location.
- Alternative activity scenarios.

## 5.2 Emissions equation

For a pollutant-specific inventory:

\[
E_p = \sum_{i=1}^{n} Q_i \times EF_{i,p}
\]

Where:

- \(Q_i\): amount of activity or product.
- \(EF_{i,p}\): compatible emission factor for pollutant \(p\).
- \(E_p\): estimated emissions of pollutant \(p\).

A scenario comparison may calculate:

\[
E_{\text{difference}} =
E_{\text{baseline}} - E_{\text{alternative}}
\]

Only calculate numerical results when compatible factors and activity quantities are supported.

## 5.3 Important distinction

An emissions inventory is not an AQI prediction.

A pollutant emission estimate is not automatically a measure of local human exposure.

A modelled result is not a scientifically established safe upper limit.

The system may compare hypothetical activity scenarios and disclose their assumptions. It must not invent a safe fireworks tonnage, duration or schedule from historical AQI alone.

Timing analysis can examine historical environmental conditions and available meteorological data, but must not claim that a particular time is environmentally safe without a validated methodology.

For the Delhi prototype, any fireworks scenario must remain a clearly identified, non-operational policy simulation consistent with the current legal restrictions documented in the Project Bible.

The public-facing event experience should continue focusing on firecracker-free community celebrations.

---

# 6. AI INTELLIGENCE REPORT

This is the central output and should receive significant attention.

## 6.1 Report structure

### Section A — Executive Summary

- Ward name.
- Geographic overview.
- Environmental overview.
- Number of candidate locations assessed.
- Main findings.
- Overall data completeness.

### Section B — Environmental Intelligence

- Historical AQI context.
- PM2.5 and PM10 observations.
- Diwali-period comparisons.
- Monitoring station coverage.
- Meteorological context.
- Environmental trends.
- Important limitations.

### Section C — Geographical Intelligence

- Ward boundary and area.
- Open-space candidate inventory.
- Hospital proximity.
- School proximity.
- Residential context.
- Road and access information.
- Existing event distribution.
- Spatial conflicts.
- Missing geographical data.

### Section D — Candidate Comparison

For every candidate:

- Candidate location.
- Geometry and area.
- Nearby infrastructure.
- Environmental context.
- Potential advantages.
- Potential concerns.
- Missing information.
- Reasons for its assessment.

### Section E — Combined Intelligence Interpretation

Explain how environmental and geographic findings interact.

For example:

A candidate may have substantial open space and good road connectivity, but its surrounding residential context and historical environmental conditions may justify additional investigation.

The report must explain the specific evidence supporting that conclusion.

### Section F — Recommended Actions

Possible recommendations:

- Compare an alternative candidate.
- Obtain additional site surveys.
- Investigate emergency access.
- Consider traffic-management arrangements.
- Examine public transport access.
- Consider monitoring requirements.
- Compare alternative celebration formats.
- Evaluate lower-activity environmental scenarios where relevant.

Recommendations must be tailored to actual findings.

Do not recommend traffic restrictions as if they cancel out fireworks emissions. Different sources and mitigation measures must remain separate.

### Section G — Scenario Analysis

- Baseline assumptions.
- Alternative assumptions.
- Modelled outputs.
- Sensitivity analysis.
- Uncertainty.
- Limitations.

### Section H — Evidence and Sources

Every important finding should identify:

- Source dataset.
- Source date.
- Relevant measurement or calculation.
- Method.
- Limitations.

### Section I — Decision Record

- Human decision.
- Reason.
- Supporting evidence.
- Timestamp.
- Review status.

## 6.2 AI output requirements

The AI should return structured JSON rather than unstructured prose alone.

Suggested output structure:

```json
{
  "executive_summary": "",
  "environmental_findings": [],
  "geographical_findings": [],
  "candidate_comparisons": [],
  "key_concerns": [],
  "recommendations": [],
  "scenario_interpretation": [],
  "data_gaps": [],
  "confidence_notes": [],
  "sources_used": [],
  "limitations": []
}
```

Use schema validation before rendering the report.

Keep source references attached to the findings so the report can be audited.

The AI should never be allowed to invent data that is missing from the input.

---

# 7. TWO NEW PUBLIC-FACING PAGES

In addition to the intelligence portal, we must create two important pages.

These are separate from the restricted civic interface.

## PAGE 1 — ABOUT UTSAVZERO

Suggested route:

`/about`

Purpose:

Explain the mission, problem, proposed solution, technology, intelligence concept and project methodology.

### Suggested sections

**1. Hero**

Title:

"Reimagining How Delhi Celebrates."

Description:

"UtsavZero connects community celebrations with geospatial and environmental intelligence to support more informed, organised and responsible celebrations."

**2. The Problem**

Explain:

- Diwali-related air-quality concerns.
- Difficulty discovering organised community alternatives.
- Fragmented event information.
- Lack of connected geographical and environmental planning information.

**3. Our Vision**

A platform where:

- Citizens discover organised celebrations.
- Organisers manage community events.
- Planners understand locality-level geography.
- Environmental data informs planning scenarios.
- AI turns complex evidence into understandable reports.

**4. How UtsavZero Works**

Show the complete flow:

Data Collection → Spatial Analysis → Environmental Analysis → AI Interpretation → Human Decision → Community Participation.

**5. Our Innovation**

Explain:

- Locality intelligence.
- Environmental intelligence.
- Combined spatial and environmental interpretation.
- Evidence-backed recommendations.
- Transparent scenario analysis.

**6. Technology**

Show the actual stack:

- Next.js.
- React.
- TypeScript.
- Leaflet.
- Supabase.
- PostgreSQL.
- PostGIS.
- Python, if implemented.
- AI model integration, if implemented.

Do not claim technologies or capabilities that are only planned.

**7. Mission and Responsible Innovation**

Mission:

"Zero pollution of Delhi" as an aspirational mission.

Explain that UtsavZero does not claim to directly reduce AQI or replace statutory authorities.

**8. Research and Sources**

Show selected research and official sources.

Use real citations and links rather than fabricated research references.

## PAGE 2 — IMPACT DASHBOARD

Suggested route:

`/impact`

Purpose:

Show what UtsavZero aims to achieve, what the current prototype can demonstrate, and what potential outcomes can be explored through transparent scenarios.

This page is important for the innovation challenge presentation.

### Section A — Impact Overview

Show cards such as:

- Community events listed.
- Total registrations.
- Event capacity.
- Verified attendance, when available.
- Geographic wards represented.
- Candidate locations analysed.
- Environmental observations available.

Do not confuse registrations with attendance.

If values are demonstration data, label them clearly.

### Section B — Environmental Intelligence

Charts:

1. Historical AQI trend.
2. PM2.5 trend.
3. PM10 trend.
4. Pre-Diwali versus Diwali versus post-Diwali comparison.
5. Monitoring station coverage.

Every chart should show:

- Pollutant or metric.
- Unit.
- Station or area.
- Date range.
- Data source.
- Whether the values are measured or modelled.

### Section C — Event Participation

Charts:

- Event capacity versus registrations.
- Registrations by event.
- Participation by locality.
- Attendance versus registrations, when verified check-in data exists.

A simple attendance scenario may be calculated as:

\[
\hat A = \min(C,R \times r)
\]

Where:

- \(C\): event capacity.
- \(R\): registrations.
- \(r\): historical or explicitly assumed attendance conversion rate.

If no verified history exists, label the result as a scenario estimate.

### Section D — Spatial Coverage and Planning

Show:

- Number of wards represented.
- Candidate locations assessed.
- Event distribution by ward.
- Geographic coverage.
- Localities with fewer organised event options.
- Spatial concentration indicators.

Do not imply that every locality without an event is underserved without considering population, accessibility and available alternatives.

### Section E — Environmental Scenario Simulator

Allow users to compare transparent hypothetical scenarios.

Potential controls:

- Baseline activity assumption.
- Reduced activity assumption.
- Alternative celebration scenario.
- Duration as a scenario parameter.
- Traffic-management assumption.
- Available emissions factors.

Outputs:

- Modelled emissions under each scenario, if factors are available.
- Difference between scenarios.
- Assumption sensitivity.
- Data confidence and limitations.

Do not display unsupported pollution reduction percentages or invented emissions savings.

### Section F — Potential UtsavZero Outcomes

Present potential outcomes as objectives, not proven results:

- More organised community celebration options.
- Better visibility of local event opportunities.
- More informed locality-level planning.
- Better understanding of environmental trends.
- More transparent decision-making.
- Improved data collection around participation and attendance.
- Evidence-based environmental scenario exploration.

### Section G — Impact Methodology

Explain the difference between:

- Measured environmental observations.
- Event registrations.
- Verified attendance.
- Modelled emissions.
- Hypothetical scenarios.
- Actual measured outcomes.

This section is important for credibility.

---

# 8. THREE-DAY DEVELOPMENT PLAN

**Hard constraint:** November 6, November 7 and part of November 8 are the only remaining development days.

November 8 is Diwali, so development time will be limited.

We need to prioritise a complete, demonstrable product over unfinished advanced features.

## NOVEMBER 6 — SPATIAL INTELLIGENCE + ENVIRONMENTAL DATA FOUNDATION

**Primary objective:** Build the first integrated intelligence package for one ward.

### Task 1 — Inspect the existing repository

- Inspect current civic zones page.
- Preserve working spatial assessment.
- Check current database schema.
- Check AQI data availability.
- Check current project build.

Do not repeat completed geographic imports.

### Task 2 — Candidate location discovery

Implement the first usable version of candidate location discovery.

Priority:

- Identify candidate open-space or park geometries from available geographic data.
- Validate candidate geometries.
- Associate candidates with wards.
- Calculate candidate areas.
- Analyse nearby infrastructure.
- Generate a candidate comparison dataset.

If suitable open-space data is missing, identify the data gap rather than inventing candidates.

### Task 3 — Environmental data foundation

Inspect existing `air_quality_observations`.

Determine:

- Whether usable historical observations exist.
- What pollutants are represented.
- Whether station IDs and timestamps exist.
- Whether source metadata is available.
- Whether Diwali-period observations can be compared.

If the table lacks useful data, retrieve a manageable, source-attributed historical dataset from a suitable public source.

Prioritise one usable comparison rather than an incomplete city-wide pipeline.

### Task 4 — Combined intelligence JSON

Create a structured output for one ward containing:

- Ward profile.
- Environmental profile.
- Candidate locations.
- Nearby infrastructure.
- Spatial findings.
- Environmental observations.
- Missing-data warnings.

### Expected November 6 outcome

A selected ward produces a structured intelligence package containing both geographical and environmental information.

## NOVEMBER 7 — INTELLIGENCE REPORT + IMPACT PAGE

**Primary objective:** Make the intelligence understandable and demonstrable.

### Task 1 — AI interpretation

- Integrate an available LLM API if credentials and access are available.
- Create a structured prompt.
- Provide only calculated and sourced data.
- Validate the returned JSON.
- Render the report in the civic portal.

If live AI integration cannot be completed reliably, implement a deterministic report generator as a fallback. Do not let the project fail because an external API is unavailable.

### Task 2 — Candidate comparison interface

Show:

- Candidate location map.
- Candidate area.
- Nearby infrastructure.
- Environmental context.
- Potential concerns.
- Advantages.
- Missing data.

### Task 3 — Impact page

Create `/impact`.

Prioritise:

1. Historical environmental charts.
2. Pollutant comparison.
3. Participation statistics.
4. Spatial coverage.
5. Transparent scenario comparison.
6. Potential outcomes.

### Task 4 — About page

Create `/about`.

Use the actual project vision and explain the integrated intelligence architecture.

### Expected November 7 outcome

The project has:

- One integrated intelligence report.
- A working candidate comparison interface.
- An Impact Dashboard.
- An About page.

## NOVEMBER 8 — DIWALI / FINAL HALF-DAY

**Primary objective:** Stabilise and prepare the final demonstration.

### Task 1 — Integration testing

Test:

- Homepage.
- Event discovery.
- Event details.
- Booking.
- Tickets.
- Civic login.
- Ward selection.
- Spatial assessment.
- Intelligence report.
- About page.
- Impact page.

### Task 2 — UI and presentation polish

- Fix visible layout problems.
- Check mobile responsiveness.
- Check light and dark themes.
- Add loading and empty states.
- Make data source labels visible.
- Make simulated data unmistakable.

### Task 3 — Deployment and demo preparation

- Confirm production build.
- Verify Vercel deployment.
- Check environment variables without exposing secrets.
- Prepare demo data.
- Prepare demonstration flow.
- Capture screenshots.
- Finalise presentation and documentation.

### Expected November 8 outcome

A stable, demonstrable UtsavZero prototype with the core intelligence concept visible.

---

# 9. STRICT PRIORITY RULES

Because the development window is extremely short, follow these rules.

## P0 — Must complete

- Preserve current working application.
- Candidate location discovery for one ward.
- Environmental data analysis for one ward.
- Combined intelligence package.
- Human-readable intelligence report.
- About page.
- Impact page.
- Build and deployment verification.

## P1 — Complete if time permits

- Candidate ranking with explainable components.
- More historical AQI comparisons.
- Scenario comparison chart.
- AI-generated report export.
- Improved event distribution map.
- Additional ward support.

## P2 — Defer

- Advanced machine-learning forecasting.
- Validated atmospheric dispersion simulation.
- Fully automated analysis of all 290 wards.
- Real government integrations.
- Complex approval workflows.
- Extensive application management.
- Production-scale AI infrastructure.
- Scientifically validated fireworks activity limits.
- Large new database migrations without an immediate need.

**Do not sacrifice the integrated intelligence report to finish administrative CRUD features.**

---

# 10. TECHNICAL IMPLEMENTATION RULES

1. Preserve the existing Next.js architecture.
2. Do not introduce another frontend framework.
3. Reuse Supabase and PostGIS.
4. Use the existing geographic dataset.
5. Avoid unnecessary table creation.
6. Inspect current schemas before modifying them.
7. Do not change RLS to bypass errors.
8. Do not expose Supabase secret/service-role keys in frontend code.
9. Keep AI API keys server-side.
10. Keep numerical calculations outside the LLM.
11. Validate all AI-generated structured output.
12. Maintain source and timestamp metadata.
13. Keep measured, modelled and simulated data separate.
14. Avoid arbitrary suitability weights without explanation.
15. Do not represent an analytical indicator as a safety certification.
16. Avoid long, unverified SQL scripts.
17. Work in small, independently testable steps.
18. Run a build after major integration changes.
19. Commit working milestones frequently.
20. Never rewrite a working feature without a concrete reason.

---

# 11. DATA AND SCIENTIFIC RESPONSIBILITY

UtsavZero must follow the principles established in its Project Bible.

### Environmental data

AQI is a measure of ambient air quality, not direct proof of emissions from a specific locality.

A station reading should retain its location, time, pollutant and source.

### Historical comparisons

Comparisons should use clearly defined time windows and comparable measurements.

### Spatial data

OSM data may be incomplete, outdated or incorrectly classified.

A mapped road does not prove emergency access.

A mapped open area does not prove public ownership or permission to host an event.

### Population

Census 2011 population context must be labelled as historical, not current 2026 population.

### AI reporting

The AI should explain the data and its limitations.

It must not invent missing measurements, distances or confidence values.

### Fireworks policy

Delhi's current restrictions must be respected.

The fireworks component remains a hypothetical, non-operational policy simulation unless applicable law changes and competent authorities grant the necessary permissions.

The public-facing platform focuses on lawful firecracker-free celebrations.

### Impact claims

Do not claim that UtsavZero has reduced Delhi AQI.

Do not convert registrations into verified attendance.

Do not convert attendance into avoided fireworks activity.

Do not claim modelled emissions reductions without validated assumptions and factors.

---

# 12. FINAL DEMONSTRATION SCENARIO

The prototype should ideally demonstrate the following flow.

1. Open UtsavZero.
2. Explain the environmental problem and project mission through the About page.
3. Open the Impact Dashboard.
4. Show historical AQI and pollutant trends.
5. Show community participation and geographical coverage.
6. Open the restricted Civic Intelligence Portal.
7. Select one Delhi ward.
8. Generate or load its geographical profile.
9. Discover candidate locations.
10. Inspect nearby hospitals, schools, residential areas and roads.
11. Load the environmental profile for the locality.
12. Combine both reports.
13. Generate the AI-assisted intelligence report.
14. Compare candidate locations.
15. Read the problems, recommendations and missing evidence.
16. Show a transparent environmental scenario comparison.
17. Explain that the human decision-maker remains responsible for any final decision.

The demo should clearly distinguish actual source data from illustrative and simulated data.

---

# 13. DEFINITION OF SUCCESS

By the end of November 8, UtsavZero should be able to demonstrate:

- A functioning public celebration platform.
- A working geospatial foundation.
- A selected ward's geographical profile.
- Candidate location discovery or a clearly labelled candidate dataset where discovery data is incomplete.
- Nearby infrastructure analysis.
- Historical environmental information for the selected locality where data is available.
- Combined spatial and environmental intelligence.
- An understandable intelligence report.
- Evidence-backed recommendations and limitations.
- An Impact Dashboard with charts and scenario explanations.
- An About page that communicates the original vision.
- A stable build and deployment.

The prototype does not need to prove that every candidate is safe, predict Delhi's AQI accurately or establish a scientifically validated fireworks limit.

It needs to demonstrate that the integrated intelligence workflow is technically credible, transparent and useful.

---

# 14. FINAL DEVELOPMENT INSTRUCTION

The most important instruction for the next development session:

**Do not start by building another form or administrative dashboard.**

Start by inspecting the current `air_quality_observations` table and determining what environmental data is actually available.

Then build the first combined intelligence package for one selected ward using the already imported geographical dataset.

The first milestone is:

**One ward → Geographic analysis + Environmental analysis → Combined structured intelligence → Human-readable report.**

Everything else should support this outcome.

UtsavZero's central innovation is not event booking, polygon drawing or application approval in isolation.

It is the ability to combine geographical and environmental information, interpret the evidence, identify problems, compare alternatives and explain possible solutions to a human decision-maker.

**Mission: Zero pollution of Delhi.**

**Guiding principle: Measure what happened. Predict what might happen. Clearly disclose what is only an estimate.**

---

*End of November 5, 2026 handoff.*