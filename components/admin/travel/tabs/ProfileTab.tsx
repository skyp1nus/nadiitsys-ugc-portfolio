"use client";

import type { TravelProfile } from "@/types/travel";
import type { PageSlug } from "@/lib/repos/media";
import { Card, Field, TextInput, Textarea } from "../_ui";
import SingleSlotMedia from "@/components/admin/SingleSlotMedia";

interface Props {
  pageSlug: PageSlug;
  value: TravelProfile;
  onChange: (next: TravelProfile) => void;
}

export function ProfileTab({ pageSlug, value, onChange }: Props) {
  const set = <K extends keyof TravelProfile>(k: K, v: TravelProfile[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <>
      <Card title="Identity" description="Shown in the hero and across the page">
        <Field label="Creator name" hint="Used in nav, hero, footer">
          <TextInput value={value.creatorName} onChange={(v) => set("creatorName", v)} />
        </Field>
        <Field label="Tagline" hint="One short line under your name in the hero">
          <TextInput value={value.tagline} onChange={(v) => set("tagline", v)} />
        </Field>
        <Field label="Location" hint="e.g. “Based in Warszawa · Available Worldwide”">
          <TextInput value={value.location} onChange={(v) => set("location", v)} />
        </Field>
      </Card>

      <SingleSlotMedia
        pageSlug={pageSlug}
        kind="hero"
        accept="image/jpeg,image/png,image/webp"
        maxSizeMB={10}
        title="Hero image"
        description="Велике портретне фото справа в Hero. JPEG / PNG / WebP, до 10 MB."
      />

      <Card title="About" description="A short bio shown in the About section">
        <Field label="Bio" hint="Keep it under ~50 words. Speak in your own voice.">
          <Textarea value={value.bio} onChange={(v) => set("bio", v)} />
        </Field>
      </Card>

      <SingleSlotMedia
        pageSlug={pageSlug}
        kind="about-video"
        accept="video/mp4,video/quicktime,video/webm"
        maxSizeMB={50}
        title="About video"
        description="Вертикальне відео в About-секції. MP4 / MOV / WebM, до 50 MB."
      />

      <Card title="Production details">
        <div className="admin-row">
          <Field label="Gear" hint="e.g. “iPhone 17 Pro Max”">
            <TextInput value={value.gear} onChange={(v) => set("gear", v)} />
          </Field>
          <Field label="Delivery time" hint="e.g. “5–7 days”">
            <TextInput value={value.delivery} onChange={(v) => set("delivery", v)} />
          </Field>
        </div>
      </Card>
    </>
  );
}
