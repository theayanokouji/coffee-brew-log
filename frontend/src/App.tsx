import { useEffect, useMemo, useState } from "react";
import { api, type Brew } from "./lib/api";
import { BrewList } from "./components/BrewList";
import { BrewFormModal } from "./components/BrewFormModal";
import { MethodFilter } from "./components/MethodFilter";

export default function App() {
  const [brews, setBrews] = useState<Brew[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Brew | null>(null);
  const [creating, setCreating] = useState(false);

  const load = async (method?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.list(method || undefined);
      setBrews(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load brews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(filter);
  }, [filter]);

  const title = useMemo(() => `Brews: ${brews.length}`, [brews]);

  return (
    <div className="min-h-full">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <header className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <button
            onClick={() => setCreating(true)}
            className="rounded-lg bg-coffee-700 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-coffee-900 focus:outline-none focus:ring-2 focus:ring-coffee-500"
          >
            Add
          </button>
        </header>

        <div className="mt-6">
          <MethodFilter value={filter} onChange={setFilter} />
        </div>

        <main className="mt-6">
          {loading && <p className="text-coffee-700">Loading…</p>}
          {error && (
            <p className="rounded-md border border-red-300 bg-red-50 p-3 text-red-800">{error}</p>
          )}
          {!loading && !error && (
            <BrewList
              brews={brews}
              onEdit={(b) => setEditing(b)}
            />
          )}
        </main>
      </div>

      {creating && (
        <BrewFormModal
          mode="create"
          onClose={() => setCreating(false)}
          onSaved={async () => {
            setCreating(false);
            await load(filter);
          }}
        />
      )}

      {editing && (
        <BrewFormModal
          mode="edit"
          brew={editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await load(filter);
          }}
          onDeleted={async () => {
            setEditing(null);
            await load(filter);
          }}
        />
      )}
    </div>
  );
}