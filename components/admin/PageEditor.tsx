"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TravelPageInput as TravelPage } from "@/lib/schemas/travel-page";
import {
  AdminShell,
  type PageLink,
  type SaveState,
  type TabItem,
} from "@/components/admin/AdminShell";
import { ProfileTab } from "@/components/admin/travel/tabs/ProfileTab";
import { HotelsTab } from "@/components/admin/travel/tabs/HotelsTab";
import { CountriesTab } from "@/components/admin/travel/tabs/CountriesTab";
import { PhotosTab } from "@/components/admin/travel/tabs/PhotosTab";
import { ReelsTab } from "@/components/admin/travel/tabs/ReelsTab";
import { LanguagesTab } from "@/components/admin/travel/tabs/LanguagesTab";
import { ContactTab } from "@/components/admin/travel/tabs/ContactTab";

type TabKey =
  | "profile"
  | "hotels"
  | "countries"
  | "photos"
  | "reels"
  | "languages"
  | "contact";

const TAB_LABELS: Record<TabKey, string> = {
  profile: "Profile",
  hotels: "Hotels",
  countries: "Countries",
  photos: "Photos",
  reels: "Reels",
  languages: "Languages",
  contact: "Contact",
};

const TAB_DESC: Record<TabKey, string> = {
  profile:
    "Your name, tagline, bio and other identity bits — appears in the hero, about and footer.",
  hotels:
    "The properties shown in the “Trusted by” section. Reorder, edit, or add new collaborations.",
  countries:
    "Countries shown in the Travels section. Keep it concise — only places you’ve actually shot in.",
  photos:
    "Photos shown in the Stills gallery. Drag-and-drop або клік щоб завантажити у R2.",
  reels:
    "Reel-відео для секції Reels. Drag-and-drop файлу — рендериться нативним <video> player.",
  languages:
    "Languages you speak. Shown as short codes (EN, PL, UA…) under the About section.",
  contact: "Email, social links and availability info shown in the Contact section.",
};

const TABS_ORDER: TabKey[] = [
  "profile",
  "hotels",
  "countries",
  "photos",
  "reels",
  "languages",
  "contact",
];

export type PageSlug = "travel" | "beauty";

const PAGES: PageLink[] = [
  { slug: "travel", label: "Travel", href: "/admin/travel" },
  { slug: "beauty", label: "Beauty", href: "/admin/beauty" },
];

const PAGE_TITLES: Record<PageSlug, string> = {
  travel: "Travel",
  beauty: "Beauty",
};

interface PageEditorProps {
  slug: PageSlug;
  initial: TravelPage;
}

export function PageEditor({ slug, initial }: PageEditorProps) {
  const [data, setData] = useState<TravelPage>(initial);
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveMessage, setSaveMessage] = useState<string | undefined>(undefined);
  const [toast, setToast] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipAutosaveRef = useRef(true);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }, []);

  const doSave = useCallback(
    async (payload: TravelPage, silent: boolean) => {
      try {
        const res = await fetch(`/api/admin/save-page/${slug}`, {
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
    [showToast, slug]
  );

  useEffect(() => {
    if (skipAutosaveRef.current) {
      skipAutosaveRef.current = false;
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSaveState("saving");
    setSaveMessage(undefined);
    debounceRef.current = setTimeout(() => {
      void doSave(data, true);
    }, 800);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [data, doSave]);

  function manualSave() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSaveState("saving");
    void doSave(data, false);
  }

  const tabs: TabItem[] = TABS_ORDER.map((k) => ({
    key: k,
    label: TAB_LABELS[k],
    badge: badgeFor(k, data),
  }));

  const pageTitle = PAGE_TITLES[slug];
  const previewHref = slug === "travel" ? "/travel" : "/beauty";

  const crumb = (
    <>
      Admin <span style={{ margin: "0 6px", color: "var(--ink-3)" }}>/</span> {pageTitle}{" "}
      <span style={{ margin: "0 6px", color: "var(--ink-3)" }}>/</span>{" "}
      <strong>{TAB_LABELS[activeTab]}</strong>
    </>
  );

  return (
    <>
      <AdminShell
        brand={{ title: pageTitle, subtitle: "Media Kit" }}
        pages={PAGES}
        currentPageSlug={slug}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(k) => setActiveTab(k as TabKey)}
        crumb={crumb}
        saveState={saveState}
        saveMessage={saveMessage}
        onSave={manualSave}
        openPreviewHref={previewHref}
      >
        <h2>{TAB_LABELS[activeTab]}</h2>
        <p className="section-desc">{TAB_DESC[activeTab]}</p>

        {activeTab === "profile" && (
          <ProfileTab
            value={data.profile}
            onChange={(profile) => setData((d) => ({ ...d, profile }))}
          />
        )}
        {activeTab === "hotels" && (
          <HotelsTab
            value={data.hotels}
            onChange={(hotels) => setData((d) => ({ ...d, hotels }))}
          />
        )}
        {activeTab === "countries" && (
          <CountriesTab
            value={data.countries}
            onChange={(countries) => setData((d) => ({ ...d, countries }))}
          />
        )}
        {activeTab === "photos" && <PhotosTab pageSlug={slug} />}
        {activeTab === "reels" && <ReelsTab pageSlug={slug} />}
        {activeTab === "languages" && (
          <LanguagesTab
            value={data.profile.languages}
            onChange={(languages) =>
              setData((d) => ({ ...d, profile: { ...d.profile, languages } }))
            }
          />
        )}
        {activeTab === "contact" && (
          <ContactTab
            value={data.contact}
            onChange={(contact) => setData((d) => ({ ...d, contact }))}
          />
        )}
      </AdminShell>

      <div className={`admin-toast${toast ? " show" : ""}`}>{toast}</div>
    </>
  );
}

function badgeFor(key: TabKey, data: TravelPage): number | undefined {
  switch (key) {
    case "hotels":
      return data.hotels.length;
    case "countries":
      return data.countries.length;
    case "languages":
      return data.profile.languages.length;
    default:
      return undefined;
  }
}
