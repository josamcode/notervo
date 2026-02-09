// src/pages/MyMessages.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { showError } from "../utils/Toast";

/* ───────────── icons ───────────── */
const Icon = ({ children, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    {children}
  </svg>
);
const BellIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
  </Icon>
);
const ClockIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </Icon>
);
const CheckIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </Icon>
);
const InboxIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-17.5 0V6.108c0-1.135.845-2.098 1.976-2.192a48.424 48.424 0 0 1 11.048 0c1.131.094 1.976 1.057 1.976 2.192V13.5" />
  </Icon>
);
const ShieldIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </Icon>
);
const ExclamationIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
  </Icon>
);
const ChatIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
  </Icon>
);

/* ───────────── type config ───────────── */
const typeConfig = {
  system: { icon: ShieldIcon, bg: "bg-gray-50", border: "border-gray-200", dot: "bg-gray-500", label: "System" },
  notification: { icon: BellIcon, bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-500", label: "Notification" },
  warning: { icon: ExclamationIcon, bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-500", label: "Warning" },
  reply: { icon: ChatIcon, bg: "bg-green-50", border: "border-green-200", dot: "bg-green-500", label: "Reply" },
  general: { icon: InboxIcon, bg: "bg-gray-50", border: "border-gray-200", dot: "bg-gray-500", label: "General" },
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
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/message-to-user/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
          `${process.env.REACT_APP_API_URL}/message-to-user/mark-read`,
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-2" />
        <div className="h-4 w-64 bg-gray-100 rounded animate-pulse mb-8" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="h-5 w-20 bg-gray-100 rounded-full animate-pulse" />
                <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="h-4 w-full bg-gray-100 rounded animate-pulse mb-2" />
              <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Messages
          </h1>
          {unreadCount > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-primary text-white text-xs font-bold">
              {unreadCount} new
            </span>
          )}
        </div>
        <p className="text-gray-500 text-sm">
          Updates, replies, and notifications from Notervo.
        </p>
      </div>

      {/* Filter tabs */}
      {messages.length > 0 && (
        <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1 scrollbar-hide">
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
                onClick={() => setFilter(key)}
                className={`
                                    flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200
                                    ${active
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary"
                  }
                                `}
              >
                {label}
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${active ? "bg-white/20" : "bg-gray-100"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {messages.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gray-100 flex items-center justify-center">
            <InboxIcon className="w-7 h-7 text-gray-400" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">No messages yet</h3>
          <p className="text-sm text-gray-500">
            You haven't received any messages from Notervo.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-gray-500">No messages match this filter.</p>
          <button
            onClick={() => setFilter("all")}
            className="text-sm text-primary font-medium mt-2 hover:underline"
          >
            View all messages
          </button>
        </div>
      ) : (
        /* Message list */
        <div className="space-y-3">
          {filtered.map((msg) => {
            const cfg = getTypeConfig(msg.type);
            const TypeIcon = cfg.icon;
            const isUnread = !msg.isRead;

            return (
              <div
                key={msg._id}
                className={`
                                    relative bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md
                                    ${isUnread ? "border-primary/20" : "border-gray-100"}
                                `}
              >
                {/* Unread indicator line */}
                {isUnread && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-2xl" />
                )}

                <div className="p-5">
                  {/* Top row: type badge + time */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${cfg.bg} ${cfg.border} border`}>
                        <TypeIcon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                      {isUnread && (
                        <span className="flex items-center gap-1 text-primary text-[11px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                          New
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-[11px] text-gray-400">
                      <ClockIcon className="w-3 h-3" />
                      {timeAgo(msg.createdAt)}
                    </span>
                  </div>

                  {/* Message content */}
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {msg.content}
                  </p>

                  {/* Bottom row: read status */}
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    {isUnread ? (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-primary">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Unread
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <CheckIcon className="w-3 h-3" />
                        Read
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Messages count */}
      {filtered.length > 0 && (
        <p className="text-center text-xs text-gray-400 mt-8">
          Showing {filtered.length} of {messages.length} messages
        </p>
      )}
    </main>
  );
}