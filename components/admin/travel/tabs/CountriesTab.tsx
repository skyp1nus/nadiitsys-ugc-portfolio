"use client";

import { useState, type KeyboardEvent } from "react";
import { Card, ChipList } from "../_ui";

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
}

export function CountriesTab({ value, onChange }: Props) {
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
    <Card
      title="Travel countries"
      description="Shown as a 6-column dotted list in the Travels section"
    >
      <ChipList items={value} onRemove={remove} />
      <div className="admin-chip-add">
        <input
          className="admin-input"
          placeholder="Add country and press Enter"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
        />
        <button type="button" className="admin-btn admin-btn-sm" onClick={add}>
          Add
        </button>
      </div>
      <div className="admin-hint" style={{ marginTop: 12 }}>
        {value.length} countries · shown in 6 columns
      </div>
    </Card>
  );
}
