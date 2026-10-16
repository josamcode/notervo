import { useEffect, useId, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { PageHeader } from "../../components/ui/Primitives";
import Reveal from "../../components/ui/Reveal";
import { Minus, Plus } from "../../components/ui/Icons";
import { fetchNotebookCategories } from "../../utils/catalog";

/* Helpers shared by the informational pages (About, Help, Shipping, policies). */

const Svg = ({ className = "w-5 h-5", strokeWidth = 1.5, children }) => (
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
  >
    {children}
  </svg>
);

export const MailIcon = (p) => (
  <Svg {...p}>
    <rect x="3" y="5.25" width="18" height="13.5" rx="1.5" />
    <path d="m3.75 6.5 8.25 6 8.25-6" />
  </Svg>
);
export const ShieldIcon = (p) => (
  <Svg {...p}>
    <path d="M12 3.25 4.75 6v5.5c0 4.35 3.05 8 7.25 9.25 4.2-1.25 7.25-4.9 7.25-9.25V6L12 3.25Z" />
    <path d="m9 12.25 2.1 2.1L15 10.5" />
  </Svg>
);
export const PinIcon = (p) => (
  <Svg {...p}>
    <path d="M19 10.25c0 6.25-7 10.5-7 10.5s-7-4.25-7-10.5a7 7 0 1 1 14 0Z" />
    <circle cx="12" cy="10.25" r="2.5" />
  </Svg>
);
export const CardIcon = (p) => (
  <Svg {...p}>
    <rect x="2.75" y="5.25" width="18.5" height="13.5" rx="1.5" />
    <path d="M2.75 9.5h18.5M6.5 15h4" />
  </Svg>
);
export const PersonIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.75" />
    <circle cx="12" cy="10" r="2.75" />
    <path d="M6.6 18.4a6 6 0 0 1 10.8 0" />
  </Svg>
);
export const PenIcon = (p) => (
  <Svg {...p}>
    <path d="m16.5 4.5 3 3L8 19l-4 1 1-4L16.5 4.5Z" />
  </Svg>
);
export const EyeIcon = (p) => (
  <Svg {...p}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="2.75" />
  </Svg>
);

/** Admin-managed notebook category images, used as editorial imagery. */
export function useCategoryImages() {
  const [images, setImages] = useState([]);
  useEffect(() => {
    let active = true;
    fetchNotebookCategories()
      .then((list) => {
        if (active) setImages(list.map((c) => c.imageUrl).filter(Boolean));
      })
      .catch(() => active && setImages([]));
    return () => {
      active = false;
    };
  }, []);
  return images;
}

/** Karst-style accordion row: hairline separated, plus / minus toggle. */
export function AccordionItem({ question, answer, open, onToggle }) {
  const id = useId();
  return (
    <div className="border-b border-ink/15 md:border-ink-line">
      <h3 className="font-sans">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          className="flex min-h-[56px] w-full items-center justify-between gap-6 py-4 text-left text-[16px] text-ink md:py-5 md:text-[18px]"
        >
          <span>{question}</span>
          <span className="icon-btn h-8 w-8 shrink-0 rounded-full border border-ink/20 md:border-ink">
            {open ? (
              <Minus className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </span>
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        className="grid transition-[grid-template-rows] duration-300 ease-karst"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="max-w-2xl pb-5 text-[15px] leading-relaxed text-muted">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

const POLICY_LINKS = [
  ["/shipping", "Shipping & delivery"],
  ["/return-policy", "Returns & exchanges"],
  ["/privacy-policy", "Privacy policy"],
  ["/terms-of-service", "Terms of service"],
];

/**
 * Editorial legal page: serif title between hairlines, a sticky index of
 * sections and sibling policies on desktop, stacked readable sections on phones.
 */
export function PolicyLayout({ title, updated, intro, sections }) {
  return (
    <div className="text-ink">
      <PageHeader eyebrow="Policies" title={title} description={updated} />

      <div className="container-x grid gap-10 pb-16 pt-4 md:grid-cols-[minmax(220px,29%)_1fr] md:gap-0 md:pb-28 md:pt-0">
        <aside className="hidden md:block md:border-r md:border-ink-line md:pr-10 md:pt-12">
          <nav
            aria-label="On this page"
            className="sticky top-[calc(var(--bar-h)+32px)]"
          >
            <p className="eyebrow mb-4 text-muted">On this page</p>
            <ul className="space-y-2.5">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="link-underline text-[15px] text-ink/85 hover:text-ink"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
            <p className="eyebrow mb-4 mt-12 text-muted">More policies</p>
            <ul className="space-y-2.5">
              {POLICY_LINKS.map(([to, label]) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `link-underline text-[15px] ${isActive ? "text-ink bg-[length:100%_1px]" : "text-ink/70 hover:text-ink"}`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <article className="md:pl-12 md:pt-12 lg:pl-20">
          {intro && (
            <Reveal>
              <p className="max-w-2xl font-serif text-[22px] font-light leading-[1.25] md:text-[30px]">
                {intro}
              </p>
            </Reveal>
          )}
          <div className="mt-8 space-y-3 md:mt-14 md:space-y-0">
            {sections.map((s) => (
              <Reveal
                as="section"
                key={s.id}
                id={s.id}
                aria-labelledby={`${s.id}-title`}
                className="scroll-mt-28 rounded-2xl border border-ink/10 bg-white/60 p-5 md:rounded-none md:border-0 md:border-t md:border-ink-line md:bg-transparent md:px-0 md:py-10"
              >
                <div className="grid gap-3 md:grid-cols-[minmax(180px,34%)_1fr] md:gap-10">
                  <h2
                    id={`${s.id}-title`}
                    className="font-serif text-[22px] font-light leading-tight md:text-[28px]"
                  >
                    {s.title}
                  </h2>
                  <div className="max-w-2xl text-[15px] leading-relaxed text-ink/85 md:text-[16px] [&_li]:relative [&_li]:pl-5 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.7em] [&_li]:before:h-px [&_li]:before:w-2.5 [&_li]:before:bg-ink [&_ol]:space-y-2.5 [&_strong]:font-medium [&_strong]:text-ink [&_ul]:space-y-2.5">
                    {s.content}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <nav aria-label="More policies" className="mt-10 md:hidden">
            <p className="eyebrow mb-3 px-1 text-muted">More policies</p>
            <ul className="overflow-hidden rounded-2xl border border-ink/10 bg-white/60">
              {POLICY_LINKS.map(([to, label]) => (
                <li key={to} className="border-b border-ink/10 last:border-b-0">
                  <Link
                    to={to}
                    className="flex min-h-[52px] items-center justify-between px-4 text-[15px]"
                  >
                    {label}
                    <span aria-hidden="true" className="text-ink/40">
                      ›
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </article>
      </div>
    </div>
  );
}
