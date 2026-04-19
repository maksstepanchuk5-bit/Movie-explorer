import { create } from "zustand";
import type { MovieListItem } from "../types/movie";

type Store = {
  watchlist: MovieListItem[];
  add: (movie: MovieListItem) => void;
  remove: (id: number) => void;
};

export const useWatchlist = create<Store>((set) => ({
    watchlist: JSON.parse(localStorage.getItem("watchlist") || "[]"),

     add: (movie) =>
        set((state) => {
          const updated = [...state.watchlist, movie];
         localStorage.setItem("watchlist", JSON.stringify(updated));
     return { watchlist: updated };
    }),
    remove: (id) =>
        set((state) => {
            const updated = state.watchlist.filter((m) => m.id !== id);
            localStorage.setItem("watchlist", JSON.stringify(updated));
            return { watchlist: updated};
        }),
}));