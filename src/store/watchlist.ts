import { create } from "zustand";
import type { MovieListItem } from "../types/movie";

type Store = {
  watchlist: MovieListItem[];
  add: (movie: MovieListItem) => void;
  remove: (id: number) => void;
};

function readWatchlist(): MovieListItem[] {
  try {
    const raw = localStorage.getItem("watchlist");
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as MovieListItem[]) : [];
  } catch {
    return [];
  }
}

export const useWatchlist = create<Store>((set) => ({
  watchlist: readWatchlist(),

  add: (movie) =>
    set((state) => {
      if (state.watchlist.some((m) => m.id === movie.id)) {
        return state;
      }
      const updated = [...state.watchlist, movie];
      localStorage.setItem("watchlist", JSON.stringify(updated));
      return { watchlist: updated };
    }),

  remove: (id) =>
    set((state) => {
      const updated = state.watchlist.filter((m) => m.id !== id);
      localStorage.setItem("watchlist", JSON.stringify(updated));
      return { watchlist: updated };
    }),
}));