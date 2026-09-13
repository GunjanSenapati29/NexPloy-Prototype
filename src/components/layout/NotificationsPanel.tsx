"use client";

import Link from "next/link";
import {
  Bell,
  CheckCheck,
  CalendarClock,
  FileText,
  Award,
  Megaphone,
  Clock,
  HeartHandshake,
  Settings2,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/hooks/useAppStore";
import { useRole } from "@/hooks/useRole";
import { cn } from "@/lib/utils";
import type { NotificationType } from "@/types";

export const notificationIcon: Record<NotificationType, typeof Bell> = {
  drive: Megaphone,
  deadline: Clock,
  interview: CalendarClock,
  offer: Award,
  document: FileText,
  mentor: HeartHandshake,
  system: Settings2,
};

/** Where each role's full Notification Center lives. */
const centerHref: Record<string, string> = {
  student: "/student/notifications",
  officer: "/officer/notifications",
};

export function NotificationsPanel() {
  const { role } = useRole();
  const notifications = useAppStore((s) => s.notifications);
  const markAllRead = useAppStore((s) => s.markAllRead);
  const markRead = useAppStore((s) => s.markRead);

  const visible = notifications.filter((n) => n.audience.includes(role));
  const unreadCount = visible.filter((n) => !n.read).length;
  const href = centerHref[role];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet text-[9px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm font-semibold">Notifications</span>
          <button
            onClick={markAllRead}
            className="flex items-center gap-1 text-xs text-violet-bright hover:underline"
          >
            <CheckCheck className="h-3 w-3" /> Mark all read
          </button>
        </div>
        <Separator />
        <ScrollArea className="h-80">
          <div className="divide-y divide-border">
            {visible.length === 0 && (
              <p className="px-4 py-10 text-center text-xs text-muted-foreground">
                No notifications for this role yet.
              </p>
            )}
            {visible.map((n) => {
              const Icon = notificationIcon[n.type];
              return (
                <button
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={cn(
                    "flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/50",
                    !n.read && "bg-violet/5",
                  )}
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Icon className="h-3.5 w-3.5 text-violet-bright" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground">{n.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{n.message}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground/60">{n.timestamp}</p>
                  </div>
                  {!n.read && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-bright" />}
                </button>
              );
            })}
          </div>
        </ScrollArea>
        {href && (
          <>
            <Separator />
            <Link
              href={href}
              className="block px-4 py-2.5 text-center text-xs text-violet-bright hover:underline"
            >
              Open Notification Center
            </Link>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
