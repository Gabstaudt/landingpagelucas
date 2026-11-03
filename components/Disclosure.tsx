"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useState, type ReactNode } from "react";

export function Disclosure({ title, context, children }: { title: string; context?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const reducedMotion = useReducedMotion();
  return (
    <div className={`disclosure ${open ? "is-expanded" : ""}`}>
      <button type="button" id={`${id}-trigger`} aria-expanded={open} aria-controls={`${id}-panel`} onClick={() => setOpen(value => !value)} className="disclosure-trigger">
        <span>{title}{context && <span className="sr-only">: {context}</span>}</span>
        <span className="disclosure-icon" aria-hidden="true"><span /><span /></span>
      </button>
      <AnimatePresence initial={false}>
        {open && <motion.div id={`${id}-panel`} role="region" aria-labelledby={`${id}-trigger`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .3, ease: [.2, .8, .2, 1] }} className="overflow-hidden">
          <div className="disclosure-body">{children}</div>
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}
