export default function Home() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          Upload audio and detect duplicates using hash + perceptual similarity.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-xs text-zinc-500">Uploads</div>
          <div className="mt-1 text-2xl font-semibold">—</div>
          <div className="mt-2 text-xs text-zinc-500">Connect DB + backend to populate.</div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-xs text-zinc-500">Duplicates</div>
          <div className="mt-1 text-2xl font-semibold">—</div>
          <div className="mt-2 text-xs text-zinc-500">Logs will appear after detections.</div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-xs text-zinc-500">System health</div>
          <div className="mt-1 text-2xl font-semibold">—</div>
          <div className="mt-2 text-xs text-zinc-500">Add health checks to show status.</div>
        </div>
      </section>
    </div>
  );
}
