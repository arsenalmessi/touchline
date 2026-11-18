
"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

import {
  AlarmClock,
  ExternalLink,
  Home,
  Mail,
  Menu,
  Power,
  Settings,
  User2,
  Users,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../ui/avatar";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { getInitials } from "./../../utils/generateInitials";
import { cn } from "@/lib/utils";
import generateSlug from "@/utils/generateSlug";

type UserRole =
  | "USER"
  | "ADMIN"
  | "WORKER"
  | "CLIENT"
  | "INDIVIDUALCLIENT";

interface NavItem {
  title: string;
  path: string;
  icon: React.ElementType;
}

export default function NavBar({ session }: { session: Session }) {
  const [open, setOpen] = useState(false);

  const user = session.user;
  const router = useRouter();
  const pathname = usePathname();

  const role = user?.role as UserRole;
  const id = user.id;
  const slug = generateSlug(user.name ?? "");

  async function handleLogout() {
    await signOut({ redirect: false });
    router.push("/login");
    router.refresh();
  }

  const roles: Record<UserRole, NavItem[]> = {
    USER: [
      { title: "Dashboard", path: "/dashboard", icon: Home },
      {
        title: "My Appointments",
        path: "/dashboard/user/appointments",
        icon: AlarmClock,
      },
      {
        title: "Professionals",
        path: "/dashboard/user/workers",
        icon: Users,
      },
      {
        title: "Inbox",
        path: "/dashboard/user/inbox",
        icon: Mail,
      },
    ],

    CLIENT: [
      { title: "Dashboard", path: "/dashboard", icon: Home },
      {
        title: "My Appointments",
        path: "/dashboard/user/appointments",
        icon: AlarmClock,
      },
      {
        title: "Professionals",
        path: "/dashboard/user/workers",
        icon: Users,
      },
      {
        title: "Inbox",
        path: "/dashboard/user/inbox",
        icon: Mail,
      },
    ],

    INDIVIDUALCLIENT: [
      { title: "Dashboard", path: "/dashboard", icon: Home },
      {
        title: "My Appointments",
        path: "/dashboard/user/appointments",
        icon: AlarmClock,
      },
      {
        title: "Professionals",
        path: "/dashboard/user/workers",
        icon: Users,
      },
      {
        title: "Inbox",
        path: "/dashboard/user/inbox",
        icon: Mail,
      },
    ],

    ADMIN: [
      { title: "Dashboard", path: "/dashboard", icon: Home },
      { title: "Services", path: "/dashboard/services", icon: Users },
      { title: "Specialties", path: "/dashboard/specialties", icon: Users },
      { title: "Symptoms", path: "/dashboard/symptoms", icon: Users },
      { title: "Professionals", path: "/dashboard/workers", icon: Users },
      { title: "Clients", path: "/dashboard/clients", icon: Users },
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
      {
        title: "Appointments",
        path: "/dashboard/worker/appointments",
        icon: AlarmClock,
      },
      {
        title: "Clients",
        path: "/dashboard/worker/clients",
        icon: Users,
      },
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

  const isActive = (path: string) =>
    pathname === path ||
    (path !== "/dashboard" && pathname.startsWith(path + "/"));

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-[#B8924A]/15 bg-[#080706]/95 px-4 backdrop-blur-xl lg:px-6">

      {/* Mobile Navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 border-[#B8924A]/25 bg-[#100F0D] text-[#D6AD65] hover:bg-[#B8924A]/10 hover:text-[#F0EBE0] md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="flex w-[290px] flex-col border-r border-[#B8924A]/20 bg-[#080706] p-0 text-[#F0EBE0]"
        >
          {/* Mobile Logo */}
          <div className="flex h-[72px] items-center border-b border-[#B8924A]/15 px-6">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#B8924A]/30 bg-[#B8924A]/10">
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

              <div>
                <p className="text-lg font-semibold tracking-[0.18em] text-[#F0EBE0]">
                  Touchline
                </p>
                <p className="text-[9px] tracking-[0.25em] text-[#8C8375]">
                  WELLNESS & CARE
                </p>
              </div>
            </Link>
          </div>

          {/* Mobile Links */}
          <div className="flex-1 overflow-y-auto px-4 py-7">
            <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#776E60]">
              Workspace
            </p>

            <nav className="grid gap-1">
              {sideBarLinks.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border px-3 py-3 text-sm font-medium transition-all",
                      active
                        ? "border-[#B8924A]/20 bg-[#B8924A]/10 text-[#D6AD65]"
                        : "border-transparent text-[#A49C8C] hover:bg-[#B8924A]/5 hover:text-[#F0EBE0]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-[18px] w-[18px]",
                        active ? "text-[#B8924A]" : "text-[#81786B]"
                      )}
                    />

                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Mobile User & Logout */}
          <div className="border-t border-[#B8924A]/15 p-4">
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-[#B8924A]/10 bg-[#100F0D] p-3">
              <Avatar className="h-10 w-10 border border-[#B8924A]/30">
                {user.image && (
                  <AvatarImage src={user.image} alt={user.name || ""} />
                )}
                <AvatarFallback className="bg-[#B8924A]/15 text-[#D6AD65]">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#F0EBE0]">
                  {user.name}
                </p>
                <p className="truncate text-xs text-[#A49C8C]">
                  {user.email}
                </p>
              </div>
            </div>

            <Button
              size="sm"
              onClick={handleLogout}
              className="h-10 w-full border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
            >
              <Power className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Home Button */}
      <div className="flex flex-1 items-center">
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 rounded-lg border border-[#B8924A]/15 bg-[#100F0D] px-4 text-[#A49C8C] hover:border-[#B8924A]/30 hover:bg-[#B8924A]/10 hover:text-[#D6AD65]"
          >
            <Home className="h-4 w-4 text-[#B8924A]" />
            <span>Home</span>
          </Button>
        </Link>
      </div>

      {/* User Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-full border border-transparent p-1.5 transition-all hover:border-[#B8924A]/30 hover:bg-[#B8924A]/5 focus:outline-none">
            <Avatar className="h-9 w-9 border border-[#B8924A]/40">
              {user.image && (
                <AvatarImage src={user.image} alt={user.name || ""} />
              )}
              <AvatarFallback className="bg-[#B8924A]/15 text-sm font-semibold text-[#D6AD65]">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            <ChevronDown className="hidden h-4 w-4 text-[#8C8375] sm:block" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-64 border-[#B8924A]/20 bg-[#100F0D] p-2 text-[#F0EBE0] shadow-xl"
        >
          <DropdownMenuLabel className="px-3 py-2">
            <p className="text-sm font-semibold text-[#F0EBE0]">
              {user.name}
            </p>
            <p className="mt-1 truncate text-xs font-normal text-[#A49C8C]">
              {user.email}
            </p>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-[#B8924A]/15" />

          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer rounded-lg px-3 py-2.5 text-red-400 focus:bg-red-500/10 focus:text-red-300"
          >
            <Power className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
