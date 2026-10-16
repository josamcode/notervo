import { useEffect, useRef } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Adds `is-visible` once the element scrolls into view (one-shot). */
export function useReveal(options = {}) {
  const ref = useRef(null);
  const { threshold = 0.15, rootMargin = "0px 0px -8% 0px" } = options;

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      node.classList.add("is-visible");
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return ref;
}

/**
 * Scroll-triggered entrance matching Karst's `appear-up` (0.6s, 1rem rise).
 * `delay` staggers siblings; `fade` uses opacity only.
 */
export default function Reveal({
  as: Tag = "div",
  delay = 0,
  fade = false,
  className = "",
  style,
  children,
  ...rest
}) {
  const ref = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${fade ? "reveal-fade" : ""} ${className}`}
      style={{ ...style, "--reveal-delay": `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
