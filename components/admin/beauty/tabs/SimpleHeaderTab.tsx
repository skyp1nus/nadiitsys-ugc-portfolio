"use client";

import type { BeautySimpleSectionHeader } from "@/lib/schemas/beauty-page";
import { Card, Field, TextInput } from "../../travel/_ui";

interface Props {
  value: BeautySimpleSectionHeader;
  onChange: (next: BeautySimpleSectionHeader) => void;
  cardTitle: string;
}

const ACCENT_HINT = "Use *word* для italic rose accent.";

export function SimpleHeaderTab({ value, onChange, cardTitle }: Props) {
  const set = <K extends keyof BeautySimpleSectionHeader>(
    k: K,
    v: BeautySimpleSectionHeader[K]
  ) => onChange({ ...value, [k]: v });

  return (
    <Card title={cardTitle} description="Лише header — самі картки/фото з Media manager нижче.">
      <div className="admin-row">
        <Field label="Eyebrow num">
          <TextInput value={value.eyebrowNum} onChange={(v) => set("eyebrowNum", v)} />
        </Field>
        <Field label="Eyebrow label">
          <TextInput value={value.eyebrowLabel} onChange={(v) => set("eyebrowLabel", v)} />
        </Field>
      </div>
      <Field label="Section title" hint={ACCENT_HINT}>
        <TextInput value={value.title} onChange={(v) => set("title", v)} />
      </Field>
    </Card>
  );
}
