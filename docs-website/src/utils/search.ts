/**
 * Global Search & Filter Utility
 * Standardized search filtering helper
 */

/**
 * Filter an array of objects by a search query across specified keys
 */
export function filterByQuery<T extends Record<string, any>>(
  items: T[],
  query: string,
  keys: (keyof T)[]
): T[] {
  if (!query || !query.trim()) return items;
  const q = query.toLowerCase().trim();

  return items.filter((item) => {
    return keys.some((key) => {
      const val = item[key];
      if (val === null || val === undefined) return false;
      if (typeof val === 'string') return val.toLowerCase().includes(q);
      if (typeof val === 'number') return val.toString().includes(q);
      if (Array.isArray(val)) {
        return val.some((v: unknown) => typeof v === 'string' && v.toLowerCase().includes(q));
      }
      return false;
    });
  });
}
