"use client";

import type { BeautyBrands, BeautyBrandItem } from "@/lib/schemas/beauty-page";
import {
  Card,
  Empty,
  Field,
  ListItem,
  MoveButtons,
  RemoveButton,
  TextInput,
} from "../../travel/_ui";

interface Props {
  value: BeautyBrands;
  onChange: (next: BeautyBrands) => void;
}

const ACCENT_HINT = "Use *word* для italic rose accent.";

export function BrandsTab({ value, onChange }: Props) {
  const set = <K extends keyof BeautyBrands>(k: K, v: BeautyBrands[K]) =>
    onChange({ ...value, [k]: v });

  const updateItem = (i: number, patch: Partial<BeautyBrandItem>) =>
    set(
      "items",
      value.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it))
    );
  const removeItem = (i: number) =>
    set(
      "items",
      value.items.filter((_, idx) => idx !== i)
    );
  const addItem = () =>
    set("items", [
      ...value.items,
      { corner: "", name: "", category: "", link: "", isOpenSlot: false },
    ]);
  const moveItem = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.items.length) return;
    const next = [...value.items];
    [next[i], next[j]] = [next[j]!, next[i]!];
    set("items", next);
  };

  return (
    <>
      <Card title="Section header">
        <div className="admin-row">
          <Field label="Eyebrow num">
            <TextInput value={value.eyebrowNum} onChange={(v) => set("eyebrowNum", v)} />
          </Field>
          <Field label="Eyebrow label">
            <TextInput
              value={value.eyebrowLabel}
              onChange={(v) => set("eyebrowLabel", v)}
            />
          </Field>
        </div>
        <Field label="Section title" hint={ACCENT_HINT}>
          <TextInput value={value.title} onChange={(v) => set("title", v)} />
        </Field>
        <Field label="Right-side intro">
          <TextInput value={value.intro} onChange={(v) => set("intro", v)} />
        </Field>
      </Card>

      <Card
        title="Brand cells"
        description="5-колоночна сітка. Останній item можна позначити Open slot."
      >
        {value.items.length === 0 && <Empty>No brand cells yet.</Empty>}
        {value.items.map((it, i) => (
          <ListItem
            key={i}
            index={i}
            actions={
              <>
                <button
                  type="button"
                  className="admin-btn admin-btn-sm ghost"
                  style={{ color: it.isOpenSlot ? "var(--accent-d)" : "var(--ink-3)" }}
                  onClick={() => updateItem(i, { isOpenSlot: !it.isOpenSlot })}
                >
                  {it.isOpenSlot ? "open" : "regular"}
                </button>
                <MoveButtons
                  onUp={() => moveItem(i, -1)}
                  onDown={() => moveItem(i, 1)}
                  canUp={i > 0}
                  canDown={i < value.items.length - 1}
                />
                <RemoveButton onClick={() => removeItem(i)} />
              </>
            }
          >
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "minmax(0,1fr) minmax(0,2fr)",
              }}
            >
              <TextInput
                value={it.corner}
                onChange={(v) => updateItem(i, { corner: v })}
                placeholder="01 · IG"
              />
              <TextInput
                value={it.name}
                onChange={(v) => updateItem(i, { name: v })}
                placeholder="Beauty *brand*"
              />
            </div>
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "minmax(0,1fr) minmax(0,2fr)",
                marginTop: 8,
              }}
            >
              <TextInput
                value={it.category}
                onChange={(v) => updateItem(i, { category: v })}
                placeholder="Skincare campaign"
              />
              <TextInput
                value={it.link}
                onChange={(v) => updateItem(i, { link: v })}
                placeholder="https://..."
              />
            </div>
          </ListItem>
        ))}
        <button
          type="button"
          className="admin-btn"
          style={{ marginTop: 8 }}
          onClick={addItem}
        >
          + Add brand
        </button>
      </Card>
    </>
  );
}
