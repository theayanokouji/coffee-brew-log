export interface Brew {
  id: number;
  beans: string;
  method: string;
  coffeeGrams: number;
  waterGrams: number;
  rating: number;
  tastingNotes: string;
  createdAt: string;
  updatedAt: string;
}

export type BrewInput = Omit<Brew, "id" | "createdAt" | "updatedAt">;

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  list: (method?: string) => {
    const qs = method ? `?method=${encodeURIComponent(method)}` : "";
    return fetch(`${API_URL}/api/brews${qs}`).then((r) => handle<Brew[]>(r));
  },
  create: (data: BrewInput) =>
    fetch(`${API_URL}/api/brews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => handle<Brew>(r)),
  update: (id: number, data: BrewInput) =>
    fetch(`${API_URL}/api/brews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => handle<Brew>(r)),
  remove: (id: number) =>
    fetch(`${API_URL}/api/brews/${id}`, { method: "DELETE" }).then((r) => handle<void>(r)),
};

export const BREW_METHODS = [
  "Aeropress",
  "V60",
  "Drip coffee",
  "French Press",
  "Espresso",
  "Moka Pot",
  "Chemex",
  "Cold Brew",
] as const;