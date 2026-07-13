import { useState } from "react";
import { api, BREW_METHODS, type Brew, type BrewInput } from "../lib/api";

type Mode = "create" | "edit";

interface Props {
  mode: Mode;
  brew?: Brew;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
  onDeleted?: () => void | Promise<void>;
}

interface FormState {
  beans: string;
  method: string;
  coffeeGrams: string;
  waterGrams: string;
  rating: string;
  tastingNotes: string;
}

function initialState(brew?: Brew): FormState {
  return {
    beans: brew?.beans ?? "",
    method: brew?.method ?? "",
    coffeeGrams: brew ? String(brew.coffeeGrams) : "",
    waterGrams: brew ? String(brew.waterGrams) : "",
    rating: brew ? String(brew.rating) : "0",
    tastingNotes: brew?.tastingNotes ?? "",
  };
}

export function BrewFormModal({ mode, brew, onClose, onSaved, onDeleted }: Props) {
  const [form, setForm] = useState<FormState>(initialState(brew));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid =
    form.beans.trim() !== "" &&
    form.method.trim() !== "" &&
    form.coffeeGrams.trim() !== "" &&
    Number(form.coffeeGrams) > 0 &&
    form.waterGrams.trim() !== "" &&
    Number(form.waterGrams) > 0 &&
    form.rating.trim() !== "" &&
    form.tastingNotes.trim() !== "";

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setSubmitting(true);
    setError(null);
    const payload: BrewInput = {
      beans: form.beans.trim(),
      method: form.method.trim(),
      coffeeGrams: Number(form.coffeeGrams),
      waterGrams: Number(form.waterGrams),
      rating: Number(form.rating),
      tastingNotes: form.tastingNotes.trim(),
    };
    try {
      if (mode === "create") await api.create(payload);
      else if (brew) await api.update(brew.id, payload);
      await onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async () => {
    if (!brew) return;
    if (!confirm("Delete this brew?")) return;
    setSubmitting(true);
    try {
      await api.remove(brew.id);
      await onDeleted?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {mode === "create" ? "Add a brew" : "Edit a brew"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-coffee-700 hover:bg-coffee-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="mt-4 space-y-4">
          <Field label="Beans">
            <input
              type="text"
              value={form.beans}
              onChange={(e) => set("beans", e.target.value)}
              className={inputCls}
              required
            />
          </Field>

          <Field label="Method">
            <select
              value={form.method}
              onChange={(e) => set("method", e.target.value)}
              className={inputCls}
              required
            >
              <option value="">Select a method</option>
              {BREW_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Coffee grams">
              <input
                type="number"
                min={0}
                step="0.1"
                value={form.coffeeGrams}
                onChange={(e) => set("coffeeGrams", e.target.value)}
                className={inputCls}
                required
              />
            </Field>
            <Field label="Water grams">
              <input
                type="number"
                min={0}
                step="0.1"
                value={form.waterGrams}
                onChange={(e) => set("waterGrams", e.target.value)}
                className={inputCls}
                required
              />
            </Field>
          </div>

          <Field label="Rating (out of 5)">
            <input
              type="number"
              min={0}
              max={5}
              step={1}
              value={form.rating}
              onChange={(e) => set("rating", e.target.value)}
              className={inputCls}
              required
            />
          </Field>

          <Field label="Tasting notes">
            <textarea
              value={form.tastingNotes}
              onChange={(e) => set("tastingNotes", e.target.value)}
              className={inputCls}
              rows={3}
              required
            />
          </Field>

          {error && (
            <p className="rounded-md border border-red-300 bg-red-50 p-2 text-sm text-red-800">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between gap-2 pt-2">
            {mode === "edit" ? (
              <button
                type="button"
                onClick={remove}
                disabled={submitting}
                className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                Delete
              </button>
            ) : (
              <span />
            )}
            <button
              type="submit"
              disabled={!isValid || submitting}
              className="rounded-lg bg-coffee-700 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-coffee-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-coffee-100 bg-white px-3 py-2 shadow-sm focus:border-coffee-500 focus:outline-none focus:ring-1 focus:ring-coffee-500";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-coffee-700">{label}</span>
      {children}
    </label>
  );
}