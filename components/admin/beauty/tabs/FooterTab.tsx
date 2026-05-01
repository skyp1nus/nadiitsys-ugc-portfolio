"use client";

import type { BeautyFooter } from "@/lib/schemas/beauty-page";
import { Card, Field, TextInput } from "../../travel/_ui";

interface Props {
  value: BeautyFooter;
  onChange: (next: BeautyFooter) => void;
}

export function FooterTab({ value, onChange }: Props) {
  const set = <K extends keyof BeautyFooter>(k: K, v: BeautyFooter[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <Card title="Footer" description="3 колонки в самому низу сторінки.">
      <Field label="Logo">
        <TextInput value={value.logo} onChange={(v) => set("logo", v)} />
      </Field>
      <Field label="Copyright">
        <TextInput value={value.copyright} onChange={(v) => set("copyright", v)} />
      </Field>
      <Field label="Tagline">
        <TextInput value={value.tagline} onChange={(v) => set("tagline", v)} />
      </Field>
    </Card>
  );
}
