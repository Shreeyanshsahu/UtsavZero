"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Leaf, MapPin, CalendarDays,
  Users, Sparkles, Wind, HeartHandshake, ShieldCheck, Map, Ticket,
  ChevronDown, Sun, Trees, Lightbulb, PartyPopper, Building2, Route,
  Sprout, Globe2, CheckCircle2, MessageCircle, Compass, CircleHelp,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useTheme } from "@/context/ThemeContext";

const steps = [
  {
    n: "01", icon: Compass, title: "Find your kind of celebration",
    text: "Explore community gatherings, cultural programmes, workshops and festive experiences. Search for something close to home or discover somewhere new.",
    tag: "DISCOVER",
  },
  {
    n: "02", icon: MapPin, title: "See the place, not just the poster",
    text: "Use the map and location details to understand where an event is happening, what is around it and how you might get there.",
    tag: "EXPLORE",
  },
  {
    n: "03", icon: Ticket, title: "Make a plan with your people",
    text: "Check event details, availability and registration information. Where enabled, reserve as a group and keep the plan together.",
    tag: "PARTICIPATE",
  },
  {
    n: "04", icon: HeartHandshake, title: "Show up and celebrate together",
    text: "Attend, meet your community and help make cleaner festive experiences more visible, accessible and welcoming.",
    tag: "CONNECT",
  },
];

const features = [
  { icon: Map, title: "A map-first way to explore", text: "Discover celebrations in their real geographic context. UtsavZero brings event locations and locality information into one place, so planning starts with where things actually happen." },
  { icon: CalendarDays, title: "Events with useful details", text: "Explore event descriptions, dates, timings, venues, categories, family-friendly information and available capacity where provided by organisers." },
  { icon: Users, title: "Community-led celebrations", text: "Find cultural gatherings, creative activities, music, food, workshops and other ways to spend the festive season with people around you." },
  { icon: Building2, title: "Tools for organisers", text: "Organisers can publish and manage events, coordinate registrations and keep attendee information organised through a dedicated workspace." },
  { icon: Ticket, title: "Group-friendly participation", text: "Group booking and ticket workflows make it easier for friends and families to plan a shared visit instead of coordinating separately." },
  { icon: ShieldCheck, title: "Check-in and attendance", text: "Ticket verification and check-in tools help event teams manage entry and maintain a clearer picture of attendance." },
  { icon: Wind, title: "Environmental context", text: "Air-quality observations and environmental information can help visitors understand the wider context around a place and a celebration." },
  { icon: Trees, title: "Delhi locality intelligence", text: "Geographic features and locality-level data help make the map more than a collection of pins: they give events a sense of place." },
  { icon: Route, title: "Plan with location in mind", text: "Venue addresses and map context help people consider travel, distance and nearby surroundings before setting out." },
];

const values = [
  { icon: HeartHandshake, title: "People over perfection", text: "Change should invite people in, not shame them. We want cleaner choices to feel joyful, practical and shared." },
  { icon: Lightbulb, title: "Technology with a reason", text: "Maps, data and digital workflows matter when they make a real experience easier, safer or more informed." },
  { icon: Sprout, title: "Progress, not greenwashing", text: "We should be careful with claims. Estimates, observations and verified outcomes are different things, and should be presented honestly." },
  { icon: Users, title: "Communities make it real", text: "Residents, organisers, volunteers and local institutions all have a role in creating celebrations that bring people together." },
];

