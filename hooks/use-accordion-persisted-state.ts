import { useEffect, useState } from "react";

const STORAGE_KEY = "sidebar-open-main-categories";

export function useAccordionPersistedState() {
  const [openIds, setOpenIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          setOpenIds(JSON.parse(raw));
        } catch {
          setOpenIds([]);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(openIds));
    }
  }, [openIds]);

  return [openIds, setOpenIds] as const;
}
