"use client";

import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Card } from "./travel/_ui";
import type { MediaItem, PageSlug, SingletonKind } from "@/lib/repos/media";

interface Props {
  pageSlug: PageSlug;
  kind: SingletonKind;
  accept: string;
  maxSizeMB: number;
  title: string;
  description: string;
}

export default function SingleSlotMedia({
  pageSlug,
  kind,
  accept,
  maxSizeMB,
  title,
  description,
}: Props) {
  const [item, setItem] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isVideo = kind === "about-video";

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetch(
          `/api/admin/media?page=${pageSlug}&kind=${kind}`,
          { signal: ac.signal },
        );
        const data = (await res.json()) as { ok: boolean; items?: MediaItem[]; error?: string };
        if (!data.ok) throw new Error(data.error || "Load failed");
        setItem(data.items?.[0] ?? null);
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
    setError(null);
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`${file.name}: занадто великий (max ${maxSizeMB} MB)`);
      return;
    }
    setPending(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("page", pageSlug);
    fd.append("kind", kind);
    try {
      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      const data = (await res.json()) as { ok: boolean; item?: MediaItem; error?: string };
      if (!data.ok || !data.item) throw new Error(data.error || "Upload failed");
      setItem(data.item);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setPending(false);
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) void uploadFile(file);
  }

  function onPickFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void uploadFile(file);
    e.target.value = "";
  }

  async function onRemove() {
    if (!item) return;
    if (!confirm(`Видалити ${isVideo ? "відео" : "зображення"}?`)) return;
    const prev = item;
    setItem(null);
    try {
      const res = await fetch(`/api/admin/media/${prev.key}`, { method: "DELETE" });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) throw new Error(data.error || "Delete failed");
    } catch (err) {
      setItem(prev);
      setError((err as Error).message);
    }
  }

  return (
    <Card title={title} description={description}>
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

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={onPickFile}
      />

      {loading ? (
        <div className="admin-empty">Завантаження…</div>
      ) : item ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              width: "100%",
              maxWidth: 480,
              aspectRatio: isVideo ? "9 / 16" : "3 / 4",
              background: "#111",
              borderRadius: 8,
              overflow: "hidden",
              opacity: pending ? 0.5 : 1,
            }}
          >
            {isVideo ? (
              <video
                src={item.url}
                controls
                muted
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.url}
                alt={item.alt ?? ""}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
          </div>
          <div style={{ fontSize: 11, opacity: 0.6 }}>
            {(item.sizeBytes / 1024 / 1024).toFixed(2)} MB · {item.mime}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              className="admin-btn admin-btn-sm"
              onClick={() => inputRef.current?.click()}
              disabled={pending}
            >
              {pending ? "Завантаження…" : "Замінити"}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-sm danger"
              onClick={onRemove}
              disabled={pending}
            >
              Видалити
            </button>
          </div>
        </div>
      ) : (
        <div
          className="admin-dropzone"
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? "#888" : "#444"}`,
            borderRadius: 8,
            padding: "2rem",
            textAlign: "center",
            cursor: pending ? "wait" : "pointer",
            background: dragOver ? "rgba(255,255,255,0.04)" : "transparent",
            opacity: pending ? 0.6 : 1,
          }}
        >
          <div style={{ fontSize: 14, opacity: 0.8 }}>
            {pending
              ? "Завантаження…"
              : `Перетягни ${isVideo ? "відео" : "зображення"} сюди або клікни щоб обрати`}
          </div>
          <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
            {accept} · до {maxSizeMB} MB
          </div>
        </div>
      )}
    </Card>
  );
}
