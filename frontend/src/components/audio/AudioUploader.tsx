"use client";

import { useMemo, useRef, useState } from "react";

type JobStatus =
  | { status: "pending" | "processing"; result?: unknown; error?: string | null }
  | { status: "done"; result?: any; error?: string | null }
  | { status: "failed"; result?: unknown; error?: string | null };

async function uploadFile(file: File) {
  const form = new FormData();
  form.append("file", file);
  const resp = await fetch("/api/audio/upload", { method: "POST", body: form });
  const data = await resp.json();
  if (!resp.ok || data?.error) {
    throw new Error(data?.error || `Upload failed (${resp.status})`);
  }
  return data as { jobId: string };
}

async function fetchJob(jobId: string): Promise<JobStatus> {
  const resp = await fetch(`/api/audio/jobs/${jobId}`, { cache: "no-store" });
  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data?.message || `Job fetch failed (${resp.status})`);
  }
  return data as JobStatus;
}

export function AudioUploader() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summary = useMemo(() => {
    if (!status) return null;
    if (status.status === "done" && (status as any).result?.isDuplicate) {
      return {
        tone: "warning" as const,
        title: "Duplicate detected",
        message: `Method: ${(status as any).result?.method ?? "unknown"} (similarity ${(status as any).result?.similarity ?? "?"})`,
      };
    }
    if (status.status === "done") {
      return {
        tone: "success" as const,
        title: "Upload processed",
        message: `Saved audioId: ${(status as any).result?.audioId ?? "unknown"}`,
      };
    }
    if (status.status === "failed") {
      return { tone: "error" as const, title: "Failed", message: status.error ?? "Unknown error" };
    }
    return { tone: "info" as const, title: "Processing", message: "Analyzing audio…" };
  }, [status]);

  async function onStart() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setStatus(null);
    setJobId(null);
    try {
      const { jobId } = await uploadFile(file);
      setJobId(jobId);

      // Poll until terminal state
      for (let i = 0; i < 120; i++) {
        const s = await fetchJob(jobId);
        setStatus(s);
        if (s.status === "done" || s.status === "failed") break;
        await new Promise((r) => setTimeout(r, 1000));
      }
    } catch (e: any) {
      setError(e?.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-base font-semibold tracking-tight">Upload audio</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          Supported: wav/mp3/m4a (max 50MB).
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            ref={inputRef}
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-zinc-700 file:mr-4 file:rounded-full file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-zinc-700 dark:text-zinc-200 dark:file:bg-zinc-100 dark:file:text-zinc-900 dark:hover:file:bg-zinc-200"
          />
          <button
            type="button"
            onClick={onStart}
            disabled={!file || busy}
            className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {busy ? "Working…" : "Upload"}
          </button>
        </div>

        {jobId && (
          <div className="mt-4 text-xs text-zinc-500">
            Job: <span className="font-mono">{jobId}</span>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
            {error}
          </div>
        )}
      </div>

      {summary && (
        <div
          className={[
            "rounded-2xl border p-5 text-sm",
            summary.tone === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-100"
              : summary.tone === "warning"
              ? "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100"
              : summary.tone === "error"
              ? "border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-100"
              : "border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100",
          ].join(" ")}
        >
          <div className="font-semibold">{summary.title}</div>
          <div className="mt-1 text-xs opacity-80">{summary.message}</div>
        </div>
      )}
    </div>
  );
}

