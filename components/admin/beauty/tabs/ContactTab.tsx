"use client";

import type { BeautyContact, BeautySocial } from "@/lib/schemas/beauty-page";
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
  value: BeautyContact;
  onChange: (next: BeautyContact) => void;
}

const ACCENT_HINT = "Use *word* для italic accent. \\n для нового рядка.";

export function ContactTab({ value, onChange }: Props) {
  const set = <K extends keyof BeautyContact>(k: K, v: BeautyContact[K]) =>
    onChange({ ...value, [k]: v });

  const updateSocial = (i: number, patch: Partial<BeautySocial>) =>
    set(
      "socials",
      value.socials.map((s, idx) => (idx === i ? { ...s, ...patch } : s))
    );
  const removeSocial = (i: number) =>
    set(
      "socials",
      value.socials.filter((_, idx) => idx !== i)
    );
  const addSocial = () =>
    set("socials", [...value.socials, { platform: "", handle: "", url: "" }]);
  const moveSocial = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.socials.length) return;
    const next = [...value.socials];
    [next[i], next[j]] = [next[j]!, next[i]!];
    set("socials", next);
  };

  return (
    <>
      <Card title="Heading">
        <Field label="Eyebrow" hint='e.g. "06 · Get in touch"'>
          <TextInput value={value.eyebrow} onChange={(v) => set("eyebrow", v)} />
        </Field>
        <Field label="Title" hint={ACCENT_HINT}>
          <Textarea value={value.title} onChange={(v) => set("title", v)} />
        </Field>
        <Field label="Subtitle">
          <Textarea value={value.subtitle} onChange={(v) => set("subtitle", v)} />
        </Field>
      </Card>

      <Card title="Email">
        <div className="admin-row">
          <Field label="Email label" hint='e.g. "Drop a line"'>
            <TextInput
              value={value.emailLabel}
              onChange={(v) => set("emailLabel", v)}
            />
          </Field>
          <Field label="Email address">
            <TextInput
              value={value.email}
              onChange={(v) => set("email", v)}
              type="email"
            />
          </Field>
        </div>
      </Card>

      <Card title="Social links">
        {value.socials.length === 0 && <Empty>No socials.</Empty>}
        {value.socials.map((s, i) => (
          <ListItem
            key={i}
            index={i}
            actions={
              <>
                <MoveButtons
                  onUp={() => moveSocial(i, -1)}
                  onDown={() => moveSocial(i, 1)}
                  canUp={i > 0}
                  canDown={i < value.socials.length - 1}
                />
                <RemoveButton onClick={() => removeSocial(i)} />
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
                value={s.platform}
                onChange={(v) => updateSocial(i, { platform: v })}
                placeholder="Instagram"
              />
              <TextInput
                value={s.handle}
                onChange={(v) => updateSocial(i, { handle: v })}
                placeholder="@naditsys"
              />
              <TextInput
                value={s.url}
                onChange={(v) => updateSocial(i, { url: v })}
                placeholder="https://..."
              />
            </div>
          </ListItem>
        ))}
        <button
          type="button"
          className="admin-btn"
          style={{ marginTop: 8 }}
          onClick={addSocial}
        >
          + Add social
        </button>
      </Card>

      <Card title="Meta row" description="3 колонки внизу contact-секції.">
        <div className="admin-row">
          <Field label="Based in — label">
            <TextInput
              value={value.metaBasedInLabel}
              onChange={(v) => set("metaBasedInLabel", v)}
            />
          </Field>
          <Field label="Based in — value">
            <TextInput
              value={value.metaBasedInValue}
              onChange={(v) => set("metaBasedInValue", v)}
            />
          </Field>
        </div>
        <div className="admin-row">
          <Field label="Languages — label">
            <TextInput
              value={value.metaLanguagesLabel}
              onChange={(v) => set("metaLanguagesLabel", v)}
            />
          </Field>
          <Field label="Languages — value">
            <TextInput
              value={value.metaLanguagesValue}
              onChange={(v) => set("metaLanguagesValue", v)}
            />
          </Field>
        </div>
        <div className="admin-row">
          <Field label="Reply — label">
            <TextInput
              value={value.metaReplyLabel}
              onChange={(v) => set("metaReplyLabel", v)}
            />
          </Field>
          <Field label="Reply — value">
            <TextInput
              value={value.metaReplyValue}
              onChange={(v) => set("metaReplyValue", v)}
            />
          </Field>
        </div>
      </Card>
    </>
  );
}
