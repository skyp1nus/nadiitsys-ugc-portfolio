"use client";

import type { BeautyNav } from "@/lib/schemas/beauty-page";
import {
  Card,
  Field,
  ListItem,
  MoveButtons,
  RemoveButton,
  TextInput,
} from "../../travel/_ui";

interface Props {
  value: BeautyNav;
  onChange: (next: BeautyNav) => void;
}

export function NavTab({ value, onChange }: Props) {
  const updateLink = (i: number, patch: Partial<{ label: string; href: string }>) =>
    onChange({
      ...value,
      links: value.links.map((l, idx) => (idx === i ? { ...l, ...patch } : l)),
    });
  const removeLink = (i: number) =>
    onChange({ ...value, links: value.links.filter((_, idx) => idx !== i) });
  const addLink = () =>
    onChange({ ...value, links: [...value.links, { label: "", href: "" }] });
  const moveLink = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.links.length) return;
    const next = [...value.links];
    [next[i], next[j]] = [next[j]!, next[i]!];
    onChange({ ...value, links: next });
  };

  return (
    <>
      <Card title="Logo" description="Текст у лівій частині nav.">
        <Field label="Logo name">
          <TextInput
            value={value.logoName}
            onChange={(v) => onChange({ ...value, logoName: v })}
          />
        </Field>
      </Card>

      <Card title="Nav links" description="Anchor links у nav.">
        {value.links.map((l, i) => (
          <ListItem
            key={i}
            index={i}
            actions={
              <>
                <MoveButtons
                  onUp={() => moveLink(i, -1)}
                  onDown={() => moveLink(i, 1)}
                  canUp={i > 0}
                  canDown={i < value.links.length - 1}
                />
                <RemoveButton onClick={() => removeLink(i)} />
              </>
            }
          >
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
              }}
            >
              <TextInput
                value={l.label}
                onChange={(v) => updateLink(i, { label: v })}
                placeholder="Label, eg About"
              />
              <TextInput
                value={l.href}
                onChange={(v) => updateLink(i, { href: v })}
                placeholder="#about"
              />
            </div>
          </ListItem>
        ))}
        <button
          type="button"
          className="admin-btn"
          style={{ marginTop: 8 }}
          onClick={addLink}
        >
          + Add link
        </button>
      </Card>

      <Card title="Nav CTA" description="Pill-кнопка справа в nav.">
        <div className="admin-row">
          <Field label="Label">
            <TextInput
              value={value.cta.label}
              onChange={(v) => onChange({ ...value, cta: { ...value.cta, label: v } })}
            />
          </Field>
          <Field label="Href">
            <TextInput
              value={value.cta.href}
              onChange={(v) => onChange({ ...value, cta: { ...value.cta, href: v } })}
            />
          </Field>
        </div>
      </Card>
    </>
  );
}
