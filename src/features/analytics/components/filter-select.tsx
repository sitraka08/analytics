"use client";

import { useRouter } from "next/navigation";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import type { Filters } from "../schemas/filters";
import type { Period } from "../schemas/period";
import { buildDashboardHref } from "../utils/search-params";

export type FilterOption = { value: string; label: string };

type FilterSelectProps = {
  label: string;
  filterKey: keyof Filters;
  options: FilterOption[];
  basePath: string;
  period: Period;
  filters: Filters;
};

const ALL_OPTION: FilterOption = { value: "", label: "Tous" };

export function FilterSelect({ label, filterKey, options, basePath, period, filters }: FilterSelectProps) {
  const router = useRouter();
  const items = [ALL_OPTION, ...options];
  const selected = items.find((item) => item.value === (filters[filterKey] ?? "")) ?? ALL_OPTION;

  return (
    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
      <span>{label}</span>
      <Combobox
        items={items}
        value={selected}
        itemToStringLabel={(item: FilterOption) => item.label}
        isItemEqualToValue={(item: FilterOption, value: FilterOption) => item.value === value.value}
        onValueChange={(next: FilterOption | null) =>
          router.push(buildDashboardHref(basePath, period, { ...filters, [filterKey]: next?.value || undefined }), {
            scroll: false,
          })
        }
      >
        <ComboboxInput
          aria-label={label}
          placeholder="Rechercher…"
          className="h-10 min-w-44 rounded-full border-2 border-foreground/15 bg-surface text-sm text-foreground hover:border-foreground/35"
        />
        <ComboboxContent>
          <ComboboxEmpty>Aucun résultat</ComboboxEmpty>
          <ComboboxList>
            {(item: FilterOption) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
