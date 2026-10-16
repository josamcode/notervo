/* Shared stroke icons for the storefront (24×24, currentColor). */
const Svg = ({
  className = "w-5 h-5",
  strokeWidth = 1.5,
  children,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={strokeWidth}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className={className}
    {...rest}
  >
    {children}
  </svg>
);

export const ArrowRight = (p) => (
  <Svg {...p}>
    <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" />
  </Svg>
);
export const ArrowLeft = (p) => (
  <Svg {...p}>
    <path d="M20 12H5m0 0 5.5-5.5M5 12l5.5 5.5" />
  </Svg>
);
export const ChevronRight = (p) => (
  <Svg {...p}>
    <path d="m9 5 7 7-7 7" />
  </Svg>
);
export const ChevronLeft = (p) => (
  <Svg {...p}>
    <path d="m15 5-7 7 7 7" />
  </Svg>
);
export const ChevronDown = (p) => (
  <Svg {...p}>
    <path d="m5 9 7 7 7-7" />
  </Svg>
);
export const Plus = (p) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);
export const Minus = (p) => (
  <Svg {...p}>
    <path d="M5 12h14" />
  </Svg>
);
export const Close = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);
export const Search = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </Svg>
);
export const Heart = (p) => (
  <Svg {...p}>
    <path d="M20.5 8.6c0-2.4-2-4.35-4.5-4.35-1.86 0-3.46 1.08-4.15 2.63-.69-1.55-2.29-2.63-4.15-2.63-2.49 0-4.5 1.95-4.5 4.35 0 6.95 8.65 11.55 8.65 11.55s8.65-4.6 8.65-11.55Z" />
  </Svg>
);
export const HeartSolid = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path d="m11.65 20.91-.01-.01-.02-.01a15.2 15.2 0 0 1-.38-.22 25.2 25.2 0 0 1-4.25-3.17C4.69 15.36 2.25 12.17 2.25 8.25 2.25 5.32 4.71 3 7.69 3A5.5 5.5 0 0 1 12 5.05 5.5 5.5 0 0 1 16.31 3c2.98 0 5.44 2.32 5.44 5.25 0 3.93-2.44 7.11-4.74 9.26a25.2 25.2 0 0 1-4.24 3.17 15.2 15.2 0 0 1-.38.22l-.02.01-.01.01a.75.75 0 0 1-.7 0Z" />
  </svg>
);
export const Bag = (p) => (
  <Svg {...p}>
    <path d="M6 7.5h12l1 12.5H5L6 7.5Z" />
    <path d="M9 9.5V6.75a3 3 0 0 1 6 0V9.5" />
  </Svg>
);
export const User = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="3.75" />
    <path d="M4.75 20.25a7.25 7.25 0 0 1 14.5 0" />
  </Svg>
);
export const Bell = (p) => (
  <Svg {...p}>
    <path d="M14.86 17.08a23.8 23.8 0 0 0 5.45-1.31A8.97 8.97 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.97 8.97 0 0 1-2.31 6.02c1.73.64 3.56 1.09 5.45 1.31m5.72 0a24.3 24.3 0 0 1-5.72 0m5.72 0a3 3 0 1 1-5.72 0" />
  </Svg>
);
export const Trash = (p) => (
  <Svg {...p}>
    <path d="M4.5 6.5h15M9.5 6.5V4.75h5V6.5M6.5 6.5l.85 12.75h9.3l.85-12.75M10 10.5v5.5M14 10.5v5.5" />
  </Svg>
);
export const Check = (p) => (
  <Svg {...p}>
    <path d="m4.5 12.75 6 6 9-13.5" />
  </Svg>
);
export const Truck = (p) => (
  <Svg {...p}>
    <path d="M2.75 6.25h10.5v9.5H2.75zM13.25 9.75h4.1l3.9 3.6v2.4h-8" />
    <circle cx="7" cy="17.5" r="1.75" />
    <circle cx="17.25" cy="17.5" r="1.75" />
  </Svg>
);
export const Return = (p) => (
  <Svg {...p}>
    <path d="M9 14.5 4 9.5l5-5" />
    <path d="M4 9.5h10.5a5.5 5.5 0 0 1 0 11H11" />
  </Svg>
);
export const Cash = (p) => (
  <Svg {...p}>
    <rect x="2.75" y="6.25" width="18.5" height="11.5" rx="1.5" />
    <circle cx="12" cy="12" r="2.5" />
    <path d="M6 9.25v.01M18 14.75v.01" />
  </Svg>
);
export const Layout = (p) => (
  <Svg {...p}>
    <rect x="4.25" y="3.25" width="15.5" height="17.5" rx="1" />
    <path d="M8 7.75h8M8 11.25h8M8 14.75h5" />
  </Svg>
);
export const Feather = (p) => (
  <Svg {...p}>
    <path d="M19.5 4.5c-6 0-11.25 4.5-12.75 12.75L5 19.5" />
    <path d="M19.5 4.5c0 6.75-4.5 11.25-11.25 11.25M11.25 12.75h4.5" />
  </Svg>
);
export const Circle = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="7.75" />
    <path
      d="M12 4.25a7.75 7.75 0 0 0 0 15.5Z"
      fill="currentColor"
      stroke="none"
    />
  </Svg>
);
export const Clock = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.25" />
    <path d="M12 7.5V12l3 2" />
  </Svg>
);
export const Grid = (p) => (
  <Svg {...p}>
    <rect x="4" y="4" width="6.5" height="6.5" rx="1" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" />
  </Svg>
);
export const Tag = (p) => (
  <Svg {...p}>
    <path d="M3.75 4.75v5.1c0 .53.21 1.04.59 1.41l8.9 8.9a2 2 0 0 0 2.83 0l4.27-4.27a2 2 0 0 0 0-2.83l-8.9-8.9a2 2 0 0 0-1.41-.59h-5.1a1.1 1.1 0 0 0-1.18 1.18Z" />
    <circle cx="8" cy="8.5" r="1" />
  </Svg>
);
export const Sparkle = (p) => (
  <Svg {...p}>
    <path d="M12 3.5 13.7 10.3 20.5 12l-6.8 1.7L12 20.5l-1.7-6.8L3.5 12l6.8-1.7L12 3.5Z" />
  </Svg>
);
export const Chat = (p) => (
  <Svg {...p}>
    <path d="M4.5 5.75h15v10.5H10l-4.5 3.5v-3.5h-1V5.75Z" />
  </Svg>
);
export const Filter = (p) => (
  <Svg {...p}>
    <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="8" cy="17" r="2" />
  </Svg>
);
export const Star = ({ className = "w-4 h-4", filled = true }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
    className={className}
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={filled ? 0 : 1.5}
  >
    <path d="M10.79 3.21c.45-1.08 1.97-1.08 2.42 0l2.08 5 5.4.44c1.17.09 1.64 1.55.75 2.3l-4.11 3.53 1.25 5.27c.27 1.14-.96 2.04-1.96 1.43L12 18.35l-4.63 2.83c-1 .61-2.23-.29-1.96-1.43l1.26-5.27-4.12-3.53c-.89-.75-.41-2.21.75-2.3l5.4-.44 2.09-5Z" />
  </svg>
);
export const Spinner = ({ className = "w-4 h-4" }) => (
  <svg
    className={`animate-spin ${className}`}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      opacity="0.25"
    />
    <path
      d="M21 12a9 9 0 0 0-9-9"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);
