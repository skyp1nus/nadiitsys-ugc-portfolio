"use client";

import type { TravelHotel } from "@/types/travel";
import { Card, Empty, ListItem, MoveButtons, RemoveButton, TextInput } from "../_ui";

interface Props {
  value: TravelHotel[];
  onChange: (next: TravelHotel[]) => void;
}

export function HotelsTab({ value, onChange }: Props) {
  const update = (i: number, patch: Partial<TravelHotel>) =>
    onChange(value.map((h, idx) => (idx === i ? { ...h, ...patch } : h)));
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const add = () => onChange([...value, { name: "", stars: "", location: "" }]);
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j]!, next[i]!];
    onChange(next);
  };

  return (
    <Card
      title="Collaborations"
      description="Shown as numbered cards in the “Trusted by” section"
    >
      {value.length === 0 && (
        <Empty>No hotels yet — add your first collaboration below.</Empty>
      )}
      {value.map((h, i) => (
        <ListItem
          key={i}
          index={i}
          actions={
            <>
              <button
                type="button"
                className="admin-btn admin-btn-sm ghost"
                title="Toggle 5-star"
                style={{ color: h.stars ? "var(--accent-d)" : "var(--ink-3)" }}
                onClick={() =>
                  update(i, { stars: h.stars ? "" : "★★★★★" })
                }
              >
                {h.stars ? "★★★★★" : "☆ rate"}
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
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)",
            }}
          >
            <TextInput
              value={h.name}
              onChange={(v) => update(i, { name: v })}
              placeholder="Hotel name"
            />
            <TextInput
              value={h.location}
              onChange={(v) => update(i, { location: v })}
              placeholder="Location"
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
        + Add hotel
      </button>
    </Card>
  );
}
