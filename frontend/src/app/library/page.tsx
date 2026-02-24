import { AudioLibraryTable } from "@/components/audio/AudioLibraryTable";

export default function LibraryPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-xl font-semibold tracking-tight">Library</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          Recently uploaded audio files.
        </p>
      </section>

      <AudioLibraryTable />
    </div>
  );
}

