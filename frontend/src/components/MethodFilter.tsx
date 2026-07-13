import { BREW_METHODS } from "../lib/api";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function MethodFilter({ value, onChange }: Props) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-coffee-700">Filter by method</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-coffee-100 bg-white px-3 py-2 shadow-sm focus:border-coffee-500 focus:outline-none focus:ring-1 focus:ring-coffee-500"
      >
        <option value="">All methods</option>
        {BREW_METHODS.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </label>
  );
}