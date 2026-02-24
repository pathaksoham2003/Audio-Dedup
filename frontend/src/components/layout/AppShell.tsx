import Link from "next/link";

const nav = [
  { href: "/", label: "Dashboard" },
  { href: "/upload", label: "Upload" },
  { href: "/library", label: "Library" },
  { href: "/duplicates", label: "Duplicates" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto flex w-full max-w-6xl gap-6 px-4 py-6">
        <aside className="hidden w-56 shrink-0 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 md:block">
          <div className="mb-4 text-sm font-semibold tracking-tight">Audio Dedup</div>
          <nav className="flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="mb-6 flex items-center justify-between">
            <div className="text-lg font-semibold tracking-tight">Audio Upload Dedup Platform</div>
            <div className="text-xs text-zinc-500">v0</div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}

