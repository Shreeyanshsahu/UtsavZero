
"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarPlus,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import ExpandableNavItem from "./ExpandableNavItem";

interface RoleNavigationProps {
  isDarkMode: boolean;
}

export default function RoleNavigation({
  isDarkMode,
}: RoleNavigationProps) {
  const pathname = usePathname();
  const { user, roles, loading } = useAuth();

  if (loading || !user) return null;

  const isCivicAdmin = roles.includes("civic_demo_admin");
  const isOrganizer = roles.includes("private_organizer");
  const isCitizen = roles.includes("citizen");

  // Higher-level roles take priority over the default citizen role.
  const navigationItems = isCivicAdmin
    ? [
        {
          label: "Civic Portal",
          href: "/civic",
          icon: ShieldCheck,
        },
      ]
    : isOrganizer
    ? [
        {
          label: "Dashboard",
          href: "/organizer",
          icon: LayoutDashboard,
        },
        {
          label: "Host Event",
          href: "/organizer/organize",
          icon: CalendarPlus,
        },
      ]
    : isCitizen
    ? [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
      ]
    : [];

  return (
    <div className="flex items-center gap-2">
      {navigationItems.map((item) => (
        <ExpandableNavItem
          key={item.href}
          href={item.href}
          label={item.label}
          icon={item.icon}
          isActive={
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`)
          }
          isDarkMode={isDarkMode}
        />
      ))}
    </div>
  );
}
