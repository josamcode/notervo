import { useEffect, useState } from "react";

const query = (q) =>
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia(q).matches
    : false;

export default function useMediaQuery(mediaQuery) {
  const [matches, setMatches] = useState(() => query(mediaQuery));

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mql = window.matchMedia(mediaQuery);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [mediaQuery]);

  return matches;
}

/** Desktop storefront vs. mobile app shell; mirrors Tailwind's `md` screen. */
export const DESKTOP_QUERY = "(min-width: 768px) and (min-height: 500px)";
export const useIsDesktop = () => useMediaQuery(DESKTOP_QUERY);
