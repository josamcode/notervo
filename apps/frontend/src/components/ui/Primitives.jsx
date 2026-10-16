import { Link } from "react-router-dom";
import Pill from "./Pill";
import { ChevronLeft } from "./Icons";

export const CURRENCY = "EGP";

export const formatMoney = (value) =>
  `${(Number(value) || 0).toFixed(2)} ${CURRENCY}`;

/** Price with optional struck-through compare-at value. */
export function Price({
  value,
  compareAt,
  className = "",
  compareClassName = "",
}) {
  const hasCompare = Number(compareAt) > Number(value);
  return (
    <span
      className={`inline-flex flex-wrap items-baseline gap-x-2 ${className}`}
    >
      <span>{formatMoney(value)}</span>
      {hasCompare && (
        <span className={`text-muted line-through ${compareClassName}`}>
          <span className="sr-only">Was </span>
          {formatMoney(compareAt)}
        </span>
      )}
    </span>
  );
}

/** Uppercase micro label used above serif headings. */
export function Eyebrow({ children, className = "" }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

/**
 * Page heading. Desktop: editorial serif title between hairlines.
 * Mobile: compact app-style title with optional back affordance.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  backTo,
  backLabel = "Back",
  className = "",
}) {
  return (
    <header
      className={`container-x pb-5 pt-4 md:border-b md:border-ink-line md:pb-8 md:pt-12 ${className}`}
    >
      {backTo && (
        <Link
          to={backTo}
          className="mb-3 inline-flex items-center gap-1 text-[13px] text-muted hover:text-ink md:hidden"
        >
          <ChevronLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      )}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <Eyebrow className="mb-2 text-muted md:mb-4">{eyebrow}</Eyebrow>
          )}
          <h1 className="font-serif text-[30px] font-light leading-[1.02] tracking-tight text-ink md:text-display-lg">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-xl text-[14px] leading-snug text-muted md:mt-4 md:text-[17px]">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-3">{actions}</div>
        )}
      </div>
    </header>
  );
}

/** Empty / error state with an outline pill CTA. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  className = "",
}) {
  return (
    <div
      className={`mx-auto flex max-w-md flex-col items-center px-6 py-16 text-center md:py-28 ${className}`}
    >
      {Icon && (
        <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-ink/15 text-ink">
          <Icon className="h-7 w-7" />
        </span>
      )}
      <h2 className="font-serif text-[28px] font-light leading-tight md:text-[40px]">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-[15px] leading-snug text-muted">
          {description}
        </p>
      )}
      {actionLabel && (actionTo || onAction) && (
        <Pill
          to={actionTo}
          onClick={onAction}
          variant="outline"
          size="md"
          arrow
          className="mt-8"
        >
          {actionLabel}
        </Pill>
      )}
    </div>
  );
}

/** Uppercase label + value row used in summaries. */
export function SummaryRow({
  label,
  children,
  strong = false,
  className = "",
}) {
  return (
    <div
      className={`flex items-baseline justify-between gap-4 ${strong ? "text-[17px] text-ink" : "text-[14px] text-muted"} ${className}`}
    >
      <span>{label}</span>
      <span className={strong ? "font-medium" : "text-ink"}>{children}</span>
    </div>
  );
}
