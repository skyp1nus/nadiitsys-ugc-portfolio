"use client";

import type { TravelReel } from "@/types/travel";
import { Card, Empty, ListItem, MoveButtons, RemoveButton, TextInput } from "../_ui";

interface Props {
  value: TravelReel[];
  onChange: (next: TravelReel[]) => void;
}

export function ReelsTab({ value, onChange }: Props) {
  const update = (i: number, patch: Partial<TravelReel>) =>
    onChange(value.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const add = () =>
    onChange([
      ...value,
      { url: "", title: "", location: "", views: "", posterUrl: "" },
    ]);
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j]!, next[i]!];
    onChange(next);
  };

  return (
    <Card
      title="Video reels"
      description="TikTok / Instagram reel URLs — shown in the Reels section"
    >
      {value.length === 0 && (
        <Empty>No reels yet — paste your first reel URL below.</Empty>
      )}
      {value.map((r, i) => (
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
              value={r.url}
              onChange={(v) => update(i, { url: v })}
              placeholder="Reel URL (TikTok / Instagram)"
            />
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr) minmax(0,1fr)",
              }}
            >
              <TextInput
                value={r.title}
                onChange={(v) => update(i, { title: v })}
                placeholder="Title"
              />
              <TextInput
                value={r.location}
                onChange={(v) => update(i, { location: v })}
                placeholder="Location"
              />
              <TextInput
                value={r.views}
                onChange={(v) => update(i, { views: v })}
                placeholder="Views"
              />
            </div>
            <TextInput
              value={r.posterUrl ?? ""}
              onChange={(v) => update(i, { posterUrl: v })}
              placeholder="Poster image URL (optional)"
            />
          </div>
        </ListItem>
      ))}
      <button
        type="button"
        className="admin-btn"
        style={{ marginTop: 8 }}
        onClick={add}
      >
        + Add reel
      </button>
    </Card>
  );
}
