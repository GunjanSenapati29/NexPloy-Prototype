"use client";

import { useCallback, useState } from "react";
import { useAppStore } from "@/hooks/useAppStore";
import { simulateCopilotResponse, type CopilotRoleContext } from "@/lib/simulate";
import type { CopilotMessage } from "@/types";

let msgCounter = 0;
const nextId = () => `msg_${++msgCounter}`;

export function useCopilot(roleContext: CopilotRoleContext) {
  const copilotOpen = useAppStore((s) => s.copilotOpen);
  const setCopilotOpen = useAppStore((s) => s.setCopilotOpen);
  const toggleCopilot = useAppStore((s) => s.toggleCopilot);

  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [thinking, setThinking] = useState(false);

  const ask = useCallback(
    (question: string) => {
      if (!question.trim()) return;
      const userMsg: CopilotMessage = { id: nextId(), role: "user", text: question };
      setMessages((m) => [...m, userMsg]);
      setThinking(true);
      window.setTimeout(() => {
        const answer = simulateCopilotResponse(question, roleContext);
        setMessages((m) => [...m, { id: nextId(), role: "assistant", text: answer }]);
        setThinking(false);
      }, 550);
    },
    [roleContext],
  );

  const reset = useCallback(() => setMessages([]), []);

  return { copilotOpen, setCopilotOpen, toggleCopilot, messages, thinking, ask, reset };
}
