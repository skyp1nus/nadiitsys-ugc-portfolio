"use client";

import type { BeautyAbout, BeautyStat } from "@/lib/schemas/beauty-page";
import {
  Card,
  Empty,
  Field,
  ListItem,
  MoveButtons,
  RemoveButton,
  TextInput,
  Textarea,
  ChipList,
} from "../../travel/_ui";
import { useState, type KeyboardEvent } from "react";

interface Props {
  value: BeautyAbout;
  onChange: (next: BeautyAbout) => void;
}

const ACCENT_HINT = "Use *word* для italic rose accent.";

export function AboutTab({ value, onChange }: Props) {
  const set = <K extends keyof BeautyAbout>(k: K, v: BeautyAbout[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <>
      <Card title="Section header">
        <div className="admin-row">
          <Field label="Eyebrow num" hint='e.g. "01"'>
            <TextInput value={value.eyebrowNum} onChange={(v) => set("eyebrowNum", v)} />
          </Field>
          <Field label="Eyebrow label" hint='e.g. "About"'>
            <TextInput
              value={value.eyebrowLabel}
              onChange={(v) => set("eyebrowLabel", v)}
            />
          </Field>
        </div>
        <Field label="Section title" hint={ACCENT_HINT}>
          <TextInput value={value.title} onChange={(v) => set("title", v)} />
        </Field>
      </Card>

      <Card title="About copy">
        <Field label="Lead paragraph" hint={ACCENT_HINT}>
          <Textarea value={value.lead} onChange={(v) => set("lead", v)} />
        </Field>
        <ParagraphsEditor
          value={value.paragraphs}
          onChange={(p) => set("paragraphs", p)}
        />
      </Card>

      <Card title="Categories" description="Pill-теги під параграфами.">
        <CategoriesEditor
          value={value.categories}
          onChange={(c) => set("categories", c)}
        />
      </Card>

      <Card title="Stats row" description="3 числа під категоріями.">
        <StatsEditor value={value.stats} onChange={(s) => set("stats", s)} />
      </Card>
    </>
  );
}

function ParagraphsEditor({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const update = (i: number, v: string) =>
    onChange(value.map((p, idx) => (idx === i ? v : p)));
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const add = () => onChange([...value, ""]);
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j]!, next[i]!];
    onChange(next);
  };

  return (
    <div style={{ marginTop: 16 }}>
      <label
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 500,
          color: "var(--ink-2)",
          marginBottom: 6,
        }}
      >
        Paragraphs
      </label>
      {value.length === 0 && <Empty>No paragraphs.</Empty>}
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
          <Textarea value={p} onChange={(v) => update(i, v)} />
        </ListItem>
      ))}
      <button
        type="button"
        className="admin-btn"
        style={{ marginTop: 8 }}
        onClick={add}
      >
        + Add paragraph
      </button>
    </div>
  );
}

function CategoriesEditor({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (!v) return;
    onChange([...value, v]);
    setInput("");
  };
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    }
  };

  return (
    <>
      <ChipList items={value} onRemove={remove} />
      <div className="admin-chip-add">
        <input
          className="admin-input"
          placeholder="Add category and press Enter"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
        />
        <button type="button" className="admin-btn admin-btn-sm" onClick={add}>
          Add
        </button>
      </div>
    </>
  );
}

function StatsEditor({
  value,
  onChange,
}: {
  value: BeautyStat[];
  onChange: (next: BeautyStat[]) => void;
}) {
  const update = (i: number, patch: Partial<BeautyStat>) =>
    onChange(value.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const add = () => onChange([...value, { num: "", accentSuffix: "", label: "" }]);
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j]!, next[i]!];
    onChange(next);
  };

  return (
    <>
      {value.length === 0 && <Empty>No stats yet.</Empty>}
      {value.map((s, i) => (
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
          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr) minmax(0,2fr)",
            }}
          >
            <TextInput
              value={s.num}
              onChange={(v) => update(i, { num: v })}
              placeholder="25"
            />
            <TextInput
              value={s.accentSuffix}
              onChange={(v) => update(i, { accentSuffix: v })}
              placeholder="+"
            />
            <TextInput
              value={s.label}
              onChange={(v) => update(i, { label: v })}
              placeholder="Brand collabs"
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
        + Add stat
      </button>
    </>
  );
}
