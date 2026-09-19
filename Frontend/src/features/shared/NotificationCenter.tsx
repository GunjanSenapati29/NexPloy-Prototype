"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BellOff, CheckCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { notificationIcon } from "@/components/layout/NotificationsPanel";
import { NOTIFICATION_CATEGORIES } from "@/data/mock/notifications";
import { useAppStore } from "@/hooks/useAppStore";
import { cn } from "@/lib/utils";
import type { NotificationType, Role } from "@/types";

/** Shared Notification Center — the student and officer pages are the
 * same component scoped to their own audience, so categories, filters and
 * read state behave identically for both. */
export function NotificationCenter({ role, eyebrow }: { role: Role; eyebrow: string }) {
  const notifications = useAppStore((s) => s.notifications);
  const markRead = useAppStore((s) => s.markRead);
  const markAllRead = useAppStore((s) => s.markAllRead);
  const [filter, setFilter] = useState<NotificationType | "all">("all");

  const mine = notifications.filter((n) => n.audience.includes(role));
  const visible = filter === "all" ? mine : mine.filter((n) => n.type === filter);
  const unread = mine.filter((n) => !n.read).length;

  const availableCategories = NOTIFICATION_CATEGORIES.filter((c) =>
    mine.some((n) => n.type === c.type),
  );

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow={eyebrow}
        title="Notification Center"
        subtitle={
          unread > 0
            ? `${unread} unread notification${unread === 1 ? "" : "s"} for this role.`
            : "You're all caught up."
        }
        actions={
          <Button variant="outline" size="sm" onClick={markAllRead} disabled={unread === 0}>
            <CheckCheck className="h-3.5 w-3.5" /> Mark all read
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-1.5">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            filter === "all"
              ? "border-violet/50 bg-violet/10 text-violet-bright"
              : "border-border text-muted-foreground hover:bg-accent",
          )}
        >
          All ({mine.length})
        </button>
        {availableCategories.map((c) => {
          const count = mine.filter((n) => n.type === c.type).length;
          return (
            <button
              key={c.type}
              onClick={() => setFilter(c.type)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                filter === c.type
                  ? "border-violet/50 bg-violet/10 text-violet-bright"
                  : "border-border text-muted-foreground hover:bg-accent",
              )}
            >
              {c.label} ({count})
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <Card className="flex flex-col items-center p-12 text-center">
          <BellOff className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">Nothing in this category</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try a different category or clear the filter.
          </p>
        </Card>
      ) : (
        <Card className="divide-y divide-border p-0">
          <AnimatePresence initial={false}>
            {visible.map((n) => {
              const Icon = notificationIcon[n.type];
              const label =
                NOTIFICATION_CATEGORIES.find((c) => c.type === n.type)?.label ?? n.type;
              return (
                <motion.button
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => markRead(n.id)}
                  className={cn(
                    "flex w-full gap-3 p-4 text-left transition-colors hover:bg-accent/40",
                    !n.read && "bg-violet/5",
                  )}
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-4 w-4 text-violet-bright" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">{n.title}</p>
                      <Badge variant="muted">{label}</Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{n.message}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground/60">{n.timestamp}</p>
                  </div>
                  {!n.read && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-violet-bright" />
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </Card>
      )}
    </div>
  );
}
