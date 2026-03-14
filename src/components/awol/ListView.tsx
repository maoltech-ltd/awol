"use client";

import { useState } from "react";
import ListCard from "./ListCard";
import ViewMoreModal from "./ViewMoreModal";

export type FieldConfig<T> = {
  label: string;
  key: keyof T;
};

export type ListConfig<T> = {
  title: string;
  fields: FieldConfig<T>[];
  previewFields: (keyof T)[];
};

interface Props<T> {
  data: T[];
  config: ListConfig<T>;
}

export default function ListView<T>({ data, config }: Props<T>) {
  const [selected, setSelected] = useState<T | null>(null);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
        {config.title}
      </h1>

      <div className="space-y-3">
        {data.map((item, index) => (
          <ListCard
            key={index}
            item={item}
            previewFields={config.previewFields}
            onView={() => setSelected(item)}
          />
        ))}
      </div>

      <ViewMoreModal
        open={!!selected}
        onClose={() => setSelected(null)}
        data={selected}
        fields={config.fields}
      />
    </div>
  );
}
