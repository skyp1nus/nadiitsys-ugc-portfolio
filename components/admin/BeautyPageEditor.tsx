"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BeautyPageInput } from "@/lib/schemas/beauty-page";
import {
  AdminShell,
  type PageLink,
  type SaveState,
  type TabItem,
} from "@/components/admin/AdminShell";
import { NavTab } from "@/components/admin/beauty/tabs/NavTab";
import { HeroTab } from "@/components/admin/beauty/tabs/HeroTab";
import { MarqueeTab } from "@/components/admin/beauty/tabs/MarqueeTab";
import { AboutTab } from "@/components/admin/beauty/tabs/AboutTab";
import { AboutPhotosTab } from "@/components/admin/beauty/tabs/AboutPhotosTab";
import { BrandsTab } from "@/components/admin/beauty/tabs/BrandsTab";
import { ServicesTab } from "@/components/admin/beauty/tabs/ServicesTab";
import { VideosTab } from "@/components/admin/beauty/tabs/VideosTab";
import { GalleryTab } from "@/components/admin/beauty/tabs/GalleryTab";
import { ContactTab } from "@/components/admin/beauty/tabs/ContactTab";
import { FooterTab } from "@/components/admin/beauty/tabs/FooterTab";
import { ThemeTab } from "@/components/admin/beauty/tabs/ThemeTab";

type TabKey =
  | "nav"
  | "hero"
  | "marquee"
  | "about"
  | "aboutPhotos"
  | "brands"
  | "services"
  | "videos"
  | "gallery"
  | "contact"
  | "footer"
  | "theme";

const TAB_LABELS: Record<TabKey, string> = {
  nav: "Nav",
  hero: "Hero",
  marquee: "Marquee",
  about: "About",
  aboutPhotos: "About photos",
  brands: "Brands",
  services: "Services",
  videos: "Videos",
  gallery: "Gallery",
  contact: "Contact",
  footer: "Footer",
  theme: "Theme",
};

const TAB_DESC: Record<TabKey, string> = {
  nav: "Logo, nav links, CTA — sticky bar at the top.",
  hero: "Title, subtitle, meta row, CTAs, badge, status tag, hero image.",
  marquee: "Infinite-scroll text strip під hero.",
  about: "About section copy: lead, paragraphs, categories, stats.",
  aboutPhotos: "2 фото в About-секції.",
  brands: '"Trusted by" 5×2 grid — корпоративні картки.',
  services: "Services & rates — 3-колоночна сітка карток з прайсами.",
  videos: "Selected work header + reel videos для 4-col стрічки.",
  gallery: "Photo header + bento grid (12-col, 7 spans).",
  contact: "Тёмная contact-секція: title, email, socials, meta.",
  footer: "Самий низ сторінки — 3 колонки тексту.",
  theme: "Перемикач рожевих палітр. Default — Blush + Cream.",
};

const TABS_ORDER: TabKey[] = [
  "nav",
  "hero",
  "marquee",
  "about",
  "aboutPhotos",
  "brands",
  "services",
  "videos",
  "gallery",
  "contact",
  "footer",
  "theme",
];

const PAGES: PageLink[] = [
  { slug: "travel", label: "Travel", href: "/admin/travel" },
  { slug: "beauty", label: "Beauty", href: "/admin/beauty" },
];

interface BeautyPageEditorProps {
  initial: BeautyPageInput;
}

