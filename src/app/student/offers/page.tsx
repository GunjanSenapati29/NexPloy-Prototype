"use client";

import { useState } from "react";
import { Award, MapPin, IndianRupee, Calendar, Eye } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PageHeader } from "@/components/layout/PageHeader";
import { getOffersByStudent } from "@/data/mock/offers";
import { primaryStudent } from "@/data/mock/students";
import { useAppStore } from "@/hooks/useAppStore";

export default function OffersPage() {
  const [offers, setOffers] = useState(getOffersByStudent(primaryStudent.id));
  const [viewing, setViewing] = useState<string | null>(null);
  const pushToast = useAppStore((s) => s.pushToast);

  const decide = (id: string, decision: "ACCEPTED" | "DECLINED") => {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, status: decision } : o)));
    pushToast(
      decision === "ACCEPTED" ? "Offer accepted" : "Offer declined",
      decision === "ACCEPTED" ? "Congratulations! Your offer has been marked accepted." : "This offer has been marked declined.",
    );
  };

  const viewingOffer = offers.find((o) => o.id === viewing);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader eyebrow="Activity" title="Offers" subtitle="Every offer you've received, in one place." />

      {offers.length === 0 ? (
        <Card className="p-10 text-center text-sm text-muted-foreground">No offers yet — keep applying to eligible drives.</Card>
      ) : (
        <div className="space-y-4">
          {offers.map((o) => (
            <Card key={o.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet/10 text-sm font-bold text-violet-bright">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>{o.companyName}</CardTitle>
                    <p className="text-xs text-muted-foreground">{o.role}</p>
                  </div>
                </div>
                <Badge variant={o.status === "OFFER RECEIVED" ? "success" : o.status === "ACCEPTED" ? "success" : "risk"}>
                  {o.status}
                </Badge>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <IndianRupee className="h-3.5 w-3.5" /> {o.package}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {o.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Joins {o.joiningDate}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setViewing(o.id)}>
                  <Eye className="h-3.5 w-3.5" /> View Offer
                </Button>
                {o.status === "OFFER RECEIVED" && (
                  <>
                    <Button variant="glow" size="sm" onClick={() => decide(o.id, "ACCEPTED")}>
                      Accept
                    </Button>
                    <Button variant="outline" size="sm" className="text-risk" onClick={() => decide(o.id, "DECLINED")}>
                      Decline
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
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
              <p><span className="text-muted-foreground">Role:</span> {viewingOffer.role}</p>
              <p><span className="text-muted-foreground">Package:</span> {viewingOffer.package}</p>
              <p><span className="text-muted-foreground">Location:</span> {viewingOffer.location}</p>
              <p><span className="text-muted-foreground">Joining Date:</span> {viewingOffer.joiningDate}</p>
              <p><span className="text-muted-foreground">Status:</span> {viewingOffer.status}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
