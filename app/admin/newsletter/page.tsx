"use client";

import { useState } from "react";
import { Search, Mail, UserMinus, Download } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Subscriber = {
  id: number;
  email: string;
  name: string | null;
  subscribed: boolean;
  createdAt: Date;
};

const stubSubscribers: Subscriber[] = [
  { id: 1, email: "sarah@example.com", name: "Sarah Chen", subscribed: true, createdAt: new Date("2025-03-20") },
  { id: 2, email: "mike@example.com", name: "Mike Johnson", subscribed: true, createdAt: new Date("2025-03-18") },
  { id: 3, email: "emma@example.com", name: "Emma Wilson", subscribed: true, createdAt: new Date("2025-03-15") },
  { id: 4, email: "alex@example.com", name: null, subscribed: true, createdAt: new Date("2025-03-12") },
  { id: 5, email: "lisa@example.com", name: "Lisa Park", subscribed: true, createdAt: new Date("2025-03-10") },
  { id: 6, email: "david@example.com", name: "David Kim", subscribed: false, createdAt: new Date("2025-03-05") },
  { id: 7, email: "rachel@example.com", name: "Rachel Adams", subscribed: true, createdAt: new Date("2025-03-01") },
  { id: 8, email: "omar@example.com", name: "Omar Hassan", subscribed: true, createdAt: new Date("2025-02-28") },
];

export default function NewsletterPage() {
  const [search, setSearch] = useState("");
  const [showUnsubscribed, setShowUnsubscribed] = useState(false);

  const filtered = stubSubscribers.filter((s) => {
    if (!showUnsubscribed && !s.subscribed) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.email.toLowerCase().includes(q) ||
        s.name?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeCount = stubSubscribers.filter((s) => s.subscribed).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--admin-text)] tracking-tight">
            Newsletter
          </h1>
          <p className="text-sm text-[var(--admin-text-muted)] mt-1">
            {activeCount} active subscribers
          </p>
        </div>
        <button className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-[var(--admin-border-subtle)] text-sm font-medium text-[var(--admin-text-secondary)] hover:bg-[var(--admin-surface-raised)] transition-colors">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--admin-text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subscribers..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-[var(--admin-surface)] border border-[var(--admin-border)] text-[var(--admin-text)] text-sm placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/40"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showUnsubscribed}
            onChange={(e) => setShowUnsubscribed(e.target.checked)}
            className="w-4 h-4 rounded border-[var(--admin-border-subtle)] bg-[var(--admin-bg)] text-[var(--admin-accent)] focus:ring-[var(--admin-accent)]/40"
          />
          <span className="text-sm text-[var(--admin-text-muted)]">
            Show unsubscribed
          </span>
        </label>
      </div>

      {/* Subscriber table */}
      <div className="rounded-xl bg-[var(--admin-surface)] border border-[var(--admin-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--admin-border)]">
                <th className="text-left text-xs font-medium text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3">
                  Subscriber
                </th>
                <th className="text-left text-xs font-medium text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3 hidden sm:table-cell">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-[var(--admin-text-muted)] uppercase tracking-wider px-5 py-3 hidden md:table-cell">
                  Joined
                </th>
                <th className="w-12 px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border)]">
              {filtered.map((sub) => (
                <tr
                  key={sub.id}
                  className="hover:bg-[var(--admin-surface-raised)]/50 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--admin-surface-raised)]">
                        <Mail className="w-3.5 h-3.5 text-[var(--admin-text-muted)]" />
                      </div>
                      <div>
                        <p className="text-sm text-[var(--admin-text)]">
                          {sub.email}
                        </p>
                        {sub.name && (
                          <p className="text-xs text-[var(--admin-text-muted)]">
                            {sub.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                        sub.subscribed
                          ? "bg-emerald-400/10 text-emerald-400"
                          : "bg-[var(--admin-surface-raised)] text-[var(--admin-text-muted)]"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          sub.subscribed ? "bg-emerald-400" : "bg-[var(--admin-text-muted)]"
                        }`}
                      />
                      {sub.subscribed ? "Active" : "Unsubscribed"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-xs text-[var(--admin-text-muted)]">
                      {formatDate(sub.createdAt)}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    {sub.subscribed && (
                      <button className="p-1.5 rounded text-[var(--admin-text-muted)] hover:text-red-400 transition-colors" title="Unsubscribe">
                        <UserMinus className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-12 text-center text-sm text-[var(--admin-text-muted)]"
                  >
                    No subscribers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
