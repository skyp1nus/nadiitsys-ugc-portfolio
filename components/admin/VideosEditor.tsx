"use client";

import { useState } from "react";
import type { Video, VideosFile, Category } from "@/types/video";

const EMPTY_VIDEO = (): Video => ({
  id: "",
  category: "beauty",
  title: "",
  description: "",
  instagramUrl: "",
  posterKey: "",
  fallbackVideoKey: "",
  publishedAt: new Date().toISOString(),
  tags: [],
});

export function VideosEditor({ initial }: { initial: VideosFile }) {
  const [videos, setVideos] = useState<Video[]>(initial.videos);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function updateField<K extends keyof Video>(index: number, key: K, value: Video[K]) {
    setVideos((prev) => prev.map((v, i) => (i === index ? { ...v, [key]: value } : v)));
  }

  function addRow() {
    setVideos((prev) => [...prev, EMPTY_VIDEO()]);
  }

  function removeRow(index: number) {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  }

  async function save() {
    setStatus("saving");
    setErrorMsg("");
    try {
      const body: VideosFile = {
        version: 1,
        updatedAt: new Date().toISOString(),
        videos: videos.map((v) => ({
          ...v,
          tags: typeof v.tags === "string"
            ? (v.tags as string).split(",").map((t) => t.trim()).filter(Boolean)
            : v.tags,
          fallbackVideoKey: v.fallbackVideoKey || undefined,
        })),
      };
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setStatus("ok");
      } else {
        const text = await res.text();
        setErrorMsg(text);
        setStatus("error");
      }
    } catch (err) {
      setErrorMsg(String(err));
      setStatus("error");
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Videos</h1>
        <div className="flex gap-3 items-center">
          {status === "ok" && <span className="text-green-600 text-sm">Saved ✓</span>}
          {status === "error" && <span className="text-red-500 text-sm">{errorMsg || "Error"}</span>}
          <button
            onClick={addRow}
            className="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            + Add row
          </button>
          <button
            onClick={save}
            disabled={status === "saving"}
            className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {status === "saving" ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2 pr-3 font-medium">ID</th>
              <th className="pb-2 pr-3 font-medium">Category</th>
              <th className="pb-2 pr-3 font-medium">Title</th>
              <th className="pb-2 pr-3 font-medium">Description</th>
              <th className="pb-2 pr-3 font-medium">Instagram URL</th>
              <th className="pb-2 pr-3 font-medium">Poster key</th>
              <th className="pb-2 pr-3 font-medium">Video key</th>
              <th className="pb-2 pr-3 font-medium">Published at</th>
              <th className="pb-2 pr-3 font-medium">Tags (CSV)</th>
              <th className="pb-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {videos.map((v, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="py-2 pr-3">
                  <Input value={v.id} onChange={(val) => updateField(i, "id", val)} placeholder="paris-spring-2026" />
                </td>
                <td className="py-2 pr-3">
                  <select
                    value={v.category}
                    onChange={(e) => updateField(i, "category", e.target.value as Category)}
                    className="border border-gray-200 rounded px-2 py-1 text-sm"
                  >
                    <option value="beauty">beauty</option>
                    <option value="travel">travel</option>
                  </select>
                </td>
                <td className="py-2 pr-3">
                  <Input value={v.title} onChange={(val) => updateField(i, "title", val)} placeholder="Title" />
                </td>
                <td className="py-2 pr-3">
                  <Input value={v.description} onChange={(val) => updateField(i, "description", val)} placeholder="Description" />
                </td>
                <td className="py-2 pr-3">
                  <Input value={v.instagramUrl} onChange={(val) => updateField(i, "instagramUrl", val)} placeholder="https://instagram.com/reel/..." />
                </td>
                <td className="py-2 pr-3">
                  <Input value={v.posterKey} onChange={(val) => updateField(i, "posterKey", val)} placeholder="posters/foo.jpg" />
                </td>
                <td className="py-2 pr-3">
                  <Input value={v.fallbackVideoKey ?? ""} onChange={(val) => updateField(i, "fallbackVideoKey", val || undefined)} placeholder="videos/foo.mp4" />
                </td>
                <td className="py-2 pr-3">
                  <Input value={v.publishedAt} onChange={(val) => updateField(i, "publishedAt", val)} placeholder="2026-04-01T12:00:00.000Z" />
                </td>
                <td className="py-2 pr-3">
                  <Input
                    value={Array.isArray(v.tags) ? v.tags.join(", ") : (v.tags as string)}
                    onChange={(val) => updateField(i, "tags", val.split(",").map((t) => t.trim()).filter(Boolean))}
                    placeholder="tag1, tag2"
                  />
                </td>
                <td className="py-2">
                  <button
                    onClick={() => removeRow(i)}
                    className="text-red-400 hover:text-red-600 text-xs px-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {videos.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-8">No videos yet — click &quot;+ Add row&quot;</p>
        )}
      </div>
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="border border-gray-200 rounded px-2 py-1 text-sm w-full min-w-[100px]"
    />
  );
}
