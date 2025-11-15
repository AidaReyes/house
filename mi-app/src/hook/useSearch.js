// src/hook/useSearch.js
import { useMemo, useState } from "react";

export function useSearch(items, filterFn) {
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const q = query.trim();
    if (!q) return items; // si no hay búsqueda, regresa todo
    return items.filter((item) => filterFn(item, q));
  }, [items, query, filterFn]);

  const onChange = (e) => setQuery(e.target.value);
  const clear = () => setQuery("");

  return {
    query,
    setQuery,
    filteredItems,
    onChange,
    clear,
  };
}
