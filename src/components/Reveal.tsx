"use client";

import { useEffect, useRef, useState, type ElementType, type HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  /** Stagger position inside its section: 0, 1, 2… */
  i?: number;
};

/**
 * A small rise as the element enters the viewport. The server and the first client render are the
 * same plain, visible element; the reveal state is only set after mount, and only for elements that
 * start below the fold, so nothing on screen ever waits for an animation.
 */
export default function Reveal({ as: Tag = "div", i = 0, className = "", style, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<"idle" | "below" | "in">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let first = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (first) {
          first = false;
          // Already on screen when the page loads: leave it alone.
          if (entry.isIntersecting) return io.disconnect();
          return setPhase("below");
        }
        if (entry.isIntersecting) {
          setPhase("in");
          io.disconnect();
        }
      },
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = [className, phase === "below" && "reveal-below", phase === "in" && "reveal-in"].filter(Boolean).join(" ");
  return <Tag ref={ref} className={cls || undefined} style={{ "--i": i, ...style } as React.CSSProperties} {...rest} />;
}
