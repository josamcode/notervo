// src/pages/MyMessages.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { showError } from "../utils/Toast";
import { EmptyState, PageHeader } from "../components/ui/Primitives";
import { Bell, Chat, Check, Clock } from "../components/ui/Icons";

/* ───────────── icons ───────────── */
const Icon = ({ children, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    aria-hidden="true"
    className={`w-5 h-5 ${className}`}
  >
    {children}
  </svg>
);
const InboxIcon = (p) => (
  <Icon {...p}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-17.5 0V6.108c0-1.135.845-2.098 1.976-2.192a48.424 48.424 0 0 1 11.048 0c1.131.094 1.976 1.057 1.976 2.192V13.5"
    />
  </Icon>
);
const ShieldIcon = (p) => (
  <Icon {...p}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
    />
  </Icon>
);
const ExclamationIcon = (p) => (
  <Icon {...p}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
    />
  </Icon>
);

/* ───────────── type config ───────────── */
const typeConfig = {
  system: {
    icon: ShieldIcon,
    badge: "bg-cream-deep text-ink",
    label: "System",
  },
  notification: {
    icon: Bell,
    badge: "bg-periwinkle text-ink",
    label: "Notification",
  },
  warning: {
    icon: ExclamationIcon,
    badge: "bg-ember/10 text-ember",
    label: "Warning",
  },
  reply: {
    icon: Chat,
    badge: "bg-ink text-cream",
    label: "Reply",
  },
  general: {
    icon: InboxIcon,
    badge: "bg-cream-deep text-ink",
    label: "General",
  },
};

const getTypeConfig = (type) => typeConfig[type] || typeConfig.general;

/* ───────────── time ago helper ───────────── */
const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

/* ───────────── filter tabs ───────────── */
const filterTabs = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "reply", label: "Replies" },
  { key: "notification", label: "Notifications" },
  { key: "warning", label: "Warnings" },
];

/* ───────────── main component ───────────── */
export default function MyMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          showError("Not authenticated.");
          setLoading(false);
          return;
        }
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/message-to-user/my`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data.success) setMessages(res.data.messages);
      } catch (err) {
        showError(err.response?.data?.message || "Failed to load messages.");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  // Mark all as read
  useEffect(() => {
    if (messages.length > 0 && !messages.every((m) => m.isRead)) {
      const unreadIds = messages.filter((m) => !m.isRead).map((m) => m._id);
      axios
        .put(
          `${import.meta.env.VITE_API_URL}/message-to-user/mark-read`,
          { messageIds: unreadIds },
          { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
        )
        .catch(console.error);
    }
  }, [messages]);

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const filtered = messages.filter((msg) => {
    if (filter === "all") return true;
    if (filter === "unread") return !msg.isRead;
    return msg.type === filter;
  });

  /* ───── Loading ───── */
  if (loading) {
    return (
      <div aria-busy="true">
        <div className="container-x pb-5 pt-4 md:border-b md:border-ink-line md:pb-8 md:pt-12">
          <div className="skeleton h-3 w-20" />
          <div className="skeleton mt-4 h-9 w-48 md:h-14 md:w-72" />
          <div className="skeleton mt-4 h-4 w-64" />
        </div>
        <div className="container-x">
          <div className="mx-auto max-w-3xl space-y-3 py-6 md:space-y-0 md:py-10">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-ink/10 p-5 md:rounded-none md:border-0 md:border-b md:px-0 md:py-6"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="skeleton h-5 w-24 rounded-full" />
                  <div className="skeleton h-3 w-16" />
                </div>
                <div className="skeleton mb-2 h-4 w-full" />
                <div className="skeleton h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Account"
        title="Messages"
        description="Updates, replies, and notifications from Notervo."
        actions={
          unreadCount > 0 ? (
            <span className="badge bg-ink text-cream">{unreadCount} new</span>
          ) : null
        }
      />

      <div className="container-x">
        <div className="mx-auto max-w-3xl pb-10 pt-2 md:pt-10">
          {/* Filter tabs */}
          {messages.length > 0 && (
            <div
              role="group"
              aria-label="Filter messages"
              className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 md:mx-0 md:mb-8 md:px-0"
            >
              {filterTabs.map(({ key, label }) => {
                const active = filter === key;
                const count =
                  key === "all"
                    ? messages.length
                    : key === "unread"
                      ? unreadCount
                      : messages.filter((m) => m.type === key).length;

                if (count === 0 && key !== "all") return null;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFilter(key)}
                    aria-pressed={active}
                    className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-[13px] transition-colors duration-200 ${
                      active
                        ? "border-ink bg-ink text-cream"
                        : "border-ink/25 text-ink hover:border-ink"
                    }`}
                  >
                    {label}
                    <span className={active ? "text-cream/70" : "text-muted"}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {messages.length === 0 ? (
            <EmptyState
              icon={InboxIcon}
              title="No messages yet"
              description="You haven't received any messages from Notervo."
              className="!py-12 md:!py-20"
            />
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[14px] text-muted">
                No messages match this filter.
              </p>
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="link-underline mt-3 text-[13px] uppercase text-ink"
              >
                View all messages
              </button>
            </div>
          ) : (
            /* Message list */
            <ul className="space-y-3 md:space-y-0 md:border-t md:border-ink/15">
              {filtered.map((msg) => {
                const cfg = getTypeConfig(msg.type);
                const TypeIcon = cfg.icon;
                const isUnread = !msg.isRead;

                return (
                  <li
                    key={msg._id}
                    className={`relative overflow-hidden rounded-2xl border bg-white/60 md:rounded-none md:border-0 md:border-b md:border-ink/15 md:bg-transparent ${
                      isUnread ? "border-ink/30" : "border-ink/10"
                    }`}
                  >
                    {/* Unread indicator line */}
                    {isUnread && (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-0 top-0 w-[3px] bg-ink"
                      />
                    )}

                    <div className="p-4 pl-5 md:py-6 md:pl-6 md:pr-0">
                      {/* Top row: type badge + time */}
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className={`badge ${cfg.badge}`}>
                            <TypeIcon className="h-3.5 w-3.5" />
                            {cfg.label}
                          </span>
                          {isUnread && (
                            <span className="flex items-center gap-1.5 text-[12px] uppercase text-ink">
                              <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                              New
                            </span>
                          )}
                        </div>
                        <span className="flex shrink-0 items-center gap-1 text-[12px] text-muted">
                          <Clock className="h-3.5 w-3.5" />
                          {timeAgo(msg.createdAt)}
                        </span>
                      </div>

                      {/* Message content */}
                      <p className="whitespace-pre-line text-[15px] leading-relaxed text-ink md:text-[16px]">
                        {msg.content}
                      </p>

                      {/* Bottom row: read status */}
                      <div className="mt-3">
                        {isUnread ? (
                          <span className="text-[12px] text-ink">Unread</span>
                        ) : (
                          <span className="flex items-center gap-1 text-[12px] text-muted">
                            <Check className="h-3.5 w-3.5" />
                            Read
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Messages count */}
          {filtered.length > 0 && (
            <p className="mt-8 text-center text-[12px] text-muted">
              Showing {filtered.length} of {messages.length} messages
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
