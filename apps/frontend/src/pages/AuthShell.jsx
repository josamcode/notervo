// Page-level layout shared by Login and Register.
import { useEffect, useState } from "react";
import SmartImage from "../components/ui/SmartImage";
import { fetchNotebookCategories } from "../utils/catalog";

const EyeIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
);
const EyeSlashIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
    />
  </svg>
);
const AlertIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
    />
  </svg>
);

/**
 * Desktop: form column + full-height category image panel (Karst split).
 * Mobile: single app-style column below the sticky top bar.
 */
export default function AuthShell({
  imageIndex = 0,
  panelTitle,
  panelText,
  panelFooter,
  children,
}) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    let active = true;
    fetchNotebookCategories()
      .then((list) => {
        if (!active || !list.length) return;
        setImage(list[imageIndex % list.length]?.imageUrl || null);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [imageIndex]);

  return (
    <div className="md:grid md:min-h-[calc(100svh-var(--header-h))] md:grid-cols-2">
      <div className="flex justify-center px-4 pb-10 pt-6 md:items-center md:px-[var(--gutter)] md:py-16">
        <div className="w-full max-w-[420px]">{children}</div>
      </div>

      <aside
        aria-hidden="true"
        className="relative hidden overflow-hidden border-l border-ink-line bg-ink md:block"
      >
        {image && (
          <SmartImage
            src={image}
            alt=""
            width={1400}
            sizes="50vw"
            loading="eager"
            className="absolute inset-0 h-full w-full animate-[appear_1.2s_ease_forwards] object-cover"
          />
        )}
        <div className="absolute inset-0 bg-ink/20" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-10 text-cream lg:p-12">
          <p className="eyebrow text-cream/80">Notervo</p>
          <h2 className="mt-4 max-w-md font-serif text-display font-light lg:text-display-lg">
            {panelTitle}
          </h2>
          {panelText && (
            <p className="mt-5 max-w-sm text-[16px] leading-snug text-cream/85">
              {panelText}
            </p>
          )}
          {panelFooter}
        </div>
      </aside>
    </div>
  );
}

export function AuthHeading({ title, description }) {
  return (
    <div className="mb-7 md:mb-10">
      <h1 className="font-serif text-[32px] font-light leading-[1.02] tracking-tight md:text-display-lg">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-[14px] leading-snug text-muted md:mt-4 md:text-[16px]">
          {description}
        </p>
      )}
    </div>
  );
}

export function AuthError({ children }) {
  return (
    <div
      role="alert"
      className="mb-5 flex items-start gap-2.5 rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 md:rounded-none"
    >
      <AlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-ember" />
      <p className="text-[14px] leading-snug text-ink">{children}</p>
    </div>
  );
}

/** Password field with a 44px show/hide toggle inside the input. */
export function PasswordField({
  id,
  label,
  name,
  value,
  onChange,
  show,
  onToggle,
  autoComplete,
  required,
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          className="field pr-12"
        />
        <button
          type="button"
          onClick={onToggle}
          className="icon-btn absolute right-0.5 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full text-muted hover:text-ink"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? (
            <EyeIcon className="h-[18px] w-[18px]" />
          ) : (
            <EyeSlashIcon className="h-[18px] w-[18px]" />
          )}
        </button>
      </div>
    </div>
  );
}

export function OrDivider() {
  return (
    <div className="my-7 flex items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-ink/15" />
      <span className="text-[12px] uppercase text-muted">or</span>
      <span className="h-px flex-1 bg-ink/15" />
    </div>
  );
}
