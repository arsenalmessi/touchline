
"use client";

import {
  AlarmClock,
  ExternalLink,
  Home,
  Mail,
  MessageSquare,
  Power,
  Settings,
  User2,
  Users,
} from "lucide-react";

import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import generateSlug from "@/utils/generateSlug";

// User roles
type UserRole =
  | "USER"
  | "ADMIN"
  | "WORKER"
  | "CLIENT"

interface NavItem {
  title: string;
  path: string;
  icon: React.ElementType;
}

export default function Sidebar({
  session,
}: {
  session: Session;
}) {
  const { user } = session;
  const role = user?.role as UserRole;
  const id = user.id;
  const slug = generateSlug(user.name ?? "");
  const pathname = usePathname();

  const roles: Record<UserRole, NavItem[]> = {
    USER: [
      { title: "Dashboard", path: "/dashboard", icon: Home },
      {
        title: "My Appointments",
        path: "/dashboard/user/appointments",
        icon: AlarmClock,
      },
   
      {
        title: "Inbox",
        path: "/dashboard/user/inbox",
        icon: Mail,
      },
    ],

    CLIENT: [
      { title: "Dashboard", path: "/dashboard", icon: Home },
      // {
      //   title: "My Appointments",
      //   path: "/dashboard/user/appointments",
      //   icon: AlarmClock,
      // },
      // {
      //   title: "Professionals",
      //   path: "/dashboard/worker",
      //   icon: Users,
      // },
      {
        title: "Inbox",
        path: "/dashboard/user/inbox",
        icon: Mail,
      },
    ],



    ADMIN: [
      { title: "Dashboard", path: "/dashboard", icon: Home },
      { title: "Professionals", path: "/dashboard/workers", icon: Users },
      { title: "Clients", path: "/dashboard/clients", icon: Users },
      {
        title: "Messages",
        path: "/dashboard/messages",
        icon: MessageSquare,
      },
      {
        title: "Appointments",
        path: "/dashboard/appointments",
        icon: AlarmClock,
      },
      {
        title: "Settings",
        path: "/dashboard/settings",
        icon: Settings,
      },
    ],

    WORKER: [
      { title: "Dashboard", path: "/dashboard", icon: Home },
      // {
      //   title: "Appointments",
      //   path: "/dashboard/worker/appointments",
      //   icon: AlarmClock,
      // },
      // {
      //   title: "Clients",
      //   path: "/dashboard/worker/clients",
      //   icon: Users,
      // },
      {
        title: "Inbox",
        path: "/dashboard/worker/inbox",
        icon: Mail,
      },
      {
        title: "Profile",
        path: `/dashboard/worker/profile/${id}`,
        icon: User2,
      },
      {
        title: "Live Preview",
        path: `/workers/${slug}?id=${id}`,
        icon: ExternalLink,
      },
      {
        title: "Settings",
        path: "/dashboard/worker/settings",
        icon: Settings,
      },
    ],
  };

  const sideBarLinks = roles[role] || [];

  return (
    <aside className="hidden border-r border-[#B8924A]/15 bg-[#080706] md:block">
      <div className="flex h-full max-h-screen flex-col">

        {/* Logo */}
        <div className="flex h-[72px] items-center border-b border-[#B8924A]/15 px-6">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#B8924A]/30 bg-[#B8924A]/10 transition-colors group-hover:bg-[#B8924A]/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#B8924A]"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M8 12h8" />
                <path d="M12 8v8" />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-[0.18em] text-[#F0EBE0] transition-colors group-hover:text-[#B8924A]">
                TOUCHLINE
              </span>
              <span className="text-[9px] font-medium tracking-[0.25em] text-[#8C8375]">
                WELLNESS & CARE
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-7">
          <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#776E60]">
            Workspace
          </p>

          <nav className="grid gap-1">
            {sideBarLinks.map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.path ||
                (item.path !== "/dashboard" &&
                  pathname.startsWith(item.path.split("?")[0] + "/"));

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium transition-all duration-200",
                    isActive
                      ? "border border-[#B8924A]/20 bg-[#B8924A]/10 text-[#D6AD65]"
                      : "border border-transparent text-[#A49C8C] hover:border-[#B8924A]/10 hover:bg-[#B8924A]/5 hover:text-[#F0EBE0]"
                  )}
                >
                  {isActive && (
                    <span className="absolute bottom-2 left-0 top-2 w-[2px] rounded-full bg-[#B8924A]" />
                  )}

                  <Icon
                    className={cn(
                      "h-[18px] w-[18px] transition-colors",
                      isActive
                        ? "text-[#B8924A]"
                        : "text-[#81786B] group-hover:text-[#B8924A]"
                    )}
                  />

                  <span>{item.title}</span>

                  {item.title === "Live Preview" && (
                    <ExternalLink className="ml-auto h-3.5 w-3.5 text-[#776E60]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom section */}
        <div className="border-t border-[#B8924A]/15 p-4">
          <div className="mb-4 rounded-xl border border-[#B8924A]/10 bg-[#100F0D] p-3">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#81786B]">
              Signed in as
            </p>
            <p className="mt-1 truncate text-sm font-medium text-[#F0EBE0]">
              {user.name || "Account"}
            </p>
            <p className="mt-0.5 truncate text-xs text-[#A49C8C]">
              {user.email}
            </p>
          </div>

          <Button
            size="sm"
            className="h-10 w-full border border-red-500/20 bg-red-500/10 text-red-400 shadow-none transition-all hover:bg-red-500/20 hover:text-red-300"
          >
            <Power className="mr-2 h-4 w-4" />
            Logout 
          </Button>
        </div>
      </div>
    </aside>
  );
}
