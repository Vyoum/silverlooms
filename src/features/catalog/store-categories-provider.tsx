"use client";

import { createContext, useContext } from "react";
import type { StoreCategory } from "@/features/catalog/lib/store-categories";

const StoreCategoriesContext = createContext<StoreCategory[]>([]);

export function StoreCategoriesProvider({
  categories,
  children,
}: {
  categories: StoreCategory[];
  children: React.ReactNode;
}) {
  return (
    <StoreCategoriesContext.Provider value={categories}>
      {children}
    </StoreCategoriesContext.Provider>
  );
}

export function useStoreCategories() {
  return useContext(StoreCategoriesContext);
}
