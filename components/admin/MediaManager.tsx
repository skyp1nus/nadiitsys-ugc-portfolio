"use client";

import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import {
  Card,
  Empty,
  Field,
  ListItem,
  MoveButtons,
  RemoveButton,
  TextInput,
} from "./travel/_ui";
import type { MediaItem, MediaKind, PageSlug } from "@/lib/repos/media";

type LocalItem = MediaItem & { _pending?: boolean; _localId?: string };

interface Props {
  pageSlug: PageSlug;
  kind: MediaKind;
  accept: string;
  maxSizeMB: number;
}

export default function MediaManager({ pageSlug, kind, accept, maxSizeMB }: Props) {
  const [items, setItems] = useState<LocalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const altTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetch(
          `/api/admin/media?page=${pageSlug}&kind=${kind}`,
          { signal: ac.signal },
        );
        const data = (await res.json()) as { ok: boolean; items?: MediaItem[]; error?: string };
        if (!data.ok) throw new Error(data.error || "List failed");
        setItems(data.items || []);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [pageSlug, kind]);

  async function uploadFile(file: File) {
    const localId = crypto.randomUUID();
    const placeholder: LocalItem = {
      key: localId,
      pageSlug,
      kind,
      position: items.length,
      alt: null,
      caption: null,
      width: null,
      height: null,
      sizeBytes: file.size,
      mime: file.type,
      createdAt: Math.floor(Date.now() / 1000),
      url: URL.createObjectURL(file),
      _pending: true,
      _localId: localId,
    };
    setItems((prev) => [...prev, placeholder]);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("page", pageSlug);
    fd.append("kind", kind);

    try {
      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      const data = (await res.json()) as { ok: boolean; item?: MediaItem; error?: string };
      if (!data.ok || !data.item) throw new Error(data.error || "Upload failed");
      const real = data.item;
      setItems((prev) => prev.map((it) => (it._localId === localId ? real : it)));
    } catch (err) {
      setItems((prev) => prev.filter((it) => it._localId !== localId));
      setError((err as Error).message);
    }
  }

  function validateAndUpload(files: FileList | File[]) {
    setError(null);
    const max = maxSizeMB * 1024 * 1024;
    for (const f of Array.from(files)) {
      if (f.size > max) {
        setError(`${f.name}: занадто великий (max ${maxSizeMB} MB)`);
        continue;
      }
      void uploadFile(f);
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) validateAndUpload(e.dataTransfer.files);
  }

  function onPickFiles(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) validateAndUpload(e.target.files);
    e.target.value = "";
  }

  async function onDelete(item: LocalItem) {
    if (item._pending) return;
    if (!confirm(`Видалити ${item.kind === "photo" ? "фото" : "reel"}?`)) return;
    const prev = items;
    setItems((p) => p.filter((it) => it.key !== item.key));
    try {
      const res = await fetch(`/api/admin/media/${item.key}`, { method: "DELETE" });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) throw new Error(data.error || "Delete failed");
    } catch (err) {
      setItems(prev);
      setError((err as Error).message);
    }
  }

  function moveItem(idx: number, delta: -1 | 1) {
    const target = idx + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[idx], next[target]] = [next[target], next[idx]];
    setItems(next);
    void persistOrder(next);
  }

  async function persistOrder(ordered: LocalItem[]) {
    const keys = ordered.filter((it) => !it._pending).map((it) => it.key);
    try {
      const res = await fetch("/api/admin/media/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageSlug, kind, keys }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) throw new Error(data.error || "Reorder failed");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  function onAltChange(item: LocalItem, alt: string) {
    if (item._pending) return;
    setItems((p) => p.map((it) => (it.key === item.key ? { ...it, alt } : it)));
    if (altTimers.current[item.key]) clearTimeout(altTimers.current[item.key]);
    altTimers.current[item.key] = setTimeout(() => {
      void fetch(`/api/admin/media/${item.key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alt }),
      }).catch(() => setError("Alt update failed"));
    }, 600);
  }

  const title = kind === "photo" ? "Photos" : "Reels";
  const description =
    kind === "photo"
      ? `Drag-and-drop для завантаження фото у R2 (max ${maxSizeMB} MB).`
      : `Drag-and-drop для завантаження reel-відео у R2 (max ${maxSizeMB} MB).`;

  return (
    <Card title={title} description={description}>
      <div
        className="admin-dropzone"
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        style={{
          border: `2px dashed ${dragOver ? "#888" : "#444"}`,
          borderRadius: 8,
          padding: "2rem",
          textAlign: "center",
          marginBottom: "1rem",
          cursor: "pointer",
          background: dragOver ? "rgba(255,255,255,0.04)" : "transparent",
        }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          style={{ display: "none" }}
          onChange={onPickFiles}
        />
        <div style={{ fontSize: 14, opacity: 0.8 }}>
          Перетягни файли сюди або клікни щоб обрати
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
          {accept} · до {maxSizeMB} MB
        </div>
      </div>

      {error && (
        <div
          style={{
            background: "rgba(255,80,80,0.12)",
            border: "1px solid rgba(255,80,80,0.4)",
            padding: "0.5rem 0.75rem",
            borderRadius: 6,
            marginBottom: "0.75rem",
            fontSize: 13,
          }}
        >
          {error}
          <button
            type="button"
            onClick={() => setError(null)}
            style={{
              float: "right",
              background: "transparent",
              border: 0,
              color: "inherit",
              cursor: "pointer",
            }}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      {loading ? (
        <Empty>Завантаження…</Empty>
      ) : items.length === 0 ? (
        <Empty>Поки нічого не завантажено.</Empty>
      ) : (
        <div className="admin-list">
          {items.map((item, idx) => (
            <ListItem
              key={item.key}
              index={idx}
              actions={
                <>
                  <MoveButtons
                    onUp={() => moveItem(idx, -1)}
                    onDown={() => moveItem(idx, 1)}
                    canUp={idx > 0 && !item._pending}
                    canDown={idx < items.length - 1 && !item._pending}
                  />
                  <RemoveButton onClick={() => onDelete(item)} />
                </>
              }
            >
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 96,
                    height: 96,
                    flexShrink: 0,
                    background: "#111",
                    borderRadius: 6,
                    overflow: "hidden",
                    opacity: item._pending ? 0.5 : 1,
                  }}
                >
                  {kind === "photo" ? (
                    <img
                      src={item.url}
                      alt={item.alt ?? ""}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <video
                      src={item.url}
                      preload="metadata"
                      muted
                      playsInline
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <Field label="Alt text" hint="Опис для accessibility (screen readers)">
                    <TextInput
                      value={item.alt ?? ""}
                      onChange={(v) => onAltChange(item, v)}
                      placeholder="напр. Sunset over Bali rice terraces"
                    />
                  </Field>
                  <div style={{ fontSize: 11, opacity: 0.5, marginTop: 4 }}>
                    {item._pending ? "Завантаження…" : `${(item.sizeBytes / 1024 / 1024).toFixed(2)} MB · ${item.mime}`}
                  </div>
                </div>
              </div>
            </ListItem>
          ))}
        </div>
      )}
    </Card>
  );
}
