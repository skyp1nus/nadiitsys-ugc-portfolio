"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import "@/app/admin/admin.css";

export interface PageLink {
  slug: string;
  label: string;
  href: string;
  badge?: string | number;
}

export interface TabItem {
  key: string;
  label: string;
  badge?: string | number;
}

export type SaveState = "idle" | "dirty" | "saving" | "saved" | "error";

interface AdminShellProps {
  brand: { title: string; subtitle?: string };
  pages: PageLink[];
  currentPageSlug: string;
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (key: string) => void;
  crumb: ReactNode;
  saveState: SaveState;
  saveMessage?: string;
  onOpenPreview?: () => void;
  children: ReactNode;
}

const STATUS_LABEL: Record<SaveState, string> = {
  idle: "Saved",
  dirty: "Unsaved",
  saving: "Saving…",
  saved: "Saved",
  error: "Save failed",
};

export function AdminShell(props: AdminShellProps) {
  const {
    brand,
    pages,
    currentPageSlug,
    tabs,
    activeTab,
    onTabChange,
    crumb,
    saveState,
    saveMessage,
    onOpenPreview,
    children,
  } = props;
  const [open, setOpen] = useState(false);
  const closeSidebar = () => setOpen(false);
  const router = useRouter();

  const statusClass =
    saveState === "error"
      ? "error"
      : saveState === "dirty"
        ? "dirty"
        : saveState === "saving"
          ? "saving"
          : "saved";

  return (
    <div className="admin-root">
      <div className="admin-app">
        <aside className={`admin-sidebar${open ? " open" : ""}`}>
          <div className="admin-brand">
            <h1>{brand.title}</h1>
            {brand.subtitle && <p>{brand.subtitle}</p>}
          </div>

          <div className="admin-nav-section-label">Pages</div>
          {pages.map((p) => (
            <a
              key={p.slug}
              href={p.href}
              className={`admin-nav-item${p.slug === currentPageSlug ? " active" : ""}`}
              onClick={closeSidebar}
            >
              <span>{p.label}</span>
              {p.badge !== undefined && <span className="badge">{p.badge}</span>}
            </a>
          ))}

          <div className="admin-nav-section-label">Sections</div>
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`admin-nav-item${t.key === activeTab ? " active" : ""}`}
              onClick={() => {
                onTabChange(t.key);
                closeSidebar();
              }}
            >
              <span>{t.label}</span>
              {t.badge !== undefined && <span className="badge">{t.badge}</span>}
            </button>
          ))}

          <div className="admin-sidebar-footer">
            {onOpenPreview && (
              <button
                type="button"
                className="admin-btn admin-btn-sm"
                onClick={onOpenPreview}
              >
                ↗ Open page
              </button>
            )}
            <button
              type="button"
              className="admin-btn admin-btn-sm"
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                router.push("/login");
                router.refresh();
              }}
            >
              Sign out
            </button>
          </div>
        </aside>

        <main className="admin-main">
          <div className="admin-toolbar">
            <button
              type="button"
              className="admin-menu-btn"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <div className="admin-crumbs">{crumb}</div>
            <div className="admin-actions">
              <span className={`admin-save-status ${statusClass}`}>
                {saveMessage ?? STATUS_LABEL[saveState]}
              </span>
            </div>
          </div>
          <div className="admin-content">{children}</div>
        </main>
      </div>

      <div
        className={`admin-scrim${open ? " show" : ""}`}
        onClick={closeSidebar}
        aria-hidden
      />
    </div>
  );
}
