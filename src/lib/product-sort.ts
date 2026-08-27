/**
 * Shared between the server query layer and the client toolbar, so it must stay
 * free of any database imports.
 */
export type ProductSort = "newest" | "oldest" | "price-asc" | "price-desc" | "name-asc";

export const PRODUCT_SORT_OPTIONS: Array<{ value: ProductSort; label: string }> = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "oldest", label: "Oldest first" },
];

export const DEFAULT_PRODUCT_SORT: ProductSort = "newest";

export function normalizeSort(value?: string | null): ProductSort {
  const match = PRODUCT_SORT_OPTIONS.find((option) => option.value === value);
  return match ? match.value : DEFAULT_PRODUCT_SORT;
}
