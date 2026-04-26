"use client";

import type { TravelPhoto } from "@/types/travel";
import { Card, Empty, ListItem, MoveButtons, RemoveButton, TextInput } from "../_ui";

interface Props {
  value: TravelPhoto[];
  onChange: (next: TravelPhoto[]) => void;
}

export function PhotosTab({ value, onChange }: Props) {
  const update = (i: number, patch: Partial<TravelPhoto>) =>
    onChange(value.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const add = () => onChange([...value, { url: "", caption: "", link: "" }]);
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j]!, next[i]!];
    onChange(next);
  };

  return (
    <>
      <Card
        title="Stills gallery"
        description="Image URL → shown in the Stills gallery. Post link → opens on click."
      >
        {value.length === 0 && (
          <Empty>No photos yet — paste an Instagram image URL below.</Empty>
        )}
        {value.map((p, i) => (
          <ListItem
            key={i}
            index={i}
            actions={
              <>
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
            <div style={{ display: "grid", gap: 12 }}>
              <TextInput
                value={p.url}
                onChange={(v) => update(i, { url: v })}
                placeholder="Image URL (https://…)"
              />
              <div
                style={{
                  display: "grid",
                  gap: 12,
                  gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
                }}
              >
                <TextInput
                  value={p.link}
                  onChange={(v) => update(i, { link: v })}
                  placeholder="Instagram post link"
                />
                <TextInput
                  value={p.caption}
                  onChange={(v) => update(i, { caption: v })}
                  placeholder="Caption"
                />
              </div>
            </div>
          </ListItem>
        ))}
        <button
          type="button"
          className="admin-btn"
          style={{ marginTop: 8 }}
          onClick={add}
        >
          + Add photo
        </button>
      </Card>
      <div className="admin-hint">
        Tip: open the Instagram post in browser, right-click the image → “Copy image
        address”.
      </div>
    </>
  );
}
