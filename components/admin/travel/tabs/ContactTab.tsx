"use client";

import type { TravelContact } from "@/types/travel";
import { Card, Field, TextInput, Toggle } from "../_ui";

interface Props {
  value: TravelContact;
  onChange: (next: TravelContact) => void;
}

export function ContactTab({ value, onChange }: Props) {
  const set = <K extends keyof TravelContact>(k: K, v: TravelContact[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <>
      <Card
        title="Direct channels"
        description="Click-through links shown in the Contact section"
      >
        <Field label="Email" hint="Used as mailto: link">
          <TextInput value={value.email} onChange={(v) => set("email", v)} type="email" />
        </Field>

        <div className="admin-row">
          <Field label="Instagram handle" hint="Display label, e.g. @yourname.travels">
            <TextInput value={value.instagram} onChange={(v) => set("instagram", v)} />
          </Field>
          <Field label="Instagram URL" hint="Full link">
            <TextInput
              value={value.instagramUrl}
              onChange={(v) => set("instagramUrl", v)}
              type="url"
            />
          </Field>
        </div>

        <div className="admin-row">
          <Field label="TikTok handle" hint="Display label, e.g. @yourname">
            <TextInput value={value.tiktok} onChange={(v) => set("tiktok", v)} />
          </Field>
          <Field label="TikTok URL" hint="Full link">
            <TextInput
              value={value.tiktokUrl}
              onChange={(v) => set("tiktokUrl", v)}
              type="url"
            />
          </Field>
        </div>

        <Toggle
          label="YouTube channel ready"
          description="Off → row shows “soon” badge instead of link"
          checked={value.youtubeReady}
          onChange={(v) => set("youtubeReady", v)}
        />

        {value.youtubeReady && (
          <div className="admin-row" style={{ marginTop: 12 }}>
            <Field label="YouTube label" hint="Display name">
              <TextInput value={value.youtube} onChange={(v) => set("youtube", v)} />
            </Field>
            <Field label="YouTube URL" hint="Full link">
              <TextInput
                value={value.youtubeUrl}
                onChange={(v) => set("youtubeUrl", v)}
                type="url"
              />
            </Field>
          </div>
        )}
      </Card>

      <Card title="Availability" description="Shown below the channels list">
        <div className="admin-row">
          <Field label="Response time" hint="e.g. “Within 24 hours”">
            <TextInput
              value={value.responseTime}
              onChange={(v) => set("responseTime", v)}
            />
          </Field>
          <Field label="Booking window" hint="e.g. “May–September open”">
            <TextInput
              value={value.bookingWindow}
              onChange={(v) => set("bookingWindow", v)}
            />
          </Field>
        </div>
      </Card>
    </>
  );
}
