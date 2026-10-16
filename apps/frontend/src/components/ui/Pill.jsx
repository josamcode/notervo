import { Link } from "react-router-dom";
import { ArrowRight } from "./Icons";

const VARIANTS = {
  outline: "btn-outline",
  light: "btn-light",
  solid: "btn-solid",
  cream: "btn-cream",
};
const SIZES = { sm: "btn-sm", md: "btn-md", lg: "btn-lg" };

const pillClass = (variant, size, className) =>
  `btn ${VARIANTS[variant] || VARIANTS.outline} ${SIZES[size] || SIZES.md} ${className}`.trim();

/**
 * Karst-style pill: outline by default, background wipes in on hover and the
 * arrow nudges forward. Renders a router Link when `to` is set.
 */
export default function Pill({
  to,
  href,
  variant = "outline",
  size = "md",
  arrow = false,
  className = "",
  children,
  type = "button",
  ...rest
}) {
  const content = (
    <>
      <span>{children}</span>
      {arrow && <ArrowRight className="btn-icon h-[18px] w-[18px]" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={pillClass(variant, size, className)} {...rest}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={pillClass(variant, size, className)} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={pillClass(variant, size, className)}
      {...rest}
    >
      {content}
    </button>
  );
}
