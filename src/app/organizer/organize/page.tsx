"use client";

import { useState } from "react";

import OrganizerLayout from "@/components/hostevents/layout/OrganizerLayout";
import EventForm from "@/components/hostevents/organize/EventForm";
import EventList from "@/components/hostevents/organize/EventList";

export default function OrganizeEventsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEventCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <OrganizerLayout
      title="Manage Events"
      description="Create, publish and manage your firecracker-free community celebrations."
    >
      <div className="space-y-10">
        <EventForm onEventCreated={handleEventCreated} />

        <div className="border-t border-[#EADCC9] pt-8">
          <EventList refreshKey={refreshKey} />
        </div>
      </div>
    </OrganizerLayout>
  );
}