"use client";

import type { BeautyHero } from "@/lib/schemas/beauty-page";
import { Card, Field, TextInput, Textarea, Toggle } from "../../travel/_ui";
import SingleSlotMedia from "@/components/admin/SingleSlotMedia";

interface Props {
  value: BeautyHero;
  onChange: (next: BeautyHero) => void;
}

const ACCENT_HINT = "Use *word* для italic rose accent (e.g. *softly* told).";

export function HeroTab({ value, onChange }: Props) {
  const set = <K extends keyof BeautyHero>(k: K, v: BeautyHero[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <>
      <Card title="Eyebrow + Title" description="Top label + main hero headline.">
        <Field label="Eyebrow" hint='напр. "Media Kit · 2026"'>
          <TextInput value={value.eyebrow} onChange={(v) => set("eyebrow", v)} />
        </Field>
        <div className="admin-row">
          <Field label="Title — line 1">
            <TextInput
              value={value.titleLine1}
              onChange={(v) => set("titleLine1", v)}
            />
          </Field>
          <Field label="Title — line 2" hint={ACCENT_HINT}>
            <TextInput
              value={value.titleLine2}
              onChange={(v) => set("titleLine2", v)}
            />
          </Field>
        </div>
        <Field label="Subtitle">
          <Textarea value={value.subtitle} onChange={(v) => set("subtitle", v)} />
        </Field>
      </Card>

      <SingleSlotMedia
        pageSlug="beauty"
        kind="hero"
        accept="image/jpeg,image/png,image/webp"
        maxSizeMB={10}
        title="Hero portrait"
        description="Велике фото справа в Hero. JPEG / PNG / WebP, до 10 MB."
      />

      <Card title="Hero meta row" description="Тонкий рядок над CTA з 3 колонками.">
        <div className="admin-row">
          <Field label="Based in — label">
            <TextInput
              value={value.metaBasedInLabel}
              onChange={(v) => set("metaBasedInLabel", v)}
            />
          </Field>
          <Field label="Based in — value">
            <TextInput
              value={value.metaBasedInValue}
              onChange={(v) => set("metaBasedInValue", v)}
            />
          </Field>
        </div>
        <div className="admin-row">
          <Field label="Niche — label">
            <TextInput
              value={value.metaNicheLabel}
              onChange={(v) => set("metaNicheLabel", v)}
            />
          </Field>
          <Field label="Niche — value">
            <TextInput
              value={value.metaNicheValue}
              onChange={(v) => set("metaNicheValue", v)}
            />
          </Field>
        </div>
        <div className="admin-row">
          <Field label="Languages — label">
            <TextInput
              value={value.metaLanguagesLabel}
              onChange={(v) => set("metaLanguagesLabel", v)}
            />
          </Field>
          <Field label="Languages — value">
            <TextInput
              value={value.metaLanguagesValue}
              onChange={(v) => set("metaLanguagesValue", v)}
            />
          </Field>
        </div>
      </Card>

      <Card title="CTAs">
        <Field label="Primary CTA — label">
          <TextInput
            value={value.primaryCta.label}
            onChange={(v) => set("primaryCta", { ...value.primaryCta, label: v })}
          />
        </Field>
        <Field label="Primary CTA — href">
          <TextInput
            value={value.primaryCta.href}
            onChange={(v) => set("primaryCta", { ...value.primaryCta, href: v })}
          />
        </Field>
        <Field label="Ghost CTA — label">
          <TextInput
            value={value.ghostCta.label}
            onChange={(v) => set("ghostCta", { ...value.ghostCta, label: v })}
          />
        </Field>
        <Field label="Ghost CTA — href">
          <TextInput
            value={value.ghostCta.href}
            onChange={(v) => set("ghostCta", { ...value.ghostCta, href: v })}
          />
        </Field>
      </Card>

      <Card title="Spinning badge" description="Текст по колу + центральна іконка.">
        <Field label="Badge text" hint="Текст по колу — повторюватиметься, додай ' · ' в кінці.">
          <TextInput value={value.badgeText} onChange={(v) => set("badgeText", v)} />
        </Field>
        <Field label="Badge icon" hint="Емоджі/символ у центрі (★, ✦, тощо).">
          <TextInput value={value.badgeIcon} onChange={(v) => set("badgeIcon", v)} />
        </Field>
      </Card>

      <Card title='Status tag ("Open for bookings")'>
        <Field label="Tag label">
          <TextInput value={value.tagLabel} onChange={(v) => set("tagLabel", v)} />
        </Field>
        <Toggle
          label="Online indicator (pulse green dot)"
          checked={value.tagOnline}
          onChange={(v) => set("tagOnline", v)}
        />
      </Card>
    </>
  );
}
