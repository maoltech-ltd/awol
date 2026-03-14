"use client";

interface Props<T> {
  open: boolean;
  onClose: () => void;
  data: T | null;
  fields: { label: string; key: keyof T }[];
}

export default function ViewMoreModal<T>({
  open,
  onClose,
  data,
  fields,
}: Props<T>) {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-2xl p-6
        bg-white dark:bg-zinc-900
        border border-gray-200 dark:border-zinc-700">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Details
          </h2>

          <button
            onClick={onClose}
            className="text-sm px-3 py-1 rounded-lg border dark:border-zinc-600"
          >
            Close
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field) => (
            <div key={String(field.key)} className="flex justify-between border-b pb-2">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                {field.label}
              </span>

              <span className="text-gray-800 dark:text-gray-100">
                {String(data[field.key] ?? "-")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
