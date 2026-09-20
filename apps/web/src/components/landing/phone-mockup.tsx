"use client";

import { useEffect, useState } from "react";
import {
  Check,
  ChevronDown,
  FileCode2,
  FolderOpen,
  ListTodo,
  Loader2,
  Pencil,
  Share,
  FileDiff,
} from "lucide-react";

const STEP_DELAYS_MS = [900, 1000, 1400, 1200, 300, 1600, 1100, 1000, 4500];
const LAST_STEP = STEP_DELAYS_MS.length - 1;

const MENU_ITEMS = [
  { label: "Tasks", icon: ListTodo },
  { label: "Modified files", icon: FileDiff },
  { label: "Browse files", icon: FolderOpen },
  { label: "Share session", icon: Share },
  { label: "Rename session", icon: Pencil },
];

const AGENTS = ["build", "plan"] as const;

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 self-start rounded-2xl rounded-bl-md bg-muted border border-border w-fit">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}

function HeaderMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        aria-label="Session menu"
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/60 border border-border/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg>
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-20 cursor-default bg-transparent"
          />
          <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-44 overflow-hidden rounded-xl bg-card border border-border shadow-xl animate-fade-in">
            <div className="py-1.5">
              {MENU_ITEMS.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left transition-colors hover:bg-muted/70"
                >
                  <Icon size={13} className="text-muted-foreground shrink-0" />
                  <span className="text-[11px] font-medium text-foreground">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AgentPicker() {
  const [open, setOpen] = useState(false);
  const [agent, setAgent] = useState<(typeof AGENTS)[number]>("build");

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-full bg-background border border-border px-2.5 py-1 transition-colors hover:border-muted-foreground/40"
      >
        <span className="text-[10px] text-muted-foreground font-medium leading-none capitalize">{agent}</span>
        <ChevronDown size={10} className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-label="Close agent menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-20 cursor-default bg-transparent"
          />
          <div className="absolute bottom-[calc(100%+6px)] left-0 z-30 w-28 overflow-hidden rounded-xl bg-card border border-border shadow-xl animate-fade-in">
            <div className="py-1">
              {AGENTS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => {
                    setAgent(a);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-3 py-1.5 text-left transition-colors hover:bg-muted/70"
                >
                  <span className="text-[11px] font-medium text-foreground capitalize">{a}</span>
                  {agent === a && <Check size={12} className="text-green-600 dark:text-green-400" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function PhoneMockup({ startAt = LAST_STEP }: { startAt?: number }) {
  const [step, setStep] = useState(startAt);

  useEffect(() => {
    const timeout = setTimeout(
      // cycle 1..LAST_STEP so the hero never shows an empty chat
      () => setStep((s) => (s + 1) % STEP_DELAYS_MS.length || 1),
      STEP_DELAYS_MS[step]
    );
    return () => clearTimeout(timeout);
  }, [step]);

  const readDone = step >= 4;

  return (
    <div className="relative flex-shrink-0 mx-auto lg:mx-0" style={{ width: 340 }}>
      {/* Side buttons */}
      <div className="absolute top-[140px] -left-[3px] w-[3px] h-9 rounded-l-sm bg-zinc-700 dark:bg-zinc-600" />
      <div className="absolute top-[200px] -left-[3px] w-[3px] h-16 rounded-l-sm bg-zinc-700 dark:bg-zinc-600" />
      <div className="absolute top-[215px] -right-[3px] w-[3px] h-24 rounded-r-sm bg-zinc-700 dark:bg-zinc-600" />

      {/* Device frame */}
      <div className="w-full rounded-[3.4rem] bg-zinc-900 border border-zinc-700/60 shadow-[0_32px_80px_-24px_rgba(0,0,0,0.55)] p-[12px] dark:bg-zinc-950 dark:border-zinc-800">
        <div className="relative overflow-hidden rounded-[2.6rem] bg-background flex flex-col" style={{ height: 620 }}>
          {/* Dynamic island */}
          <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-10 h-[25px] w-[100px] rounded-full bg-black" />

          {/* Status bar */}
          <div className="flex items-center justify-between px-9 pt-3.5 text-[12px] font-semibold text-foreground">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <svg width="15" height="11" viewBox="0 0 16 12" fill="currentColor">
                <rect x="0" y="7" width="3" height="4" rx="0.5" />
                <rect x="4.5" y="4.5" width="3" height="6.5" rx="0.5" />
                <rect x="9" y="2" width="3" height="9" rx="0.5" />
              </svg>
              <svg width="15" height="11" viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M2 6.5C7.5 1.5 16.5 1.5 22 6.5" />
                <path d="M5.5 10.5c4-3.5 9-3.5 13 0" />
                <circle cx="12" cy="15" r="1" fill="currentColor" />
              </svg>
              <svg width="24" height="12" viewBox="0 0 25 12" fill="none">
                <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="currentColor" opacity="0.4" />
                <rect x="2" y="2" width="15" height="8" rx="1.5" fill="currentColor" />
                <path d="M23 4v4c1-.3 1.5-1 1.5-2S24 4.3 23 4z" fill="currentColor" opacity="0.4" />
              </svg>
            </div>
          </div>

          {/* App header — mirrors real SessionHeader: back, title, overflow menu */}
          <div className="flex items-center gap-2 border-b border-border px-4 pt-3 pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            </div>
            <div className="flex flex-col min-w-0 flex-1 text-left">
              <span className="text-[13px] font-semibold text-foreground truncate leading-tight tracking-tight">Fix auth middleware</span>
              <span className="text-[11px] text-muted-foreground truncate">myapp</span>
            </div>
            <HeaderMenu />
          </div>

          {/* Chat */}
          <div className="flex-1 overflow-hidden px-4 py-4 flex flex-col gap-3">
            {step >= 1 && (
              <div className="max-w-[86%] rounded-2xl rounded-br-md px-4 py-3 self-end border border-border bg-secondary animate-rise-in shadow-sm">
                <p className="text-[12px] text-secondary-foreground leading-relaxed text-left">
                  The auth middleware is throwing 401 on valid tokens. Can you check the verify function?
                </p>
              </div>
            )}
            {step === 2 && (
              <div className="animate-rise-in">
                <TypingDots />
              </div>
            )}
            {step >= 3 && (
              <div className="flex items-center gap-1.5 animate-rise-in">
                {readDone ? (
                  <Check size={12} strokeWidth={3} className="text-green-600 dark:text-green-400 shrink-0" />
                ) : (
                  <Loader2 size={12} className="animate-spin text-muted-foreground/60 shrink-0" />
                )}
                <span className="text-[11px] text-muted-foreground">
                  Read file: <code className="font-mono text-foreground/80">src/middleware/auth.ts</code>
                </span>
              </div>
            )}
            {step >= 5 && (
              <p className="text-[12px] text-foreground leading-relaxed text-left animate-rise-in">
                Found it. The <code className="bg-muted px-1.5 py-0.5 rounded-md text-[11px] font-mono border border-border/60">verify</code>{" "}
                function expects the token without the{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded-md text-[11px] font-mono border border-border/60">Bearer</code> prefix, but the
                header includes it. Here&apos;s the fix:
              </p>
            )}
            {step >= 6 && (
              <div className="rounded-xl border border-border bg-muted/40 overflow-hidden animate-rise-in">
                <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border/70">
                  <FileCode2 size={11} className="text-muted-foreground shrink-0" />
                  <span className="text-[10px] text-muted-foreground font-mono">auth.ts</span>
                  <span className="text-[10px] text-green-600 dark:text-green-400 font-mono ml-auto">+2 -1</span>
                </div>
                <pre className="px-3 py-2 text-[10px] font-mono leading-relaxed overflow-hidden text-left"><code><span className="text-red-500 dark:text-red-400">- const token = req.headers.auth</span>{"\n"}<span className="text-green-600 dark:text-green-400">+ const token = req.headers.auth</span>{"\n"}<span className="text-green-600 dark:text-green-400">+   ?.replace(&quot;Bearer &quot;, &quot;&quot;)</span></code></pre>
              </div>
            )}
            {step >= 7 && (
              <div className="flex items-center gap-1.5 animate-rise-in">
                {step >= 8 ? (
                  <Check size={12} strokeWidth={3} className="text-green-600 dark:text-green-400 shrink-0" />
                ) : (
                  <Loader2 size={12} className="animate-spin text-muted-foreground/60 shrink-0" />
                )}
                <span className="text-[11px] font-medium font-mono text-muted-foreground">todowrite</span>
                <span className={`text-[10px] font-medium ${step >= 8 ? "text-green-600 dark:text-green-400" : "text-muted-foreground/70"}`}>
                  {step >= 8 ? "done" : "running"}
                </span>
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="px-4 pb-5 pt-1">
            <div className="rounded-[1.4rem] bg-muted/70 p-3 border border-border shadow-sm">
              <div className="text-[11px] text-muted-foreground px-1 pb-2 text-left">Ask anything...</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                  </div>
                  <AgentPicker />
                </div>
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--primary-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
