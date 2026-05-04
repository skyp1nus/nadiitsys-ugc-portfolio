"use client";

import type { ReactNode, ChangeEvent } from "react";

export function Card({
  title,
  description,
  children,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="admin-card">
      {title && (
        <div className="admin-card-head">
          <div>
            <h3>{title}</h3>
            {description && <p>{description}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      {children}
      {hint && <div className="admin-hint">{hint}</div>}
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "url" | "number";
}) {
  return (
    <input
      className="admin-input"
      type={type}
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
    />
  );
}

export function Textarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      className="admin-textarea"
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
    />
  );
}

export function ListItem({
  index,
  children,
  actions,
}: {
  index: number;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="admin-list-item">
      <div className="num">{String(index + 1).padStart(2, "0")}</div>
      <div className="body">{children}</div>
      {actions && <div className="admin-list-actions">{actions}</div>}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="admin-empty">{children}</div>;
}

export function ChipList({
  items,
  onRemove,
}: {
  items: string[];
  onRemove: (i: number) => void;
}) {
  return (
    <div className="admin-chips">
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="admin-chip">
          {item}
          <button type="button" onClick={() => onRemove(i)} aria-label={`Remove ${item}`}>
            ×
          </button>
        </span>
      ))}
    </div>
  );
}

export function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="admin-toggle">
      <div className="meta">
        <div>{label}</div>
        {description && <div className="desc">{description}</div>}
      </div>
      <label className="admin-switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.checked)}
        />
        <span />
      </label>
    </div>
  );
}

export function MoveButtons({
  onUp,
  onDown,
  canUp,
  canDown,
}: {
  onUp: () => void;
  onDown: () => void;
  canUp: boolean;
  canDown: boolean;
}) {
  return (
    <>
      <button
        type="button"
        className="admin-btn admin-btn-sm ghost"
        onClick={onUp}
        disabled={!canUp}
        aria-label="Move up"
      >
        ↑
      </button>
      <button
        type="button"
        className="admin-btn admin-btn-sm ghost"
        onClick={onDown}
        disabled={!canDown}
        aria-label="Move down"
      >
        ↓
      </button>
    </>
  );
}

export function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="admin-btn admin-btn-sm danger"
      onClick={onClick}
    >
      Remove
    </button>
  );
}