const faqs = [
  { q: "What exactly is UtsavZero?", a: "UtsavZero is a Delhi-focused platform for discovering and organising community celebrations and cleaner festive experiences. It combines event discovery, interactive maps, participation workflows and environmental context in one place." },
  { q: "Is UtsavZero only about banning firecrackers?", a: "No. The idea is not to take the joy out of Diwali or tell people how they must celebrate. It is about making appealing community alternatives easier to discover, organise and participate in, while encouraging awareness of the environmental impact of festive activities." },
  { q: "Can I find events near me?", a: "You can explore published events through the discovery experience and use their location details to decide what is convenient. Availability depends on which events organisers have published and the location information they provide." },
  { q: "Can anyone organise an event?", a: "UtsavZero includes an organiser workflow for publishing and managing events. Organiser access and any required approvals depend on the platform's current eligibility and authorisation process." },
  { q: "Does UtsavZero measure pollution or guarantee cleaner air?", a: "No platform can guarantee that an event or an individual choice will produce a specific AQI improvement. UtsavZero can present environmental observations and estimates as context; they should not be mistaken for a direct measurement of the impact of a single event." },
  { q: "Are all events free and firecracker-free?", a: "Not necessarily. Event price, capacity, family-friendly status and firecracker-related information depend on the details supplied for each event. Please review the individual event listing before booking or attending." },
  { q: "How does booking work?", a: "Where registration is enabled, visitors can follow the event's booking flow and receive booking or ticket details. Group booking and QR-based check-in workflows support event participation. Always refer to the confirmation shown for your specific booking." },
  { q: "Is UtsavZero only for Diwali?", a: "Diwali in Delhi is the starting point and central inspiration. The broader ambition is to make community-led, environmentally conscious celebrations easier to discover throughout the year." },
];

function Eyebrow({ children, dark }: { children: React.ReactNode; dark: boolean }) {
  return (
    <div className={`mb-5 flex items-center gap-3 text-[10px] font-extrabold tracking-[.24em] ${dark ? "text-[#FF865C]" : "text-[#E94B18]"}`}>
      <span className="h-px w-8 bg-current" />{children}
    </div>
  );
}

function SectionHeading({ eyebrow, title, body, dark }: { eyebrow: string; title: React.ReactNode; body?: string; dark: boolean }) {
  return (
    <div className="max-w-3xl">
      <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      <h2 className={`font-lora text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl lg:text-5xl ${dark ? "text-[#FFF0D7]" : "text-[#35231D]"}`}>{title}</h2>
      {body && <p className={`mt-5 max-w-2xl text-sm leading-7 sm:text-base ${dark ? "text-[#BDB8AD]" : "text-[#806D61]"}`}>{body}</p>}
    </div>
  );
}

