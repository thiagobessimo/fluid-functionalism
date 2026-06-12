"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import { DocPage, DocSection } from "@/lib/docs/DocPage";
import { ComponentPreview } from "@/lib/docs/ComponentPreview";
import { PropsTable, type PropDef } from "@/lib/docs/PropsTable";
import { spring } from "@/registry/default/lib/springs";
import { fontWeights } from "@/registry/default/lib/font-weight";
import { Button } from "@/registry/radix/button";
import { cn } from "@/registry/default/lib/utils";

/** Inline code chip used throughout the prose. */
function Code({ children }: { children: ReactNode }) {
  return (
    <code className="mx-1 rounded bg-muted px-1 py-0.5 text-[12px]">
      {children}
    </code>
  );
}

// ---------------------------------------------------------------------------
// Code snippets (shown in the Code tab of each ComponentPreview)
// ---------------------------------------------------------------------------

const SPRING_TOKENS_CODE = `import { motion } from "framer-motion";
import { spring } from "@/lib/springs";

// fast     — 0.08s, bounce 0.    Hover, fades, tooltips, focus rings.
// moderate — 0.16s, bounce 0.08. Dropdowns, tabs, short travel.
// slow     — 0.24s, bounce 0.12. Dialogs, drawers, large surfaces.

// spring.<tier> is the enter; spring.<tier>.exit is the matching exit tween.
<motion.div
  transition={spring.fast}                       // enter
  exit={{ opacity: 0, transition: spring.fast.exit }}  // leave
/>`;

// ---------------------------------------------------------------------------
// Reference table
// ---------------------------------------------------------------------------

const springTokens: PropDef[] = [
  {
    name: "spring.fast",
    type: "{ duration: 0.08, bounce: 0 }",
    description:
      "Micro-interactions: hover backgrounds, focus rings, fades, tooltips, selection indicators.",
  },
  {
    name: "spring.moderate",
    type: "{ duration: 0.16, bounce: 0.08 }",
    description:
      "Short travel and small expansion: dropdown and tab indicators, switch thumb, accordions, drawers.",
  },
  {
    name: "spring.slow",
    type: "{ duration: 0.24, bounce: 0.12 }",
    description:
      "Large surfaces and important notifications: dialogs, drawers, side panels.",
  },
];

const exitTokens: PropDef[] = [
  {
    name: "spring.fast.exit",
    type: "{ duration: 0.06 }",
    description: "Hover and selection fades, tooltips, focus rings.",
  },
  {
    name: "spring.moderate.exit",
    type: "{ duration: 0.12 }",
    description: "Dropdown, select, and nav active backgrounds; drawers.",
  },
  {
    name: "spring.slow.exit",
    type: "{ duration: 0.16 }",
    description: "Dialogs and other large surfaces.",
  },
];

// ---------------------------------------------------------------------------
// Spring tokens demo
// ---------------------------------------------------------------------------

const SPRING_TIERS = [
  {
    key: "fast",
    token: spring.fast,
    meta: "0.08s · bounce 0",
    usage: "hover, fades",
  },
  {
    key: "moderate",
    token: spring.moderate,
    meta: "0.16s · bounce 0.08",
    usage: "dropdowns, tabs",
  },
  {
    key: "slow",
    token: spring.slow,
    meta: "0.24s · bounce 0.12",
    usage: "dialogs, drawers",
  },
] as const;

function SpringTokensDemo() {
  const [atEnd, setAtEnd] = useState(false);

  return (
    <ComponentPreview
      code={SPRING_TOKENS_CODE}
      onReplay={() => setAtEnd((v) => !v)}
    >
      <div className="flex w-full max-w-md flex-col gap-5">
        {SPRING_TIERS.map(({ key, token, meta, usage }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <div className="flex items-baseline gap-2 text-[13px]">
              <span
                className="text-foreground"
                style={{ fontVariationSettings: fontWeights.semibold }}
              >
                {key}
              </span>
              <span className="font-mono text-[11px] text-muted-foreground/70">
                {meta}
              </span>
              <span className="ml-auto hidden text-[12px] text-muted-foreground sm:inline">
                {usage}
              </span>
            </div>
            <button
              onClick={() => setAtEnd((v) => !v)}
              aria-label={`Run the ${key} spring`}
              className={cn(
                "flex h-10 w-full cursor-pointer items-center rounded-full bg-muted px-1 outline-none focus-visible:ring-1 focus-visible:ring-[#6B97FF]",
                atEnd ? "justify-end" : "justify-start"
              )}
            >
              <motion.div
                layout
                transition={token}
                className="h-8 w-8 rounded-full bg-foreground"
              />
            </button>
          </div>
        ))}
        <p className="text-center text-[12px] text-muted-foreground/70">
          Click a track (or replay) to fire all three springs.
        </p>
      </div>
    </ComponentPreview>
  );
}

