import { AudioUploader } from "@/components/audio/AudioUploader";

export default function UploadPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-xl font-semibold tracking-tight">Upload</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          Files are analyzed server-side and checked for duplicates.
        </p>
      </section>

      <AudioUploader />
    </div>
  );
}

