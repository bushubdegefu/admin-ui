import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useUtilStore = create(
  persist(
    (set, get) => ({
      page: 1,
      size: 20,
      history: [],

      // Set the current page
      setPage: (page) => {
        set((state) => ({
          ...state,
          page,
        }));
      },

      // Set the page size
      setSize: (size) => {
        set((state) => ({
          ...state,
          size,
        }));
      },

      // Push a new route to history (replace last element if length > 50)
      pushHistory: (route) => {
        set((state) => {
          let newHistory = [...state.history, route];

          // If the history length exceeds 50, replace the last element
          if (newHistory.length > 50) {
            newHistory = [...newHistory.slice(0, 49), route]; // Replace the last element
          }

          return { ...state, history: newHistory };
        });
      },

      // Pop the last route from history
      popHistory: () => {
        set((state) => {
          const newHistory = state.history.slice(0, -1); // Remove the last element
          return { ...state, history: newHistory };
        });
      },
      getPrevious: () => {
        let lastElement = history.length ? get().history.at(-1) : "/";
        return lastElement;
      },
    }),
    {
      name: "util-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