// ---------------------------------------------------------------------------
// Modal exit comparison — same enter, two exit speeds
// ---------------------------------------------------------------------------

const MODAL_CODE = `// Both modals open on spring.slow. Only the exit differs.

// ❌ Same exit time — leaves on spring.slow too (0.24s, and it bounces)
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95, transition: spring.slow }}
  transition={spring.slow}
/>

// ✅ Faster exit — leaves on spring.slow.exit (0.16s tween)
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95, transition: spring.slow.exit }}
  transition={spring.slow}
/>`;

function ModalFrame({
  open,
  exitTransition,
}: {
  open: boolean;
  exitTransition: Transition;
}) {
  return (
    <div
      aria-hidden="true"
      className="relative flex h-[200px] w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-background"
    >
      <AnimatePresence>
        {open && (
          <>
            {/* subtle backdrop */}
            <motion.div
              className="absolute inset-0 bg-foreground/5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: exitTransition }}
              transition={spring.slow}
            />
            {/* modal card */}
            <motion.div
              className="relative z-10 flex w-4/5 flex-col gap-2.5 rounded-xl border border-border bg-card p-4 shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: exitTransition }}
              transition={spring.slow}
            >
              {/* close affordance */}
              <div className="absolute right-3 top-3 h-4 w-4 rounded-full bg-muted" />
              {/* title */}
              <div className="h-3 w-1/2 rounded-full bg-muted" />
              {/* body */}
              <div className="mt-1 h-2 w-full rounded-full bg-muted/60" />
              <div className="h-2 w-full rounded-full bg-muted/60" />
              <div className="h-2 w-2/5 rounded-full bg-muted/60" />
              {/* footer actions */}
              <div className="mt-3 flex justify-end gap-2">
                <div className="h-6 w-16 rounded-md bg-muted" />
                <div className="h-6 w-16 rounded-md bg-muted" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModalExitDemo() {
  // Independent state per side, so you can toggle one, then the other, and feel
  // the difference back to back rather than all at once.
  const [openSame, setOpenSame] = useState(false);
  const [openFaster, setOpenFaster] = useState(false);
  const labelClass =
    "flex items-center justify-center gap-2 text-[12px] text-muted-foreground";
  return (
    <ComponentPreview code={MODAL_CODE} minHeightClass="min-h-[320px]">
      <div className="flex w-full max-w-2xl flex-col items-center gap-4">
        <div className="grid w-full gap-5 sm:grid-cols-2">
          {/* Same exit time */}
          <div className="flex flex-col items-center gap-3">
            <ModalFrame open={openSame} exitTransition={spring.slow} />
            <Button
              variant="secondary"
              size="sm"
              aria-label="Toggle the modal with the same exit speed"
              onClick={() => setOpenSame((v) => !v)}
            >
              Toggle modal
            </Button>
            <span className={labelClass}>
              <span aria-hidden="true">❌</span> Same exit time — drags on the way
              out
            </span>
          </div>
          {/* Faster exit */}
          <div className="flex flex-col items-center gap-3">
            <ModalFrame open={openFaster} exitTransition={spring.slow.exit} />
            <Button
              variant="secondary"
              size="sm"
              aria-label="Toggle the modal with the faster exit speed"
              onClick={() => setOpenFaster((v) => !v)}
            >
              Toggle modal
            </Button>
            <span className={labelClass}>
              <span aria-hidden="true">✅</span> Faster exit — gone a tier quicker
            </span>
          </div>
        </div>
        <p className="text-center text-[12px] text-muted-foreground/70">
          Toggle one, then the other — both open on{" "}
          <span className="font-mono">spring.slow</span>; only the close differs.
        </p>
      </div>
    </ComponentPreview>
  );
}

// ---------------------------------------------------------------------------
// High-level map of which components lead with which spring
// ---------------------------------------------------------------------------

const SPEED_USAGE = [
  {
    key: "fast",
    duration: "0.08s",
    components: [
      "Hover & focus rings",
      "Checkbox",
      "Radio",
      "Table rows",
      "Tooltip",
      "Input copy",
      "Slider",
      "Select / Color picker open",
    ],
  },
  {
    key: "moderate",
    duration: "0.16s",
    components: [
      "Dropdown / Select highlight",
      "Tabs indicator",
      "Switch thumb",
      "Accordion",
      "Chat & message bubbles",
      "Mobile drawer",
    ],
  },
  {
    key: "slow",
    duration: "0.24s",
    components: ["Dialog", "Ask-user questions", "Thinking steps"],
  },
] as const;

function SpeedUsageList() {
  return (
    <div className="flex flex-col">
      {SPEED_USAGE.map((tier, i) => (
        <div
          key={tier.key}
          className={cn(
            "grid grid-cols-[84px_1fr] items-baseline gap-4 py-3",
            i > 0 && "border-t border-border"
          )}
        >
          <div className="flex flex-col">
            <span
              className="text-[13px] text-foreground"
              style={{ fontVariationSettings: fontWeights.semibold }}
            >
              {tier.key}
            </span>
            <span className="font-mono text-[11px] text-muted-foreground/70">
              {tier.duration}
            </span>
          </div>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            {tier.components.join(" · ")}
          </p>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function MotionDoc() {
  return (
    <DocPage
      title="Motion"
      slug="motion"
      installSlug="springs"
      description="Three spring speeds, and exits that run a little quicker than entrances. Every component follows the same handful of rules."
    >
      <DocSection title="Spring tokens">
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Every animation pulls one of three springs from{" "}
          <Code>
            lib/springs
          </Code>
          . The bigger the thing that moves, the slower the spring: a hover state
          uses{" "}
          <Code>
            fast
          </Code>
          , a dropdown uses{" "}
          <Code>
            moderate
          </Code>
          , a dialog uses{" "}
          <Code>
            slow
          </Code>
          . Nothing picks its own duration, so two unrelated parts of the screen
          still move at the same pace.
        </p>
        <SpringTokensDemo />
      </DocSection>

      <DocSection title="Slow in, faster out">
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          The rule, made visible. Both modals open the same way, on{" "}
          <Code>
            spring.slow
          </Code>
          . The only thing that changes is the close: the left leaves on that
          same{" "}
          <Code>
            spring.slow
          </Code>
          , the right on{" "}
          <Code>
            spring.slow.exit
          </Code>{" "}
          — a tier quicker. Watch the slow one: it feels like the modal cannot
          quite commit to leaving.
        </p>
        <ModalExitDemo />
      </DocSection>

      <DocSection title="Where each speed shows up">
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          A high-level map of which component leads with which spring. Most
          components also use{" "}
          <Code>
            fast
          </Code>{" "}
          for their hover and focus states on top of this.
        </p>
        <SpeedUsageList />
      </DocSection>

      <DocSection title="Reference">
        <h3
          className="text-[15px] text-foreground"
          style={{ fontVariationSettings: fontWeights.semibold }}
        >
          Enter springs
        </h3>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Imported from{" "}
          <Code>
            lib/springs
          </Code>
          . Springs, with a little bounce on the larger tiers.
        </p>
        <PropsTable props={springTokens} />

        <h3
          className="mt-6 text-[15px] text-foreground"
          style={{ fontVariationSettings: fontWeights.semibold }}
        >
          Exit tweens
        </h3>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          From the same{" "}
          <Code>
            lib/springs
          </Code>
          . Plain tweens, no bounce, one tier quicker than the matching enter —
          pair{" "}
          <Code>
            spring.fast
          </Code>{" "}
          with{" "}
          <Code>
            spring.fast.exit
          </Code>
          , and so on. Never hand-write an exit{" "}
          <Code>
            {"{ duration }"}
          </Code>
          .
        </p>
        <PropsTable props={exitTokens} />
      </DocSection>
    </DocPage>
  );
}