export function BeautyPageEditor({ initial }: BeautyPageEditorProps) {
  const [data, setData] = useState<BeautyPageInput>(initial);
  const [activeTab, setActiveTab] = useState<TabKey>("hero");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveMessage, setSaveMessage] = useState<string | undefined>(undefined);
  const [toast, setToast] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipAutosaveRef = useRef(true);

  const openPreview = useCallback(() => {
    const host = window.location.host;
    const publicHost = host.startsWith("admin.")
      ? host.slice("admin.".length)
      : host;
    const url = `${window.location.protocol}//${publicHost}/beauty`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }, []);

  const doSave = useCallback(
    async (payload: BeautyPageInput, silent: boolean) => {
      try {
        const res = await fetch(`/api/admin/save-page/beauty`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setSaveState("saved");
          setSaveMessage(undefined);
          if (!silent) showToast("Saved");
        } else {
          const text = await res.text();
          setSaveState("error");
          setSaveMessage(`Save failed (${res.status})`);
          if (!silent) showToast(`Error: ${text.slice(0, 80)}`);
        }
      } catch (err) {
        setSaveState("error");
        setSaveMessage(err instanceof Error ? err.message : "Network error");
      }
    },
    [showToast]
  );

  useEffect(() => {
    if (skipAutosaveRef.current) {
      skipAutosaveRef.current = false;
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSaveState("dirty");
    setSaveMessage(undefined);
    debounceRef.current = setTimeout(() => {
      setSaveState("saving");
      void doSave(data, true);
    }, 800);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [data, doSave]);

  const tabs: TabItem[] = TABS_ORDER.map((k) => ({
    key: k,
    label: TAB_LABELS[k],
    badge: badgeFor(k, data),
  }));

  const crumb = (
    <>
      Admin <span style={{ margin: "0 6px", color: "var(--ink-3)" }}>/</span> Beauty{" "}
      <span style={{ margin: "0 6px", color: "var(--ink-3)" }}>/</span>{" "}
      <strong>{TAB_LABELS[activeTab]}</strong>
    </>
  );

  return (
    <>
      <AdminShell
        brand={{ title: "Beauty", subtitle: "Media Kit" }}
        pages={PAGES}
        currentPageSlug="beauty"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(k) => setActiveTab(k as TabKey)}
        crumb={crumb}
        saveState={saveState}
        saveMessage={saveMessage}
        onOpenPreview={openPreview}
      >
        <h2>{TAB_LABELS[activeTab]}</h2>
        <p className="section-desc">{TAB_DESC[activeTab]}</p>

        {activeTab === "nav" && (
          <NavTab value={data.nav} onChange={(nav) => setData((d) => ({ ...d, nav }))} />
        )}
        {activeTab === "hero" && (
          <HeroTab value={data.hero} onChange={(hero) => setData((d) => ({ ...d, hero }))} />
        )}
        {activeTab === "marquee" && (
          <MarqueeTab
            value={data.marquee}
            onChange={(marquee) => setData((d) => ({ ...d, marquee }))}
          />
        )}
        {activeTab === "about" && (
          <AboutTab
            value={data.about}
            onChange={(about) => setData((d) => ({ ...d, about }))}
          />
        )}
        {activeTab === "aboutPhotos" && <AboutPhotosTab />}
        {activeTab === "brands" && (
          <BrandsTab
            value={data.brands}
            onChange={(brands) => setData((d) => ({ ...d, brands }))}
          />
        )}
        {activeTab === "services" && (
          <ServicesTab
            value={data.services}
            onChange={(services) => setData((d) => ({ ...d, services }))}
          />
        )}
        {activeTab === "videos" && (
          <VideosTab
            value={data.videos}
            onChange={(videos) => setData((d) => ({ ...d, videos }))}
          />
        )}
        {activeTab === "gallery" && (
          <GalleryTab
            value={data.gallery}
            onChange={(gallery) => setData((d) => ({ ...d, gallery }))}
          />
        )}
        {activeTab === "contact" && (
          <ContactTab
            value={data.contact}
            onChange={(contact) => setData((d) => ({ ...d, contact }))}
          />
        )}
        {activeTab === "footer" && (
          <FooterTab
            value={data.footer}
            onChange={(footer) => setData((d) => ({ ...d, footer }))}
          />
        )}
        {activeTab === "theme" && (
          <ThemeTab
            value={data.paletteKey}
            onChange={(paletteKey) => setData((d) => ({ ...d, paletteKey }))}
          />
        )}
      </AdminShell>

      <div className={`admin-toast${toast ? " show" : ""}`}>{toast}</div>
    </>
  );
}

function badgeFor(key: TabKey, data: BeautyPageInput): number | undefined {
  switch (key) {
    case "marquee":
      return data.marquee.length;
    case "brands":
      return data.brands.items.length;
    case "services":
      return data.services.items.length;
    default:
      return undefined;
  }
}
