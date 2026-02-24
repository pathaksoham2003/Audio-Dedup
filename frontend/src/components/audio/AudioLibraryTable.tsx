"use client";

import { useEffect, useState } from "react";

type AudioFile = {
  id: string;
  originalFilename: string;
  mimeType: string;
  fileSize: string;
  sha256Hash: string;
  createdAt: string;
};

export function AudioLibraryTable() {
  const [items, setItems] = useState<AudioFile[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const resp = await fetch("/api/audio", { cache: "no-store" });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data?.message || `Request failed (${resp.status})`);
        if (!cancelled) setItems(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load library");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
        {error}
      </div>
    );
  }

  if (!items) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
        Loading…
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 px-5 py-3 text-sm font-semibold dark:border-zinc-800">
        Audio files
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 text-xs text-zinc-500 dark:bg-zinc-950/40 dark:text-zinc-400">
            <tr>
              <th className="px-5 py-3">Filename</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Size</th>
              <th className="px-5 py-3">SHA-256</th>
              <th className="px-5 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td className="px-5 py-4 text-zinc-500" colSpan={5}>
                  No audio yet. Upload one from the Upload page.
                </td>
              </tr>
            ) : (
              items.map((a) => (
                <tr key={a.id} className="border-t border-zinc-100 dark:border-zinc-800">
                  <td className="px-5 py-3">{a.originalFilename}</td>
                  <td className="px-5 py-3 text-zinc-500">{a.mimeType}</td>
                  <td className="px-5 py-3 text-zinc-500">{a.fileSize}</td>
                  <td className="px-5 py-3 font-mono text-xs text-zinc-500">{a.sha256Hash}</td>
                  <td className="px-5 py-3 text-zinc-500">
                    {a.createdAt ? new Date(a.createdAt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

