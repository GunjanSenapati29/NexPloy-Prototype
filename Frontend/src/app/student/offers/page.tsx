"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  MapPin,
  IndianRupee,
  Calendar,
  Eye,
  Clock,
  Sparkles,
  FileCheck2,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/layout/StatCard";
import { DepthCard } from "@/components/intelligence/DepthCard";
import { IntelligencePulse } from "@/components/intelligence/IntelligencePulse";
import { JourneyTimeline } from "@/components/intelligence/JourneyTimeline";
import { getOffersByStudent } from "@/data/mock/offers";
import { primaryStudent } from "@/data/mock/students";
import { useAppStore } from "@/hooks/useAppStore";
import { offerStatusTone } from "@/lib/status";
import type { Offer, OfferStatus } from "@/types";

/** Where an offer sits on the shared placement journey timeline. */
function journeyIndexFor(offer: Offer, status: OfferStatus): number {
  if (offer.joined) return 8;
  if (offer.documentsVerified) return 7;
  if (status === "ACCEPTED") return 6;
  return 5; // offer received / pending acceptance
}

export default function OffersPage() {
  const baseOffers = getOffersByStudent(primaryStudent.id);
  const offerDecisions = useAppStore((s) => s.offerDecisions);
  const decideOffer = useAppStore((s) => s.decideOffer);
  const pushToast = useAppStore((s) => s.pushToast);
  const [viewing, setViewing] = useState<string | null>(null);
  const [pulsing, setPulsing] = useState<string | null>(null);

  const offers = baseOffers.map((o) => ({ ...o, status: offerDecisions[o.id] ?? o.status }));

  const decide = (offer: Offer, decision: "ACCEPTED" | "DECLINED") => {
    decideOffer(offer.id, decision);
    setPulsing(offer.id);
    window.setTimeout(() => setPulsing((p) => (p === offer.id ? null : p)), 900);
    pushToast(
      decision === "ACCEPTED" ? "Offer accepted" : "Offer declined",
      decision === "ACCEPTED"
        ? `${offer.companyName} offer accepted — document verification is the next step.`
        : `${offer.companyName} offer has been marked declined.`,
    );
  };

  const viewingOffer = offers.find((o) => o.id === viewing);
  const accepted = offers.filter((o) => o.status === "ACCEPTED").length;
  const pending = offers.filter(
    (o) => o.status === "OFFER RECEIVED" || o.status === "PENDING ACCEPTANCE",
  ).length;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="Opportunities"
        title="Offers"
        subtitle="Every offer you've received, including pre-placement offers from your internships."
      />

      <div className="mb-5 grid grid-cols-3 gap-4">
        <StatCard label="Total Offers" value={offers.length} icon={Award} accent="violet" />
        <StatCard label="Accepted" value={accepted} accent="success" />
        <StatCard label="Awaiting Decision" value={pending} icon={Clock} accent="warning" />
      </div>

      {offers.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">
          No offers yet — keep applying to eligible drives.
        </Card>
      ) : (
        <div className="space-y-4">
          {offers.map((o) => {
            const decidable = o.status === "OFFER RECEIVED" || o.status === "PENDING ACCEPTANCE";
            return (
              <DepthCard key={o.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <IntelligencePulse active={pulsing === o.id}>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet/10 text-sm font-bold text-violet-bright">
                        <Award className="h-5 w-5" />
                      </div>
                    </IntelligencePulse>
                    <div>
                      <CardTitle>{o.companyName}</CardTitle>
                      <p className="text-xs text-muted-foreground">{o.role}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={o.offerType === "PPO" ? "warning" : "muted"}>
                      {o.offerType === "PPO" && <Sparkles className="mr-1 h-3 w-3" />}
                      {o.offerType}
                    </Badge>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={o.status}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Badge variant={offerStatusTone[o.status]}>{o.status}</Badge>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {o.fromInternship && (
                  <p className="mt-3 rounded-lg border border-warning/30 bg-warning/5 p-2.5 text-xs text-muted-foreground">
                    <span className="font-medium text-warning">Pre-placement offer</span> converted
                    from {o.fromInternship}.
                  </p>
                )}

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted-foreground sm:grid-cols-4">
                  <div className="flex items-center gap-1.5">
                    <IndianRupee className="h-3.5 w-3.5" /> {o.package}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> {o.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> Offered {o.offerDate}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> Accept by {o.acceptanceDeadline}
                  </div>
                </div>

                <div className="mt-4">
                  <JourneyTimeline currentIndex={journeyIndexFor(o, o.status)} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => setViewing(o.id)}>
                    <Eye className="h-3.5 w-3.5" /> View Offer
                  </Button>
                  {decidable && (
                    <>
                      <Button variant="glow" size="sm" onClick={() => decide(o, "ACCEPTED")}>
                        Accept Offer
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-risk"
                        onClick={() => decide(o, "DECLINED")}
                      >
                        Decline
                      </Button>
                    </>
                  )}
                  {o.status === "ACCEPTED" && !o.documentsVerified && (
                    <Button asChild variant="outline" size="sm">
                      <Link href="/student/documents">
                        <FileCheck2 className="h-3.5 w-3.5" /> Complete document verification
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  )}
                </div>
              </DepthCard>
            );
          })}
        </div>
      )}

      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewingOffer?.companyName} — Offer Letter</DialogTitle>
            <DialogDescription>Simulated offer document preview.</DialogDescription>
          </DialogHeader>
          {viewingOffer && (
            <div className="space-y-2 rounded-lg border border-border bg-elevated p-4 text-sm">
              <p>
                <span className="text-muted-foreground">Role:</span> {viewingOffer.role}
              </p>
              <p>
                <span className="text-muted-foreground">Offer Type:</span> {viewingOffer.offerType}
              </p>
              <p>
                <span className="text-muted-foreground">CTC:</span> {viewingOffer.package}
              </p>
              <p>
                <span className="text-muted-foreground">Location:</span> {viewingOffer.location}
              </p>
              <p>
                <span className="text-muted-foreground">Offer Date:</span> {viewingOffer.offerDate}
              </p>
              <p>
                <span className="text-muted-foreground">Acceptance Deadline:</span>{" "}
                {viewingOffer.acceptanceDeadline}
              </p>
              <p>
                <span className="text-muted-foreground">Joining Date:</span>{" "}
                {viewingOffer.joiningDate}
              </p>
              <p>
                <span className="text-muted-foreground">Status:</span> {viewingOffer.status}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
