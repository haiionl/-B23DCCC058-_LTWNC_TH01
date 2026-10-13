import { createContext, useContext, type ReactNode } from "react";
import { FILTER_LABELS, FilterStatus } from "../types";
import type { FilterStatus as FilterStatusType } from "../types";

interface FilterContextValue {
  activeFilter: FilterStatusType;
  counts: Record<FilterStatusType, number>;
  onFilterChange: (filter: FilterStatusType) => void;
}

const FilterContext = createContext<FilterContextValue | null>(null);

interface FilterRootProps extends FilterContextValue {
  children: ReactNode;
}

function FilterRoot({
  activeFilter,
  counts,
  onFilterChange,
  children,
}: FilterRootProps) {
  return (
    <FilterContext.Provider value={{ activeFilter, counts, onFilterChange }}>
      <div className="filter-tabs" role="tablist" aria-label="Lọc bài tập">
        {children}
      </div>
    </FilterContext.Provider>
  );
}

function FilterTab({ value }: { value: FilterStatusType }) {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("FilterTab phải được đặt bên trong Filter.Root.");
  }

  const active = context.activeFilter === value;
  return (
    <button
      className={`filter-tab${active ? " is-active" : ""}`}
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => context.onFilterChange(value)}
    >
      {FILTER_LABELS[value]}
      <span className="filter-count">{context.counts[value]}</span>
    </button>
  );
}

export const Filter = {
  Root: FilterRoot,
  Tab: FilterTab,
};

export const FILTER_OPTIONS: FilterStatusType[] = [
  FilterStatus.ALL,
  FilterStatus.INCOMPLETE,
  FilterStatus.OVERDUE,
  FilterStatus.COMPLETED,
];
