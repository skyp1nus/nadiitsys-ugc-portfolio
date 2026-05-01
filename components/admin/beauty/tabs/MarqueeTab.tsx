"use client";

import type { BeautyMarqueeItem } from "@/lib/schemas/beauty-page";
import {
  Card,
  Empty,
  ListItem,
  MoveButtons,
  RemoveButton,
  TextInput,
} from "../../travel/_ui";

interface Props {
  value: BeautyMarqueeItem[];
  onChange: (next: BeautyMarqueeItem[]) => void;
}

export function MarqueeTab({ value, onChange }: Props) {
  const update = (i: number, patch: Partial<BeautyMarqueeItem>) =>
    onChange(value.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const add = () => onChange([...value, { text: "", italic: false }]);
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j]!, next[i]!];
    onChange(next);
  };

  return (
    <Card
      title="Marquee items"
      description="Безкінечний горизонтальний скрол під hero. Italic-варіанти рожеві."
    >
      {value.length === 0 && (
        <Empty>Поки порожньо — додай перший item.</Empty>
      )}
      {value.map((it, i) => (
        <ListItem
          key={i}
          index={i}
          actions={
            <>
              <button
                type="button"
                className="admin-btn admin-btn-sm ghost"
                style={{
                  fontStyle: it.italic ? "italic" : "normal",
                  color: it.italic ? "var(--accent-d)" : "var(--ink-3)",
                }}
                onClick={() => update(i, { italic: !it.italic })}
              >
                {it.italic ? "italic" : "regular"}
              </button>
              <MoveButtons
                onUp={() => move(i, -1)}
                onDown={() => move(i, 1)}
                canUp={i > 0}
                canDown={i < value.length - 1}
              />
              <RemoveButton onClick={() => remove(i)} />
            </>
          }
        >
          <TextInput
            value={it.text}
            onChange={(v) => update(i, { text: v })}
            placeholder="Aesthetic visuals"
          />
        </ListItem>
      ))}
      <button
        type="button"
        className="admin-btn"
        style={{ marginTop: 8 }}
        onClick={add}
      >
        + Add item
      </button>
    </Card>
  );
}
