// src/pages/Contact.jsx
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { showError, showSuccess } from "../utils/Toast";

/* ───────────── icons ───────────── */
const Icon = ({ children, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    {children}
  </svg>
);
const ChatIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
  </Icon>
);
const MailIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </Icon>
);
const ClockIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </Icon>
);
const ShieldIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </Icon>
);
const ArrowRightIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </Icon>
);
const CheckCircleIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </Icon>
);
const SpinnerIcon = ({ className = "" }) => (
  <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

/* ───────────── info cards data ───────────── */
const infoCards = [
  {
    icon: ChatIcon,
    title: "Send a Message",
    description: "Use the form below and our team will respond within 24 hours.",
  },
  {
    icon: ClockIcon,
    title: "Quick Response",
    description: "We reply to all messages during business hours, usually same-day.",
  },
  {
    icon: ShieldIcon,
    title: "Secure & Private",
    description: "Your messages are encrypted and only visible to our support team.",
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
        `${process.env.REACT_APP_API_URL}/messages`,
        { message },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );
      showSuccess("Message sent successfully.");
      setMessage("");
      setSent(true);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="text-gray-900">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden bg-primary py-20 sm:py-24">
        {/* Decorative */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/3 right-16 w-16 h-16 bg-white/5 rounded-full" />

        <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
            <MailIcon className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-xs font-semibold text-gray-200 uppercase tracking-wider">Get in Touch</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Contact Notervo
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Questions about notebooks, orders, or delivery? Send a message and our team will reply shortly.
          </p>
        </div>
      </section>

      {/* ═══════════════ INFO CARDS ═══════════════ */}
      <section className="max-w-4xl mx-auto px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {infoCards.map(({ icon: Ico, title, description }) => (
            <div
              key={title}
              className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 p-5 text-center"
            >
              <span className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center mx-auto mb-3">
                <Ico className="w-5 h-5 text-primary" />
              </span>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ FORM ═══════════════ */}
      <section className="max-w-2xl mx-auto px-6 py-16 sm:py-20">
        {sent ? (
          /* ───── Success state ───── */
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircleIcon className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed max-w-sm mx-auto">
              Thank you for reaching out. We'll review your message and get back to you as soon as possible.
            </p>
            <button
              onClick={() => setSent(false)}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-primary border-2 border-gray-200 rounded-xl hover:border-primary transition-all"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          /* ───── Form ───── */
          <>
            <div className="mb-8">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                <span className="w-6 h-px bg-primary" />
                Contact Form
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">
                Send Us a Message
              </h2>
              <p className="text-sm text-gray-500">
                Share your question and we'll respond with a clear next step.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="message" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Your Message *
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="6"
                  required
                  placeholder="Tell us how we can help..."
                  className="w-full px-4 py-4 text-sm border border-gray-200 rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary resize-none transition-all hover:border-gray-300"
                  autoFocus
                />
                <div className="flex justify-between mt-1.5 px-1">
                  <p className="text-[11px] text-gray-400">Be as descriptive as possible.</p>
                  <p className={`text-[11px] font-medium ${message.length > 1000 ? "text-red-500" : "text-gray-400"}`}>
                    {message.length}/1000
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="group w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-black transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-black/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <SpinnerIcon className="w-5 h-5" />
                ) : (
                  <>
                    Send Message
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}