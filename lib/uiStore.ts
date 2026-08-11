import { create } from "zustand";

export interface FilterState {
  categories: string[];
  colors: string[];
  sizes: string[];
}

interface UiStore {
  // Mobile Menu
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;

  // Filter Drawer
  isFilterOpen: boolean;
  openFilter: () => void;
  closeFilter: () => void;

  // Active Filters
  activeFilters: FilterState;
  toggleFilter: (type: keyof FilterState, value: string) => void;
  clearFilters: () => void;
}

export const useUiStore = create<UiStore>((set) => ({
  isMobileMenuOpen: false,
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  isFilterOpen: false,
  openFilter: () => set({ isFilterOpen: true }),
  closeFilter: () => set({ isFilterOpen: false }),

  activeFilters: {
    categories: [],
    colors: [],
    sizes: [],
  },
  toggleFilter: (type, value) =>
    set((state) => {
      const currentList = state.activeFilters[type];
      const isSelected = currentList.includes(value);

      return {
        activeFilters: {
          ...state.activeFilters,
          [type]: isSelected
            ? currentList.filter((v) => v !== value)
            : [...currentList, value],
        },
      };
    }),
  clearFilters: () =>
    set({
      activeFilters: {
        categories: [],
        colors: [],
        sizes: [],
      },
    }),
}));
