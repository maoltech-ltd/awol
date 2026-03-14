"use client";

interface Props<T> {
  item: T;
  previewFields: (keyof T)[];
  onView: () => void;
}

export default function ListCard<T>({
  item,
  previewFields,
  onView,
}: Props<T>) {
  return (
    <div className="rounded-xl p-4 border
      bg-white dark:bg-zinc-900
      border-gray-200 dark:border-zinc-700
      flex justify-between items-center">

      <div className="space-y-1">
        {previewFields.map((key) => (
          <div key={String(key)} className="text-gray-700 dark:text-gray-200">
            {String(item[key] ?? "-")}
          </div>
        ))}
      </div>

      <button
        onClick={onView}
        className="px-3 py-1 rounded-lg border
        border-gray-300 dark:border-zinc-600
        hover:bg-gray-100 dark:hover:bg-zinc-800"
      >
        View More
      </button>
    </div>
  );
}
