import type { Brew } from "../lib/api";

interface Props {
  brews: Brew[];
  onEdit: (brew: Brew) => void;
}

export function BrewList({ brews, onEdit }: Props) {
  if (brews.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-coffee-500/40 p-8 text-center text-coffee-700">
        No brews yet. Click <span className="font-semibold">Add</span> to log your first one.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {brews.map((b) => (
        <li key={b.id}>
          <button
            onClick={() => onEdit(b)}
            className="flex w-full items-start gap-4 rounded-lg border border-coffee-100 bg-white p-4 text-left shadow-sm transition hover:border-coffee-500 hover:shadow"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coffee-100 text-lg font-bold text-coffee-700">
              {b.rating}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-base font-semibold">{b.beans}</div>
              <div className="mt-1 text-sm text-coffee-700">
                {b.method} · {b.coffeeGrams}g coffee · {b.waterGrams}g water
              </div>
              {b.tastingNotes && (
                <div className="mt-1 truncate text-sm text-coffee-700/80">{b.tastingNotes}</div>
              )}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}