export default function AboutPage() {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<"residents" | "organisers">("residents");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const dark = isDarkMode;

  const palette = useMemo(() => ({
    page: dark ? "bg-[#171A19] text-[#FFF0D7]" : "bg-[#FFF8EB] text-[#3D2923]",
    muted: dark ? "text-[#B7B0A5]" : "text-[#806B5D]",
    card: dark ? "border-[#343B36] bg-[#202522]" : "border-[#EADCC9] bg-white",
    soft: dark ? "bg-[#1D2420]" : "bg-[#F7EEDC]",
  }), [dark]);

  const shownFeatures = showAllFeatures ? features : features.slice(0, 6);

  return (
    <div className={`min-h-screen w-full overflow-x-clip font-sans transition-colors duration-300 ${palette.page}`}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <main>
        {/* HERO — editorial, warm and festival-led */}
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-20">
            <Image src="/UtsavZerobgm.png" alt="" fill priority className="object-cover object-center opacity-[.16] dark:opacity-[.10]" />
          </div>
          <div className={`absolute inset-0 -z-10 ${dark ? "bg-gradient-to-b from-[#171A19]/85 via-[#171A19]/95 to-[#171A19]" : "bg-gradient-to-b from-[#FFF8EB]/65 via-[#FFF8EB]/90 to-[#FFF8EB]"}`} />
          <div className="pointer-events-none absolute -right-28 top-8 -z-10 h-[28rem] w-[28rem] rounded-full border border-orange-400/20" />
          <div className="pointer-events-none absolute -right-8 top-28 -z-10 h-[20rem] w-[20rem] rounded-full border border-orange-400/20" />

          <div className="mx-auto grid min-h-[690px] max-w-7xl items-center gap-10 px-5 pb-20 pt-20 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:py-24">
            <div className="relative z-10">
              <div className={`mb-7 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-bold uppercase tracking-[.18em] ${dark ? "border-orange-300/20 bg-orange-300/5 text-orange-200" : "border-orange-300/60 bg-white/60 text-[#B9431B]"}`}>
                <Sparkles size={13} /> A new way to celebrate together
              </div>
              <h1 className="max-w-3xl font-lora text-[3.25rem] font-bold leading-[.99] tracking-[-.045em] sm:text-7xl lg:text-[5.6rem]">
                The joy of
                <span className="block text-[#F0440A]">celebration.</span>
                The care of
                <span className={`block ${dark ? "text-[#F5C98A]" : "text-[#9A6A36]"}`}>tomorrow.</span>
              </h1>
              <p className={`mt-8 max-w-xl text-base leading-8 sm:text-lg ${palette.muted}`}>
                Diwali is about light, hope and being together. UtsavZero is here to help Delhi discover more community celebrations and cleaner festive experiences — without losing the magic that makes the festival special.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/events" className="group inline-flex items-center gap-3 rounded-full bg-[#F0440A] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-900/15 transition hover:-translate-y-1 hover:bg-[#D93B08]">
                  Find a celebration <ArrowUpRight size={17} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
                <a href="#the-idea" className={`inline-flex items-center gap-2 rounded-full border px-6 py-3.5 text-sm font-bold transition hover:border-[#F0440A] ${dark ? "border-white/15 hover:text-orange-300" : "border-[#DCCBB7] hover:text-[#E94B18]"}`}>
                  Get to know us <ArrowDown size={16} />
                </a>
              </div>
              <div className={`mt-12 flex flex-wrap gap-x-7 gap-y-3 text-[10px] font-bold uppercase tracking-[.16em] ${dark ? "text-[#99998E]" : "text-[#9B8878]"}`}>
                <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-500" /> Community first</span>
                <span className="inline-flex items-center gap-2"><MapPin size={13} /> Rooted in Delhi</span>
                <span className="inline-flex items-center gap-2"><Leaf size={13} /> Environment aware</span>
              </div>
            </div>

            <div className="relative mx-auto flex w-full max-w-[510px] items-center justify-center py-8">
              <div className={`absolute aspect-square w-[95%] rounded-full border ${dark ? "border-orange-300/15" : "border-orange-500/20"}`} />
              <div className={`absolute aspect-square w-[78%] rounded-full border border-dashed ${dark ? "border-orange-300/20" : "border-orange-500/25"}`} />
              <div className={`absolute aspect-square w-[59%] rounded-full ${dark ? "bg-[#F0440A]/10" : "bg-[#F0440A]/[.08]"}`} />
              <div className="relative z-10 flex aspect-square w-[74%] flex-col items-center justify-center text-center">
                <Image src="/UtsavZeroLogo.png" alt="UtsavZero" width={420} height={100} className="h-auto w-[90%] object-contain drop-shadow-sm" />
                <div className="mt-7 flex items-center gap-3">
                  <span className={`h-px w-8 ${dark ? "bg-orange-300/50" : "bg-orange-500/50"}`} />
                  <span className={`text-[9px] font-bold uppercase tracking-[.25em] ${palette.muted}`}>Same celebration. Cleaner tomorrow.</span>
                  <span className={`h-px w-8 ${dark ? "bg-orange-300/50" : "bg-orange-500/50"}`} />
                </div>
              </div>
              <div className={`absolute left-0 top-[19%] rounded-2xl border p-3 shadow-lg backdrop-blur ${dark ? "border-white/10 bg-[#242A25]/90" : "border-white bg-white/90"}`}><Sun className="text-orange-500" size={22} /></div>
              <div className={`absolute right-0 top-[28%] rounded-2xl border p-3 shadow-lg backdrop-blur ${dark ? "border-white/10 bg-[#242A25]/90" : "border-white bg-white/90"}`}><Users className="text-green-600" size={22} /></div>
              <div className={`absolute bottom-[13%] left-[8%] rounded-2xl border p-3 shadow-lg backdrop-blur ${dark ? "border-white/10 bg-[#242A25]/90" : "border-white bg-white/90"}`}><MapPin className="text-orange-500" size={22} /></div>
              <div className={`absolute bottom-[10%] right-[8%] rounded-2xl border p-3 shadow-lg backdrop-blur ${dark ? "border-white/10 bg-[#242A25]/90" : "border-white bg-white/90"}`}><Leaf className="text-green-600" size={22} /></div>
            </div>
          </div>
          <div className={`mx-auto flex max-w-7xl items-center justify-between border-t px-5 py-5 text-[10px] font-bold uppercase tracking-[.18em] sm:px-8 ${dark ? "border-white/10 text-[#8F948D]" : "border-[#EADCC9] text-[#9B8878]"}`}>
            <span>Scroll to explore our story</span><span className="flex items-center gap-2">Made for Delhi <ArrowDown size={13} /></span>
          </div>
        </section>

        {/* A little context — not a wall of text */}
        <section id="the-idea" className="px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.85fr_1.15fr]">
            <div>
              <Eyebrow dark={dark}>THE IDEA</Eyebrow>
              <h2 className="font-lora text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                A festival of lights shouldn&apos;t leave us <span className="text-[#F0440A]">lost in the haze.</span>
              </h2>
              <div className={`mt-8 inline-flex items-center gap-3 rounded-full px-4 py-2 text-xs font-bold ${dark ? "bg-[#28352D] text-[#B9D8BE]" : "bg-[#E9F1E5] text-[#3F714A]"}`}>
                <Wind size={15} /> Cleaner choices should be easier to find
              </div>
            </div>
            <div className={`space-y-6 text-base leading-8 sm:text-lg ${palette.muted}`}>
              <p>Delhi knows how to celebrate. Streets glow, homes fill with warmth, families reunite and neighbourhoods come alive. Diwali carries a kind of energy that is difficult to describe — and impossible to replace.</p>
              <p>But the festive season can also bring a difficult reality: a sharp rise in pollution and days when the air feels heavier than it should. The conversation often becomes a choice between celebration and responsibility, as if we must give up one to protect the other.</p>
              <p className={`border-l-2 border-[#F0440A] pl-5 font-lora text-xl font-semibold leading-8 ${dark ? "text-[#FFF0D7]" : "text-[#4A3025]"}`}>We believe there is another way: keep the joy, create more ways to come together, and make thoughtful choices easier to act on.</p>
              <p>That is where UtsavZero begins. Not with a lecture, and not with a claim that one app can solve Delhi&apos;s air-quality challenge. It begins with a practical question: what if people could easily discover meaningful celebrations happening around them — and organisers had the tools to bring those communities together?</p>
            </div>
          </div>
        </section>

        {/* Story band */}
        <section className={`relative overflow-hidden px-5 py-20 sm:px-8 ${dark ? "bg-[#202722]" : "bg-[#F0E6D5]"}`}>
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-orange-500/15" />
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-3 lg:items-center">
            <div className="lg:col-span-2">
              <Eyebrow dark={dark}>OUR POINT OF VIEW</Eyebrow>
              <p className={`font-lora text-3xl font-semibold leading-[1.25] sm:text-4xl lg:text-5xl ${dark ? "text-[#FFF0D7]" : "text-[#3D2923]"}`}>
                “We don&apos;t want to make Diwali smaller. We want to make the possibilities around it bigger.”
              </p>
            </div>
            <div className={`flex items-center gap-4 text-sm leading-6 ${palette.muted}`}>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F0440A] text-white"><PartyPopper size={25} /></div>
              <p>More shared experiences. More local discovery. More reasons to celebrate together.</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <SectionHeading dark={dark} eyebrow="THE JOURNEY" title={<>From “what&apos;s happening?” to <span className="text-[#F0440A]">“see you there!”</span></>} body="UtsavZero connects the little steps between hearing about an event and actually being part of it." />
            <div className="mt-16 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {steps.map((s, i) => {
                const Icon = s.icon;
                return <article key={s.n} className={`group relative overflow-hidden rounded-[1.7rem] border p-7 transition duration-300 hover:-translate-y-2 hover:shadow-xl ${palette.card}`}>
                  <div className="flex items-center justify-between"><div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${dark ? "bg-[#F0440A]/15 text-[#FF865C]" : "bg-[#FFF0E7] text-[#E94B18]"}`}><Icon size={23} /></div><span className={`font-lora text-4xl font-bold ${dark ? "text-white/10" : "text-[#EADCC9]"}`}>{s.n}</span></div>
                  <p className="mt-8 text-[9px] font-extrabold tracking-[.2em] text-[#F0440A]">{s.tag}</p>
                  <h3 className="mt-2 font-lora text-xl font-bold leading-snug">{s.title}</h3>
                  <p className={`mt-4 text-sm leading-7 ${palette.muted}`}>{s.text}</p>
                  {i < steps.length - 1 && <div className={`absolute bottom-7 right-7 hidden transition group-hover:translate-x-1 xl:block ${dark ? "text-[#FF865C]" : "text-[#E94B18]"}`}><ArrowRight size={18} /></div>}
                </article>;
              })}
            </div>
          </div>
        </section>

        {/* Interactive audience switch */}
        <section className={`px-5 py-24 sm:px-8 ${palette.soft}`}>
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <Eyebrow dark={dark}>MADE FOR PEOPLE WHO MAKE IT HAPPEN</Eyebrow>
              <h2 className="font-lora text-4xl font-bold leading-tight sm:text-5xl">One platform.<br /><span className="text-[#F0440A]">Different roles.</span></h2>
              <p className={`mt-6 max-w-lg leading-7 ${palette.muted}`}>Whether you&apos;re looking for somewhere to go or bringing a neighbourhood together, UtsavZero is designed to make the experience more connected.</p>
              <div className={`mt-8 inline-flex rounded-full border p-1 ${dark ? "border-white/10 bg-[#171A19]" : "border-[#E3D3BE] bg-white/70"}`}>
                <button onClick={() => setActiveTab("residents")} className={`rounded-full px-5 py-3 text-xs font-bold transition ${activeTab === "residents" ? "bg-[#F0440A] text-white shadow" : palette.muted}`}>I&apos;m exploring</button>
                <button onClick={() => setActiveTab("organisers")} className={`rounded-full px-5 py-3 text-xs font-bold transition ${activeTab === "organisers" ? "bg-[#F0440A] text-white shadow" : palette.muted}`}>I&apos;m organising</button>
              </div>
            </div>
            <div className={`relative min-h-[350px] overflow-hidden rounded-[2rem] border p-8 sm:p-10 ${palette.card}`}>
              {activeTab === "residents" ? <>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF1E5] text-[#477A4D]"><Compass size={27} /></div>
                <p className="mt-8 text-[10px] font-extrabold tracking-[.2em] text-[#F0440A]">FOR RESIDENTS & VISITORS</p>
                <h3 className="mt-3 max-w-md font-lora text-3xl font-bold">Your next celebration might be closer than you think.</h3>
                <ul className={`mt-7 space-y-3 text-sm ${palette.muted}`}>
                  {["Discover published celebrations around Delhi", "Explore event locations on an interactive map", "Compare event details, timings and availability", "Plan a visit with friends or family", "Keep your booking and ticket information together"].map(x => <li key={x} className="flex gap-3"><CheckCircle2 size={17} className="shrink-0 text-green-600" />{x}</li>)}
                </ul>
                <Link href="/events" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#F0440A]">Explore events <ArrowUpRight size={16} /></Link>
              </> : <>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0E7] text-[#E94B18]"><PartyPopper size={27} /></div>
                <p className="mt-8 text-[10px] font-extrabold tracking-[.2em] text-[#F0440A]">FOR ORGANISERS & COMMUNITIES</p>
                <h3 className="mt-3 max-w-md font-lora text-3xl font-bold">Bring your people together. We&apos;ll help with the coordination.</h3>
                <ul className={`mt-7 space-y-3 text-sm ${palette.muted}`}>
                  {["Publish event information and venue details", "Manage event listings through an organiser workspace", "Review registrations and attendee information", "Use ticket check-in tools at the event", "Coordinate group participation and attendance"].map(x => <li key={x} className="flex gap-3"><CheckCircle2 size={17} className="shrink-0 text-green-600" />{x}</li>)}
                </ul>
                <Link href="/organizer" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#F0440A]">Visit organiser space <ArrowUpRight size={16} /></Link>
              </>}
            </div>
          </div>
        </section>

        {/* Feature collection */}
        <section className="px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
              <SectionHeading dark={dark} eyebrow="WHAT'S INSIDE" title={<>A little more than <span className="text-[#F0440A]">event listings.</span></>} body="The platform brings discovery, coordination and place-based information into one connected experience." />
              <div className={`hidden max-w-xs text-xs leading-6 md:block ${palette.muted}`}>Explore the pieces that help turn a local celebration into a shared community experience.</div>
            </div>
            <div className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {shownFeatures.map((f, i) => {
                const Icon = f.icon;
                return <article key={f.title} className={`group rounded-[1.6rem] border p-7 transition duration-300 hover:-translate-y-1 hover:border-[#F0440A]/50 ${palette.card}`}>
                  <div className="flex items-center justify-between"><div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${dark ? "bg-[#F0440A]/15 text-[#FF865C]" : "bg-[#FFF0E7] text-[#E94B18]"}`}><Icon size={22} /></div><span className={`text-[10px] font-bold tracking-widest ${dark ? "text-white/25" : "text-[#C8B6A1]"}`}>0{i+1}</span></div>
                  <h3 className="mt-7 font-lora text-xl font-bold">{f.title}</h3>
                  <p className={`mt-3 text-sm leading-7 ${palette.muted}`}>{f.text}</p>
                </article>;
              })}
            </div>
            <div className="mt-9 flex justify-center">
              <button onClick={() => setShowAllFeatures(v => !v)} className={`inline-flex items-center gap-2 rounded-full border px-6 py-3 text-xs font-bold transition hover:border-[#F0440A] ${dark ? "border-white/15 hover:text-orange-300" : "border-[#DCCBB7] hover:text-[#E94B18]"}`}>
                {showAllFeatures ? "Show fewer features" : "Explore all platform features"} <ChevronDown size={15} className={`transition ${showAllFeatures ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Environment section */}
        <section className="relative overflow-hidden bg-[#202A24] px-5 py-24 text-[#FFF4E4] sm:px-8 lg:py-32">
          <div className="absolute -right-40 top-0 h-[34rem] w-[34rem] rounded-full bg-green-700/20 blur-[100px]" />
          <div className="absolute -bottom-40 -left-32 h-[30rem] w-[30rem] rounded-full bg-orange-700/15 blur-[100px]" />
          <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_.9fr] lg:items-center">
            <div>
              <Eyebrow dark={true}>THE ENVIRONMENTAL LENS</Eyebrow>
              <h2 className="font-lora text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">A map can show you a place.<br /><span className="text-[#F6B36C]">Context helps you understand it.</span></h2>
              <p className="mt-7 max-w-xl text-sm leading-8 text-[#C2C9BE] sm:text-base">Environmental awareness is not a decorative badge. It is about giving people useful context, helping them ask better questions and making information easier to explore.</p>
              <p className="mt-5 max-w-xl text-sm leading-8 text-[#C2C9BE] sm:text-base">UtsavZero&apos;s geographic and environmental direction brings together locality information, mapped features and air-quality observations. Over time, this can help visitors and communities understand the places around their celebrations and make more informed plans.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] font-bold tracking-wider text-[#D8E2D4]">AIR-QUALITY CONTEXT</span>
                <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] font-bold tracking-wider text-[#D8E2D4]">LOCALITY DATA</span>
                <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] font-bold tracking-wider text-[#D8E2D4]">GEOGRAPHIC FEATURES</span>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[1.7rem] border border-white/10 bg-white/[.06] p-6 backdrop-blur"><Wind size={25} className="text-[#F6B36C]" /><h3 className="mt-8 font-lora text-xl font-bold">Air observations</h3><p className="mt-2 text-xs leading-6 text-[#B8C4B7]">Environmental readings can provide context for the conditions around a locality.</p></div>
                <div className="mt-10 rounded-[1.7rem] border border-white/10 bg-white/[.06] p-6 backdrop-blur"><MapPin size={25} className="text-[#F6B36C]" /><h3 className="mt-8 font-lora text-xl font-bold">Place matters</h3><p className="mt-2 text-xs leading-6 text-[#B8C4B7]">Locality and geographic features help connect digital information to real places.</p></div>
                <div className="rounded-[1.7rem] border border-white/10 bg-white/[.06] p-6 backdrop-blur"><Leaf size={25} className="text-[#F6B36C]" /><h3 className="mt-8 font-lora text-xl font-bold">Better awareness</h3><p className="mt-2 text-xs leading-6 text-[#B8C4B7]">Understand the environmental conversation without oversimplifying it.</p></div>
                <div className="mt-10 rounded-[1.7rem] border border-white/10 bg-white/[.06] p-6 backdrop-blur"><Globe2 size={25} className="text-[#F6B36C]" /><h3 className="mt-8 font-lora text-xl font-bold">Shared responsibility</h3><p className="mt-2 text-xs leading-6 text-[#B8C4B7]">A cleaner future is built through many informed, collective decisions.</p></div>
              </div>
            </div>
          </div>
        </section>

        {/* Honesty / what it is not */}
        <section className="px-5 py-24 sm:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <SectionHeading dark={dark} eyebrow="A PROMISE OF HONESTY" title={<>Good intentions deserve <span className="text-[#F0440A]">honest information.</span></>} body="We want UtsavZero to be useful and credible. That means being clear about what the platform does — and what it does not claim to do." />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className={`rounded-3xl border p-7 ${palette.card}`}><CheckCircle2 className="text-green-600" size={23} /><h3 className="mt-5 font-lora text-xl font-bold">What we aim to do</h3><ul className={`mt-4 space-y-3 text-sm leading-6 ${palette.muted}`}><li>• Make community celebrations easier to discover.</li><li>• Help organisers coordinate event participation.</li><li>• Connect events with location and environmental context.</li><li>• Encourage thoughtful, community-led alternatives.</li></ul></div>
              <div className={`rounded-3xl border p-7 ${palette.card}`}><CircleHelp className="text-[#F0440A]" size={23} /><h3 className="mt-5 font-lora text-xl font-bold">What we don&apos;t promise</h3><ul className={`mt-4 space-y-3 text-sm leading-6 ${palette.muted}`}><li>• That one event will measurably improve city-wide AQI.</li><li>• That every listing is automatically verified in every respect.</li><li>• That every event is free or firecracker-free.</li><li>• That estimates replace official environmental measurements.</li></ul></div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className={`px-5 py-24 sm:px-8 ${palette.soft}`}>
          <div className="mx-auto max-w-7xl">
            <SectionHeading dark={dark} eyebrow="OUR COMPASS" title={<>The values behind <span className="text-[#F0440A]">every little detail.</span></>} body="The product will keep evolving. These principles are the things we want to stay constant." />
            <div className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {values.map(v => { const Icon = v.icon; return <div key={v.title} className={`rounded-3xl border p-7 ${palette.card}`}><Icon size={25} className="text-[#F0440A]" /><h3 className="mt-7 font-lora text-xl font-bold">{v.title}</h3><p className={`mt-3 text-sm leading-7 ${palette.muted}`}>{v.text}</p></div>; })}
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="px-5 py-24 sm:px-8 lg:py-32">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#F0440A] px-7 py-16 text-white sm:px-14 sm:py-20">
            <div className="absolute -right-24 -top-36 h-[32rem] w-[32rem] rounded-full border border-white/20" /><div className="absolute -right-4 -top-16 h-[22rem] w-[22rem] rounded-full border border-white/20" />
            <div className="relative max-w-3xl">
              <Eyebrow dark={true}>WHERE WE WANT TO GO</Eyebrow>
              <h2 className="font-lora text-4xl font-bold leading-[1.05] sm:text-6xl">A Delhi where the festival lights up the city — <span className="text-[#FFD69C]">not the air.</span></h2>
              <p className="mt-7 max-w-2xl text-sm leading-8 text-white/85 sm:text-base">We imagine neighbourhoods where people know what is happening around them, where organisers can bring communities together with less friction, and where cleaner festive experiences become part of the choices people can actually make.</p>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-white/85 sm:text-base">Diwali is our starting point. The bigger vision is a culture of celebration that makes room for joy, belonging and responsibility — all at once.</p>
              <Link href="/events" className="mt-9 inline-flex items-center gap-3 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#C83A0C] transition hover:-translate-y-1 hover:bg-[#FFF0D7]">Let&apos;s celebrate better <ArrowUpRight size={17} /></Link>
            </div>
            <div className="pointer-events-none absolute bottom-8 right-10 hidden text-[8rem] opacity-20 lg:block">✳</div>
          </div>
        </section>

        {/* FAQ */}
        <section className={`px-5 py-24 sm:px-8 ${palette.soft}`}>
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.7fr_1.3fr]">
            <div><Eyebrow dark={dark}>THE QUICK QUESTIONS</Eyebrow><h2 className="font-lora text-4xl font-bold leading-tight sm:text-5xl">Curious?<br /><span className="text-[#F0440A]">Good.</span></h2><p className={`mt-5 max-w-sm text-sm leading-7 ${palette.muted}`}>A few things people might want to know before they explore, organise or join a celebration.</p><div className={`mt-8 flex items-center gap-3 text-xs font-semibold ${palette.muted}`}><MessageCircle size={17} className="text-[#F0440A]" /> Still have a question? Get in touch through our support channels.</div></div>
            <div className="space-y-3">
              {faqs.map((f, i) => <div key={f.q} className={`overflow-hidden rounded-2xl border ${palette.card}`}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i} className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-7">
                  <span className="text-sm font-bold sm:text-base">{f.q}</span><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${openFaq === i ? "rotate-180 bg-[#F0440A] text-white" : dark ? "bg-white/5 text-[#FF865C]" : "bg-[#FFF0E7] text-[#E94B18]"}`}><ChevronDown size={17} /></span>
                </button>
                {openFaq === i && <div className={`px-5 pb-6 text-sm leading-7 sm:px-7 ${palette.muted}`}><div className={`border-l-2 pl-4 ${dark ? "border-[#F0440A]/70" : "border-[#F0440A]/50"}`}>{f.a}</div></div>}
              </div>)}
            </div>
          </div>
        </section>

        {/* Final invitation */}
        <section className="px-5 py-24 text-center sm:px-8 lg:py-32">
          <div className="mx-auto max-w-3xl">
            <div className="mx-auto mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0440A] text-white shadow-lg shadow-orange-900/15"><Sparkles size={26} /></div>
            <Eyebrow dark={dark}>THIS IS AN INVITATION</Eyebrow>
            <h2 className="font-lora text-4xl font-bold leading-tight sm:text-6xl">The best celebrations are the ones <span className="text-[#F0440A]">we share.</span></h2>
            <p className={`mx-auto mt-6 max-w-xl text-sm leading-8 sm:text-base ${palette.muted}`}>Discover something happening around you. Bring your friends. Support a local organiser. Start with one celebration, and help make a better tradition possible.</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/events" className="inline-flex items-center gap-3 rounded-full bg-[#F0440A] px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-[#D93B08]">Explore celebrations <ArrowRight size={17} /></Link>
              <Link href="/organizer" className={`inline-flex items-center gap-3 rounded-full border px-7 py-3.5 text-sm font-bold transition hover:border-[#F0440A] ${dark ? "border-white/15" : "border-[#DCCBB7]"}`}>I&apos;m an organiser <ArrowUpRight size={17} /></Link>
            </div>
            <p className={`mt-12 font-lora text-lg italic ${dark ? "text-[#AFA99C]" : "text-[#927F70]"}`}>UtsavZero — Same celebration. Cleaner tomorrow.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
