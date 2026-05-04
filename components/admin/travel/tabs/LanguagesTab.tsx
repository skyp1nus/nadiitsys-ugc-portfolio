"use client";

import { useState, type KeyboardEvent } from "react";
import { Card, ChipList } from "../_ui";

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
}

export function LanguagesTab({ value, onChange }: Props) {
  const [input, setInput] = useState("");

  const add = () => {
    const v = input.trim().toUpperCase();
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
    <Card
      title="Spoken languages"
      description="Two-letter codes shown in the About section (e.g. EN · PL · UA · RU)"
    >
      <ChipList items={value} onRemove={remove} />
      <div className="admin-chip-add">
        <input
          className="admin-input"
          placeholder="Code (e.g. ES)"
          maxLength={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
        />
        <button type="button" className="admin-btn admin-btn-sm" onClick={add}>
          Add
        </button>
      </div>
    </Card>
  );
}
