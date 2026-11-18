"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

/** Lê window.location.search sem precisar de Suspense (no servidor devolve ""). */
export function useLocationSearch() {
  return useSyncExternalStore(subscribe, () => window.location.search, () => "");
}
