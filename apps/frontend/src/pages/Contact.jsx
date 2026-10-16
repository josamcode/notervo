// src/pages/Contact.jsx
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { showError, showSuccess } from "../utils/Toast";
import { PageHeader, Eyebrow } from "../components/ui/Primitives";
import Reveal from "../components/ui/Reveal";
import {
  ArrowRight,
  Chat,
  Check,
  Clock,
  Spinner,
} from "../components/ui/Icons";
import { MailIcon, ShieldIcon } from "./info/InfoKit";

/* ───────────── info cards data ───────────── */
const infoCards = [
  {
    icon: Chat,
    title: "Send a Message",
    description:
      "Use the form below and our team will respond within 24 hours.",
  },
  {
    icon: Clock,
    title: "Quick Response",
    description:
      "We reply to all messages during business hours, usually same-day.",
  },
  {
    icon: ShieldIcon,
    title: "Secure & Private",
    description:
      "Your messages are encrypted and only visible to our support team.",
  },
];

/* ───────────── main component ───────────── */
export default function ContactPage() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      showError("Message is required.");
      return;
    }

    setIsSubmitting(true);
    const token = Cookies.get("token");
    if (!token) {
      showError("Please log in to send a message.");
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/messages`,
        { message },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showSuccess("Message sent successfully.");
      setMessage("");
      setSent(true);
    } catch (err) {
      showError(
        err.response?.data?.message ||
          "Failed to send message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-ink">
      <PageHeader
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <MailIcon className="h-3.5 w-3.5" /> Get in Touch
          </span>
        }
        title="Contact Notervo"
        description="Questions about notebooks, orders, or delivery? Send a message and our team will reply shortly."
      />

      <div className="grid md:grid-cols-[minmax(320px,38%)_1fr] lg:grid-cols-[minmax(380px,29%)_1fr]">
        {/* ═══════════════ INFO ═══════════════ */}
        <aside className="order-2 px-4 pb-10 md:order-1 md:border-r md:border-ink-line md:px-[var(--gutter)] md:py-14">
          <Eyebrow className="mb-3 hidden text-muted md:mb-6 md:block">
            How we help
          </Eyebrow>
          <ul className="overflow-hidden rounded-2xl border border-ink/10 bg-white/60 md:rounded-none md:border-0 md:bg-transparent">
            {infoCards.map(({ icon: Ico, title, description }, i) => (
              <Reveal
                as="li"
                key={title}
                delay={i * 80}
                className="flex gap-4 border-b border-ink/10 p-4 last:border-b-0 md:border-ink-line md:px-0 md:py-6 md:first:border-t md:last:border-b"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/15 md:h-11 md:w-11 md:border-ink">
                  <Ico className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="font-sans text-[15px] font-medium md:text-[17px] md:font-normal">
                    {title}
                  </h2>
                  <p className="mt-1 text-[13px] leading-snug text-muted md:text-[14px]">
                    {description}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </aside>

        {/* ═══════════════ FORM ═══════════════ */}
        <section className="order-1 px-4 pb-8 md:order-2 md:px-[var(--gutter)] md:py-14 lg:px-20 lg:py-20">
          {sent ? (
            /* ───── Success state ───── */
            <div className="flex flex-col items-center rounded-2xl border border-ink/10 bg-white/60 px-6 py-12 text-center md:max-w-xl md:items-start md:rounded-none md:border-0 md:bg-transparent md:px-0 md:py-0 md:text-left">
              <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-cream">
                <Check className="h-6 w-6" />
              </span>
              <h2 className="font-serif text-[28px] font-light leading-tight md:text-display">
                Message Sent!
              </h2>
              <p className="mt-3 max-w-sm text-[15px] leading-snug text-muted">
                Thank you for reaching out. We'll review your message and get
                back to you as soon as possible.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="btn btn-outline btn-md mt-8"
              >
                <span>Send Another Message</span>
              </button>
            </div>
          ) : (
            /* ───── Form ───── */
            <div className="rounded-2xl border border-ink/10 bg-white/60 p-5 md:max-w-2xl md:rounded-none md:border-0 md:bg-transparent md:p-0">
              <Eyebrow className="mb-3 text-muted md:mb-5">
                Contact Form
              </Eyebrow>
              <h2 className="font-serif text-[26px] font-light leading-tight md:text-display">
                Send Us a Message
              </h2>
              <p className="mt-2 text-[14px] leading-snug text-muted md:mt-4 md:text-[16px]">
                Share your question and we'll respond with a clear next step.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5 md:mt-10">
                <div>
                  <label htmlFor="message" className="field-label">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="6"
                    required
                    placeholder="Tell us how we can help..."
                    className="field resize-none"
                    autoFocus
                  />
                  <div className="mt-2 flex justify-between px-1">
                    <p className="text-[12px] text-muted">
                      Be as descriptive as possible.
                    </p>
                    <p
                      className={`text-[12px] tabular-nums ${message.length > 1000 ? "text-ember" : "text-muted"}`}
                    >
                      {message.length}/1000
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="btn btn-solid btn-lg w-full md:w-auto md:min-w-[260px]"
                >
                  {isSubmitting ? (
                    <Spinner className="h-5 w-5" />
                  ) : (
                    <>
                      <span>Send Message</span>
                      <ArrowRight className="btn-icon h-[18px] w-[18px]" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
