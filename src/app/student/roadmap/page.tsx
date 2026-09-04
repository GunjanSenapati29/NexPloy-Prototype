"use client";

import { motion } from "framer-motion";
import { Map, Info } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageHeader } from "@/components/layout/PageHeader";
import { staggerContainer, staggerItem } from "@/lib/motion-variants";
import { primaryStudent } from "@/data/mock/students";

export default function RoadmapPage() {
  const s = primaryStudent;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader eyebrow="Growth" title="Your Roadmap" subtitle="A sequenced plan to close your critical skill gaps before your next drives." />

      <Alert className="mb-6">
        <Info />
        <AlertDescription>Prototype scenario estimate — not guaranteed.</AlertDescription>
      </Alert>

      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="relative pl-8">
        <div className="absolute bottom-4 left-[15px] top-2 w-px bg-border" />
        {s.roadmap.map((step, i) => (
          <motion.div key={step.id} variants={staggerItem} className="relative mb-6 last:mb-0">
            <div className="absolute -left-8 top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-violet-bright bg-violet/15 text-xs font-semibold text-violet-bright">
              {i + 1}
            </div>
            <Card className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Map className="h-3.5 w-3.5 text-violet-bright" />
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{step.week}</span>
                </div>
                <span className="text-xs font-medium text-success">{step.estimatedImpact}</span>
              </div>
              <CardTitle className="mt-1.5">{step.title}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
