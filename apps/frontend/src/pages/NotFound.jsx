// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import Pill from "../components/ui/Pill";
import { Eyebrow } from "../components/ui/Primitives";

const NotFound = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center text-ink md:min-h-[calc(100svh-var(--header-h))] md:py-24">
      <Eyebrow className="text-muted">Error 404</Eyebrow>

      <p
        aria-hidden="true"
        className="mt-4 select-none font-serif text-[120px] font-light leading-[0.85] tracking-[-0.04em] text-ink/15 md:mt-6 md:text-[220px]"
      >
        404
      </p>

      <h1 className="-mt-4 font-serif text-[34px] font-light leading-none tracking-tight md:-mt-10 md:text-display-lg">
        Page not found
      </h1>

      <p className="mx-auto mt-5 max-w-sm text-[15px] leading-snug text-muted md:text-[17px]">
        Sorry, the page you&#39;re looking for doesn&#39;t exist or has been
        moved to a different location.
      </p>

      <div className="mt-9 flex w-full max-w-xs flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
        <Pill to="/" variant="solid" size="lg" className="w-full sm:w-auto">
          Go back home
        </Pill>
        <Pill
          to="/shop"
          variant="outline"
          size="lg"
          arrow
          className="w-full sm:w-auto"
        >
          Browse shop
        </Pill>
      </div>

      <p className="mt-10 text-[13px] text-muted">
        If you believe this is an error, please{" "}
        <Link
          to="/contact"
          className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
        >
          contact us
        </Link>
        .
      </p>
    </div>
  );
};

export default NotFound;
