"use client";

import type { BeautyServices, BeautyServiceItem, ServiceVariant } from "@/lib/schemas/beauty-page";
import {
  Card,
  Empty,
  Field,
  ListItem,
  MoveButtons,
  RemoveButton,
  TextInput,
  Textarea,
} from "../../travel/_ui";

interface Props {
  value: BeautyServices;
  onChange: (next: BeautyServices) => void;
}

const ACCENT_HINT = "Use *word* для italic rose accent.";
const VARIANTS: ServiceVariant[] = ["regular", "featured", "dashed"];

export function ServicesTab({ value, onChange }: Props) {
  const set = <K extends keyof BeautyServices>(k: K, v: BeautyServices[K]) =>
    onChange({ ...value, [k]: v });

  const updateItem = (i: number, patch: Partial<BeautyServiceItem>) =>
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
      {
        number: "",
        tag: "",
        name: "",
        desc: "",
        currency: "€",
        price: "",
        variant: "regular",
      },
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

      <Card title="Service cards" description="3-колоночна сітка карток.">
        {value.items.length === 0 && <Empty>No services yet.</Empty>}
        {value.items.map((it, i) => (
          <ListItem
            key={i}
            index={i}
            actions={
              <>
                <select
                  className="admin-select"
                  style={{ width: "auto", padding: "5px 8px", fontSize: 12 }}
                  value={it.variant}
                  onChange={(e) =>
                    updateItem(i, { variant: e.target.value as ServiceVariant })
                  }
                >
                  {VARIANTS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
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
                gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr) minmax(0,2fr)",
              }}
            >
              <TextInput
                value={it.number}
                onChange={(v) => updateItem(i, { number: v })}
                placeholder="001"
              />
              <TextInput
                value={it.tag}
                onChange={(v) => updateItem(i, { tag: v })}
                placeholder="Instagram"
              />
              <TextInput
                value={it.name}
                onChange={(v) => updateItem(i, { name: v })}
                placeholder="IG *Stories*"
              />
            </div>
            <Textarea
              value={it.desc}
              onChange={(v) => updateItem(i, { desc: v })}
              placeholder="Description"
            />
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "minmax(0,1fr) minmax(0,2fr)",
              }}
            >
              <TextInput
                value={it.currency}
                onChange={(v) => updateItem(i, { currency: v })}
                placeholder="€"
              />
              <TextInput
                value={it.price}
                onChange={(v) => updateItem(i, { price: v })}
                placeholder="70 / Let's talk"
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
          + Add service
        </button>
      </Card>

      <Card title="Note line" description="Маленький блок під картками.">
        <Textarea value={value.note} onChange={(v) => set("note", v)} />
      </Card>
    </>
  );
}
